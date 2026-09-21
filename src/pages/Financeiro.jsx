import React, { useEffect, useState } from "react";
import { buscarExtrato, buscarSaldo, buscarSaldoEmMetas, buscarSaldoLivre } from "../services/extratoService";
import RegistrarEconomia from "../components/RegistrarEconomia";
import RegistrarRetirada from "../components/RegistrarRetirada";
import CabecalhoPainel from "../components/CabecalhoPainel";
import "../styles/painelPais.css";

export default function Financeiro({ crianca, responsavel, criancas, aoTrocarCrianca, aoAdicionarCrianca, aoSair, aoVoltar }) {
    const [extrato, definirExtrato] = useState([]);
    const [saldo, definirSaldo] = useState(null);
    const [saldoEmMetas, definirSaldoEmMetas] = useState(null);
    const [saldoLivre, definirSaldoLivre] = useState(null);
    const [carregando, definirCarregando] = useState(true);
    const [erro, definirErro] = useState("");
    const [sucesso, definirSucesso] = useState("");
    const [atualizacao, definirAtualizacao] = useState(0);
    const [operacao, definirOperacao] = useState(null);

    useEffect(() => {
        let cancelado = false;
        definirCarregando(true);
        definirErro("");
        async function carregar() {
            try {
                const [dados, saldoAtual, valorEmMetas, valorLivre] = await Promise.all([
                    buscarExtrato(crianca.id),
                    buscarSaldo(crianca.id),
                    buscarSaldoEmMetas(crianca.id),
                    buscarSaldoLivre(crianca.id),
                ]);
                if (!cancelado) {
                    definirExtrato(dados);
                    definirSaldo(saldoAtual);
                    definirSaldoEmMetas(valorEmMetas);
                    definirSaldoLivre(valorLivre);
                }
            } catch (falha) {
                const mensagem = falha.response?.data?.mensagem;
                if (!cancelado) definirErro(typeof mensagem === "string" ? mensagem : "Não foi possível carregar o financeiro. Tente novamente.");
            } finally {
                if (!cancelado) definirCarregando(false);
            }
        }
        carregar();
        return () => { cancelado = true; };
    }, [crianca.id, atualizacao]);

    const indisponivel = carregando || Boolean(erro);
    const movimentos = [...extrato].sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id);

    function formatarValor(valor) {
        return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    function registroConcluido() {
        definirOperacao(null);
        definirSucesso("Movimentação registrada com sucesso.");
        definirCarregando(true);
        definirAtualizacao(atualizacao + 1);
    }

    return (
        <div className="pagina-painel">
            <CabecalhoPainel crianca={crianca} responsavel={responsavel} criancas={criancas}
                aoTrocarCrianca={aoTrocarCrianca} aoAdicionarCrianca={aoAdicionarCrianca} aoSair={aoSair} aoVoltar={aoVoltar} atualizacao={atualizacao} />
            <main className="conteudo-painel">
                <h1>Financeiro de {crianca.nome}</h1>
                <div className="saldos-financeiro">
                <section className="saldo-total-painel" aria-label="Saldo total">
                    <p><span className="emote-saldo" aria-hidden="true">💰</span> Saldo Total</p>
                    <strong>{indisponivel ? "—" : formatarValor(saldo)}</strong>
                    <p>tudo que {crianca.nome} tem</p>
                </section>
                <section className="saldo-livre-painel" aria-label="Saldo livre">
                    <p><span className="emote-saldo" aria-hidden="true">👛</span> Saldo Livre</p>
                    <strong>{indisponivel ? "—" : formatarValor(saldoLivre)}</strong>
                    <p>não alocado em metas</p>
                </section>
                <section className="saldo-metas-painel" aria-label="Reservado em metas">
                    <p><span className="emote-saldo" aria-hidden="true">🎯</span> Em Metas</p>
                    <strong>{indisponivel ? "—" : formatarValor(saldoEmMetas)}</strong>
                    <p>guardado por {crianca.nome}</p>
                </section>
                </div>
                <div className="acoes-financeiro">
                    <button className="acao-entrada" disabled={indisponivel} onClick={() => definirOperacao("ENTRADA")}><span aria-hidden="true">↓</span><strong>Registrar Entrada</strong><p>Adicionar dinheiro para {crianca.nome} (ex: mesada)</p></button>
                    <button className="acao-retirada" disabled={indisponivel || saldoLivre <= 0} onClick={() => definirOperacao("RETIRADA")}><span aria-hidden="true">↑</span><strong>Registrar Retirada</strong><p>Registrar gasto do saldo livre de {crianca.nome}</p></button>
                </div>
                {sucesso && <p className="sucesso-painel" role="status">
                <span>{sucesso}</span>

                <button type="button" className="fechar-sucesso-registro" aria-label="Fechar mensagem"
                        onClick={() => definirSucesso("")}
                >
                    ×
                </button>
            </p>}
                <section className="extrato-painel" aria-busy={carregando}>
                    <header><h2>Extrato</h2>{!indisponivel && <p>{extrato.length} movimentações</p>}</header>
                    {carregando ? <p className="estado-extrato" role="status">Carregando extrato…</p> : erro ? (
                        <div className="estado-extrato"><p role="alert">{erro}</p><button className="btn botao-secundario-painel" onClick={() => definirAtualizacao(atualizacao + 1)}>Tentar novamente</button></div>
                    ) : extrato.length === 0 ? <p className="estado-extrato">Nenhuma movimentação ainda.</p> : (
                        <div className="tabela-extrato">
                            <table>
                                <thead><tr><th scope="col">Data</th><th scope="col">Tipo</th><th scope="col">Descrição</th><th scope="col">Valor</th></tr></thead>
                                <tbody>{movimentos.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.data.split("-").reverse().join("/")}</td>
                                        <td><span className={item.tipo === "ENTRADA" ? "tipo-entrada" : "tipo-retirada"}>{item.tipo === "ENTRADA" ? "↑ Entrada" : "↓ Retirada"}</span></td>
                                        <td>{item.descricao || "—"}</td>
                                        <td className={item.tipo === "ENTRADA" ? "valor-entrada" : "valor-retirada"}>{item.tipo === "ENTRADA" ? "+" : "−"}{formatarValor(item.valor)}</td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
            {operacao === "ENTRADA" && <RegistrarEconomia crianca={crianca} saldo={saldo} aoFechar={() => definirOperacao(null)} aoRegistrar={registroConcluido} />}
            {operacao === "RETIRADA" && <RegistrarRetirada crianca={crianca} saldo={saldoLivre} aoFechar={() => definirOperacao(null)} aoRegistrar={registroConcluido} />}
        </div>
    );
}
