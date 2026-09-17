import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ModalCriterio from "../components/ModalCriterio";
import ConfirmarMesada from "../components/ConfirmarMesada";
import ConfirmarExclusaoMissoes from "../components/ConfirmarExclusaoMissoes";
import CabecalhoPainel from "../components/CabecalhoPainel";
import { buscarConfiguracaoMesada } from "../services/configuracaoMesadaService";
import { listarMissoes, criarMissao, atualizarMissao, excluirMissao, calcularMedia, calcularMesada, registrarMesada, mensagemErroMissao } from "../services/missaoService";
import "../styles/painelPais.css";
import "../styles/missoes.css";

export default function Missoes({ crianca, responsavel, criancas, aoTrocarCrianca, aoAdicionarCrianca, aoSair, aoVoltar }) {
    const [missoes, definirMissoes] = useState([]);
    const [media, definirMedia] = useState(null);
    const [mesada, definirMesada] = useState(null);
    const [configuracao, definirConfiguracao] = useState(null);
    const [erroConfiguracao, definirErroConfiguracao] = useState("");
    const [carregando, definirCarregando] = useState(true);
    const [enviando, definirEnviando] = useState(false);
    const [erroLista, definirErroLista] = useState("");
    const [erroMedia, definirErroMedia] = useState("");
    const [erroMesada, definirErroMesada] = useState("");
    const [erro, definirErro] = useState("");
    const [sucesso, definirSucesso] = useState("");
    const [atualizacao, definirAtualizacao] = useState(0);
    const [criterioAberto, definirCriterioAberto] = useState(false);
    const [missaoParaEditar, definirMissaoParaEditar] = useState(null);
    const [missaoParaExcluir, definirMissaoParaExcluir] = useState(null);
    const [mesadaAberta, definirMesadaAberta] = useState(false);
    const envioEmAndamento = useRef(false);
    const paginaAberta = useRef(true);

    useEffect(() => {
        paginaAberta.current = true;
        return () => { paginaAberta.current = false; };
    }, []);

    useEffect(() => {
        let cancelado = false;
        definirCarregando(true);
        definirErroLista("");
        definirErroMedia("");
        definirErroMesada("");
        definirErroConfiguracao("");
        definirConfiguracao(null);
        definirMedia(null);
        definirMesada(null);
        async function carregar() {
            // Uma falha na mesada não impede a consulta das missões e da média.
            const [lista, mediaAtual, configuracaoAtual] = await Promise.allSettled([
                listarMissoes(crianca.id), calcularMedia(crianca.id), buscarConfiguracaoMesada(crianca.id),
            ]);
            let mesadaAtual = { status: "fulfilled", value: null };
            if (configuracaoAtual.status === "fulfilled" && configuracaoAtual.value) {
                const resultadoMesada = await Promise.allSettled([calcularMesada(crianca.id)]);
                mesadaAtual = resultadoMesada[0];
            }
            if (cancelado) return;
            if (lista.status === "fulfilled") definirMissoes(lista.value);
            else definirErroLista(mensagemErroMissao(lista.reason, "Não foi possível carregar as missões."));
            if (mediaAtual.status === "fulfilled") definirMedia(mediaAtual.value);
            else definirErroMedia(mensagemErroMissao(mediaAtual.reason, "Não foi possível consultar a média."));
            if (mesadaAtual.status === "fulfilled") definirMesada(mesadaAtual.value);
            else definirErroMesada(mensagemErroMissao(mesadaAtual.reason, "Não foi possível consultar a mesada. Confira a configuração e tente novamente."));
            if (configuracaoAtual.status === "fulfilled") definirConfiguracao(configuracaoAtual.value);
            else definirErroConfiguracao(mensagemErroMissao(configuracaoAtual.reason, "Não foi possível consultar as faixas da mesada."));
            definirCarregando(false);
        }
        carregar();
        return () => { cancelado = true; };
    }, [crianca.id, atualizacao]);

    function atualizar() {
        definirCarregando(true);
        definirAtualizacao(valor => valor + 1);
    }

    function fecharJanelas() {
        if (envioEmAndamento.current) return;
        definirCriterioAberto(false);
        definirMissaoParaEditar(null);
        definirMissaoParaExcluir(null);
        definirMesadaAberta(false);
        definirErro("");
    }

    // Após gravar, fecha a janela e consulta novamente. Uma falha na consulta não repete a gravação.
    async function salvarAlteracao(acao, mensagem) {
        if (envioEmAndamento.current || carregando) return;
        envioEmAndamento.current = true;
        definirEnviando(true);
        definirErro("");
        definirSucesso("");
        try {
            await acao();
        } catch (falha) {
            if (paginaAberta.current) definirErro(mensagemErroMissao(falha, "Não foi possível confirmar a operação. Confira os dados antes de tentar novamente."));
            return;
        } finally {
            envioEmAndamento.current = false;
            if (paginaAberta.current) definirEnviando(false);
        }
        if (!paginaAberta.current) return;
        fecharJanelas();
        definirSucesso(mensagem);
        atualizar();
    }

    function salvarCriterio(criterio) {
        if (missaoParaEditar) {
            return salvarAlteracao(() => atualizarMissao(missaoParaEditar.id, criterio, missaoParaEditar.nota), "Missão atualizada com sucesso!");
        }
        return salvarAlteracao(() => criarMissao(crianca.id, criterio, 0), "Missão criada com sucesso!");
    }

    function alterarNota(missao, nota) {
        return salvarAlteracao(() => atualizarMissao(missao.id, missao.criterio, nota), "Nota atualizada com sucesso!");
    }

    function confirmarExclusao() {
        return salvarAlteracao(() => excluirMissao(missaoParaExcluir.id), "Missão excluída com sucesso.");
    }

    async function abrirMesada() {
        if (envioEmAndamento.current || carregando) return;
        envioEmAndamento.current = true;
        definirEnviando(true);
        definirErro("");
        definirSucesso("");
        try {
            const valor = await calcularMesada(crianca.id);
            if (!paginaAberta.current) return;
            definirMesada(valor);
            definirErroMesada("");
            definirMesadaAberta(true);
        } catch (falha) {
            if (paginaAberta.current) definirErro(mensagemErroMissao(falha, "Não foi possível calcular a mesada."));
        } finally {
            envioEmAndamento.current = false;
            if (paginaAberta.current) definirEnviando(false);
        }
    }

    function confirmarRegistroMesada() {
        return salvarAlteracao(() => registrarMesada(crianca.id), "Mesada registrada no extrato com sucesso!");
    }

    const bloqueado = carregando || enviando;
    const janelaAberta = criterioAberto || Boolean(missaoParaExcluir) || mesadaAberta;

    function formatarValor(valor) {
        return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    function formatarNota(nota) {
        return Number(nota).toLocaleString("pt-BR", { maximumFractionDigits: 2 });
    }

    return (
        <div className="pagina-painel">
            <CabecalhoPainel crianca={crianca} responsavel={responsavel} criancas={criancas}
                aoTrocarCrianca={aoTrocarCrianca} aoAdicionarCrianca={aoAdicionarCrianca} aoSair={aoSair} aoVoltar={aoVoltar} bloqueado={enviando} atualizacao={atualizacao} />
            <main className="conteudo-painel">
                <header className="titulo-missoes">
                    <div><h1>Missões</h1><p>Avalie {crianca.nome} com notas de 0 a 10.</p></div>
                    <button type="button" className="btn botao-acessar-painel" disabled={bloqueado || Boolean(erroLista)}
                        onClick={() => { definirErro(""); definirSucesso(""); definirCriterioAberto(true); }}>+ Nova Missão</button>
                </header>
                {sucesso && <p className="sucesso-painel" role="status">{sucesso}</p>}
                {erro && !janelaAberta && <p className="erro-painel" role="alert">{erro}</p>}
                {carregando && <p role="status">Atualizando missões e resumo…</p>}
                <div className="grade-missoes" aria-busy={carregando}>
                    <section className="lista-missoes" aria-label="Missões da criança">
                        {erroLista ? <p className="erro-painel" role="alert">{erroLista}</p> : !carregando && missoes.length === 0 ? (
                            <div className="missoes-vazias"><span aria-hidden="true">⭐</span><h2>Nenhum critério cadastrado</h2><p>Crie critérios como Organização, Estudos e Respeito.</p></div>
                        ) : !carregando && <>
                            <p className="instrucao-missoes">Clique no número para atribuir a nota.</p>
                            {missoes.map(missao => (
                                <article className="cartao-missao" key={missao.id}>
                                    <div className="cabecalho-missao">
                                        <h2><span aria-hidden="true">⭐</span> {missao.criterio} <span className="nota-atual-missao">Nota: {missao.nota}</span></h2>
                                        <div className="acoes-missao">
                                            <button type="button" className="btn botao-secundario-painel botao-icone-missao" disabled={bloqueado} aria-label={"Editar " + missao.criterio} data-legenda="Editar" title="Editar missão"
                                                onClick={() => { definirErro(""); definirMissaoParaEditar(missao); definirCriterioAberto(true); }}>✏️</button>
                                            <button type="button" className="btn botao-excluir-missao botao-icone-missao" disabled={bloqueado} aria-label={"Excluir " + missao.criterio} data-legenda="Excluir" title="Excluir missão"
                                                onClick={() => { definirErro(""); definirMissaoParaExcluir(missao); }}>🗑️</button>
                                        </div>
                                    </div>
                                    <div className="notas-missao" role="group" aria-label={"Nota de " + missao.criterio}>
                                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(nota => (
                                            <button type="button" className="botao-nota-missao" key={nota} disabled={bloqueado}
                                                aria-pressed={Number(missao.nota) === nota} onClick={() => alterarNota(missao, nota)}>{nota}</button>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </>}
                    </section>
                    <aside className="resumo-missoes" aria-label="Resumo das missões">
                        <h2>Resumo</h2>
                        <dl>
                            <div><dt>Média das Missões</dt><dd>{carregando || media === null ? "—" : Number(media).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}</dd></div>
                            <div><dt>Mesada Base</dt><dd>{carregando || !configuracao ? "—" : formatarValor(configuracao.valorBase)}</dd></div>
                            <div><dt>Mesada Calculada</dt><dd>{carregando || mesada === null ? "—" : Number(mesada).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</dd></div>
                        </dl>
                        {!carregando && configuracao && <section className="faixas-resumo-missoes" aria-label="Faixas configuradas">
                            <h3>Faixas configuradas</h3>
                            <p><span>Abaixo de {formatarNota(configuracao.notaMinimaIntermediaria)}</span><strong>{formatarValor(configuracao.valorFaixaBaixa)}</strong></p>
                            <p><span>De {formatarNota(configuracao.notaMinimaIntermediaria)} até menos de {formatarNota(configuracao.notaMinimaMaxima)}</span><strong>{formatarValor(configuracao.valorFaixaIntermediaria)}</strong></p>
                            <p><span>A partir de {formatarNota(configuracao.notaMinimaMaxima)}</span><strong>{formatarValor(configuracao.valorFaixaMaxima)}</strong></p>
                        </section>}
                        {erroConfiguracao && <p className="erro-painel" role="alert">{erroConfiguracao}</p>}
                        {!carregando && !configuracao && !erroConfiguracao && <div className="mesada-sem-configuracao">
                            <p>A mesada desta criança ainda não foi configurada.</p>
                            <Link className="btn botao-acessar-painel" to="/configuracoes">Configurar mesada</Link>
                        </div>}
                        {erroMedia && <p className="erro-painel" role="alert">{erroMedia}</p>}
                        {erroMesada && <p className="erro-painel" role="alert">{erroMesada}</p>}
                        <button type="button" className="btn botao-acessar-painel" disabled={bloqueado || Boolean(erroLista) || mesada === null}
                            onClick={abrirMesada}>Calcular Mesada</button>
                    </aside>
                </div>
                {(erroLista || erroMedia || erroMesada || erroConfiguracao) && <button type="button" className="btn botao-secundario-painel" disabled={bloqueado} onClick={atualizar}>Tentar novamente</button>}
            </main>
            {criterioAberto && <ModalCriterio missao={missaoParaEditar} aoFechar={fecharJanelas} aoSalvar={salvarCriterio} enviando={enviando} erro={erro} />}
            {missaoParaExcluir && <ConfirmarExclusaoMissoes missao={missaoParaExcluir} aoFechar={fecharJanelas} aoConfirmar={confirmarExclusao} enviando={enviando} erro={erro} />}
            {mesadaAberta && <ConfirmarMesada mesada={mesada} crianca={crianca} aoFechar={fecharJanelas} aoConfirmar={confirmarRegistroMesada} enviando={enviando} erro={erro} />}
        </div>
    );
}
