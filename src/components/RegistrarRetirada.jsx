import React, { useState } from "react";
import { registrarExtrato } from "../services/extratoService";

function RegistrarRetirada() {

    const [valor, setValor] = useState("");
    const [descricao, setDescricao] = useState("");

    const criancaId = 1; // TEMPORÁRIO

    async function registrar() {

        const dados = {
            criancaId: criancaId,
            tipo: "RETIRADA",
            valor: Number(valor),
            descricao: descricao
        };

        try {
            await registrarExtrato(dados);

            console.log("Retirada registrada!");

        } catch (erro) {
            console.error("Erro ao registrar retirada:", erro);
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