import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CadastroPage() {
    const navigate = useNavigate();
    const [nomeResponsavel, setNomeResponsavel] = useState("");
    const [email, setEmail] = useState("");
    const [senhaLogin, setSenhaLogin] = useState("");
    const [senhaPainel, setSenhaPainel] = useState("");
    const [nomeCrianca, setNomeCrianca] = useState("");
    const [idadeCrianca, setIdadeCrianca] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const validarFormulario = async () => {
        setErro("");
        setSucesso("");

        if (nomeResponsavel === "") {
            setErro("Preencha o nome completo.");
            return;
        }

        // email
        if (email === "") {
            setErro("Preencha o e-mail.");
            return;
        }

        if (!email.includes("@")) {
            setErro("Digite um e-mail válido.");
            return;
        }

        // senha login
        if (senhaLogin === "") {
            setErro("Preencha a senha de login.");
            return;
        }

        if (senhaLogin.length < 6) {
            setErro("A senha de login deve ter pelo menos 6 caracteres.");
            return;
        }

        // senha painel
        if (senhaPainel === "") {
            setErro("Preencha a senha do painel.");
            return;
        }

        if (senhaPainel.length < 4) {
            setErro("A senha do painel deve ter pelo menos 4 caracteres.");
            return;
        }

        // nome criança
        if (nomeCrianca === "") {
            setErro("Preencha o nome da criança.");
            return;
        }

        if (idadeCrianca === "") {
            setErro("Preencha a idade da criança.");
            return;
        }

        const dadosCadastro = {
            responsavel: {
                nome: nomeResponsavel,
                email: email,
                senha: senhaLogin,
                senhaPainel: senhaPainel
            },
            crianca: [
                {
                    nome: nomeCrianca,
                    idade: Number(idadeCrianca)
                }
            ]
        };

        try {
            const resposta = await fetch("http://localhost:8080/contas/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosCadastro)
            });
            if (resposta.ok) {
                setSucesso("Conta criada com sucesso!");
                navigate("/login");
            } else if (resposta.status === 409) {
                setErro("Este e-mail já está cadastrado.");
            } else {
                setErro("Não foi possível criar a conta.");
            }
        } catch (error) {
            setErro("Erro ao conectar com o servidor.");
        }
    };

    return (
        <div>
            <header>
                <div>
                    <button>←</button>

                    <div>
                        <h1>Criar conta</h1>
                        <p>Cadastro da família no MiniBank</p>
                    </div>
                </div>
            </header>

            <section>
                <h2>Responsável</h2>

                <label>Nome completo*</label>
                <input
                    type="text"
                    placeholder="Ex: Maria Silva"
                    value={nomeResponsavel}
                    onChange={(e) => setNomeResponsavel(e.target.value)}
                />
                {erro && <p>{erro}</p>}

                <label>E-mail*</label>
                <input
                    type="email"
                    placeholder="familia@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="row">

                    <div className="col-md-6">
                        <label>Senha de login*</label>
                        <input
                            type="password"
                            placeholder="Mín. 6 caracteres"
                            value={senhaLogin}
                            onChange={(e) => setSenhaLogin(e.target.value)}
                        />
                        <p>Para entrar na plataforma</p>
                    </div>

                    <div className="col-md-6">
                        <label>Senha do painel*</label>
                        <input
                            type="password"
                            placeholder="Mín. 4 caracteres"
                            value={senhaPainel}
                            onChange={(e) => setSenhaPainel(e.target.value)}
                        />
                        <p>Para acessar o painel dos pais</p>
                    </div>

                </div>

            </section>

            <section>
                <h2>Criança</h2>

                <div className="row">

                    <div className="col-md-8">
                        <label>Nome*</label>
                        <input
                            type="text"
                            placeholder="Ex: Lucas"
                            value={nomeCrianca}
                            onChange={(e) => setNomeCrianca(e.target.value)}
                        />
                    </div>

                    <div className="col-md-4">
                        <label>Idade*</label>
                        <input
                            type="number"
                            placeholder="Ex: 10"
                            value={idadeCrianca}
                            onChange={(e) => setIdadeCrianca(e.target.value)}
                        />
                    </div>

                </div>
            </section>

            <div>
                <button onClick={validarFormulario}>Criar Conta</button>

                {sucesso && <p>{sucesso}</p>}

                <p>
                    Já tem conta? <button onClick={() => navigate("/login")}>Entrar</button>
                </p>
            </div>
        </div>
    );
}

export default CadastroPage;