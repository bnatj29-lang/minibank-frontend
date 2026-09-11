import React, { useEffect, useRef, useState } from "react";
import CabecalhoPainel from "../components/CabecalhoPainel";
import { buscarConfiguracaoMesada, salvarConfiguracaoMesada, mensagemErroMesada } from "../services/configuracaoMesadaService";
import "../styles/painelPais.css";
import "../styles/configuracaoMesada.css";

const configuracaoVazia = {
    valorBase: "",
    notaMinimaIntermediaria: "",
    notaMinimaMaxima: "",
    valorFaixaBaixa: "",
    valorFaixaIntermediaria: "",
    valorFaixaMaxima: "",
};

export default function ConfiguracoesPage({ crianca, responsavel, criancas, aoTrocarCrianca, aoSair, aoVoltar }) {
    const [dados, definirDados] = useState(configuracaoVazia);
    const [carregando, definirCarregando] = useState(true);
    const [enviando, definirEnviando] = useState(false);
    const [erroCarregamento, definirErroCarregamento] = useState("");
    const [erro, definirErro] = useState("");
    const [sucesso, definirSucesso] = useState("");
    const [primeiraConfiguracao, definirPrimeiraConfiguracao] = useState(false);
    const [tentativa, definirTentativa] = useState(0);
    const envioEmAndamento = useRef(false);
    const paginaAberta = useRef(true);

    useEffect(() => {
        paginaAberta.current = true;
        return () => { paginaAberta.current = false; };
    }, []);

    useEffect(() => {
        let cancelado = false;
        definirCarregando(true);
        definirErroCarregamento("");

        async function carregarConfiguracao() {
            try {
                const configuracao = await buscarConfiguracaoMesada(crianca.id);
                if (cancelado) return;
                if (configuracao) {
                    definirDados({
                        valorBase: String(configuracao.valorBase),
                        notaMinimaIntermediaria: String(configuracao.notaMinimaIntermediaria),
                        notaMinimaMaxima: String(configuracao.notaMinimaMaxima),
                        valorFaixaBaixa: String(configuracao.valorFaixaBaixa),
                        valorFaixaIntermediaria: String(configuracao.valorFaixaIntermediaria),
                        valorFaixaMaxima: String(configuracao.valorFaixaMaxima),
                    });
                } else {
                    definirDados(configuracaoVazia);
                }
                definirPrimeiraConfiguracao(configuracao === null);
            } catch {
                if (!cancelado) definirErroCarregamento("Não foi possível carregar a configuração de mesada.");
            } finally {
                if (!cancelado) definirCarregando(false);
            }
        }

        carregarConfiguracao();
        return () => { cancelado = true; };
    }, [crianca.id, tentativa]);

    function atualizarCampo(evento) {
        definirDados({ ...dados, [evento.target.name]: evento.target.value });
        definirErro("");
        definirSucesso("");
    }

    async function salvar(evento) {
        evento.preventDefault();
        if (envioEmAndamento.current || carregando || erroCarregamento) return;

        // Converte os campos em números e impede valores vazios ou arredondamentos inesperados.
        const configuracao = {};
        for (const campo of Object.keys(configuracaoVazia)) {
            const valor = Number(dados[campo]);
            if (dados[campo].trim() === "" || !Number.isFinite(valor)) {
                definirErro("Preencha todos os campos com números válidos.");
                return;
            }
            if (Math.abs(valor * 100 - Math.round(valor * 100)) > 0.00001) {
                definirErro("Use no máximo duas casas decimais nos valores e nas notas.");
                return;
            }
            configuracao[campo] = valor;
        }

        const valores = [configuracao.valorBase, configuracao.valorFaixaBaixa, configuracao.valorFaixaIntermediaria, configuracao.valorFaixaMaxima];
        if (valores.some(valor => valor <= 0 || valor > 99999999.99)) {
            definirErro("Os valores da mesada devem estar entre R$ 0,01 e R$ 99.999.999,99.");
            return;
        }
        if (configuracao.notaMinimaIntermediaria <= 0 || configuracao.notaMinimaIntermediaria >= 10) {
            definirErro("A nota mínima intermediária deve ser maior que 0 e menor que 10.");
            return;
        }
        if (configuracao.notaMinimaMaxima <= configuracao.notaMinimaIntermediaria || configuracao.notaMinimaMaxima > 10) {
            definirErro("A nota da faixa máxima deve ser maior que a intermediária e não pode passar de 10.");
            return;
        }

        envioEmAndamento.current = true;
        definirEnviando(true);
        definirErro("");
        definirSucesso("");
        try {
            await salvarConfiguracaoMesada(crianca.id, configuracao);
            if (paginaAberta.current) {
                definirPrimeiraConfiguracao(false);
                definirSucesso("Configurações salvas com sucesso!");
            }
        } catch (falha) {
            if (paginaAberta.current) definirErro(mensagemErroMesada(falha));
        } finally {
            envioEmAndamento.current = false;
            if (paginaAberta.current) definirEnviando(false);
        }
    }

    const notaIntermediaria = dados.notaMinimaIntermediaria.replace(".", ",") || "…";
    const notaMaxima = dados.notaMinimaMaxima.replace(".", ",") || "…";

    return (
        <div className="pagina-painel">
            <CabecalhoPainel crianca={crianca} responsavel={responsavel} criancas={criancas}
                aoTrocarCrianca={aoTrocarCrianca} aoSair={aoSair} aoVoltar={aoVoltar} bloqueado={enviando} />
            <main className="conteudo-painel">
                <div className="configuracao-mesada">
                    <header className="titulo-configuracao-mesada">
                        <h1>Configurações da Mesada</h1>
                    </header>
                    {carregando ? <p role="status">Carregando configurações…</p> : erroCarregamento ? (
                        <div className="aviso-configuracao-mesada">
                            <p role="alert">{erroCarregamento}</p>
                            <button type="button" className="btn botao-secundario-painel" onClick={() => definirTentativa(tentativa + 1)}>Tentar novamente</button>
                        </div>
                    ) : (
                        <form onSubmit={salvar} aria-busy={enviando}>
                            {primeiraConfiguracao && <p className="aviso-configuracao-mesada" role="status">A mesada ainda não foi configurada para esta criança. Preencha os valores abaixo para começar.</p>}
                            <fieldset disabled={enviando} className="campos-configuracao-mesada">
                                <section className="cartao-configuracao-mesada">
                                    <h2>Mesada Base</h2>
                                    <label className="form-label" htmlFor="valor-base">Valor base (R$)</label>
                                    <input id="valor-base" name="valorBase" type="number" className="form-control" required min="0.01" max="99999999.99" step="0.01"
                                        placeholder="Ex: 300" value={dados.valorBase} onChange={atualizarCampo} />
                                </section>
                                <section className="cartao-configuracao-mesada">
                                    <h2>Faixas de Cálculo</h2>
                                    <p className="descricao-configuracao-mesada">Configure as notas e os valores correspondentes.</p>
                                    <div className="campos-configuracao-mesada">
                                        <div>
                                            <label className="form-label" htmlFor="nota-intermediaria">Nota mínima da faixa intermediária</label>
                                            <input id="nota-intermediaria" name="notaMinimaIntermediaria" type="number" className="form-control" required min="0.01" max="9.99" step="0.01"
                                                placeholder="Ex: 7" value={dados.notaMinimaIntermediaria} onChange={atualizarCampo} aria-describedby="ajuda-nota-intermediaria" />
                                            <p className="ajuda-configuracao-mesada" id="ajuda-nota-intermediaria">Notas abaixo disso recebem o valor da faixa baixa.</p>
                                        </div>
                                        <div className="faixas-mesada">
                                            <div className="faixa-baixa-mesada">
                                                <h3>Abaixo de {notaIntermediaria}</h3>
                                                <label className="form-label" htmlFor="valor-faixa-baixa">Valor (R$)</label>
                                                <input id="valor-faixa-baixa" name="valorFaixaBaixa" type="number" className="form-control" required min="0.01" max="99999999.99" step="0.01"
                                                    placeholder="Ex: 250" value={dados.valorFaixaBaixa} onChange={atualizarCampo} />
                                            </div>
                                            <div className="faixa-intermediaria-mesada">
                                                <h3>De {notaIntermediaria} até menos de {notaMaxima}</h3>
                                                <label className="form-label" htmlFor="valor-faixa-intermediaria">Valor (R$)</label>
                                                <input id="valor-faixa-intermediaria" name="valorFaixaIntermediaria" type="number" className="form-control" required min="0.01" max="99999999.99" step="0.01"
                                                    placeholder="Ex: 300" value={dados.valorFaixaIntermediaria} onChange={atualizarCampo} />
                                            </div>
                                            <div className="faixa-maxima-mesada">
                                                <h3>A partir de {notaMaxima}</h3>
                                                <label className="form-label" htmlFor="valor-faixa-maxima">Valor (R$)</label>
                                                <input id="valor-faixa-maxima" name="valorFaixaMaxima" type="number" className="form-control" required min="0.01" max="99999999.99" step="0.01"
                                                    placeholder="Ex: 350" value={dados.valorFaixaMaxima} onChange={atualizarCampo} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="form-label" htmlFor="nota-maxima">Nota para a faixa máxima</label>
                                            <input id="nota-maxima" name="notaMinimaMaxima" type="number" className="form-control" required min="0.01" max="10" step="0.01"
                                                placeholder="Ex: 10" value={dados.notaMinimaMaxima} onChange={atualizarCampo} aria-describedby="ajuda-nota-maxima" />
                                            <p className="ajuda-configuracao-mesada" id="ajuda-nota-maxima">Notas iguais ou superiores a este valor recebem o valor da faixa máxima.</p>
                                        </div>
                                    </div>
                                </section>
                                {erro && <p className="erro-painel" role="alert">{erro}</p>}
                                <div className="acoes-configuracao-mesada">
                                    <button type="submit" className="btn botao-salvar-mesada" disabled={enviando}>{enviando ? "Salvando…" : "Salvar Configurações"}</button>
                                    {sucesso && <p className="confirmacao-mesada" role="status">{sucesso}</p>}
                                </div>
                            </fieldset>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
