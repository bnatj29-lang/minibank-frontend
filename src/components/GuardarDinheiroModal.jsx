import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { guardarDinheiroMeta, mensagemErroMeta } from "../services/metaService";
import { formatarMoedaInput, valorMonetarioParaNumero } from "../utils/moeda";

export default function GuardarDinheiroModal({ criancaId, meta, saldoLivre, aoFechar, aoGuardar }) {
    const [valor, definirValor] = useState("");
    const [erro, definirErro] = useState("");
    const [enviando, definirEnviando] = useState(false);
    const envioEmAndamento = useRef(false);

    function formatarValor(quantia) {
        return Number(quantia).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    async function guardar(evento) {
        evento.preventDefault();
        if (envioEmAndamento.current) return;
        const quantia = valorMonetarioParaNumero(valor);
        if (!valor.trim() || !Number.isFinite(quantia)) {
            definirErro("Informe o valor que deseja guardar.");
            return;
        }
        envioEmAndamento.current = true;
        definirEnviando(true);
        definirErro("");
        try {
            // Saldo disponível e valor restante são validados pelo backend.
            await guardarDinheiroMeta(criancaId, meta.id, quantia);
        } catch (falha) {
            definirErro(mensagemErroMeta(falha, "Não foi possível confirmar o aporte. Confira a meta antes de tentar novamente."));
            envioEmAndamento.current = false;
            definirEnviando(false);
            return;
        }
        aoGuardar();
    }

    return (
        <Modal show centered className="modal-metas" onHide={aoFechar}
            backdrop={enviando ? "static" : true} keyboard={!enviando} aria-labelledby="titulo-guardar-meta">
            <Modal.Header closeButton={!enviando}>
                <Modal.Title id="titulo-guardar-meta">Guardar dinheiro 💰</Modal.Title>
            </Modal.Header>
            <form onSubmit={guardar} aria-busy={enviando}>
                <Modal.Body>
                    <div className="resumo-aporte-meta">
                        <strong className="nome-meta-confirmacao">{meta.nomeMeta}</strong>
                        <p>{formatarValor(meta.valorGuardado)} guardados · faltam {formatarValor(meta.valorRestante)}</p>
                        <progress className="progresso-meta" max="100" value={meta.percentual} aria-label="Progresso da meta" />
                    </div>
                    <p className="saldo-livre-metas">Saldo livre disponível: <strong>{formatarValor(saldoLivre)}</strong></p>
                    <fieldset disabled={enviando}>
                        <label className="form-label" htmlFor="valor-aporte">Quanto você quer guardar? (R$)</label>
                        <input id="valor-aporte" type="text" inputMode="decimal" className="form-control" required
                            autoFocus placeholder="0,00" value={valor}
                            onChange={evento => { definirValor(evento.target.value); definirErro(""); }}
                            onBlur={() => definirValor(formatarMoedaInput(valor))} />
                        <div className="valores-rapidos-meta" aria-label="Valores rápidos">
                            {[10, 20, 50, 100].filter(quantia => quantia <= saldoLivre && quantia <= meta.valorRestante).map(quantia => (
                                <button key={quantia} type="button" className="btn botao-secundario-meta"
                                    aria-pressed={valorMonetarioParaNumero(valor) === quantia} onClick={() => { definirValor(formatarMoedaInput(String(quantia))); definirErro(""); }}>{formatarValor(quantia)}</button>
                            ))}
                        </div>
                    </fieldset>
                    {erro && <p className="erro-metas" role="alert">{erro}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn botao-secundario-meta" disabled={enviando} onClick={aoFechar}>Cancelar</button>
                    <button type="submit" className="btn botao-nova-meta" disabled={enviando}>{enviando ? "Guardando…" : "Guardar!"}</button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
