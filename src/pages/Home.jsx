import React from "react";
import {useNavigate} from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Bem-vindo à página inicial!</h1>
            <button onClick={() => navigate("/painel-pais")}>
                Login dos responsáveis
            </button>
        </div>
    );
}

export default Home;