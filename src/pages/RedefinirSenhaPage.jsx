import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CampoSenha from "../components/CampoSenha";
import { redefinirSenha, validarTokenRecuperacao, mensagemErroRecuperacao } from "../services/recuperacaoSenhaService";
import { limparSessao } from "../services/sessaoService";
import logo from "../assets/icons/logo_minibank_original.svg";
import "../styles/autenticacao.css";

const mensagemTokenInvalido = "Este link de recuperação não é mais válido. Solicite um novo.";

export default function RedefinirSenhaPage() {
    const [parametros] = useSearchParams();
    const navegar = useNavigate();
    const token = parametros.get("token") || "";
    const [validando, definirValidando] = useState(true);
    const [tokenValido, definirTokenValido] = useState(false);
    const [novaSenha, definirNovaSenha] = useState("");
    const [confirmacaoSenha, definirConfirmacaoSenha] = useState("");
    const [erro, definirErro] = useState("");
    const [enviando, definirEnviando] = useState(false);

    useEffect(() => {
        let componenteAtivo = true;
        definirValidando(true);
        definirTokenValido(false);
        definirErro("");

        if (!token) {
            definirValidando(false);
            definirErro(mensagemTokenInvalido);
            return () => { componenteAtivo = false; };
        }

        validarTokenRecuperacao(token)
            .then(() => {
                if (componenteAtivo) definirTokenValido(true);
            })
            .catch(() => {
                if (componenteAtivo) definirErro(mensagemTokenInvalido);
            })
            .finally(() => {
                if (componenteAtivo) definirValidando(false);
            });

        return () => { componenteAtivo = false; };
    }, [token]);

    async function enviarFormulario(evento) {
        evento.preventDefault();
        if (enviando || !tokenValido) return;
        definirErro("");
        if (novaSenha !== confirmacaoSenha) {
            definirErro("A nova senha e a confirmação precisam ser iguais.");
            return;
        }
        definirEnviando(true);
        try {
            await redefinirSenha({ token, novaSenha, confirmacaoSenha });
            limparSessao();
            navegar("/login", { replace: true, state: { senhaRedefinida: true } });
        } catch (falha) {
            if (falha.response?.status === 400 && falha.response.data?.mensagem === mensagemTokenInvalido) {
                definirTokenValido(false);
            }
            definirErro(mensagemErroRecuperacao(falha));
        } finally {
            definirEnviando(false);
        }
    }

    if (validando) {
        return <main className="pagina-autenticacao">
            <div className="formulario-entrada">
                <header className="marca-autenticacao">
                    <img className="logotipo-marca-autenticacao" src={logo} alt="MiniBank" />
                </header>
                <section className="cartao-entrada estado-recuperacao" role="status" aria-live="polite">
                    <p>Validando o link de recuperação…</p>
                </section>
            </div>
        </main>;
    }

    if (!tokenValido) {
        return <main className="pagina-autenticacao">
            <div className="formulario-entrada">
                <header className="marca-autenticacao">
                    <img className="logotipo-marca-autenticacao" src={logo} alt="MiniBank" />
                </header>
                <section className="cartao-entrada estado-recuperacao">
                    <h1>Link inválido</h1>
                    <p className="alert alert-danger" role="alert">{erro || mensagemTokenInvalido}</p>
                    <div className="acoes-recuperacao">
                        <Link className="btn botao-enviar" to="/recuperar-senha">Solicitar novo link</Link>
                        <Link className="btn botao-secundario-autenticacao" to="/login">Voltar para o login</Link>
                    </div>
                </section>
            </div>
        </main>;
    }

    return <main className="pagina-autenticacao">
        <div className="formulario-entrada">
            <header className="marca-autenticacao">
                <img className="logotipo-marca-autenticacao" src={logo} alt="MiniBank" />
            </header>
            <section className="cartao-entrada">
                <h1>Redefinir senha</h1>
                {erro && <div className="alert alert-danger mensagem-erro" role="alert">{erro}</div>}
                <form onSubmit={enviarFormulario} aria-busy={enviando}>
                    <fieldset disabled={enviando || !token} className="campos-formulario">
                        <CampoSenha id="nova-senha" rotulo="Nova senha" valor={novaSenha} aoAlterar={evento => { definirNovaSenha(evento.target.value); definirErro(""); }} minimo={6} exemplo="••••••" preenchimentoAutomatico="new-password" />
                        <CampoSenha id="confirmacao-senha" rotulo="Confirmar nova senha" valor={confirmacaoSenha} aoAlterar={evento => { definirConfirmacaoSenha(evento.target.value); definirErro(""); }} minimo={6} exemplo="••••••" preenchimentoAutomatico="new-password" />
                        <button className="btn botao-enviar" type="submit">{enviando ? "Salvando…" : "Redefinir senha"}</button>
                    </fieldset>
                </form>
                <p className="rodape-autenticacao"><Link to="/login">Voltar para o login</Link></p>
            </section>
        </div>
    </main>;
}
