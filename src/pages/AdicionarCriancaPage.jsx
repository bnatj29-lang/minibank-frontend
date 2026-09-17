import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CabecalhoPainel from "../components/CabecalhoPainel";
import { adicionarCrianca, listarCriancas, mensagemErroCrianca } from "../services/criancaService";
import "../styles/painelPais.css";
import "../styles/configuracaoMesada.css";

export default function AdicionarCriancaPage({ crianca, responsavel, criancas, aoTrocarCrianca, aoAdicionarCrianca, aoSair, aoVoltar, aoAtualizarCriancas }) {
    const navegar = useNavigate();
    const [nome, definirNome] = useState("");
    const [idade, definirIdade] = useState("");
    const [erro, definirErro] = useState("");
    const [enviando, definirEnviando] = useState(false);

    async function salvar(evento) {
        evento.preventDefault();
        if (enviando) return;
        const dados = { nome: nome.trim(), idade: Number(idade) };
        if (!dados.nome || !Number.isInteger(dados.idade) || dados.idade < 1 || dados.idade > 18) {
            definirErro("Informe um nome e uma idade inteira entre 1 e 18.");
            return;
        }
        definirErro(""); definirEnviando(true);
        try {
            const novaCrianca = await adicionarCrianca(responsavel.id, dados);
            const listaAtualizada = await listarCriancas(responsavel.id);
            aoAtualizarCriancas(listaAtualizada, novaCrianca.id);
            navegar("/home", { replace: true });
        } catch (falha) {
            definirErro(mensagemErroCrianca(falha, "Não foi possível adicionar a criança."));
        } finally {
            definirEnviando(false);
        }
    }

    return <div className="pagina-painel">
        <CabecalhoPainel crianca={crianca} responsavel={responsavel} criancas={criancas}
            aoTrocarCrianca={aoTrocarCrianca} aoAdicionarCrianca={aoAdicionarCrianca} aoSair={aoSair}
            aoVoltar={aoVoltar} bloqueado={enviando} />
        <main className="conteudo-painel">
            <div className="adicionar-crianca-pagina">
                <header className="titulo-gerenciador-criancas"><h1>Adicionar criança</h1><p>Informe os dados da nova criança da família.</p></header>
                <form className="cartao-configuracao-mesada formulario-adicionar-crianca" onSubmit={salvar} aria-busy={enviando}>
                    <label className="form-label" htmlFor="nome-nova-crianca">Nome</label>
                    <input id="nome-nova-crianca" className="form-control" value={nome} onChange={evento => definirNome(evento.target.value)} required autoFocus />
                    <label className="form-label" htmlFor="idade-nova-crianca">Idade</label>
                    <input id="idade-nova-crianca" className="form-control" type="number" min="1" max="18" value={idade} onChange={evento => definirIdade(evento.target.value)} required />
                    {erro && <p className="erro-painel" role="alert">{erro}</p>}
                    <div className="acoes-dados-crianca"><button type="button" className="btn botao-secundario-painel" onClick={() => navegar("/financeiro")} disabled={enviando}>Cancelar</button><button type="submit" className="btn botao-salvar-mesada" disabled={enviando}>{enviando ? "Adicionando…" : "Adicionar criança"}</button></div>
                </form>
            </div>
        </main>
    </div>;
}
