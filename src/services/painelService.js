import api from "./api"
//IMPORTA A INSTANCIA axios

export async function verificarSenhaPainel(senha) {
    const resposta = await api.post("/painel/verificar", {
        senha,
    });


    //EXPORT ASYNC: ISSO É UMA FUNCAO ASSINCRONA (CONSEGUE REALIZAR UMA TAREFA AO MESMO TEMPO QUE OUTRAS SEM TRAVAR)
    //recebe um unico parametro: a senha que a pessoa digitou do modal
    //isso vem do painelmodal.jsx

    //CONST RESPOSTA: esse é o coração da funcao, que faz a requisicao POST http://localhost:8080/painel/verificar,
    //que manda um corpo JSON.
    //o AWAIT pausa a funcao ate a resposta do servidor chegar


    return resposta.data;
}
//O RETURN devolve apenas os dados da resposta (n o objeto inteiro)

//fluxo: PainelPaisModal (usuario clica para acessar) --> funcao de verificarsenha(senha) --> POST para verificar
// --> Backend valida com passwordEncoder.matches(...) = acerto 200 (volta ao normal) erro 401 (vira excecao)

//NESSA PAGINA AQUI É NECESSARIO CONFIGURAR UM TOKEN QUE SERA DEFINIDO NA =PAGINA DE LOGIN= (BACKEND)
//(esse token identifica quem é o responsavel usando a conta) - Authentication authentication

//==MAIS SOBRE A PAGINA==
//unica parte do front que pega o endpoint --