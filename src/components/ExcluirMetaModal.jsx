import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { excluirMeta, mensagemErroMeta } from "../services/metaService";

export default function ExcluirMetaModal({ criancaId, meta, aoFechar, aoExcluir }) {
    const [enviando, definirEnviando] = useState(false);
    const [erro, definirErro] = useState("");
    const envioEmAndamento = useRef(false);

    async function confirmarExclusao() {
        if (envioEmAndamento.current) return;
        if (meta.status === "CONQUISTADA") {
            definirErro("Não é possível excluir uma meta conquistada.");
            return;
        }

        envioEmAndamento.current = true;
        definirEnviando(true);
        definirErro("");
        try {
            await excluirMeta(criancaId, meta.id);
        } catch (falha) {
            definirErro(mensagemErroMeta(falha, "Não foi possível confirmar a exclusão. Atualize a lista antes de tentar novamente."));
            envioEmAndamento.current = false;
            definirEnviando(false);
            return;
        }
        aoExcluir();
    }

    return (
        <Modal show centered className="modal-metas" onHide={aoFechar}
            backdrop={enviando ? "static" : true} keyboard={!enviando} aria-labelledby="titulo-excluir-meta">
            <Modal.Header closeButton={!enviando}>
                <Modal.Title id="titulo-excluir-meta">Excluir meta</Modal.Title>
            </Modal.Header>
            <Modal.Body aria-busy={enviando}>
                <p>Deseja excluir a meta <strong className="nome-meta-confirmacao">{meta.nomeMeta}</strong>?</p>
                <p className="descricao-modal-meta">Essa ação não pode ser desfeita.</p>
                {erro && <p className="erro-metas" role="alert">{erro}</p>}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn botao-secundario-meta" type="button" disabled={enviando} onClick={aoFechar}>Cancelar</button>
                <button className="btn botao-confirmar-exclusao" type="button" disabled={enviando} onClick={confirmarExclusao}>
                    {enviando ? "Excluindo…" : "Excluir meta"}
                </button>
            </Modal.Footer>
        </Modal>
    );
}
