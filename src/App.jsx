import React from "react";

import CadastroPage from "./pages/CadastroPage";

// Por enquanto, o App só renderiza a tela de cadastro.
// Quando o login e outras telas forem criados, aqui entra o
// react-router-dom para decidir qual página mostrar em cada URL.
export default function App() {
  return <CadastroPage />;
}
