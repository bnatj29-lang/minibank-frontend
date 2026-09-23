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

export async function guardarDinheiroMeta(criancaId, metaId, valorAporte) {
    const resposta = await api.post(`/metas/${criancaId}/metas/${metaId}/guardar`, { valorAporte });
    return resposta.data;
}

export async function conquistarMeta(criancaId, metaId) {
    const resposta = await api.post(`/metas/${criancaId}/metas/${metaId}/conquistar`);
    return resposta.data;
}

export async function solicitarConquista(criancaId, metaId) {
    const resposta = await api.post(`/metas/${criancaId}/metas/${metaId}/solicitar-conquista`);
    return resposta.data;
}

export async function listarSolicitacoes(criancaId) {
    const resposta = await api.get(`/metas/${criancaId}/solicitacoes`);
    return resposta.data;
}

export async function aprovarConquista(criancaId, metaId) {
    const resposta = await api.post(`/metas/${criancaId}/metas/${metaId}/aprovar-conquista`);
    return resposta.data;
}

export async function recusarConquista(criancaId, metaId) {
    const resposta = await api.post(`/metas/${criancaId}/metas/${metaId}/recusar-conquista`);
    return resposta.data;
}

export function mensagemErroMeta(falha, mensagemPadrao) {
    const mensagem = falha.response?.data?.mensagem;
    return typeof mensagem === "string" ? mensagem : mensagemPadrao;
}
