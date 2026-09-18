import api from "./api";

export async function solicitarRecuperacao(email) {
    const resposta = await api.post("/autenticar/esqueci-senha", { email });
    return resposta.data;
}

export async function redefinirSenha({ token, novaSenha, confirmacaoSenha }) {
    const resposta = await api.post("/autenticar/redefinir-senha", {
        token,
        novaSenha,
        confirmacaoSenha
    });
    return resposta.data;
}

export async function validarTokenRecuperacao(token) {
    await api.get("/autenticar/redefinir-senha/validar", { params: { token } });
}

export function mensagemErroRecuperacao(erro) {
    if (!erro.response) return "Não foi possível conectar ao servidor. Tente novamente.";
    if (erro.response.status === 400) {
        const mensagem = erro.response.data?.mensagem;
        return typeof mensagem === "string"
            ? mensagem
            : "Confira os dados preenchidos e tente novamente.";
    }
    if (erro.response.status === 502) {
        return "Não foi possível enviar o e-mail de recuperação. Tente novamente.";
    }
    return "Não foi possível concluir a recuperação de senha. Tente novamente.";
}
