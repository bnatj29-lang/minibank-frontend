import React from "react";

function ConfirmarExclusao({ isOpen, onClose, onConfirmar, missao }) {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            Excluir Missão
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>

                    <div className="modal-body">
                        <p>
                            Deseja excluir a missão "{missao.criterio}"?
                        </p>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={onConfirmar}
                        >
                            Excluir
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ConfirmarExclusao;