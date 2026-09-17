import React from "react";
import { Modal } from "react-bootstrap";

export default function ExcluirCriancaModal({ crianca, aoFechar, aoConfirmar, enviando, erro }) {
    return (
        <Modal show centered className="modal-painel" onHide={enviando ? undefined : aoFechar}
            backdrop={enviando ? "static" : true} keyboard={!enviando} aria-labelledby="titulo-excluir-crianca">
            <Modal.Header closeButton={!enviando}>
                <Modal.Title id="titulo-excluir-crianca">Excluir criança</Modal.Title>
            </Modal.Header>
            <Modal.Body aria-busy={enviando}>
                <p>Você está prestes a remover o perfil de <strong>{crianca.nome}</strong>.</p>
                <p className="descricao-modal-crianca">Os dados dessa criança também serão removidos. Deseja continuar?</p>
                {erro && <p className="erro-painel" role="alert">{erro}</p>}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn botao-secundario-painel" type="button" disabled={enviando} onClick={aoFechar}>Cancelar</button>
                <button className="btn botao-excluir-crianca" type="button" disabled={enviando} onClick={aoConfirmar}>
                    {enviando ? "Excluindo…" : "Excluir criança"}
                </button>
            </Modal.Footer>
        </Modal>
    );
}
