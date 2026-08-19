import api from "./api"

export async function verificarSenhaPainel(senha) {
    const resposta = await api.post("/painel/verificar", {
        senha,
    });

    return resposta.data;
}