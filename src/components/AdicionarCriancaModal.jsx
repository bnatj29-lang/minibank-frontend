import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { adicionarCrianca, listarCriancas, mensagemErroCrianca } from "../services/criancaService";
import "../styles/painelPais.css";

export default function AdicionarCriancaModal({ responsavel, aoFechar, aoConcluir }) {
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

        definirErro("");
        definirEnviando(true);
        try {
            const novaCrianca = await adicionarCrianca(responsavel.id, dados);
            const criancasAtualizadas = await listarCriancas(responsavel.id);
            aoConcluir(criancasAtualizadas, novaCrianca.id);
        } catch (falha) {
            definirErro(mensagemErroCrianca(falha, "Não foi possível adicionar a criança."));
        } finally {
            definirEnviando(false);
        }
    }

    return (
        <Modal show centered size="sm" onHide={enviando ? undefined : aoFechar}
            backdrop={enviando ? "static" : true} keyboard={!enviando}
            className="modal-painel modal-adicionar-crianca" aria-labelledby="titulo-adicionar-crianca">
            <Modal.Header closeButton={!enviando}>
                <Modal.Title id="titulo-adicionar-crianca">Adicionar Criança</Modal.Title>
            </Modal.Header>
            <form onSubmit={salvar} aria-busy={enviando}>
                <Modal.Body>
                    <div className="aviso-adicionar-crianca">
                        <span aria-hidden="true">⭐</span>
                        <span>Nova criança na conta da família</span>
                    </div>
                    <fieldset disabled={enviando}>
                        <label className="form-label" htmlFor="nome-nova-crianca">Nome</label>
                        <input id="nome-nova-crianca" className="form-control" value={nome}
                            onChange={evento => { definirNome(evento.target.value); definirErro(""); }} autoFocus required />
                        <label className="form-label" htmlFor="idade-nova-crianca">Idade</label>
                        <input id="idade-nova-crianca" className="form-control" type="number" min="1" max="18"
                            value={idade} onChange={evento => { definirIdade(evento.target.value); definirErro(""); }} required />
                    </fieldset>
                    {erro && <p className="erro-painel" role="alert">{erro}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn botao-secundario-painel" disabled={enviando} onClick={aoFechar}>Cancelar</button>
                    <button type="submit" className="btn botao-acessar-painel" disabled={enviando}>{enviando ? "Adicionando…" : "Adicionar"}</button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
