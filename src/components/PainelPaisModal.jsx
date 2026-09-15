import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import CampoSenha from "./CampoSenha";
import { verificarSenhaPainel } from "../services/painelService";
import "../styles/painelPais.css";

export default function PainelPaisModal({ email, aoFechar, aoAcessar }) {
    const [senha, definirSenha] = useState("");
    const [erro, definirErro] = useState("");
    const [carregando, definirCarregando] = useState(false);

    async function acessar(evento) {
        evento.preventDefault();
        if (carregando) return;
        definirErro("");
        definirCarregando(true);
        try {
            await verificarSenhaPainel(senha, email);
            aoAcessar();
        } catch (falha) {
            definirErro(falha.response?.status === 401
                ? "Senha do painel incorreta. Tente novamente."
                : "Não foi possível verificar a senha. Tente novamente.");
        } finally {
            definirCarregando(false);
        }
    }

    return (
        <Modal show centered onHide={aoFechar} backdrop={carregando ? "static" : true} keyboard={!carregando} className="modal-painel" aria-labelledby="titulo-senha-painel">
            <Modal.Header closeButton={!carregando}>
                <Modal.Title id="titulo-senha-painel">Painel dos Pais</Modal.Title>
            </Modal.Header>
            <form onSubmit={acessar} aria-busy={carregando}>
                <Modal.Body>
                    <p className="descricao-painel">Digite a senha dos responsáveis para acessar o painel.</p>
                    <fieldset disabled={carregando}>
                        <CampoSenha id="senha-painel" rotulo="Senha do Painel dos Pais" valor={senha}
                            aoAlterar={evento => { definirSenha(evento.target.value); definirErro(""); }}
                            exemplo="••••••" preenchimentoAutomatico="off" />
                    </fieldset>
                    {erro && <p className="erro-painel" role="alert">{erro}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn botao-secundario-painel" disabled={carregando} onClick={aoFechar}>Cancelar</button>
                    <button type="submit" className="btn botao-acessar-painel" disabled={carregando}>{carregando ? "Verificando…" : "Acessar"}</button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
