import api from "./api";

export async function listarMetas(criancaId) {
    const resposta = await api.get(`/metas/${criancaId}/listar-todas`);
    return resposta.data;
}

export async function criarMeta(criancaId, dados) {
    const resposta = await api.post(`/metas/${criancaId}/criar`, dados);
    return resposta.data;
}

export async function editarMeta(criancaId, metaId, dados) {
    const resposta = await api.put(`/metas/${criancaId}/editar/${metaId}`, dados);
    return resposta.data;
}

export async function excluirMeta(criancaId, metaId) {
    await api.delete(`/metas/${criancaId}/excluir/${metaId}`);
}

export function mensagemErroMeta(falha, mensagemPadrao) {
    const mensagem = falha.response?.data?.mensagem;
    return typeof mensagem === "string" ? mensagem : mensagemPadrao;
}
