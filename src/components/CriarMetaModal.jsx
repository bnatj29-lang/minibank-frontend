import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { criarMeta, mensagemErroMeta } from "../services/metaService";

export default function CriarMetaModal({ crianca, aoFechar, aoCriar }) {
    const [nome, definirNome] = useState("");
    const [valor, definirValor] = useState("");
    const [erro, definirErro] = useState("");
    const [enviando, definirEnviando] = useState(false);
    const envioEmAndamento = useRef(false);

    async function salvar(evento) {
        evento.preventDefault();
        if (envioEmAndamento.current) return;

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

        envioEmAndamento.current = true;
        definirEnviando(true);
        definirErro("");
        try {
            await criarMeta(crianca.id, { nomeMeta: nome.trim(), valorMeta: quantia });
        } catch (falha) {
            definirErro(mensagemErroMeta(falha, "Não foi possível confirmar a criação. Confira suas metas antes de tentar novamente."));
            envioEmAndamento.current = false;
            definirEnviando(false);
            return;
        }

        // A página atualiza a lista depois de fechar a janela.
        aoCriar();
    }

    return (
        <Modal show centered className="modal-metas" onHide={aoFechar}
            backdrop={enviando ? "static" : true} keyboard={!enviando} aria-labelledby="titulo-nova-meta">
            <Modal.Header closeButton={!enviando}>
                <Modal.Title id="titulo-nova-meta">Nova Meta 🎯</Modal.Title>
            </Modal.Header>
            <form onSubmit={salvar} aria-busy={enviando}>
                <Modal.Body>
                    <p className="descricao-modal-meta">Qual é o próximo objetivo de {crianca.nome}? Dê um nome e informe o valor que deseja juntar.</p>
                    <fieldset disabled={enviando} className="campos-meta">
                        <div>
                            <label className="form-label" htmlFor="nome-meta">Nome da meta</label>
                            <input id="nome-meta" className="form-control" value={nome} required autoFocus
                                placeholder="Ex: Bicicleta, Videogame, Tênis..."
                                onChange={evento => { definirNome(evento.target.value); definirErro(""); }} />
                        </div>
                        <div>
                            <label className="form-label" htmlFor="valor-meta">Valor que você quer juntar (R$)</label>
                            <input id="valor-meta" type="number" className="form-control" value={valor}
                                required min="0.01" step="0.01" placeholder="Ex: 350"
                                onChange={evento => { definirValor(evento.target.value); definirErro(""); }} />
                        </div>
                    </fieldset>
                    {erro && <p className="erro-metas" role="alert">{erro}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn botao-secundario-meta" type="button" disabled={enviando} onClick={aoFechar}>Cancelar</button>
                    <button className="btn botao-nova-meta" type="submit" disabled={enviando}>{enviando ? "Criando…" : "Criar Meta!"}</button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
