import React from "react";
import { Link, NavLink } from "react-router-dom";
import icone from "../assets/icons/icone_minibank_original.svg";
import logo from "../assets/icons/logo_minibank_original.svg";

export default function CabecalhoPainel({ crianca, responsavel, criancas, aoTrocarCrianca, aoSair, aoVoltar, bloqueado = false }) {
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
                    <img className="icone-painel" src={icone} alt="" />
                    <div>
                        <img className="logotipo-painel" src={logo} alt="MiniBank" />
                        <span className="identificacao-painel">Painel dos Pais</span>
                        <p>Olá, {responsavel.nome.split(" ")[0]}!</p>
                    </div>
                </div>
                <div className="acoes-cabecalho-painel">
                    <label className="seletor-crianca-painel">Criança
                        <select className="form-select" value={crianca.id} disabled={bloqueado}
                            onChange={evento => aoTrocarCrianca(Number(evento.target.value))}>
                            {criancas.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
                        </select>
                    </label>
                    <Link className="btn botao-secundario-painel" to="/home" onClick={voltar} aria-disabled={bloqueado}>Voltar ao modo criança</Link>
                    <button type="button" className="btn botao-secundario-painel" onClick={aoSair} disabled={bloqueado}>Sair</button>
                </div>
                <nav className="navegacao-painel" aria-label="Painel dos Pais">
                    <NavLink to="/financeiro" onClick={verificarNavegacao} aria-disabled={bloqueado}>Financeiro</NavLink>
                    <NavLink to="/configuracoes" onClick={verificarNavegacao} aria-disabled={bloqueado}>Configurações</NavLink>
                </nav>
            </div>
        </header>
    );
}
