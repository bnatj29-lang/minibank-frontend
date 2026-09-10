import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";


import PainelPaisModal from "./components/PainelPaisModal";
import Login from "./components/Login";
import CadastroPage from "./pages/CadastroPage";
import Home from "./pages/Home";
import SelecionarCriancaPage from "./pages/SelecionarCriancaPage";
import { lerSessao, salvarSessao } from "./services/sessaoService";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import Financeiro from "./pages/Financeiro";
import MetasPage from "./pages/MetasPage";

function App() {
    const navegar = useNavigate();
    const [painelLiberado, definirPainelLiberado] = useState(false);
    const [sessao, definirSessao] = useState(lerSessao);
    const criancaAtiva = sessao?.criancas.find(crianca => crianca.id === sessao.criancaAtivaId);

    useEffect(() => {
        salvarSessao(sessao);
    }, [sessao]);

    function entrarFamilia(familia) {
        definirPainelLiberado(false);
        definirPainelAberto(false);
        definirSessao({ responsavel: familia.responsavel, criancas: familia.criancas, criancaAtivaId: null });
    }

    function selecionarCrianca(id) {
        if (sessao.criancas.some(crianca => crianca.id === id)) {
            definirSessao({ ...sessao, criancaAtivaId: id });
        }
    }

    function sair() {
        definirSessao(null);
        definirPainelLiberado(false);
        navegar("/login", { replace: true });
        definirPainelAberto(false);
    }

    const [painelAberto, definirPainelAberto] = useState(false);

    const tratarSucessoPainel = () => {
        definirPainelLiberado(true);
        navegar("/financeiro");
        definirPainelAberto(false);
    };

    return (
        <div>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/cadastro" element={<CadastroPage />} />
                <Route path="/login" element={<Login aoEntrar={entrarFamilia} />} />
                <Route path="/selecionar-crianca" element={sessao
                    ? <SelecionarCriancaPage familia={sessao} aoSelecionar={selecionarCrianca} aoSair={sair} />
                    : <Navigate to="/login" replace />} />
                <Route path="/home" element={criancaAtiva
                    ? <Home crianca={criancaAtiva} aoAbrirPainel={() => definirPainelAberto(true)} />
                    : <Navigate to={sessao ? "/selecionar-crianca" : "/login"} replace />} />
                <Route path="/metas" element={criancaAtiva
                    ? <MetasPage key={criancaAtiva.id} crianca={criancaAtiva} aoAbrirPainel={() => definirPainelAberto(true)} />
                    : <Navigate to={sessao ? "/selecionar-crianca" : "/login"} replace />} />
                <Route path="/configuracoes" element={<ConfiguracoesPage />} />
                <Route path="/financeiro" element={!criancaAtiva
                    ? <Navigate to={sessao ? "/selecionar-crianca" : "/login"} replace />
                    : painelLiberado
                        ? <Financeiro key={criancaAtiva.id} crianca={criancaAtiva} responsavel={sessao.responsavel}
                            criancas={sessao.criancas} aoTrocarCrianca={selecionarCrianca} aoSair={sair}
                            aoVoltar={() => definirPainelLiberado(false)} />
                        : <Navigate to="/home" replace />} />
            </Routes>

            {painelAberto && sessao && criancaAtiva && <PainelPaisModal
                email={sessao.responsavel.email}
                aoFechar={() => definirPainelAberto(false)}
                aoAcessar={tratarSucessoPainel}
            />}
        </div>
    );
}

export default App;
