import React, { useEffect, useState } from "react";
import { buscarExtrato, buscarSaldo } from "../services/extratoService";
import RegistrarEconomia from "../components/RegistrarEconomia";
import RegistrarRetirada from "../components/RegistrarRetirada";
import CabecalhoPainel from "../components/CabecalhoPainel";
import "../styles/painelPais.css";

export default function Financeiro({ crianca, responsavel, criancas, aoTrocarCrianca, aoSair, aoVoltar }) {
    const [extrato, definirExtrato] = useState([]);
    const [saldo, definirSaldo] = useState(null);
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
                const [dados, saldoAtual] = await Promise.all([
                    buscarExtrato(crianca.id),
                    buscarSaldo(crianca.id),
                ]);
                if (!cancelado) {
                    definirExtrato(dados);
                    definirSaldo(saldoAtual);
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
                aoTrocarCrianca={aoTrocarCrianca} aoSair={aoSair} aoVoltar={aoVoltar} />
            <main className="conteudo-painel">
                <h1>Financeiro de {crianca.nome}</h1>
                <section className="saldo-total-painel" aria-label="Saldo total">
                    <p>Saldo Total</p>
                    <strong>{indisponivel ? "—" : formatarValor(saldo)}</strong>
                    <p>tudo que {crianca.nome} tem</p>
                </section>
                <div className="acoes-financeiro">
                    <button className="acao-entrada" disabled={indisponivel} onClick={() => definirOperacao("ENTRADA")}><span aria-hidden="true">↓</span><strong>Registrar Entrada</strong><p>Adicionar dinheiro para {crianca.nome} (ex: mesada)</p></button>
                    <button className="acao-retirada" disabled={indisponivel || saldo <= 0} onClick={() => definirOperacao("RETIRADA")}><span aria-hidden="true">↑</span><strong>Registrar Retirada</strong><p>Registrar gasto de {crianca.nome}</p></button>
                </div>
                {sucesso && <p className="sucesso-painel" role="status">{sucesso}</p>}
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
                                        <td><span className={item.tipo === "ENTRADA" ? "tipo-entrada" : "tipo-retirada"}>{item.tipo === "ENTRADA" ? "Entrada" : "Retirada"}</span></td>
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
            {operacao === "RETIRADA" && <RegistrarRetirada crianca={crianca} saldo={saldo} aoFechar={() => definirOperacao(null)} aoRegistrar={registroConcluido} />}
        </div>
    );
}
