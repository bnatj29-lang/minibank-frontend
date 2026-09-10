import api from "./api";

// Busca todas as missões de uma criança
export const listarMissoes = async (criancaId) => {
    const resposta = await api.get(`/missoes/crianca/${criancaId}`);
    return resposta.data;
};

//cria uma nova missao para uma crianca
export const criarMissao = async (criancaId, criterio, nota) => {
    const resposta = await api.post(`/missoes/${criancaId}`, {
        criterio: criterio,
        nota: nota
    });
    return resposta.data;
};