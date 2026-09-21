import api from "./api";

export async function cadastrarUsuario(dados) {
    const resposta = await api.post("/contas/cadastro", dados, { timeout: 15000 });
    return resposta.data;
}

export async function entrarUsuario({ email, senha }) {
    const resposta = await api.post("/autenticar/login", { email, senha });
    return resposta.data;
}

export function mensagemErroAutenticacao(erro, cadastro = false) {
    if (erro.code === "ECONNABORTED" || erro.code === "ETIMEDOUT") {
        return cadastro
            ? "O cadastro demorou mais que o esperado. Verifique sua conexão e tente novamente."
            : "A solicitação demorou mais que o esperado. Tente novamente.";
    }
    if (!erro.response) return "Não foi possível conectar ao servidor. Tente novamente.";
    if (erro.response.status === 401) return "E-mail ou senha incorretos.";
    if (erro.response.status === 409) return "Este e-mail já está cadastrado. Entre na sua conta.";
    if (erro.response.status === 400) {
        const dados = erro.response.data;
        if (dados && typeof dados === "object") {
            const mensagens = Object.values(dados).filter(valor => typeof valor === "string");
            if (mensagens.length) return mensagens.join(" ");
        }
        return "Confira os dados preenchidos e tente novamente.";
    }
    return cadastro ? "Não foi possível criar a conta. Tente novamente." : "Não foi possível entrar. Tente novamente.";
}
