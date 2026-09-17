import React, { useEffect, useRef, useState } from "react";
import "../styles/seletorCrianca.css";

const coresAvatar = ["verde", "azul", "violeta", "amarelo", "rosa"];

function IconeSeletor({ tipo }) {
    const propriedades = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
    if (tipo === "chevron") return <svg {...propriedades}><path d="m6 9 6 6 6-6" /></svg>;
    return <svg {...propriedades}><path d="m5 12 4 4L19 6" /></svg>;
}

export default function SeletorCrianca({ crianca, criancas, aoTrocarCrianca, aoAdicionarCrianca, bloqueado = false }) {
    const [aberto, definirAberto] = useState(false);
    const referencia = useRef(null);
    const indiceAtual = Math.max(0, criancas.findIndex(item => item.id === crianca.id));

    useEffect(() => {
        function fecharAoClicarFora(evento) {
            if (!referencia.current?.contains(evento.target)) definirAberto(false);
        }
        document.addEventListener("mousedown", fecharAoClicarFora);
        return () => document.removeEventListener("mousedown", fecharAoClicarFora);
    }, []);

    function selecionar(id) {
        aoTrocarCrianca(id);
        definirAberto(false);
    }

    return (
        <div className={`seletor-crianca-custom ${aberto ? "esta-aberto" : ""}`} ref={referencia}>
            <button type="button" className="botao-seletor-crianca" disabled={bloqueado}
                aria-haspopup="listbox" aria-expanded={aberto} onClick={() => definirAberto(valor => !valor)}>
                <span className={`avatar-seletor-crianca ${coresAvatar[indiceAtual % coresAvatar.length]}`} aria-hidden="true">{crianca.nome.charAt(0).toUpperCase()}</span>
                <span className="nome-seletor-crianca">{crianca.nome}</span>
                <span className="chevron-seletor-crianca"><IconeSeletor tipo="chevron" /></span>
            </button>
            {aberto && <div className="menu-seletor-crianca" role="listbox" aria-label="Crianças">
                {criancas.map((item, indice) => {
                    const selecionada = item.id === crianca.id;
                    return <button type="button" role="option" aria-selected={selecionada} className="opcao-seletor-crianca" key={item.id}
                        onClick={() => selecionar(item.id)}>
                        <span className={`avatar-seletor-crianca ${coresAvatar[indice % coresAvatar.length]}`} aria-hidden="true">{item.nome.charAt(0).toUpperCase()}</span>
                        <span className="dados-opcao-crianca"><strong>{item.nome}</strong><small>{item.idade} {Number(item.idade) === 1 ? "ano" : "anos"}</small></span>
                        {selecionada && <span className="check-seletor-crianca"><IconeSeletor tipo="check" /></span>}
                    </button>;
                })}
                {aoAdicionarCrianca && <button type="button" className="opcao-adicionar-crianca" onClick={() => { definirAberto(false); aoAdicionarCrianca(); }}>
                    <span aria-hidden="true">＋</span> Adicionar criança
                </button>}
            </div>}
        </div>
    );
}
