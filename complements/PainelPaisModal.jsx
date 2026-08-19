import React, { useState } from "react";
import { verificarSenhaPainel} from "../src/services/painelService";

//esses sao os imports - react e a funcao (q faz requisicao pro back)
//useState faz lembrar valores entre renderizacoes.

//quem usa esse componente decide
//ex:
//   - isOpen: true/false -> mostra ou esconde o modal
//   - onClose: função chamada quando a pessoa clica em "Cancelar" ou no X
//   - onSuccess: função chamada quando a senha está CORRETA (é aqui que
//     quem estiver usando o modal decide o que fazer depois, ex:
//     navegar pra tela do Painel dos Pais)

export default function PainelPaisModal({ isOpen, onClose, onSuccess }) {
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
}
//essas sao memorias que o componente guarda
//senha - o que a pessoa ta digitando no campo
//mostrarSenha - se a senha esta visivel (olhinho)
//carregando - se a requisicao esta em andamento (p nao deixar clicar
//duas vezes, botao some
//erro - mensagem de erro exibida

if (!isOpen) return null;  // Se isOpen for false, o componente não renderiza NADA.
// É assim que controlamos se o modal aparece ou não.

async function handleAcessar() {

}