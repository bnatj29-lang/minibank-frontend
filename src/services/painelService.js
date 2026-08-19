import api from "./api"

export async function verificarSenhaPainel(senha) {
    const resposta = await api.post("/painel/verificar", {
        senha,
    });

    return resposta.data;
}

//NESSA PAGINA AQUI É NECESSARIO CONFIGURAR UM TOKEN QUE SERA DEFINIDO NA PAGINA DE LOGIN (BACKEND)