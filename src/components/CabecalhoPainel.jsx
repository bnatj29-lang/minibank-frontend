import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/icons/logo_minibank_original.svg";
import { buscarSaldo } from "../services/extratoService";
import SeletorCrianca from "./SeletorCrianca";
import { listarSolicitacoes } from "../services/metaService";

function IconeNavegacao({ tipo }) {
    const propriedades = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
    if (tipo === "financeiro") return <svg {...propriedades}><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" /></svg>;
    if (tipo === "missoes") return <svg {...propriedades}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
    if (tipo === "solicitacoes") return <svg {...propriedades}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></svg>;
    if (tipo === "crianca") return <svg {...propriedades}><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></svg>;
    return <svg {...propriedades}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>;
}

function IconeCabecalho({ tipo }) {
    const propriedades = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
    if (tipo === "voltar") return <svg {...propriedades}><path d="m15 18-6-6 6-6" /></svg>;
    return <svg {...propriedades}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
}

export default function CabecalhoPainel({ crianca, responsavel, criancas, aoTrocarCrianca, aoAdicionarCrianca, aoSair, aoVoltar, bloqueado = false, atualizacao = 0 }) {
    const [saldoTotal, definirSaldoTotal] = useState(null);
    const [quantidadeSolicitacoes, definirQuantidadeSolicitacoes] = useState(0);

    useEffect(() => {
        let cancelado = false;
        buscarSaldo(crianca.id).then(saldo => {
            if (!cancelado) definirSaldoTotal(saldo);
        }).catch(() => {
            if (!cancelado) definirSaldoTotal(null);
        });
        return () => { cancelado = true; };
    }, [crianca.id, atualizacao]);

    useEffect(() => {
        let cancelado = false;
        listarSolicitacoes(crianca.id).then(solicitacoes => {
            if (!cancelado) definirQuantidadeSolicitacoes(solicitacoes.length);
        }).catch(() => {
            if (!cancelado) definirQuantidadeSolicitacoes(0);
        });
        return () => { cancelado = true; };
    }, [crianca.id, atualizacao]);

    function verificarNavegacao(evento) {
        if (bloqueado) evento.preventDefault();
    }

    function voltar(evento) {
        if (bloqueado) evento.preventDefault();
        else aoVoltar();
    }

    return (
        <header className="cabecalho-painel">
            <div className="conteudo-cabecalho-painel">
                <div className="marca-painel">
                    <div>
                        <div className="linha-marca-painel">
                            <img className="logotipo-painel" src={logo} alt="MiniBank" />
                            <span className="identificacao-painel">Painel dos Pais</span>
                        </div>
                        <p>Olá, {responsavel.nome.split(" ")[0]}!</p>
                    </div>
                </div>
                <div className="acoes-cabecalho-painel">
                    <SeletorCrianca crianca={crianca} criancas={criancas} aoTrocarCrianca={aoTrocarCrianca} aoAdicionarCrianca={aoAdicionarCrianca} bloqueado={bloqueado} />
                    <div className="saldo-cabecalho-painel">
                        <span>Saldo total</span>
                        <strong>{saldoTotal === null ? "—" : Number(saldoTotal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
                    </div>
                    <Link className="btn botao-secundario-painel botao-voltar-painel" to="/home" onClick={voltar} aria-disabled={bloqueado}><IconeCabecalho tipo="voltar" />Voltar ao modo criança</Link>
                    <button type="button" className="botao-sair-painel" onClick={aoSair} disabled={bloqueado} aria-label="Sair" data-legenda="Sair"><IconeCabecalho tipo="sair" /></button>
                </div>
                <nav className="navegacao-painel" aria-label="Painel dos Pais">
                    <NavLink to="/financeiro" onClick={verificarNavegacao} aria-disabled={bloqueado}><IconeNavegacao tipo="financeiro" />Financeiro</NavLink>
                    <NavLink to="/missoes" onClick={verificarNavegacao} aria-disabled={bloqueado}><IconeNavegacao tipo="missoes" />Missões</NavLink>
                    <NavLink to="/solicitacoes" onClick={verificarNavegacao} aria-disabled={bloqueado}><IconeNavegacao tipo="solicitacoes" />Solicitações {quantidadeSolicitacoes > 0 && <span className="badge-solicitacoes-painel">{quantidadeSolicitacoes}</span>}</NavLink>
                    <NavLink to="/configuracoes" onClick={verificarNavegacao} aria-disabled={bloqueado}><IconeNavegacao tipo="configuracoes" />Configurações</NavLink>
                    <NavLink to="/crianca" onClick={verificarNavegacao} aria-disabled={bloqueado}><IconeNavegacao tipo="crianca" />Criança</NavLink>
                </nav>
            </div>
        </header>
    );
}
