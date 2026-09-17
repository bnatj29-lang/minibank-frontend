import api from "./api";

export async function listarCriancas(responsavelId) {
    const resposta = await api.get(`/criancas/responsavel/${responsavelId}`);
    return resposta.data;
}

export async function adicionarCrianca(responsavelId, dados) {
    const resposta = await api.post(`/criancas?responsavelId=${responsavelId}`, dados);
    return resposta.data;
}

export async function editarCrianca(criancaId, responsavelId, dados) {
    await api.put(`/criancas/${criancaId}/responsavel/${responsavelId}`, dados);
}

export async function excluirCrianca(criancaId, responsavelId) {
    await api.delete(`/criancas/${criancaId}/responsavel/${responsavelId}`);
}

export function mensagemErroCrianca(falha, mensagemPadrao) {
    const dados = falha.response?.data;
    if (typeof dados?.mensagem === "string") return dados.mensagem;
    if (falha.response?.status === 400 && dados && typeof dados === "object") {
        const mensagens = Object.values(dados).filter(valor => typeof valor === "string");
        if (mensagens.length) return mensagens.join(" ");
    }
    return mensagemPadrao;
}
