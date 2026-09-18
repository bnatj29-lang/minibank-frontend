import React, {useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import CampoSenha from "./CampoSenha";
import {entrarUsuario, mensagemErroAutenticacao} from "../services/usuarioService";
import logo from "../assets/icons/logo_minibank_original.svg";
import "../styles/autenticacao.css";

export default function Login({ aoEntrar }) {
    const {state: estado} = useLocation();
    const [email, definirEmail] = useState(estado?.email || "");
    const [senha, definirSenha] = useState("");
    const [erro, definirErro] = useState("");
    const [enviando, definirEnviando] = useState(false);
    const navegar = useNavigate();

    async function enviarFormulario(evento) {
        evento.preventDefault();
        if (enviando) return;
        definirErro("");
        definirEnviando(true);
        try {
            const familia = await entrarUsuario({email: email.trim(), senha});
            if (!familia?.responsavel?.id || !Array.isArray(familia.criancas)) {
                definirErro("Não foi possível carregar os dados da família. Tente novamente.");
                return;
            }
            aoEntrar(familia);
            navegar("/selecionar-crianca", {replace: true});
        } catch (falha) {
            definirErro(mensagemErroAutenticacao(falha));
        } finally {
            definirEnviando(false);
        }
    }

    return <main className="pagina-autenticacao pagina-login">
        <div className="formulario-entrada">
            <header className="marca-autenticacao">
                <img className="logotipo-marca-autenticacao" src={logo} alt="MiniBank"/>
            </header>
            <section className="cartao-entrada">
                <h1>Entrar na sua conta</h1>
                {estado?.cadastroSucesso &&
                    <div className="alert alert-success" role="status">Conta criada com sucesso! Entre com seu e-mail e
                        senha.</div>}
                {estado?.senhaRedefinida &&
                    <div className="alert alert-success" role="status">Sua senha foi redefinida com sucesso. Faça login novamente.</div>}
                <form onSubmit={enviarFormulario} aria-busy={enviando}>
                    <fieldset disabled={enviando} className="campos-formulario">
                        <div>
                            <label className="form-label" htmlFor="email">
                                E-mail<span className="campo-obrigatorio"> *</span>
                            </label>
                            <div className="envoltorio-campo">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="form-control"
                                    autoComplete="username"
                                    placeholder="familia@email.com"
                                    value={email}
                                    onChange={evento => {
                                        definirEmail(evento.target.value);
                                        definirErro("");
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <CampoSenha
                            id="senha"
                            rotulo="Senha"
                            valor={senha}
                            aoAlterar={evento => {
                                definirSenha(evento.target.value);
                                definirErro("");
                            }}
                            minimo={6}
                            exemplo="••••••"
                            preenchimentoAutomatico="current-password"
                        />
                        {erro && <div className="alert alert-danger mensagem-erro" role="alert">{erro}</div>}
                        <button className="btn botao-enviar"
                                type="submit">{enviando ? "Entrando…" : "Entrar"}</button>
                    </fieldset>
                </form>
                <p className="link-esqueceu-senha"><Link to="/recuperar-senha" state={{ email }}>Esqueceu sua senha?</Link></p>
                <div className="divisor-autenticacao"><span>ou</span></div>
                <Link to="/cadastro" className="btn link-cadastro">Criar conta gratuita</Link>
            </section>
        </div>
    </main>;
}
