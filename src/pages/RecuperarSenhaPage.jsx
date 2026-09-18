import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { solicitarRecuperacao, mensagemErroRecuperacao } from "../services/recuperacaoSenhaService";
import logo from "../assets/icons/logo_minibank_original.svg";
import "../styles/autenticacao.css";

export default function RecuperarSenhaPage() {
    const localizacao = useLocation();
    const [email, definirEmail] = useState(localizacao.state?.email || "");
    const [erro, definirErro] = useState("");
    const [mensagem, definirMensagem] = useState("");
    const [enviando, definirEnviando] = useState(false);

    async function enviarFormulario(evento) {
        evento.preventDefault();
        if (enviando) return;
        definirErro("");
        definirMensagem("");
        definirEnviando(true);
        try {
            const resposta = await solicitarRecuperacao(email.trim());
            definirMensagem(resposta.mensagem || "Se existir uma conta cadastrada com esse e-mail, enviaremos as instruções para redefinir sua senha.");
        } catch (falha) {
            definirErro(mensagemErroRecuperacao(falha));
        } finally {
            definirEnviando(false);
        }
    }

    return <main className="pagina-autenticacao">
        <div className="formulario-entrada">
            <header className="marca-autenticacao">
                <img className="logotipo-marca-autenticacao" src={logo} alt="MiniBank" />
            </header>
            <section className="cartao-entrada">
                <h1>Recuperar senha</h1>
                <p className="descricao-autenticacao">Informe seu e-mail para receber as instruções de redefinição.</p>
                {mensagem && <div className="alert alert-success" role="status">{mensagem}</div>}
                {erro && <div className="alert alert-danger mensagem-erro" role="alert">{erro}</div>}
                <form onSubmit={enviarFormulario} aria-busy={enviando}>
                    <fieldset disabled={enviando} className="campos-formulario">
                        <div>
                            <label className="form-label" htmlFor="email-recuperacao">E-mail<span className="campo-obrigatorio"> *</span></label>
                            <input id="email-recuperacao" type="email" className="form-control" autoComplete="email"
                                placeholder="familia@email.com" value={email}
                                onChange={evento => { definirEmail(evento.target.value); definirErro(""); }} required />
                        </div>
                        <button className="btn botao-enviar" type="submit">{enviando ? "Enviando…" : "Enviar instruções"}</button>
                    </fieldset>
                </form>
                <p className="rodape-autenticacao"><Link to="/login">Voltar para o login</Link></p>
            </section>
        </div>
    </main>;
}
