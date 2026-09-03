import React, { useState } from "react"; //guarda o que o usuario digita
import { registrarExtrato } from "../services/extratoService";

function RegistrarRetirada({ onRegistro }) {

    const [valor, setValor] = useState("");
    //valor = valor atual digitado
    const [descricao, setDescricao] = useState("");
    //setValor = funcao que muda o valor
    //onRegistro vem do Financeiro.jsx - chama carregarExtrato
    const criancaId = 1; // TEMPORÁRIO

    async function registrar() {
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

        } catch (erro) {
            console.error("Erro ao registrar retirada:", erro);

            alert("Não foi possível realizar a retirada.");
        }
    }

    return (
        <div>

            <h2>Registrar Retirada</h2>

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

export default RegistrarRetirada;