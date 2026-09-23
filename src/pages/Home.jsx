import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buscarSaldo, buscarSaldoLivre, buscarSaldoEmMetas, buscarExtrato } from "../services/extratoService";
import { listarMissoes, calcularMedia } from "../services/missaoService";
import { listarMetas, mensagemErroMeta } from "../services/metaService";
import MetasPage from "./MetasPage";
import icone from "../assets/icons/icone_minibank_original.svg";
import logo from "../assets/icons/logo_minibank_original.svg";
import "../styles/metas.css";
import "../styles/inicioCrianca.css";

export default function Home({ crianca, aoAbrirPainel, aoSair }) {
    const [saldos, definirSaldos] = useState(null);
    const [extrato, definirExtrato] = useState([]);
    const [missoes, definirMissoes] = useState([]);
    const [media, definirMedia] = useState(null);
    const [metas, definirMetas] = useState([]);
    const [erros, definirErros] = useState({});
    const [carregando, definirCarregando] = useState(true);
    const [atualizacao, definirAtualizacao] = useState(0);
    const [animacaoMoedas, definirAnimacaoMoedas] = useState(0);

    useEffect(() => {
        let cancelado = false;
        definirCarregando(true);
        definirErros({});
        definirSaldos(null);
        definirMedia(null);
        definirMetas([]);

        async function carregar() {
            // As seções são independentes: um erro nas missões não esconde o cofrinho.
            const [valores, movimentos, criterios, mediaAtual, metasAtuais] = await Promise.allSettled([
                Promise.all([buscarSaldo(crianca.id), buscarSaldoLivre(crianca.id), buscarSaldoEmMetas(crianca.id)]),
                buscarExtrato(crianca.id),
                listarMissoes(crianca.id),
                calcularMedia(crianca.id),
                listarMetas(crianca.id),
            ]);
            if (cancelado) return;
            const falhas = {};
            if (valores.status === "fulfilled") {
                definirSaldos({ total: valores.value[0], livre: valores.value[1], metas: valores.value[2] });
            } else falhas.saldos = mensagemErro(valores.reason, "Não foi possível consultar seu saldo.");
            if (movimentos.status === "fulfilled") definirExtrato(movimentos.value);
            else falhas.extrato = mensagemErro(movimentos.reason, "Não foi possível carregar as movimentações.");
            if (criterios.status === "fulfilled") definirMissoes(criterios.value);
            else falhas.missoes = mensagemErro(criterios.reason, "Não foi possível carregar suas missões.");
            if (mediaAtual.status === "fulfilled") definirMedia(mediaAtual.value);
            else falhas.media = mensagemErro(mediaAtual.reason, "Não foi possível consultar sua média.");
            if (metasAtuais.status === "fulfilled") definirMetas(metasAtuais.value);
            else falhas.metas = mensagemErroMeta(metasAtuais.reason, "Não foi possível carregar suas metas.");
            definirErros(falhas);
            definirCarregando(false);
        }
        carregar();
        return () => { cancelado = true; };
    }, [crianca.id, atualizacao]);

    function mensagemErro(falha, alternativa) {
        const mensagem = falha.response?.data?.mensagem;
        return typeof mensagem === "string" ? mensagem : alternativa;
    }

    function formatarValor(valor) {
        return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    // Só ordena a apresentação; os saldos e a média vêm prontos das APIs.
    const ultimasMovimentacoes = [...extrato]
        .sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id)
        .slice(0, 5);
    const metasEmAndamento = metas.filter(meta => meta.status !== "CONQUISTADA");
    const metasConquistadas = metas.filter(meta => meta.status === "CONQUISTADA");
    const hora = new Date().getHours();
    const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
    const dataAtual = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

    return (
        <div className="pagina-inicio-crianca">
            <header className="cabecalho-metas cabecalho-inicio-crianca">
                <div className="conteudo-cabecalho-metas cabecalho-home-conteudo">
                    <Link to="/home" className="marca-metas" aria-label="MiniBank — início">
                        <img className="logotipo-metas" src={logo} alt="MiniBank" />
                    </Link>
                    <div className="saudacao-cabecalho-inicio">
                        <strong>{saudacao}, {crianca.nome}! 👋</strong>
                        <span>{dataAtual} · {crianca.idade} {crianca.idade === 1 ? "ano" : "anos"}</span>
                    </div>
                    <nav className="navegacao-metas" aria-label="Navegação da criança">
                        <button type="button" className="btn botao-pais-metas" onClick={aoAbrirPainel}>Painel dos Pais</button>
                        <button type="button" className="botao-sair-inicio" onClick={aoSair} aria-label="Sair" data-legenda="Sair">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        </button>
                    </nav>
                </div>
            </header>
            <main className="conteudo-inicio-crianca">
                {carregando && <p role="status">Carregando seu cofrinho, movimentações e missões…</p>}
                <section className="cofrinho-crianca" aria-label="Meu cofrinho" aria-busy={carregando}>
                    <div className="titulo-cofrinho">
                        <div><h2>Meu Cofrinho</h2><strong>{carregando || !saldos ? "—" : formatarValor(saldos.total)}</strong><p>Total economizado</p></div>
                        <button type="button" className="cofrinho-interativo" aria-label="Animar moedas do cofrinho"
                            onClick={() => definirAnimacaoMoedas(valor => valor + 1)}>
                            <img src={icone} alt="" />
                            {animacaoMoedas > 0 && <span className="moedas-cofrinho" key={animacaoMoedas} aria-hidden="true">
                                {["-52px", "-26px", "0px", "26px", "52px"].map((deslocamento, indice) => (
                                    <span key={indice} className="moeda-cofrinho" style={{ "--moeda-x": deslocamento, "--moeda-y": `${-28 - (indice % 2) * 12}px`, "--moeda-atraso": `${indice * 55}ms` }} />
                                ))}
                            </span>}
                        </button>
                    </div>
                    {erros.saldos && <p role="alert">{erros.saldos}</p>}
                    <div className="divisao-cofrinho">
                        <div><h3>Saldo Livre</h3><strong>{carregando || !saldos ? "—" : formatarValor(saldos.livre)}</strong><p>disponível para você usar</p></div>
                        <div><h3>Em Metas</h3><strong>{carregando || !saldos ? "—" : formatarValor(saldos.metas)}</strong><p>guardado nos seus objetivos</p></div>
                    </div>
                </section>
                <div className="grade-principal-home">
                <section className="metas-home-crianca metas-home-resumo" aria-label="Minhas metas">
                    <div className="cabecalho-metas-home">
                        <div><h2>Minhas Metas 🎯 {metasEmAndamento.length > 0 && <span className="quantidade-metas-home">{metasEmAndamento.length}</span>}</h2><p>Guarde dinheiro para realizar seus objetivos.</p></div>
                    </div>
                    {erros.metas ? <p role="alert">{erros.metas}</p> : carregando ? <p role="status">Carregando metas…</p> : metas.length === 0 ? (
                        <div className="metas-home-vazias"><p>Você ainda não tem metas.</p><Link className="btn botao-nova-meta" to="/metas">Criar minha primeira meta</Link></div>
                    ) : <>
                        {metasEmAndamento.map(meta => (
                            <article className="cartao-meta-home" key={meta.id}>
                                <div className="cabecalho-cartao-meta-home"><div><h3>{meta.nomeMeta}</h3><p><strong>{formatarValor(meta.valorGuardado)}</strong> guardados de {formatarValor(meta.valorMeta)}</p></div><strong>{Math.round(meta.percentual)}%</strong></div>
                                <progress className="progresso-meta" max="100" value={Math.max(0, Math.min(100, meta.percentual))} aria-label={`Progresso da meta ${meta.nomeMeta}`} />
                                {meta.status === "ALCANÇADA" ? <p className="meta-alcancada">🏆 Meta alcançada! <Link to="/metas">Solicitar conquista</Link></p> : meta.status === "AGUARDANDO_APROVACAO" ? <p className="meta-alcancada">⏳ Solicitação enviada ao responsável</p> : <><p className="restante-meta">Faltam <strong>{formatarValor(meta.valorRestante)}</strong></p><Link className="btn botao-acao-meta-home" to="/metas">Guardar dinheiro</Link></>}
                            </article>
                        ))}
                        {metasConquistadas.length > 0 && <div className="conquistas-home"><h3>Metas conquistadas</h3>{metasConquistadas.map(meta => <p key={meta.id}>🏆 <strong>{meta.nomeMeta}</strong> · {formatarValor(meta.valorMeta)}</p>)}</div>}
                    </>}
                </section>
                <MetasPage crianca={crianca} aoAbrirPainel={aoAbrirPainel}
                    aoAtualizarSaldos={() => definirAtualizacao(valor => valor + 1)} embutido />
                <section className="cartao-inicio-crianca cartao-missoes-home" aria-busy={carregando}>
                    <h2>Minhas Missões ⭐</h2>
                    {erros.missoes ? <p role="alert">{erros.missoes}</p> : !carregando && (missoes.length === 0 ? <p>Nenhuma missão cadastrada.</p> : (
                        <ul className="missoes-crianca">
                            {missoes.map(missao => <li key={missao.id}><strong>{missao.criterio}</strong><span aria-label={"Nota " + missao.nota}>{missao.nota}</span></li>)}
                        </ul>
                    ))}
                    <div className="media-crianca">
                        <p>Média atual</p>
                        <strong>{carregando || media === null ? "—" : Number(media).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}</strong>
                        {erros.media && <p role="alert">{erros.media}</p>}
                    </div>
                </section>
                </div>
                {Object.keys(erros).length > 0 && <button className="btn botao-secundario-meta" type="button" disabled={carregando}
                    onClick={() => { definirCarregando(true); definirAtualizacao(valor => valor + 1); }}>Tentar novamente</button>}
            </main>
        </div>
    );
}
