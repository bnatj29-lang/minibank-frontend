import api from "./api";

export async function buscarConfiguracaoMesada(criancaId) {
    try {
        const resposta = await api.get(`/criancas/${criancaId}/configuracao-mesada`);
        return resposta.data;
    } catch (falha) {
        // A API retorna 404 quando essa criança ainda não tem configuração.
        if (falha.response?.status === 404) return null;
        throw falha;
    }
}

export async function salvarConfiguracaoMesada(criancaId, configuracao) {
    await api.put(`/criancas/${criancaId}/configuracao-mesada`, configuracao);
}

export function mensagemErroMesada(falha) {
    if (falha.response?.status === 400) {
        const dados = falha.response.data;
        if (dados && typeof dados === "object") {
            const mensagens = Object.values(dados).filter(valor => typeof valor === "string");
            if (mensagens.length) return mensagens.join(" ");
        }
    }
    return "Não foi possível confirmar o salvamento. Confira a conexão e tente novamente.";
}
