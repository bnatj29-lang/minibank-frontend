import React, { useState } from "react";
import { registrarExtrato } from "../services/extratoService";

function RegistrarEconomia({onRegistro}){

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

    return (
        <div>

            <h2>Registrar Economia</h2>

            <input
                type="number"
                placeholder="Valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
            />

            <input
                type="text"
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
            />

            <button onClick={registrar}>
                Registrar
            </button>

        </div>
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