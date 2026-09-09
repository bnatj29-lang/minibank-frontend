import React, { useState } from "react";

//nessa pagina existe bootstrap para fins de teste

function ModalCriterio({ isOpen, onClose, onCriar }) {
    const [criterio, setCriterio] = useState(""); //guarda o valor do que vc digita

    if (!isOpen) {
        return null;
    }

    const handleCriar = () => {
        if (!criterio.trim()) {
            return;
        }

        onCriar(criterio); //cria
        setCriterio(""); //atribui valor ao criterio (??)
        onClose(); //fecha o modal
    };

    return (
        <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            Nova Missão
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>

                    <div className="modal-body">
                        <label className="form-label">
                            Nome da missão *
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex: Arrumar o quarto, Fazer as tarefas..."
                            value={criterio}
                            onChange={(e) => setCriterio(e.target.value)}
                        />
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
                            className="btn btn-success"
                            onClick={handleCriar}
                        >
                            Criar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ModalCriterio;