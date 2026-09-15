import React, { useState } from "react";

export default function AuthField({ id, label, type = "text", hint, ...props }) {
    const [visible, setVisible] = useState(false);
    const password = type === "password";
    return <div>
        <label className="form-label" htmlFor={id}>{label}<span className="auth-required"> *</span></label>
        <div className="position-relative">
            <input {...props} id={id} name={id} required type={password && visible ? "text" : type}
                className={`form-control ${password ? "auth-password" : ""}`}
                aria-describedby={hint ? `${id}-hint` : undefined} />
            {password && <button type="button" className="auth-reveal" aria-label={`${visible ? "Ocultar" : "Mostrar"} ${label.toLowerCase()}`}
                aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? "Ocultar" : "Mostrar"}</button>}
        </div>
        {hint && <p id={`${id}-hint`} className="form-text mb-0">{hint}</p>}
    </div>;
}
