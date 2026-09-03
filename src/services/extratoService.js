import api from "./api";


//registra uma entrada/retirada no extrato
//recebe os dados e envia para a api
//isso aqui vira POST http://localhost:8080/extrato ==
export async function registrarExtrato(dados){
    const resposta = await api.post("/extrato", dados);

    return resposta.data;
}

//busca o extrato de uma crianca
//e essa daqui, se crianca id = 1, vira GET http://localhost:8080/extrato/1 ==

export async function buscarExtrato(criancaId){
    const resposta = await api.get(`/extrato${criancaId}`);

    return resposta.data;
}

//as regras de negocio estao no backend - extratoService