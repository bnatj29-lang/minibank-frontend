import React, { useState } from "react";
import { verificarSenhaPainel} from "../services/painelService";
import {Alert, Button, InputGroup, Modal, Form} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

//esses sao os imports - react e a funcao (q faz requisicao pro back)
//useState faz lembrar valores entre renderizacoes.
//ele cria variaveis q pode mudar e fazer a tela ser atualizada automaticamente.

//quem usa esse componente decide
//ex:
//   - isOpen: true/false -> mostra ou esconde o modal
//   - onClose: função chamada quando a pessoa clica em "Cancelar" ou no X
//   - onSuccess: função chamada quando a senha está CORRETA (é aqui que
//     quem estiver usando o modal decide o que fazer depois, ex:
//     navegar pra tela do Painel dos Pais)

function PainelPaisModal() {
    const navigate = useNavigate();
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

//essas sao memorias que o componente guarda
//senha - o que a pessoa ta digitando no campo
//mostrarSenha - se a senha esta visivel (olhinho)
//carregando - se a requisicao esta em andamento (p nao deixar clicar
//duas vezes, botao some
//erro - mensagem de erro exibida
//state - react transforma de acordo com os dados. (dado manda na tela)



    async function handleAcessar() {
        setErro("");
        setSucesso("");
//handleAcessar é o que roda quando clica para acessar

        if (!senha) {
            setErro("Digite a senha do painel.");
            return;
        }

        const emailUsuario = sessionStorage.getItem("usuarioEmail");

        if (!emailUsuario) {
            setErro("E-mail do usuário não encontrado. Faça o login novamente.");
            return;
        }
//esse erro vai ser limpo depois
        //Se o campo está vazio, mostra erro local e para ali (return) - validacao simples
        setCarregando(true); //trava o botao - mostra verificando
        try {
            await verificarSenhaPainel(senha, emailUsuario); //chama funcao
            setSucesso("Login realizado com sucesso!");
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
        setSucesso("");
        navigate("/login");
//essa function fecha o modal limpando os campos.
    }
    return (
        // O <Modal> do react-bootstrap já cuida sozinho de: overlay escurecido,
        // fechar com ESC, travar o scroll de fundo, e centralizar na tela.
        // "show" substitui o nosso antigo "if (!isOpen) return null".
        // "onHide" é chamado tanto ao clicar fora quanto no X — por isso
        // ligamos direto no handleCancelar.

        <Modal show={true} onHide={handleCancelar} centered>
            <Modal.Header closeButton>
                <Modal.Title>Painel dos Pais</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="d-flex justify-content-center mb-3">
                    <div
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{ width: 56, height: 56, backgroundColor: "#ede9fe", fontSize: 24 }}
                    >
                        🔒
                    </div>
                </div>

                <p className="text-center text-muted">
                    Digite a senha dos responsáveis para acessar o painel.
                </p>

                <Form.Group>
                    <Form.Label>
                        Senha do Painel dos Pais <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={mostrarSenha ? "text" : "password"}
                            value={senha}
                            onChange={(e) => {
                                setSenha(e.target.value);
                                setErro("");
                                setSucesso("");
                            }}
                            placeholder="••••••"
                            disabled={carregando}
                            // isInvalid liga automaticamente o estilo de erro (borda
                            // vermelha) do Bootstrap quando existe uma mensagem de erro
                            isInvalid={!!erro}
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                            aria-label="Mostrar ou ocultar senha"
                        >
                            {mostrarSenha ? "🙈" : "👁"}
                        </Button>
                    </InputGroup>
                </Form.Group>

                {erro && (
                    <Alert variant="danger" className="mt-3 mb-0 py-2">
                        {erro}
                    </Alert>
                )}

                {sucesso && (
                    <Alert variant="success" className="mt-3 mb-0 py-2">
                        {sucesso}
                    </Alert>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleCancelar} disabled={carregando}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleAcessar} disabled={carregando}>
                    {carregando ? "Verificando..." : "Acessar"}
                </Button>
            </Modal.Footer>
        </Modal>
    );

}
export default PainelPaisModal;
