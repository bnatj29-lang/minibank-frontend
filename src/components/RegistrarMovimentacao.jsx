import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { registrarExtrato } from "../services/extratoService";

export default function RegistrarMovimentacao({ crianca, tipo, saldo, aoFechar, aoRegistrar }) {
    const [valor, definirValor] = useState("");
    const [descricao, definirDescricao] = useState("");
    const [erro, definirErro] = useState("");
    const [enviando, definirEnviando] = useState(false);
    const envioEmAndamento = useRef(false);
    const entrada = tipo === "ENTRADA";
    const titulo = entrada ? "Registrar Entrada" : "Registrar Retirada";

    async function registrar(evento) {
        evento.preventDefault();
        if (envioEmAndamento.current) return;
        const quantia = Number(valor);
        if (!Number.isFinite(quantia) || quantia <= 0 || Math.abs(quantia * 100 - Math.round(quantia * 100)) > 0.00001) {
            definirErro("Digite um valor maior que zero, com até duas casas decimais.");
            return;
        }
        if (!entrada && Math.round(quantia * 100) > Math.round(saldo * 100)) {
            definirErro("Saldo insuficiente para essa retirada.");
            return;
        }
        envioEmAndamento.current = true;
        definirEnviando(true);
        definirErro("");
        try {
            await registrarExtrato({ criancaId: crianca.id, tipo, valor: quantia, descricao: descricao.trim() });
        } catch (falha) {
            definirErro(falha.response?.data?.mensagem || "Não foi possível confirmar o registro. Confira o extrato antes de tentar novamente.");
            envioEmAndamento.current = false;
            definirEnviando(false);
            return;
        }
        // Fecha após gravar. Uma falha ao atualizar o extrato não permite reenviar a operação.
        aoRegistrar();
    }

    return (
        <Modal show centered onHide={aoFechar} backdrop={enviando ? "static" : true} keyboard={!enviando} className="modal-painel" aria-labelledby="titulo-movimentacao">
            <Modal.Header closeButton={!enviando}><Modal.Title id="titulo-movimentacao">{titulo}</Modal.Title></Modal.Header>
            <form onSubmit={registrar} aria-busy={enviando}>
                <Modal.Body>
                    <p className="descricao-painel">{crianca.nome} · Saldo total: {saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                    <fieldset disabled={enviando} className="campos-movimentacao">
                        <div>
                            <label className="form-label" htmlFor="valor-movimentacao">Valor (R$)</label>
                            <input id="valor-movimentacao" type="number" className="form-control" autoFocus required min="0.01" step="0.01" value={valor} onChange={evento => definirValor(evento.target.value)} placeholder="0,00" />
                        </div>
                        <div>
                            <label className="form-label" htmlFor="descricao-movimentacao">Descrição (opcional)</label>
                            <input id="descricao-movimentacao" className="form-control" maxLength={255} value={descricao} onChange={evento => definirDescricao(evento.target.value)} placeholder={entrada ? "Ex: mesada" : "Ex: compra de um livro"} />
                        </div>
                    </fieldset>
                    {erro && <p className="erro-painel" role="alert">{erro}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn botao-secundario-painel" disabled={enviando} onClick={aoFechar}>Cancelar</button>
                    <button type="submit" className="btn botao-acessar-painel" disabled={enviando}>{enviando ? "Registrando…" : "Registrar"}</button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
