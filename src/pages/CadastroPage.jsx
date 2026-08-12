import React from "react";
import { useState } from "react";
import { cadastrarUsuario } from "../services/usuarioService";

// Essa é a tela completa de cadastro. Ela cuida de três coisas:
// 1) Guardar o que o usuário digita (useState)
// 2) Enviar esses dados pra API quando o formulário é submetido
// 3) Mostrar mensagem de sucesso ou de erro pra pessoa
export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  async function handleSubmit(evento) {
    evento.preventDefault(); // evita que a página recarregue (comportamento padrão do HTML)

    setMensagemErro("");
    setMensagemSucesso("");
    setCarregando(true);

    try {
      const usuarioCriado = await cadastrarUsuario({ nome, email, senha });
      setMensagemSucesso(`Cadastro criado com sucesso! Bem-vindo(a), ${usuarioCriado.nome}.`);

      // limpa o formulário
      setNome("");
      setEmail("");
      setSenha("");
    } catch (erro) {
      // Se o backend devolveu um erro conhecido (ex: e-mail duplicado, campo inválido),
      // ele vem dentro de erro.response.data
      if (erro.response && erro.response.data) {
        const dadosErro = erro.response.data;
        const primeiraMensagem = Object.values(dadosErro)[0];
        setMensagemErro(primeiraMensagem || "Não foi possível concluir o cadastro.");
      } else {
        setMensagemErro("Erro ao conectar com o servidor. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Criar conta - minibank</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button 
        type="submit" 
        disabled={carregando} 
        style={{ width: "100%", padding: 10 }}>
          {carregando ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      {mensagemErro && <p style={{ color: "red", marginTop: 12 }}>{mensagemErro}</p>}
      {mensagemSucesso && <p style={{ color: "green", marginTop: 12 }}>{mensagemSucesso}</p>}
    </div>
  );
}
