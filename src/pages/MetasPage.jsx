import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarMetas, mensagemErroMeta } from "../services/metaService";
import CriarMetaModal from "../components/CriarMetaModal";
import EditarMetaModal from "../components/EditarMetaModal";
import ExcluirMetaModal from "../components/ExcluirMetaModal";
import GuardarDinheiroModal from "../components/GuardarDinheiroModal";
import ConquistarMetaModal from "../components/ConquistarMetaModal";
import { buscarSaldoLivre } from "../services/extratoService";
import logo from "../assets/icons/logo_minibank_original.svg";
import "../styles/metas.css";

export default function MetasPage({ crianca, aoAbrirPainel, aoAtualizarSaldos, embutido = false }) {
    const [metas, definirMetas] = useState([]);
    const [carregando, definirCarregando] = useState(true);
    const [erro, definirErro] = useState("");
    const [sucesso, definirSucesso] = useState("");
    const [atualizacao, definirAtualizacao] = useState(0);
    const [criacaoAberta, definirCriacaoAberta] = useState(false);
    const [metaParaEditar, definirMetaParaEditar] = useState(null);
    const [metaParaExcluir, definirMetaParaExcluir] = useState(null);
    const [metaParaGuardar, definirMetaParaGuardar] = useState(null);
    const [metaParaConquistar, definirMetaParaConquistar] = useState(null);
    const [saldoLivre, definirSaldoLivre] = useState(null);
    const [conquistasExpandidas, definirConquistasExpandidas] = useState(false);

    useEffect(() => {
        let cancelado = false;
        definirCarregando(true);
        definirErro("");

        async function carregarMetas() {
            try {
                const [dados, saldo] = await Promise.all([listarMetas(crianca.id), buscarSaldoLivre(crianca.id)]);
                if (!cancelado) {
                    definirMetas(dados);
                    definirSaldoLivre(saldo);
                }
            } catch (falha) {
                if (!cancelado) definirErro(mensagemErroMeta(falha, "Não foi possível carregar as metas. Tente novamente."));
            } finally {
                if (!cancelado) definirCarregando(false);
            }
        }

        carregarMetas();
        return () => { cancelado = true; };
    }, [crianca.id, atualizacao]);

    function atualizarMetas(mensagem) {
        definirCriacaoAberta(false);
        definirMetaParaEditar(null);
        definirMetaParaExcluir(null);
        definirMetaParaGuardar(null);
        definirMetaParaConquistar(null);
        definirConquistasExpandidas(false);
        if (aoAtualizarSaldos) aoAtualizarSaldos();
        definirSucesso(mensagem);
        definirCarregando(true);
        definirAtualizacao(atual => atual + 1);
    }

    function abrirCriacao() {
        definirSucesso("");
        definirCriacaoAberta(true);
    }

    function formatarValor(valor) {
        return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    const metasAtuais = metas.filter(meta => meta.status !== "CONQUISTADA");
    const metasConquistadas = metas.filter(meta => meta.status === "CONQUISTADA");
    const conquistasVisiveis = conquistasExpandidas ? metasConquistadas : metasConquistadas.slice(0, 3);

    return (
        <div className={embutido ? "metas-embutidas" : "pagina-metas"}>
            {!embutido && <header className="cabecalho-metas">
                <div className="conteudo-cabecalho-metas">
                    <Link to="/home" className="marca-metas" aria-label="MiniBank — início">
                        <img className="logotipo-metas" src={logo} alt="MiniBank" />
                    </Link>
                    <nav className="navegacao-metas" aria-label="Navegação da criança">
                        <Link to="/home" className="btn botao-secundario-meta">Voltar ao início</Link>
                        <button className="btn botao-pais-metas" type="button" onClick={aoAbrirPainel}>Painel dos Pais</button>
                    </nav>
                </div>
            </header>}
            <main className={embutido ? "conteudo-metas-embutido" : "conteudo-metas"}>
                <div className="titulo-pagina-metas">
                    <div>
                        <h1>Minhas Metas</h1>
                        <p>Os objetivos de {crianca.nome}</p>
                    </div>
                    <button className="btn botao-nova-meta" type="button" onClick={abrirCriacao} disabled={carregando || Boolean(erro)}>+ Nova Meta</button>
                </div>
                {sucesso && <p className="sucesso-metas" role="status">{sucesso}</p>}
                {!carregando && !erro && <p className="saldo-livre-metas">Saldo livre disponível: <strong>{formatarValor(saldoLivre)}</strong></p>}
                {carregando ? (
                    <p className="estado-metas" role="status">Carregando metas…</p>
                ) : erro ? (
                    <div className="estado-metas">
                        <p role="alert">{erro}</p>
                        <button className="btn botao-secundario-meta" onClick={() => atualizarMetas("")}>Tentar novamente</button>
                    </div>
                ) : (
                    <>
                        {metasAtuais.length === 0 ? (
                            <section className="metas-vazias">
                                <span className="simbolo-metas" aria-hidden="true">🎯</span>
                                <h2>{metasConquistadas.length ? "Qual será sua próxima meta?" : "Você ainda não tem metas!"}</h2>
                                <p>Crie uma meta para o que você deseja conquistar.</p>
                                <button className="btn botao-nova-meta" onClick={abrirCriacao}>{metasConquistadas.length ? "Criar nova meta" : "Criar minha primeira meta!"}</button>
                            </section>
                        ) : (
                            <section className="lista-metas" aria-label="Metas em andamento">
                                {metasAtuais.map(meta => (
                                    <article className="cartao-meta" key={meta.id}>
                                        <div className="cabecalho-cartao-meta">
                                            <div>
                                                <h2>{meta.nomeMeta}</h2>
                                                <p><strong>{formatarValor(meta.valorGuardado)}</strong> guardados de {formatarValor(meta.valorMeta)}</p>
                                            </div>
                                            <div className="acoes-cartao-meta">
                                                <button className="btn botao-editar-meta" type="button"
                                                    aria-label={`Editar meta ${meta.nomeMeta}`} data-legenda="Editar" onClick={() => { definirSucesso(""); definirMetaParaEditar(meta); }}>✏️</button>
                                                <button className="btn botao-excluir-meta" type="button"
                                                    aria-label={`Excluir meta ${meta.nomeMeta}`} data-legenda="Excluir" onClick={() => { definirSucesso(""); definirMetaParaExcluir(meta); }}>🗑️</button>
                                            </div>
                                        </div>
                                        <div className="resumo-progresso-meta">
                                            <span>{meta.status === "ALCANÇADA" ? "Alcançada" : "Em andamento"}</span>
                                            <strong>{Math.round(meta.percentual)}%</strong>
                                        </div>
                                        <progress className="progresso-meta" max="100" value={Math.max(0, Math.min(100, meta.percentual))}
                                            aria-label={`Progresso da meta ${meta.nomeMeta}`} />
                                        {meta.status === "ALCANÇADA" ? (
                                            <p className="meta-alcancada">🏆 Você juntou o suficiente para esta meta!</p>
                                        ) : <p className="restante-meta">Faltam <strong>{formatarValor(meta.valorRestante)}</strong></p>}
                                        {meta.status === "ALCANÇADA" ? (
                                            <button className="btn botao-nova-meta" type="button" onClick={() => { definirSucesso(""); definirMetaParaConquistar(meta); }}>🏆 Conquistar meta</button>
                                        ) : (
                                            <button className="btn botao-nova-meta" type="button" disabled={saldoLivre <= 0}
                                                onClick={() => { definirSucesso(""); definirMetaParaGuardar(meta); }}>{saldoLivre <= 0 ? "Sem saldo livre no momento" : "Guardar dinheiro"}</button>
                                        )}
                                    </article>
                                ))}
                            </section>
                        )}
                        {metasConquistadas.length > 0 && (
                            <section className="lista-conquistas" aria-label="Metas conquistadas">
                                <h2>🏆 Metas Conquistadas</h2>
                                {conquistasVisiveis.map(meta => (
                                    <article className="meta-conquistada" key={meta.id}>
                                        <div><h3>{meta.nomeMeta}</h3><p>{formatarValor(meta.valorMeta)}</p></div>
                                        <span>🏆 Conquistada</span>
                                    </article>
                                ))}
                                {metasConquistadas.length > 3 && <button type="button" className="btn botao-ver-conquistas"
                                    onClick={() => definirConquistasExpandidas(expandidas => !expandidas)}>
                                    {conquistasExpandidas ? "↑ Ver menos" : `↓ Ver todas as conquistas (${metasConquistadas.length})`}
                                </button>}
                            </section>
                        )}
                    </>
                )}
            </main>
            {criacaoAberta && <CriarMetaModal crianca={crianca} aoFechar={() => definirCriacaoAberta(false)} aoCriar={() => atualizarMetas("Meta criada com sucesso!")} />}
            {metaParaEditar && <EditarMetaModal key={metaParaEditar.id} criancaId={crianca.id} meta={metaParaEditar} aoFechar={() => definirMetaParaEditar(null)} aoEditar={() => atualizarMetas("Meta atualizada com sucesso!")} />}
            {metaParaExcluir && <ExcluirMetaModal criancaId={crianca.id} meta={metaParaExcluir} aoFechar={() => definirMetaParaExcluir(null)} aoExcluir={() => atualizarMetas("Meta excluída com sucesso.")} />}
            {metaParaGuardar && <GuardarDinheiroModal key={metaParaGuardar.id} criancaId={crianca.id} meta={metaParaGuardar} saldoLivre={saldoLivre}
                aoFechar={() => definirMetaParaGuardar(null)} aoGuardar={() => atualizarMetas("Dinheiro guardado na meta com sucesso!")} />}
            {metaParaConquistar && <ConquistarMetaModal criancaId={crianca.id} meta={metaParaConquistar}
                aoFechar={() => definirMetaParaConquistar(null)} aoConquistar={() => atualizarMetas("Meta conquistada! O gasto foi registrado no extrato.")} />}
        </div>
    );
}
