import React, { useEffect, useState } from "react";
import { editarCrianca, listarCriancas, mensagemErroCrianca } from "../services/criancaService";

export default function GerenciarCriancas({ crianca, responsavel, criancas, aoAtualizar }) {
    const [nome, definirNome] = useState("");
    const [idade, definirIdade] = useState("");
    const [erro, definirErro] = useState("");
    const [sucesso, definirSucesso] = useState("");
    const [enviando, definirEnviando] = useState(false);

    useEffect(() => {
        definirNome(crianca.nome);
        definirIdade(String(crianca.idade));
        definirErro("");
    }, [crianca.id, crianca.nome, crianca.idade]);

    async function salvar(evento) {
        evento.preventDefault();
        if (enviando) return;
        definirErro(""); definirSucesso("");
        const dados = { nome: nome.trim(), idade: Number(idade) };
        if (!dados.nome || !Number.isInteger(dados.idade) || dados.idade < 1) {
            definirErro("Informe um nome e uma idade inteira maior que zero."); return;
        }
        definirEnviando(true);
        try {
            await editarCrianca(crianca.id, responsavel.id, dados);
            const listaAtualizada = await listarCriancas(responsavel.id);
            aoAtualizar(listaAtualizada);
            definirNome(crianca.nome); definirIdade(String(crianca.idade));
            definirSucesso("Dados da criança atualizados.");
        } catch (falha) {
            definirErro(mensagemErroCrianca(falha, "Não foi possível salvar os dados da criança."));
        } finally {
            definirEnviando(false);
        }
    }

    return <section className="gerenciador-criancas">
        <header className="titulo-gerenciador-criancas"><h2>Dados da Criança</h2><p>Edite as informações do perfil.</p></header>
        <div className="cartao-dados-crianca cartao-configuracao-mesada">
            <div className="resumo-dados-crianca"><span className="icone-dados-crianca" aria-hidden="true">⭐</span><div><strong>{crianca.nome}</strong><small>{crianca.idade} {crianca.idade === 1 ? "ano" : "anos"}</small></div></div>
            <form className="formulario-dados-crianca" onSubmit={salvar}>
                <label className="form-label" htmlFor="nome-dados-crianca">Nome</label><input id="nome-dados-crianca" className="form-control" value={nome} onChange={evento => definirNome(evento.target.value)} required disabled={enviando} />
                <label className="form-label" htmlFor="idade-dados-crianca">Idade</label><input id="idade-dados-crianca" className="form-control" type="number" min="1" max="18" value={idade} onChange={evento => definirIdade(evento.target.value)} required disabled={enviando} />
                {erro && <p className="erro-painel" role="alert">{erro}</p>}
                <div className="acoes-dados-crianca"><button type="submit" className="btn botao-salvar-mesada" disabled={enviando}>{enviando ? "Salvando…" : "Salvar"}</button>{sucesso && <p className="confirmacao-mesada" role="status">✓ {sucesso}</p>}</div>
            </form>
        </div>
    </section>;
}
