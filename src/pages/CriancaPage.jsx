import React from "react";
import CabecalhoPainel from "../components/CabecalhoPainel";
import GerenciarCriancas from "../components/GerenciarCriancas";
import "../styles/painelPais.css";
import "../styles/configuracaoMesada.css";

export default function CriancaPage({ crianca, responsavel, criancas, aoTrocarCrianca, aoAdicionarCrianca, aoSair, aoVoltar, aoAtualizarCriancas }) {
    return <div className="pagina-painel">
        <CabecalhoPainel crianca={crianca} responsavel={responsavel} criancas={criancas}
            aoTrocarCrianca={aoTrocarCrianca} aoAdicionarCrianca={aoAdicionarCrianca} aoSair={aoSair} aoVoltar={aoVoltar} />
        <main className="conteudo-painel">
            <GerenciarCriancas crianca={crianca} responsavel={responsavel} criancas={criancas} aoAtualizar={aoAtualizarCriancas} />
        </main>
    </div>;
}
