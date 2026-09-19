import axios from "axios";
import { obterToken, limparSessao } from "./sessaoService";

// Esse arquivo centraliza a configuração de conexão com o backend.
// Todo o resto do frontend usa esse "api" ao invés de escrever a URL
// completa toda vez, o que facilita se precisarmos trocar o endereço
// (ex: quando for pra produção).
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(configuracao => {
  const token = obterToken();
  if (token) configuracao.headers.Authorization = `Bearer ${token}`;
  return configuracao;
});

api.interceptors.response.use(
  resposta => resposta,
  erro => {
    const rota = erro.config?.url || "";
    if (erro.response?.status === 401 && !rota.includes("/autenticar/login")) {
      limparSessao();
      if (window.location.pathname !== "/login") window.location.assign("/login");
    }
    return Promise.reject(erro);
  }
);

export default api;
