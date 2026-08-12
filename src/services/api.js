import axios from "axios";

// Esse arquivo centraliza a configuração de conexão com o backend.
// Todo o resto do frontend usa esse "api" ao invés de escrever a URL
// completa toda vez, o que facilita se precisarmos trocar o endereço
// (ex: quando for pra produção).
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
