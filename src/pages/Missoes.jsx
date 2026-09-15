import React, { useState, useEffect } from "react";
import ModalCriterio from "../components/ModalCriterio";
import ConfirmarMesada from "../components/ConfirmarMesada";
import ConfirmarExclusaoMissoes from "../components/ConfirmarExclusaoMissoes";

import {
    listarMissoes,
    criarMissao as criarMissaoAPI,
    atualizarMissao as atualizarMissaoAPI,
    excluirMissao as excluirMissaoAPI,
    calcularMedia,
    calcularMesada as calcularMesadaAPI,
    registrarMesada
} from "../services/missaoService";

function Missoes() {

    const [nota, setNota] = useState(0);

    const [missoes, setMissoes] = useState([]);

    const [media, setMedia] = useState(0);

    const [modalAberto, setModalAberto] = useState(false);

    const [missaoParaEditar, setMissaoParaEditar] = useState(null);

    const [missaoParaExcluir, setMissaoParaExcluir] = useState(null);

    const [mesada, setMesada] = useState(0);

    const [modalMesadaAberto, setModalMesadaAberto] = useState(false);

    // Temporariamente estamos usando a criança de ID 1.
    const criancaId = 1;


    // Carrega as missões, a média e o valor da mesada
    // quando a página é aberta.
    useEffect(() => {

        const carregarMissoes = async () => {

            const dados = await listarMissoes(criancaId);

            setMissoes(dados);


            const resultadoMedia = await calcularMedia(criancaId);

            setMedia(resultadoMedia);


            // IMPORTANTE:
            // Aqui usamos calcularMesadaAPI.
            // Essa função apenas BUSCA o valor da mesada.
            // Ela NÃO abre o modal.
            const resultadoMesada =
                await calcularMesadaAPI(criancaId);

            setMesada(resultadoMesada);
        };

        carregarMissoes();

    }, []);


    // Cria uma nova missão
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


    // Altera a nota de uma missão
    const alterarNota = async (missao, novaNota) => {

        try {

            // Envia a nova nota para o backend
            await atualizarMissaoAPI(
                missao.id,
                missao.criterio,
                novaNota
            );


            // Atualiza a nota na tela
            const novasMissoes = missoes.map((item) => {

                if (item.id === missao.id) {

                    return {
                        ...item,
                        nota: novaNota
                    };

                }

                return item;
            });

            setMissoes(novasMissoes);


            // Recalcula a média
            const resultadoMedia =
                await calcularMedia(criancaId);

            setMedia(resultadoMedia);


            // Recalcula a mesada
            const resultadoMesada =
                await calcularMesadaAPI(criancaId);

            setMesada(resultadoMesada);

        } catch (erro) {

            console.error(
                "Erro ao atualizar nota:",
                erro
            );

        }
    };


    // Edita o nome de uma missão
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

            console.error(
                "Erro ao atualizar missão:",
                erro
            );

        }
    };


    // Exclui uma missão
    const excluirMissao = async () => {

        try {

            // Envia o DELETE para o backend
            await excluirMissaoAPI(
                missaoParaExcluir.id
            );


            // Remove a missão da tela
            const novasMissoes = missoes.filter(
                (missao) =>
                    missao.id !== missaoParaExcluir.id
            );


            setMissoes(novasMissoes);

            setMissaoParaExcluir(null);

        } catch (erro) {

            console.error(
                "Erro ao excluir missão:",
                erro
            );

        }
    };


    // Calcula a mesada quando o usuário
    // clica no botão "Calcular Mesada"
    const calcularMesada = async () => {

        try {

            const resultado =
                await calcularMesadaAPI(criancaId);

            console.log(
                "MESADA RECEBIDA DO BACKEND:",
                resultado
            );


            setMesada(resultado);


            // Aqui o modal é aberto.
            // Ele NÃO deve abrir sozinho ao carregar a página.
            setModalMesadaAberto(true);

        } catch (erro) {

            console.error(
                "Erro ao calcular mesada:",
                erro
            );

        }
    };


    // Confirma o registro da mesada no extrato
    const confirmarMesada = async () => {

        try {

            await registrarMesada(criancaId);


            // Depois que a mesada foi registrada,
            // fecha o modal.
            setModalMesadaAberto(false);

        } catch (erro) {

            console.error(
                "Erro ao registrar mesada:",
                erro
            );

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

                <div key={missao.id}>

                    <div className="d-flex align-items-center gap-2">

                        <h3>
                            {missao.criterio}
                        </h3>


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


                    <p>
                        Nota: {missao.nota}
                    </p>


                    <div className="d-flex gap-2">

                        {[
                            0, 1, 2, 3, 4,
                            5, 6, 7, 8, 9, 10
                        ].map((numero) => (

                            <button
                                key={numero}
                                onClick={() =>
                                    alterarNota(
                                        missao,
                                        numero
                                    )
                                }
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


            <p>
                Média das Missões: {media}
            </p>


            <p>
                Mesada: R$ {mesada}
            </p>


            <button onClick={calcularMesada}>
                Calcular Mesada
            </button>


            {/* Modal para criar ou editar missão */}
            <ModalCriterio
                isOpen={modalAberto}
                onClose={() => {

                    setModalAberto(false);

                    setMissaoParaEditar(null);

                }}
                onCriar={
                    missaoParaEditar
                        ? editarMissao
                        : criarMissao
                }
                missaoParaEditar={
                    missaoParaEditar
                }
            />


            {/* Modal para confirmar exclusão */}
            <ConfirmarExclusaoMissoes
                isOpen={
                    missaoParaExcluir !== null
                }
                onClose={() =>
                    setMissaoParaExcluir(null)
                }
                onConfirmar={
                    excluirMissao
                }
                missao={
                    missaoParaExcluir
                }
            />


            {/* Modal para confirmar o registro da mesada */}
            <ConfirmarMesada
                isOpen={
                    modalMesadaAberto
                }
                onClose={() =>
                    setModalMesadaAberto(false)
                }
                onConfirmar={
                    confirmarMesada
                }
                mesada={
                    mesada
                }
            />

        </div>
    );
}


export default Missoes;