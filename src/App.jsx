import React, { useState } from "react";
import PainelPaisModal from "./components/PainelPaisModal";
import CadastroPage from "./pages/CadastroPage";

function App() {
    const [painelAberto, setPainelAberto] = useState(false);

    const handleSucessoPainel = () => {
        console.log("Senha do painel verificada com sucesso!");
        setPainelAberto(false);
    };

    return (
        <div>
            <CadastroPage />

            <button onClick={() => setPainelAberto(true)}>
                Abrir Painel dos Pais
            </button>

            <PainelPaisModal
                isOpen={painelAberto}
                onClose={() => setPainelAberto(false)}
                onSuccess={handleSucessoPainel}
            />
        </div>
    );
}

export default App;