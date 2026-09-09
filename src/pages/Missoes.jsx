import React, { useState } from "react";

// esqueleto da pagina

function Missoes() {
    const [nota, setNota] = useState(0);
    const [missao, setMissao] = useState();

    return (
        <div>
            <h1>Missões</h1>

            <p>
                Atribua notas de 0 a 10 para cada missão
            </p>

            <button>+ Nova Missão</button>

            <hr />

            <h2>Missões</h2>

            {missao && (
                <div>
                    <h3>{missao.criterio}</h3>

                    <p>Nota: {nota}</p>

                    <div className="d-flex gap-2">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((numero) => (
                            <button
                                key={numero}
                                onClick={() => setNota(numero)}
                                className={
                                    nota === numero
                                        ? "btn btn-success"
                                        : "btn btn-outline-secondary"
                                }
                            >
                                {numero}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <h2>Resumo</h2>
        </div>
    );
}

export default Missoes;