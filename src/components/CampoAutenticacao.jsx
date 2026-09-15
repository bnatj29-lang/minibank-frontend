import React, { useState } from "react";

export default function CampoAutenticacao({ id, rotulo, tipo = "text", ajuda, ...propriedades }) {
    const [visivel, definirVisivel] = useState(false);
    const campoSenha = tipo === "password";
    return <div>
        <label className="form-label" htmlFor={id}>{rotulo}<span className="campo-obrigatorio"> *</span></label>
        <div className="position-relative">
            <input {...propriedades} id={id} name={id} required type={campoSenha && visivel ? "text" : tipo}
                className={`form-control ${campoSenha ? "campo-senha" : ""}`}
                aria-describedby={ajuda ? `${id}-ajuda` : undefined} />
            {campoSenha && <button type="button" className="botao-visibilidade-senha" aria-label={`${visivel ? "Ocultar" : "Mostrar"} ${rotulo.toLowerCase()}`}
                aria-pressed={visivel} onClick={() => definirVisivel(!visivel)}>{visivel ? "Ocultar" : "Mostrar"}</button>}
        </div>
        {ajuda && <p id={`${id}-ajuda`} className="form-text mb-0">{ajuda}</p>}
    </div>;
}
