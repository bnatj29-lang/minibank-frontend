import React from "react";

//isOpen       → mostra ou esconde o modal
//onClose      → fecha o modal
//onConfirmar  → confirma o registro
//mesada       → mostra o valor calculado

function ConfirmarMesada ({isOpen, onClose, onConfirmar, mesada}) {

  if (!isOpen) {
      return null;
  }

  return (
      <div>
          <h3>Confirmar Mesada</h3>

          <p>
              A mesada calculada foi de R$ {mesada}.
          </p>

          <p>
              Deseja registrar essa mesada no extrato?
          </p>

          <button onClick={onClose}>
              Cancelar
          </button>

          <button onClick={onConfirmar}>
              Confirmar
          </button>
      </div>
  );

}

export default ConfirmarMesada;