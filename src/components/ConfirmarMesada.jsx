import React from "react";
import { Modal } from "react-bootstrap";

export default function ConfirmarMesada({ crianca, mesada, aoFechar, aoConfirmar, enviando, erro }) {
    return (
        <Modal show centered className="modal-painel" onHide={aoFechar} backdrop={enviando ? "static" : true} keyboard={!enviando} aria-labelledby="titulo-confirmar-mesada">
            <Modal.Header closeButton={!enviando}><Modal.Title id="titulo-confirmar-mesada">Registrar mesada</Modal.Title></Modal.Header>
            <Modal.Body aria-busy={enviando}>
                <p>A mesada calculada para <strong>{crianca.nome}</strong> é de <strong>{Number(mesada).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>.</p>
                <p>Deseja registrar a mesada no extrato? Essa ação cria uma nova entrada de dinheiro.</p>
                {erro && <p className="erro-painel" role="alert">{erro}</p>}
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn botao-secundario-painel" disabled={enviando} onClick={aoFechar}>Cancelar</button>
                <button type="button" className="btn botao-acessar-painel" disabled={enviando} onClick={aoConfirmar}>{enviando ? "Registrando…" : "Registrar mesada"}</button>
            </Modal.Footer>
        </Modal>
    );
}
