import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoSenha from "../components/CampoSenha";
import { cadastrarUsuario, mensagemErroAutenticacao } from "../services/usuarioService";
import icone from "../assets/icons/icone_minibank_original.svg";
import "../styles/autenticacao.css";

export default function CadastroPage() {
    const navegar = useNavigate();
    const [dados, definirDados] = useState({ nome: "", email: "", senha: "", senhaPainel: "" });
    const [criancas, definirCriancas] = useState([{ id: 1, nome: "", idade: "" }]);
    const proximoIdCrianca = useRef(2);
    const [erro, definirErro] = useState("");
    const [enviando, definirEnviando] = useState(false);
    function atualizarCampo(evento) {
        const nome = evento.target.name;
        const valor = evento.target.value;
        definirDados({ ...dados, [nome]: valor });
        definirErro("");
    }

    function adicionarCrianca() {
        const novaCrianca = { id: proximoIdCrianca.current, nome: "", idade: "" };
        proximoIdCrianca.current += 1;
        definirCriancas([...criancas, novaCrianca]);
        definirErro("");
    }

    function removerCrianca(id) {
        if (criancas.length === 1) return;
        definirCriancas(criancas.filter(crianca => crianca.id !== id));
        definirErro("");
    }

    function atualizarCrianca(id, evento) {
        const campo = evento.target.name;
        const valor = evento.target.value;
        definirCriancas(criancas.map(crianca => {
            if (crianca.id === id) {
                return { ...crianca, [campo]: valor };
            }
            return crianca;
        }));
        definirErro("");
    }

    async function cadastrar(evento) {
        evento.preventDefault();
        if (enviando) return;
        if (!dados.nome.trim() || !dados.senha.trim() || !dados.senhaPainel.trim()) {
            definirErro("Preencha os nomes e as senhas sem usar apenas espaços."); return;
        }
        for (let indice = 0; indice < criancas.length; indice += 1) {
            const crianca = criancas[indice];
            if (!crianca.nome.trim()) {
                definirErro(`Preencha o nome da criança ${indice + 1}.`);
                return;
            }
            const idade = Number(crianca.idade);
            if (!Number.isInteger(idade) || idade < 1 || idade > 18) {
                definirErro(`A idade da criança ${indice + 1} deve ser um número inteiro entre 1 e 18.`);
                return;
            }
        }
        definirErro(""); definirEnviando(true);
        try {
            await cadastrarUsuario({
                responsavel: { nome: dados.nome.trim(), email: dados.email.trim(), senha: dados.senha, senhaPainel: dados.senhaPainel },
                crianca: criancas.map(crianca => ({
                    nome: crianca.nome.trim(),
                    idade: Number(crianca.idade),
                })),
            });
            navegar("/login", { replace: true, state: { cadastroSucesso: true, email: dados.email.trim() } });
        } catch (falha) { definirErro(mensagemErroAutenticacao(falha, true)); }
        finally { definirEnviando(false); }
    }
    return <main className="pagina-autenticacao">
        <div className="formulario-cadastro">
            <header className="cabecalho-cadastro">
                <Link to="/login" className="btn botao-voltar" aria-label="Voltar para o login">←</Link>
                <img className="icone-cadastro" src={icone} alt="MiniBank" />
                <div><h1>Criar conta</h1><p>Cadastro da família no MiniBank</p></div>
            </header>
            <form onSubmit={cadastrar} aria-busy={enviando}>
                <fieldset disabled={enviando} className="campos-formulario">
                    <section className="cartao-autenticacao">
                        <h2>Responsável</h2>
                        <div className="campos-formulario">
                            <div>
                                <label className="form-label" htmlFor="nome">
                                    Nome completo<span className="campo-obrigatorio"> *</span>
                                </label>
                                <div className="envoltorio-campo">
                                    <input
                                        id="nome"
                                        name="nome"
                                        type="text"
                                        className="form-control"
                                        autoComplete="name"
                                        placeholder="Ex: Maria Silva"
                                        value={dados.nome}
                                        onChange={atualizarCampo}
                                        required
                                    />
                                </div>
                            </div>
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
                                        value={dados.email}
                                        onChange={atualizarCampo}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="linha-campos">
                                <div className="coluna-campo"><CampoSenha
                                    id="senha"
                                    rotulo="Senha de login"
                                    valor={dados.senha}
                                    aoAlterar={atualizarCampo}
                                    minimo={6}
                                    exemplo="Mín. 6 caracteres"
                                    preenchimentoAutomatico="new-password"
                                    ajuda="Para entrar na plataforma"
                                /></div>
                                <div className="coluna-campo"><CampoSenha
                                    id="senhaPainel"
                                    rotulo="Senha do painel"
                                    valor={dados.senhaPainel}
                                    aoAlterar={atualizarCampo}
                                    minimo={4}
                                    exemplo="Mín. 4 caracteres"
                                    preenchimentoAutomatico="new-password"
                                    ajuda="Para o Painel dos Pais"
                                /></div>
                            </div>
                        </div>
                    </section>
                    <section className="cartao-autenticacao">
                        <h2>Crianças</h2>
                        <div className="campos-formulario">
                            {criancas.map((crianca, indice) => (
                                <div className="cadastro-crianca" key={crianca.id}>
                                    <div className="cabecalho-crianca">
                                        <h3>Criança {indice + 1}</h3>
                                        {criancas.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn botao-remover-crianca"
                                                onClick={() => removerCrianca(crianca.id)}
                                                aria-label={`Remover criança ${indice + 1}`}
                                            >
                                                Remover
                                            </button>
                                        )}
                                    </div>
                                    <div className="linha-campos">
                                        <div className="coluna-campo">
                                            <label className="form-label" htmlFor={`nome-crianca-${crianca.id}`}>
                                                Nome<span className="campo-obrigatorio"> *</span>
                                            </label>
                                            <input
                                                id={`nome-crianca-${crianca.id}`}
                                                name="nome"
                                                type="text"
                                                className="form-control"
                                                autoComplete="off"
                                                placeholder="Ex: Lucas"
                                                value={crianca.nome}
                                                onChange={evento => atualizarCrianca(crianca.id, evento)}
                                                required
                                            />
                                        </div>
                                        <div className="coluna-campo">
                                            <label className="form-label" htmlFor={`idade-crianca-${crianca.id}`}>
                                                Idade<span className="campo-obrigatorio"> *</span>
                                            </label>
                                            <input
                                                id={`idade-crianca-${crianca.id}`}
                                                name="idade"
                                                type="number"
                                                className="form-control"
                                                placeholder="Ex: 10"
                                                value={crianca.idade}
                                                onChange={evento => atualizarCrianca(crianca.id, evento)}
                                                min={1}
                                                max={18}
                                                step={1}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" className="btn link-cadastro" onClick={adicionarCrianca}>
                                Adicionar outra criança
                            </button>
                        </div>
                    </section>
                    {erro && <div className="alert alert-danger mensagem-erro" role="alert">{erro}</div>}
                    <button className="btn botao-enviar" type="submit">{enviando ? "Criando conta…" : "Criar Conta"}</button>
                </fieldset>
                <p className="rodape-autenticacao">Já tem conta? <Link to="/login">Entrar</Link></p>
            </form>
        </div>
    </main>;
}
