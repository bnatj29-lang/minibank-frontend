import api from "./api";

// Essa função é a ÚNICA parte do frontend que sabe que existe um endpoint
// "/usuarios/cadastro". A tela (CadastroPage.jsx) só chama essa função,
// sem precisar saber detalhes de como a requisição é feita.
//
// Isso é bom porque, se um dia a URL ou o formato do endpoint mudar,
// só precisamos ajustar aqui, e não em todas as telas que usam cadastro.
export async function cadastrarUsuario({ nome, email, senha }) {
  const resposta = await api.post("/usuarios/cadastro", {
    nome,
    email,
    senha,
  });

  return resposta.data; // já vem como UsuarioResponseDTO (sem a senha)
}
