import React, { useState } from "react";
import PainelPaisModal from "./components/PainelPaisModal";

//botao abrir painel TEMPORÁRIO
//import CadastroPage from "./pages/CadastroPage";


// Quando o login e outras telas forem criados, aqui entra o
// react-router-dom para decidir qual página mostrar em cada URL.

export default function App() {
  const [painelAberto, setPainelAberto] = useState(false);

  function handleSucessoPainel() {
    setPainelAberto(false);
    alert("Acesso liberado! (aqui depois entra a navegação pro Painel de verdade)");
  }

  return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <button onClick={() => setPainelAberto(true)} style={{ padding: "8px 16px" }}>
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

//essa página é como se fosse dona do estado painelAberto
//--decide qnd o modal aparece
//status - fase de teste, botao temporario