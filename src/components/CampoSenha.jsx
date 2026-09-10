import React, { useState } from "react";

export default function CampoSenha({ id, rotulo, valor, aoAlterar, minimo, exemplo, preenchimentoAutomatico, ajuda }) {
    const [visivel, definirVisivel] = useState(false);

    function alternarVisibilidade() {
        definirVisivel(!visivel);
    }

    return (
        <div>
            <label className="form-label" htmlFor={id}>
                {rotulo}<span className="campo-obrigatorio"> *</span>
            </label>
            <div className="envoltorio-campo">
                <input
                    id={id}
                    name={id}
                    type={visivel ? "text" : "password"}
                    className="form-control campo-senha"
                    value={valor}
                    onChange={aoAlterar}
                    minLength={minimo}
                    placeholder={exemplo}
                    autoComplete={preenchimentoAutomatico}
                    aria-describedby={ajuda ? `${id}-ajuda` : undefined}
                    required
                />
                <button
                    type="button"
                    className="botao-visibilidade-senha"
                    onClick={alternarVisibilidade}
                    aria-label={`${visivel ? "Ocultar" : "Mostrar"} ${rotulo.toLowerCase()}`}
                    aria-pressed={visivel}
                >
                    {visivel ? "Ocultar" : "Mostrar"}
                </button>
            </div>
            {ajuda && <p id={`${id}-ajuda`} className="form-text ajuda-campo">{ajuda}</p>}
        </div>
    );
}
