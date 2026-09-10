import React, { useState, useEffect } from "react";
import ModalCriterio from "../components/ModalCriterio";
import ConfirmarExclusaoMissoes from "../components/ConfirmarExclusaoMissoes";
import {
    listarMissoes,
    criarMissao as criarMissaoAPI,
    atualizarMissao as atualizarMissaoAPI,
    excluirMissao as excluirMissaoAPI
} from "../services/missaoService";

// esqueleto da pagina


function Missoes() {
    const [nota, setNota] = useState(0);
    const [missoes, setMissoes] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [missaoParaEditar, setMissaoParaEditar] = useState(null);
    const [missaoParaExcluir, setMissaoParaExcluir] = useState(null);

    const criancaId = 1;

    useEffect(() => {
        const carregarMissoes = async () => {
            const dados = await listarMissoes(criancaId);

            setMissoes(dados);
        };

        carregarMissoes();
    }, []);

    const criarMissao = async (criterio) => {
        try {
            const novaMissao = await criarMissaoAPI(
                criancaId,
                criterio,
                0
            );

            setMissoes([...missoes, novaMissao]);
        } catch (erro) {
            console.error("Erro ao criar missão:", erro);
        }
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

    const editarMissao = async (criterioNovo) => {
        try {
            await atualizarMissaoAPI(
                missaoParaEditar.id,
                criterioNovo,
                missaoParaEditar.nota
            );

            const novasMissoes = missoes.map((missao) => {
                if (missao.id === missaoParaEditar.id) {
                    return {
                        ...missao,
                        criterio: criterioNovo
                    };
                }

                return missao;
            });

            setMissoes(novasMissoes);
            setMissaoParaEditar(null);

        } catch (erro) {
            console.error("Erro ao atualizar missão:", erro);
        }
    };


    //filter = filtra a lista e mantem todas menos as que queremos excluir
    const excluirMissao = async () => {

        try {

            // Envia o DELETE para o backend
            await excluirMissaoAPI(missaoParaExcluir.id);

            // Remove a missão da tela
            const novasMissoes = missoes.filter(
                (missao) => missao.id !== missaoParaExcluir.id
            );

            setMissoes(novasMissoes);

            setMissaoParaExcluir(null);

        } catch (erro) {

            console.error("Erro ao excluir missão:", erro);

        }
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

                    <div className="d-flex align-items-center gap-2">
                        <h3>{missao.criterio}</h3>

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                setMissaoParaEditar(missao);
                                setModalAberto(true);
                            }}
                        >
                            ✏️
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => {
                                setMissaoParaExcluir(missao);
                            }}
                        >
                            🗑️
                        </button>

                    </div>

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
                onCriar={missaoParaEditar ? editarMissao : criarMissao}
                missaoParaEditar={missaoParaEditar}
            />
            <ConfirmarExclusaoMissoes
            isOpen={missaoParaExcluir !== null}
            onClose={() => setMissaoParaExcluir(null)}
            onConfirmar={excluirMissao}
            missao={missaoParaExcluir}
            />
        </div>
    );
}



export default Missoes;