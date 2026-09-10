import api from "./api";

export const listarMissoes = async (criancaId) => {
    const resposta = await api.get(`/missoes/crianca/${criancaId}`)

    return resposta.data;

    //funcao listar missoes - GET missoes de tal criancaId
}