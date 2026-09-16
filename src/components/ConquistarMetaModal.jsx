import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { conquistarMeta, mensagemErroMeta } from "../services/metaService";

export default function ConquistarMetaModal({ criancaId, meta, aoFechar, aoConquistar }) {
    const [enviando, definirEnviando] = useState(false);
    const [erro, definirErro] = useState("");
    const envioEmAndamento = useRef(false);

    async function confirmar() {
        if (envioEmAndamento.current) return;
        envioEmAndamento.current = true;
        definirEnviando(true);
        definirErro("");
        try {
            await conquistarMeta(criancaId, meta.id);
        } catch (falha) {
            definirErro(mensagemErroMeta(falha, "Não foi possível confirmar a conquista. Confira a meta e o extrato antes de tentar novamente."));
            envioEmAndamento.current = false;
            definirEnviando(false);
            return;
        }
        aoConquistar();
    }

    return (
        <Modal show centered className="modal-metas" onHide={aoFechar}
            backdrop={enviando ? "static" : true} keyboard={!enviando} aria-labelledby="titulo-conquistar-meta">
            <Modal.Header closeButton={!enviando}>
                <Modal.Title id="titulo-conquistar-meta">Conquistar meta 🏆</Modal.Title>
            </Modal.Header>
            <Modal.Body aria-busy={enviando}>
                <p>Você juntou <strong>{Number(meta.valorGuardado).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong> para <strong className="nome-meta-confirmacao">{meta.nomeMeta}</strong>!</p>
                <p>Deseja marcar como conquistada? O valor reservado será registrado como gasto no extrato.</p>
                {erro && <p className="erro-metas" role="alert">{erro}</p>}
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn botao-secundario-meta" disabled={enviando} onClick={aoFechar}>Cancelar</button>
                <button type="button" className="btn botao-nova-meta" disabled={enviando} onClick={confirmar}>{enviando ? "Conquistando…" : "Conquistar!"}</button>
            </Modal.Footer>
        </Modal>
    );
}
