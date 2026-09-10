import api from "./api";

// Busca todas as missões de uma criança
export const listarMissoes = async (criancaId) => {
    const resposta = await api.get(`/missoes/crianca/${criancaId}`);

    return resposta.data;
};

// Cria uma nova missão para uma criança
export const criarMissao = async (criancaId, criterio, nota) => {
    const resposta = await api.post(`/missoes/${criancaId}`, {
        criterio: criterio,
        nota: nota
    });

    return resposta.data;
};

// Atualiza uma missão existente
export const atualizarMissao = async (id, criterio, nota) => {
    await api.put(`/missoes/${id}`, {
        criterio: criterio,
        nota: nota
    });
};

// Exclui uma missão existente
export const excluirMissao = async (id) => {
    await api.delete(`/missoes/${id}`);
};

// Calcula a média das notas das missões
export const calcularMedia = async (criancaId) => {
    const resposta = await api.get(`/missoes/${criancaId}/media`);

    return resposta.data;
};