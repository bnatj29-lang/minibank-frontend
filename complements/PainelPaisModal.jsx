import React, { useState } from "react";
import { verificarSenhaPainel} from "../src/services/painelService";

//esses sao os imports - react e a funcao (q faz requisicao pro back)
//useState faz lembrar valores entre renderizacoes.
//ele cria variaveis pode mudar e fazer a tela ser atualizada automaticamente.

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
//state - react transforma de acordo com os dados. (dado manda na tela)

if (!isOpen) return null;  // Se isOpen for false, o componente não renderiza NADA.
// É assim que controlamos se o modal aparece ou não.

async function handleAcessar() {
    setErro("");
//handleAcessar é o que roda quando clica para acessar

    if (!senha) {
        setErro("Digite a senha do painel.");
        return;
    }
//esse erro vai se limpo depois
    //Se o campo está vazio, mostra erro local e para ali (return) - validacao simples
    setCarregando(true); //trava o botao - mostra verificando
    try {
        await verificarSenhaPainel(senha); //chama funcao
        //se der certo chama onSuccess()

        // Senha correta: limpa o campo, avisa quem está usando o modal.
        setSenha("");
        onSuccess();
    } catch (erroRequisicao) {
        //se der erro cai no CATCH que diferencia o TIPO do erro
        // Critério de aceite: "senha incorreta retorna erro claro, sem
        // liberar acesso". Por isso, em QUALQUER erro, simplesmente não
        // chamamos onSuccess() — o modal continua fechado pro painel.
        if (erroRequisicao.response && erroRequisicao.response.status === 401) {
            setErro("Senha do painel incorreta.");
        } else if (erroRequisicao.response && erroRequisicao.response.data) {
            const dadosErro = erroRequisicao.response.data;
            setErro(dadosErro.mensagem || "Não foi possível verificar a senha.");
        } else {
            setErro("Erro ao conectar com o servidor. Tente novamente.");
        }
    } finally {
        setCarregando(false);
        //roda sempre, dando certo ou errado, pra destravar o botão no final.
    }
}

function handleCancelar() {
    setSenha("");
    setErro("");
    onClose();
//essa function fecha o modal limpando os campos.
}
