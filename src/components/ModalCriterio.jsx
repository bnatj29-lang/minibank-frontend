import React, { useState } from "react";
import { Modal } from "react-bootstrap";

export default function ModalCriterio({ missao, aoFechar, aoSalvar, enviando, erro }) {
    const [criterio, definirCriterio] = useState(missao?.criterio || "");
    function salvar(evento) {
        evento.preventDefault();
        if (!enviando && criterio.trim()) aoSalvar(criterio.trim());
    }
    return (
        <Modal show centered className="modal-painel" onHide={aoFechar} backdrop={enviando ? "static" : true} keyboard={!enviando} aria-labelledby="titulo-criterio">
            <Modal.Header closeButton={!enviando}><Modal.Title id="titulo-criterio">{missao ? "Editar Missão" : "Nova Missão"}</Modal.Title></Modal.Header>
            <form onSubmit={salvar} aria-busy={enviando}>
                <Modal.Body>
                    <label className="form-label" htmlFor="criterio-missao">Nome da missão</label>
                    <input id="criterio-missao" className="form-control" required autoFocus disabled={enviando}
                        value={criterio} onChange={evento => definirCriterio(evento.target.value)} placeholder="Ex: Organização, Estudos, Respeito" />
                    {!missao && <p className="ajuda-missao">A missão começa com nota 0, que entra na média. Depois de criar, você pode atribuir outra nota.</p>}
                    {erro && <p className="erro-painel" role="alert">{erro}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn botao-secundario-painel" disabled={enviando} onClick={aoFechar}>Cancelar</button>
                    <button type="submit" className="btn botao-acessar-painel" disabled={enviando}>{enviando ? "Salvando…" : missao ? "Salvar" : "Criar"}</button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
