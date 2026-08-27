import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();
    const enviarFormulario = async (event) => {
        event.preventDefault();
        const dadosLogin = {
            email,
            senha
        };

        try {
            await api.post("/autenticar/login", dadosLogin);
            alert("Login realizado com sucesso!");
            navigate("/home");
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("E-mail ou senha incorretos.");
        }
    };
    return (

        <div>
            <h1>Entrar na sua conta</h1>

       <form onSubmit={enviarFormulario}>
           <input
               type="text"
               placeholder="Digite seu email"
            value={email}
               onChange={(e) => setEmail(e.target.value)}
           />
           <input type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
           />
           <button type="submit">Entrar</button>
        </form>
        </div>
    );
}
export default LoginForm;