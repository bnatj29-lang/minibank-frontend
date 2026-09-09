import React, { useState } from "react";
import ModalCriterio from "../components/ModalCriterio";

// esqueleto da pagina


function Missoes() {
    const [nota, setNota] = useState(0);
    const [missoes, setMissoes] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);

    const criarMissao = (criterio) => {
        const novaMissao = {
            criterio: criterio,
            nota: 0
        };

        setMissoes([...missoes, novaMissao]);
    };

    const alterarNota = (criterio, novaNota) => {
        const novasMissoes = missoes.map((missao) => {
            if(missao.criterio === criterio) {
                return {
                    ...missao,
                    nota: novaNota
                };
            }
            return missao;
        });
     setMissoes(novasMissoes);
    };

    return (
        <div>
            <h1>Missões</h1>

            <p>
                Atribua notas de 0 a 10 para cada missão
            </p>

            <button
                onClick={() => setModalAberto(true)}
            >
                + Nova Missão
            </button>

            <hr />

            <h2>Missões</h2>

            {missoes.map((missao) => (
                <div key={missao.criterio}>

                    <h3>{missao.criterio}</h3>

                    <p>Nota: {missao.nota}</p>

                    <div className="d-flex gap-2">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((numero) => (
                            <button
                                key={numero}
                                onClick={() => alterarNota(missao.criterio, numero)}
                                className={
                                    missao.nota === numero
                                        ? "btn btn-success"
                                        : "btn btn-outline-secondary"
                                }
                            >
                                {numero}
                            </button>
                        ))}
                    </div>

                </div>
            ))}

            <h2>Resumo</h2>

            <ModalCriterio
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
                onCriar={criarMissao}
            />
        </div>
    );
}



export default Missoes;