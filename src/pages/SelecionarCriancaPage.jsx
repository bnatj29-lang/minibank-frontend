import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarExtrato } from "../services/extratoService";
import logo from "../assets/icons/logo_minibank_original.svg";
import icone from "../assets/icons/icone_minibank_original.svg";
import "../styles/selecaoCrianca.css";

export default function SelecionarCriancaPage({ familia, aoSelecionar, aoSair }) {
    const navegar = useNavigate();
    const [saldos, definirSaldos] = useState({});
    const [tentativa, definirTentativa] = useState(0);
    const hora = new Date().getHours();
    let saudacao = "Boa noite";
    if (hora < 12) saudacao = "Bom dia";
    else if (hora < 18) saudacao = "Boa tarde";

    useEffect(() => {
        let cancelado = false;
        definirSaldos({});

        async function carregarSaldo(crianca) {
            try {
                const extrato = await buscarExtrato(crianca.id);
                // Soma em centavos para evitar diferenças de arredondamento.
                let centavos = 0;
                for (const movimento of extrato) {
                    const valor = Math.round(Number(movimento.valor) * 100);
                    if (movimento.tipo === "ENTRADA") centavos += valor;
                    if (movimento.tipo === "RETIRADA") centavos -= valor;
                }
                if (!cancelado) {
                    definirSaldos(atuais => ({ ...atuais, [crianca.id]: { valor: centavos / 100 } }));
                }
            } catch {
                if (!cancelado) {
                    definirSaldos(atuais => ({ ...atuais, [crianca.id]: { erro: true } }));
                }
            }
        }

        familia.criancas.forEach(carregarSaldo);
        return () => { cancelado = true; };
    }, [familia.criancas, tentativa]);

    function acessarCrianca(id) {
        aoSelecionar(id);
        navegar("/home");
    }

    function encerrarSessao() {
        aoSair();
        navegar("/login", { replace: true });
    }

    const temErroSaldo = Object.values(saldos).some(saldo => saldo.erro);

    return (
        <div className="pagina-selecao">
            <header className="cabecalho-selecao">
                <div className="conteudo-cabecalho-selecao">
                    <div className="marca-selecao">
                        <img className="icone-selecao" src={icone} alt="" />
                        <img className="logotipo-selecao" src={logo} alt="MiniBank" />
                    </div>
                    <div className="responsavel-selecao">
                        <span>{familia.responsavel.nome}</span>
                        <button className="botao-sair" type="button" onClick={encerrarSessao}>Sair</button>
                    </div>
                </div>
            </header>
            <main className="conteudo-selecao">
                <div className="apresentacao-selecao">
                    <h1>{saudacao}, {familia.responsavel.nome.trim().split(" ")[0]}! 👋</h1>
                    <p>Quem você deseja acessar hoje?</p>
                </div>
                {familia.criancas.length === 0 && (
                    <p className="aviso-selecao" role="status">Nenhuma criança cadastrada nesta conta.</p>
                )}
                <div className="lista-criancas">
                    {familia.criancas.map(crianca => (
                        <button
                            className="cartao-crianca"
                            key={crianca.id}
                            type="button"
                            onClick={() => acessarCrianca(crianca.id)}
                            aria-label={`Acessar ${crianca.nome}, ${crianca.idade} anos`}
                        >
                            <span className="avatar-crianca">{crianca.nome.trim().charAt(0).toUpperCase()}</span>
                            <span className="dados-crianca">
                                <span className="nome-crianca">{crianca.nome}</span>
                                <span className="idade-crianca">{crianca.idade} {crianca.idade === 1 ? "ano" : "anos"}</span>
                                <span className="saldo-crianca">
                                    <span className="valor-crianca">
                                        {!saldos[crianca.id] ? "Carregando…" : saldos[crianca.id].erro ? "Saldo indisponível" :
                                            saldos[crianca.id].valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </span>
                                    <span className="legenda-cofrinho">no cofrinho</span>
                                </span>
                            </span>
                            <span className="acessar-crianca">Acessar →</span>
                        </button>
                    ))}
                </div>
                {temErroSaldo && (
                    <div className="aviso-selecao" role="status">
                        <p>Não foi possível carregar todos os saldos. Você ainda pode selecionar uma criança.</p>
                        <button type="button" className="botao-recarregar" onClick={() => definirTentativa(tentativa + 1)}>Tentar novamente</button>
                    </div>
                )}
            </main>
        </div>
    );
}
