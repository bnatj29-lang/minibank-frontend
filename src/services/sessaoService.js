// Guarda somente os dados necessários para navegar. Não guarda senhas.
const chaveSessao = "minibank-familia";

export function lerSessao() {
    try {
        const sessao = JSON.parse(sessionStorage.getItem(chaveSessao));
        if (!sessao?.responsavel?.id || !Array.isArray(sessao.criancas)) return null;
        return sessao;
    } catch {
        return null;
    }
}

export function salvarSessao(sessao) {
    try {
        if (sessao) {
            sessionStorage.setItem(chaveSessao, JSON.stringify(sessao));
        } else {
            sessionStorage.removeItem(chaveSessao);
        }
    } catch {
        // Se o navegador bloquear o armazenamento, a navegação continua em memória.
    }
}
