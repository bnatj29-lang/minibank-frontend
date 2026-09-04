import React, { useState } from "react";
import { registrarExtrato } from "../services/extratoService";
import { Alert, Button, InputGroup, Modal, Form } from "react-bootstrap";

function RegistrarEconomia({onRegistro, isOpen, onClose}){

   const [valor, setValor] = useState("");
   const [descricao, setDescricao] = useState("");

   const criancaId = 1; //TEMPORARIO - para fins de teste

    //montagem do objeto
    async function registrar(){

       const dados = {
           criancaId: criancaId,
           tipo: "ENTRADA", //aqui o front define o tipo = ENTRADA
           valor: Number(valor),
           descricao: descricao
       };
       try {
           await registrarExtrato(dados);

           console.log("Economia registrada!");

           await onRegistro();
       } catch (erro){
           console.error("Erro ao registrar economia:", erro);
       }
    }

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} onHide={onClose} centered>

            <Modal.Header closeButton>
                <Modal.Title>Registrar Economia</Modal.Title>
            </Modal.Header>

            <Modal.Body>

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

                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>

                <Button variant="primary" onClick={registrar}>
                    Registrar
                </Button>

            </Modal.Footer>

        </Modal>
    );
}

export default RegistrarEconomia;


























//RegistrarEconomia.jsx
//       ↓
//registrarExtrato(dados)
//      ↓
//POST /extrato
//      ↓
//Backend
//        ↓
//MySQL