import React, { useEffect, useState } from "react";
import CabecalhoPainel from "../components/CabecalhoPainel";
import { aprovarConquista, listarSolicitacoes, mensagemErroMeta, recusarConquista } from "../services/metaService";
import "../styles/painelPais.css";

export default function SolicitacoesPage({ crianca, responsavel, criancas, aoTrocarCrianca, aoAdicionarCrianca, aoSair, aoVoltar }) {
    const [solicitacoes, definirSolicitacoes] = useState([]);
    const [carregando, definirCarregando] = useState(true);
    const [erro, definirErro] = useState("");
    const [sucesso, definirSucesso] = useState("");
    const [acao, definirAcao] = useState(null);
    const [enviando, definirEnviando] = useState(false);

    async function carregar() {
        definirCarregando(true);
        definirErro("");
        try {
            definirSolicitacoes(await listarSolicitacoes(crianca.id));
        } catch (falha) {
            definirErro(mensagemErroMeta(falha, "Não foi possível carregar as solicitações."));
        } finally {
            definirCarregando(false);
        }
    }

    useEffect(() => { carregar(); }, [crianca.id]);

    async function confirmarAcao() {
        if (!acao || enviando) return;
        definirEnviando(true);
        definirErro("");
        try {
            if (acao.tipo === "aprovar") {
                await aprovarConquista(crianca.id, acao.meta.id);
                definirSucesso("Conquista aprovada com sucesso.");
            } else {
                await recusarConquista(crianca.id, acao.meta.id);
                definirSucesso("Solicitação recusada.");
            }
            definirAcao(null);
            await carregar();
        } catch (falha) {
            definirErro(mensagemErroMeta(falha, "Não foi possível concluir esta solicitação."));
        } finally {
            definirEnviando(false);
        }
    }

    function formatarValor(valor) {
        return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    return <div className="pagina-painel">
        <CabecalhoPainel crianca={crianca} responsavel={responsavel} criancas={criancas}
            aoTrocarCrianca={aoTrocarCrianca} aoAdicionarCrianca={aoAdicionarCrianca} aoSair={aoSair} aoVoltar={aoVoltar}
            bloqueado={enviando} atualizacao={solicitacoes.length} />
        <main className="conteudo-painel">
            <header className="titulo-solicitacoes">
                <div><h1><span className="icone-titulo-solicitacoes" aria-hidden="true">🔔</span> Solicitações de {crianca.nome}</h1><p>Revise as conquistas que aguardam sua aprovação.</p></div>
            </header>
            {sucesso && <p className="sucesso-painel" role="status">{sucesso}<button type="button" className="fechar-sucesso-registro" onClick={() => definirSucesso("")} aria-label="Fechar mensagem">×</button></p>}
            {erro && <p className="erro-painel" role="alert">{erro}</p>}
            {carregando ? <p role="status">Carregando solicitações…</p> : solicitacoes.length === 0 ? (
                <section className="solicitacoes-vazias"><span aria-hidden="true">🔔</span><h2>Nenhuma solicitação pendente</h2><p>Quando {crianca.nome} solicitar a conquista de uma meta, ela aparecerá aqui.</p></section>
            ) : <section className="lista-solicitacoes" aria-label={`Solicitações de ${crianca.nome}`}>
                {solicitacoes.map(meta => <article className="cartao-solicitacao" key={meta.id}>
                    <span className="rotulo-solicitacao">🏆 Conquista de meta</span>
                    <div className="conteudo-cartao-solicitacao">
                        <span className="icone-meta-solicitacao" aria-hidden="true">🎯</span>
                        <div className="nome-meta-solicitacao"><span>Meta alcançada</span><h2>{meta.nomeMeta}</h2><p>{crianca.nome} conseguiu juntar o valor da meta.</p></div>
                        <strong className="valor-cartao-solicitacao">{formatarValor(meta.valorGuardado)}</strong>
                    </div>
                    <div className="rodape-solicitacao"><span className="valor-reservado-solicitacao"><span aria-hidden="true">💰</span><span>Valor reservado<strong>{formatarValor(meta.valorGuardado)}</strong></span></span><div><button type="button" className="btn botao-recusar-solicitacao" disabled={enviando} onClick={() => definirAcao({ tipo: "recusar", meta })}>Recusar</button><button type="button" className="btn botao-aprovar-solicitacao" disabled={enviando} onClick={() => definirAcao({ tipo: "aprovar", meta })}>Aprovar conquista</button></div></div>
                </article>)}
            </section>}
        </main>
        {acao && <div className="modal-solicitacao-fundo" role="presentation"><section className={`modal-solicitacao ${acao.tipo === "aprovar" ? "modal-aprovar-conquista" : "modal-recusar-solicitacao"}`} role="dialog" aria-modal="true" aria-labelledby="titulo-confirmacao-solicitacao">
            <div className={`celebracao-solicitacao ${acao.tipo === "recusar" ? "celebracao-recusar-solicitacao" : ""}`} aria-hidden="true"><span>{acao.tipo === "aprovar" ? "🏆" : "↩"}</span><i>✦</i><i>✦</i></div>
            <h2 id="titulo-confirmacao-solicitacao">{acao.tipo === "aprovar" ? "Aprovar conquista?" : "Recusar solicitação?"}</h2>
            {acao.tipo === "aprovar" ? <>
                <p className="mensagem-celebracao-solicitacao">{crianca.nome} conseguiu juntar o valor da meta! 🎉</p>
                <div className="resumo-conquista-solicitacao">
                    <span className="icone-resumo-conquista" aria-hidden="true">🎯</span>
                    <div><span>Meta alcançada</span><strong>{acao.meta.nomeMeta}</strong></div>
                    <div className="valor-conquista-solicitacao"><span>Valor da conquista</span><strong>{formatarValor(acao.meta.valorGuardado)}</strong></div>
                </div>
                <p className="aviso-financeiro-solicitacao"><span className="icone-aviso-solicitacao" aria-hidden="true">ⓘ</span><span>Ao confirmar, <strong>{formatarValor(acao.meta.valorGuardado)}</strong> serão retirados do saldo total de {crianca.nome} e a meta será marcada como conquistada.</span></p>
            </> : <>
                <p className="mensagem-celebracao-solicitacao">A conquista ficará para outro momento.</p>
                <div className="resumo-conquista-solicitacao resumo-recusar-solicitacao"><span className="icone-resumo-conquista" aria-hidden="true">🎯</span><div><span>Meta alcançada</span><strong>{acao.meta.nomeMeta}</strong></div><div className="valor-conquista-solicitacao"><span>Valor reservado</span><strong>{formatarValor(acao.meta.valorGuardado)}</strong></div></div>
                <p className="aviso-recusar-solicitacao">A meta continuará alcançada e o dinheiro permanecerá reservado.</p>
            </>}
            <div className="acoes-modal-solicitacao"><button type="button" className="btn botao-cancelar-solicitacao" onClick={() => definirAcao(null)} disabled={enviando}>Cancelar</button><button type="button" className={`btn ${acao.tipo === "aprovar" ? "botao-aprovar-solicitacao" : "botao-recusar-solicitacao"}`} onClick={confirmarAcao} disabled={enviando}>{enviando ? "Aguarde…" : acao.tipo === "aprovar" ? "🏆 Confirmar conquista" : "Recusar solicitação"}</button></div>
        </section></div>}
    </div>;
}
