import api from "./api";


//registra uma entrada/retirada no extrato
//recebe os dados e envia para a api
//isso aqui vira POST http://localhost:8080/extrato ==
export async function registrarExtrato(dados){
    const resposta = await api.post("/extrato", dados);
//aqui se espera uma resposta do backend
// dados = objeto que o RegistrarEconomia montou
//requisicao POST - dados vira o corpo json



    return resposta.data;
    // Pega os dados que vieram na resposta do backend e devolve para quem chamou a função.
}

//busca o extrato de uma crianca
//e essa daqui, se crianca id = 1, vira GET http://localhost:8080/extrato/1 ==

export async function buscarExtrato(criancaId){
    const resposta = await api.get(`/extrato/${criancaId}`);

    return resposta.data;
}

//as regras de negocio estao no backend - extratoService