import React, { useState } from "react";
import { registrarExtrato } from "../services/extratoService";
import { Button, Modal, Form } from "react-bootstrap";

function RegistrarEconomia({ onRegistro, isOpen, onClose }) {

    const [valor, setValor] = useState("");
    const [descricao, setDescricao] = useState("");
    const [erro, setErro] = useState("");

    const criancaId = 1; // TEMPORÁRIO

    // Fecha o modal e limpa os campos
    function fecharModal() {
        setValor("");
        setDescricao("");
        setErro("");
        onClose();
    }

    // Função executada quando o usuário clica em "Registrar"
    async function registrar() {

        // Limpa qualquer erro anterior
        setErro("");

        // Verifica se o valor foi preenchido
        if (!valor) {
            setErro("Digite um valor.");
            return;
        }

        // Verifica se o valor é maior que zero
        if (Number(valor) <= 0) {
            setErro("O valor deve ser maior que zero.");
            return;
        }

        // Montagem do objeto enviado para o backend
        const dados = {
            criancaId: criancaId,
            tipo: "ENTRADA",
            valor: Number(valor),
            descricao: descricao
        };

        try {

            // Envia a economia para o backend
            await registrarExtrato(dados);

            console.log("Economia registrada!");

            // Atualiza o extrato e o saldo
            await onRegistro();

            // Fecha o modal e limpa os campos
            fecharModal();

        } catch (erro) {

            console.error("Erro ao registrar economia:", erro);

            // Se o backend retornou uma resposta de erro
            if (erro.response) {

                setErro(
                    erro.response.data?.mensagem ||
                    "Não foi possível realizar a economia."
                );

            } else {

                // Erro de conexão com o servidor
                setErro("Erro ao conectar com o servidor. Tente novamente.");
            }
        }
    }

    // Se o modal não estiver aberto, não mostra nada
    if (!isOpen) return null;

    return (
        <Modal
            show={isOpen}
            onHide={fecharModal}
            centered
        >

            <Modal.Header closeButton>
                <Modal.Title>Registrar Economia</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                {/* Mostra a mensagem de erro, caso exista */}
                {erro && (
                    <div className="text-danger mb-3">
                        {erro}
                    </div>
                )}

                <Form.Group className="mb-3">

                    <Form.Label>Valor</Form.Label>

                    <Form.Control
                        type="number"
                        placeholder="Digite o valor"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                    />

                </Form.Group>

                <Form.Group>

                    <Form.Label>Descrição</Form.Label>

                    <Form.Control
                        type="text"
                        placeholder="Digite uma descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />

                </Form.Group>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={fecharModal}
                >
                    Cancelar
                </Button>

                <Button
                    variant="primary"
                    onClick={registrar}
                >
                    Registrar
                </Button>

            </Modal.Footer>

        </Modal>
    );
}

export default RegistrarEconomia;


// Fluxo:
//
// RegistrarEconomia.jsx
//       ↓
// registrarExtrato(dados)
//       ↓
// POST /extrato
//       ↓
// Backend
//       ↓
// MySQL