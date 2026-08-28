import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import CadastroPage from "./pages/CadastroPage";
import Home from "./pages/Home";
import PainelPaisModal from "./components/PainelPaisModal";

function App() {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
                path="/login"
                element={
                    <>
                        <LoginForm />
                        <button onClick={() => navigate("/cadastro")}>
                            Criar um cadastro
                        </button>
                    </>
                }
            />

            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/painel-pais" element={ <PainelPaisModal />} />

        </Routes>
    );
}

export default App;
