import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import PainelPaisModal from "./components/PainelPaisModal";
import LoginForm from "./components/LoginForm";
import CadastroPage from "./pages/CadastroPage";
import Home from "./pages/Home";

function App() {
    const [painelAberto, setPainelAberto] = useState(false);

    const handleSucessoPainel = () => {
        console.log("Senha do painel verificada com sucesso!");
        setPainelAberto(false);
    };

    return (
        <div>
            <Routes>
                <Route path="/cadastro" element={<CadastroPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/home" element={<Home />} />
            </Routes>

            <PainelPaisModal
                isOpen={painelAberto}
                onClose={() => setPainelAberto(false)}
                onSuccess={handleSucessoPainel}
            />
        </div>
    );
}

export default App;