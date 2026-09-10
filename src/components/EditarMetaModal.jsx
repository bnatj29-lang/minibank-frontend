import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { editarMeta, mensagemErroMeta } from "../services/metaService";

export default function EditarMetaModal({ criancaId, meta, aoFechar, aoEditar }) {
    const [nome, definirNome] = useState(meta.nomeMeta);
    const [valor, definirValor] = useState(String(meta.valorMeta));
    const [erro, definirErro] = useState("");
    const [enviando, definirEnviando] = useState(false);
    const envioEmAndamento = useRef(false);

    async function salvar(evento) {
        evento.preventDefault();
        if (envioEmAndamento.current) return;

        if (meta.status === "CONQUISTADA") {
            definirErro("Não é possível editar uma meta conquistada.");
            return;
        }
        if (!nome.trim()) {
            definirErro("Preencha o nome da meta.");
            return;
        }

        const quantia = Number(valor);
        const centavos = Math.round(quantia * 100);
        if (!Number.isFinite(quantia) || quantia <= 0 || Math.abs(quantia * 100 - centavos) > 0.00001) {
            definirErro("Informe um valor maior que zero, com até duas casas decimais.");
            return;
        }
        if (centavos < Math.round(Number(meta.valorGuardado) * 100)) {
            definirErro("O valor da meta não pode ser menor que o valor já guardado.");
            return;
        }

        envioEmAndamento.current = true;
        definirEnviando(true);
        definirErro("");
        try {
            await editarMeta(criancaId, meta.id, { nomeMeta: nome.trim(), valorMeta: quantia });
        } catch (falha) {
            definirErro(mensagemErroMeta(falha, "Não foi possível confirmar a edição. Confira suas metas antes de tentar novamente."));
            envioEmAndamento.current = false;
            definirEnviando(false);
            return;
        }

        // Atualiza a lista para receber também o novo percentual e o status da API.
        aoEditar();
    }

    return (
        <Modal show centered className="modal-metas" onHide={aoFechar}
            backdrop={enviando ? "static" : true} keyboard={!enviando} aria-labelledby="titulo-editar-meta">
            <Modal.Header closeButton={!enviando}>
                <Modal.Title id="titulo-editar-meta">Editar Meta</Modal.Title>
            </Modal.Header>
            <form onSubmit={salvar} aria-busy={enviando}>
                <Modal.Body>
                    <p className="descricao-modal-meta">Altere o nome ou o valor desta meta.</p>
                    <fieldset disabled={enviando} className="campos-meta">
                        <div>
                            <label className="form-label" htmlFor="nome-editar-meta">Nome da meta</label>
                            <input id="nome-editar-meta" className="form-control" value={nome} required autoFocus
                                onChange={evento => { definirNome(evento.target.value); definirErro(""); }} />
                        </div>
                        <div>
                            <label className="form-label" htmlFor="valor-editar-meta">Valor que você quer juntar (R$)</label>
                            <input id="valor-editar-meta" type="number" className="form-control" value={valor}
                                required min="0.01" step="0.01" aria-describedby="valor-guardado-meta"
                                onChange={evento => { definirValor(evento.target.value); definirErro(""); }} />
                            <p className="ajuda-editar-meta" id="valor-guardado-meta">
                                Já guardado: {Number(meta.valorGuardado).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </p>
                        </div>
                    </fieldset>
                    {erro && <p className="erro-metas" role="alert">{erro}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn botao-secundario-meta" type="button" disabled={enviando} onClick={aoFechar}>Cancelar</button>
                    <button className="btn botao-nova-meta" type="submit" disabled={enviando}>{enviando ? "Salvando…" : "Salvar alterações"}</button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
