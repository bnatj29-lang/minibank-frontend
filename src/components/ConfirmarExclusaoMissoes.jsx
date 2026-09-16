import React from "react";
import { Modal } from "react-bootstrap";

export default function ConfirmarExclusaoMissoes({ missao, aoFechar, aoConfirmar, enviando, erro }) {
    return (
        <Modal show centered className="modal-painel" onHide={aoFechar} backdrop={enviando ? "static" : true} keyboard={!enviando} aria-labelledby="titulo-excluir-missao">
            <Modal.Header closeButton={!enviando}><Modal.Title id="titulo-excluir-missao">Excluir Missão</Modal.Title></Modal.Header>
            <Modal.Body aria-busy={enviando}>
                <p>Deseja excluir a missão <strong>{missao.criterio}</strong>?</p>
                <p>A média e a mesada serão consultadas novamente após a exclusão.</p>
                {erro && <p className="erro-painel" role="alert">{erro}</p>}
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn botao-secundario-painel" disabled={enviando} onClick={aoFechar}>Cancelar</button>
                <button type="button" className="btn botao-excluir-missao" disabled={enviando} onClick={aoConfirmar}>{enviando ? "Excluindo…" : "Excluir"}</button>
            </Modal.Footer>
        </Modal>
    );
}
