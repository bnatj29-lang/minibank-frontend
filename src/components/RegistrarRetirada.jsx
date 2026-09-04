import React, { useState } from "react";
import { registrarExtrato } from "../services/extratoService";
import { Button, Modal, Form } from "react-bootstrap";

function RegistrarRetirada({ onRegistro, isOpen, onClose }) {

    const [valor, setValor] = useState("");
    // valor = valor atual digitado

    const [descricao, setDescricao] = useState("");
    // descricao = texto digitado pelo usuario

    const [erro, setErro] = useState("");
    // erro = mensagem de erro que sera exibida no modal

    const criancaId = 1;

    // Funcao para fechar o modal e limpar os campos
    function fecharModal() {
        setValor("");
        setDescricao("");
        setErro("");
        onClose();
    }

    // Funcao executada quando o usuario clica em "Registrar"
    async function registrar() {

        // Limpa qualquer erro anterior
        setErro("");

        // Verifica se o campo valor esta vazio
        if (!valor) {
            setErro("Digite um valor.");
            return;
        }

        // Verifica se o valor e maior que zero
        if (Number(valor) <= 0) {
            setErro("O valor deve ser maior que zero.");
            return;
        }

        // Montagem do objeto que sera enviado para o backend
        const dados = {
            criancaId: criancaId,
            tipo: "RETIRADA",
            valor: Number(valor),
            descricao: descricao
        };

        // Objeto JSON enviado para o backend

        try {

            // Envia a retirada para o backend
            await registrarExtrato(dados);

            console.log("Retirada registrada!");

            // Atualiza o extrato e o saldo
            await onRegistro();

            // Fecha o modal e limpa os campos
            fecharModal();

        } catch (erro) {

            console.error("Erro ao registrar retirada:", erro);

            // Se o backend retornou uma resposta de erro
            if (erro.response) {

                setErro(
                    erro.response.data?.mensagem ||
                    "Não foi possível realizar a retirada"
                );

            } else {

                // Erro de conexão com o servidor
                setErro("Erro ao conectar com o servidor. Tente novamente.");
            }
        }
    }

    // Se o modal nao estiver aberto, nao mostra nada
    if (!isOpen) return null;

    return (
        <Modal
            show={isOpen}
            onHide={fecharModal}
            centered
        >

            <Modal.Header closeButton>
                <Modal.Title>Registrar Retirada</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                {/* Exibe a mensagem de erro, caso exista */}
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

export default RegistrarRetirada;