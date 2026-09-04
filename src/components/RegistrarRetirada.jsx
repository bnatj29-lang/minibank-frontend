import React, { useState } from "react"; //guarda o que o usuario digita
import { registrarExtrato } from "../services/extratoService";
import { Button, Modal, Form } from "react-bootstrap";

function RegistrarRetirada({ onRegistro, isOpen, onClose }){

    const [valor, setValor] = useState("");
    //valor = valor atual digitado
    const [descricao, setDescricao] = useState("");
    //setValor = funcao que muda o valor
    //onRegistro vem do Financeiro.jsx - chama carregarExtrato
    const [erro, setErro] = useState("");

    const criancaId = 1; // TEMPORÁRIO

    async function registrar() {

        setErro("");

        if (!valor) {
            setErro("Digite um valor.");
            return;
        }

        if (Number(valor) <= 0) {
            setErro("O valor deve ser maior que zero.");
            return;
        }



        //funcao executada qnd o usuario clica no botao
        const dados = {
            criancaId: criancaId,
            tipo: "RETIRADA",
            valor: Number(valor),
            descricao: descricao
        };
        //objeto json enviado para o back

        try {
            await registrarExtrato(dados);

            console.log("Retirada registrada!");

            await onRegistro();

            onClose();

        } catch (erro) {
            console.error("Erro ao registrar retirada:", erro);

            if(erro.response){
                setErro(
                    erro.response.data?.mensagem || "Não foi possível realizar a retirada"
                );
            } else{
                setErro("Erro ao conectar com o servidor. Tente novamente.");
            }

        }
    }

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} onHide={onClose} centered>

            <Modal.Header closeButton>
                <Modal.Title>Registrar Retirada</Modal.Title>
            </Modal.Header>

            <Modal.Body>

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
                    onClick={onClose}
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