import React, { useState } from "react";
import api from "../services/api";

function ConfiguracoesPage() {
    const [valorBase, setValorBase] = useState("");
    const [notaMinimaIntermediaria, setNotaMinimaIntermediaria] = useState("");
    const [notaMinimaMaxima, setNotaMinimaMaxima] = useState("");
    const [valorFaixaBaixa, setValorFaixaBaixa] = useState("");
    const [valorFaixaIntermediaria, setValorFaixaIntermediaria] = useState("");
    const [valorFaixaMaxima, setValorFaixaMaxima] = useState("");

    const handleSalvar =  async (e) => {
        e.preventDefault();

        const configuracao = {
            valorBase,
            notaMinimaIntermediaria,
            notaMinimaMaxima,
            valorFaixaBaixa,
            valorFaixaIntermediaria,
            valorFaixaMaxima
        };

        await api.put("/criancas/2/configuracao-mesada", configuracao);
        await api.put("/criancas/2/configuracao-mesada", configuracao);

        alert("Salvo!");

        console.log(configuracao);
    };

    return (
        <div>

            <h1>Configurações da Mesada</h1>

            <p>Personalize os valores e faixas de cálculo.</p>

            <form onSubmit={handleSalvar}>

                <h2>Mesada Base</h2>

                <label>Valor base (R$) *</label>

                <input
                    type="number"
                    value={valorBase}
                    onChange={(e) => setValorBase(e.target.value)}
                />

                <h2>Faixas de Cálculo</h2>

                <p>Configure os limiares e valores correspondentes.</p>

                <label>Nota mínima da faixa intermediária</label>

                <input
                    type="number"
                    value={notaMinimaIntermediaria}
                    onChange={(e) => setNotaMinimaIntermediaria(e.target.value)}
                />

                <p>Notas abaixo disso recebem o valor mais baixo</p>

                <div className="mb-4">
                    <h3>Abaixo de {notaMinimaIntermediaria || "7"}</h3>

                    <label>Valor (R$) *</label>

                    <input
                        type="number"
                        value={valorFaixaBaixa}
                        onChange={(e) => setValorFaixaBaixa(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <h3>{notaMinimaIntermediaria || "7"} a 9.9</h3>

                    <label>Valor (R$) *</label>

                    <input
                        type="number"
                        value={valorFaixaIntermediaria}
                        onChange={(e) => setValorFaixaIntermediaria(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <h3>Igual a 10</h3>

                    <label>Valor (R$) *</label>

                    <input
                        type="number"
                        value={valorFaixaMaxima}
                        onChange={(e) => setValorFaixaMaxima(e.target.value)}
                    />
                </div>


                <div className="mb-4">
                    <label>Nota para a faixa máxima *</label>

                    <input
                        type="number"
                        value={notaMinimaMaxima}
                        onChange={(e) => setNotaMinimaMaxima(e.target.value)}
                    />
                </div>

                <button type="submit">
                    Salvar
                </button>

            </form>
        </div>
    );
}

export default ConfiguracoesPage;