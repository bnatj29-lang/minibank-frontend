import React from "react";
import { Link } from "react-router-dom";
import "../styles/selecaoCrianca.css";
import "../styles/painelPais.css";

function Home({ crianca, aoAbrirPainel }) {
    return (
        <main className="pagina-selecao">
            <div className="conteudo-selecao">
                <h1>Olá, {crianca.nome}!</h1>
                <p>Você está acessando o perfil de {crianca.nome}, {crianca.idade} {crianca.idade === 1 ? "ano" : "anos"}.</p>
                <div className="acoes-inicio-crianca">
                    <Link className="botao-recarregar" to="/metas">Minhas Metas</Link>
                    <Link className="botao-recarregar" to="/selecionar-crianca">Trocar criança</Link>
                    <button className="btn botao-acessar-painel" onClick={aoAbrirPainel}>Painel dos Pais</button>
                </div>
            </div>
        </main>
    );
}

export default Home;
