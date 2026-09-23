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
import Missoes from "./pages/Missoes";
import CriancaPage from "./pages/CriancaPage";
import AdicionarCriancaModal from "./components/AdicionarCriancaModal";
import RecuperarSenhaPage from "./pages/RecuperarSenhaPage";
import RedefinirSenhaPage from "./pages/RedefinirSenhaPage";
import SolicitacoesPage from "./pages/SolicitacoesPage";

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
        definirSessao({ responsavel: familia.responsavel, criancas: familia.criancas, token: familia.token, criancaAtivaId: null });
    }

    function selecionarCrianca(id) {
        if (sessao.criancas.some(crianca => crianca.id === id)) {
            definirSessao({ ...sessao, criancaAtivaId: id });
        }
    }

    function atualizarCriancas(criancas, criancaAtivaId = sessao?.criancaAtivaId) {
        if (sessao) definirSessao({ ...sessao, criancas, criancaAtivaId });
    }

    function abrirAdicionarCrianca() {
        definirAdicionarCriancaAberto(true);
    }

    function sair() {
        definirSessao(null);
        definirPainelLiberado(false);
        navegar("/login", { replace: true });
        definirPainelAberto(false);
    }

    const [painelAberto, definirPainelAberto] = useState(false);
    const [adicionarCriancaAberto, definirAdicionarCriancaAberto] = useState(false);

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
                <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
                <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
                <Route path="/selecionar-crianca" element={sessao
                    ? <SelecionarCriancaPage familia={sessao} aoSelecionar={selecionarCrianca} aoSair={sair}
                        aoAdicionarCrianca={abrirAdicionarCrianca} />
                    : <Navigate to="/login" replace />} />
                <Route path="/home" element={criancaAtiva
                    ? <Home key={criancaAtiva.id} crianca={criancaAtiva}
                        aoAbrirPainel={() => definirPainelAberto(true)} aoSair={sair} />
                    : <Navigate to={sessao ? "/selecionar-crianca" : "/login"} replace />} />
                <Route path="/metas" element={criancaAtiva
                    ? <MetasPage key={criancaAtiva.id} crianca={criancaAtiva} aoAbrirPainel={() => definirPainelAberto(true)} />
                    : <Navigate to={sessao ? "/selecionar-crianca" : "/login"} replace />} />
                <Route path="/configuracoes" element={!criancaAtiva
                    ? <Navigate to={sessao ? "/selecionar-crianca" : "/login"} replace />
                    : painelLiberado
                        ? <ConfiguracoesPage key={criancaAtiva.id} crianca={criancaAtiva} responsavel={sessao.responsavel}
                            criancas={sessao.criancas} aoTrocarCrianca={selecionarCrianca} aoAdicionarCrianca={abrirAdicionarCrianca} aoSair={sair}
                            aoVoltar={() => definirPainelLiberado(false)} />
                        : <Navigate to="/home" replace />} />
                <Route path="/crianca" element={!criancaAtiva
                    ? <Navigate to={sessao ? "/selecionar-crianca" : "/login"} replace />
                    : painelLiberado
                        ? <CriancaPage key={criancaAtiva.id} crianca={criancaAtiva} responsavel={sessao.responsavel}
                            criancas={sessao.criancas} aoTrocarCrianca={selecionarCrianca} aoAdicionarCrianca={abrirAdicionarCrianca} aoSair={sair}
                            aoVoltar={() => definirPainelLiberado(false)} aoAtualizarCriancas={atualizarCriancas} />
                        : <Navigate to="/home" replace />} />
                <Route path="/financeiro" element={!criancaAtiva
                    ? <Navigate to={sessao ? "/selecionar-crianca" : "/login"} replace />
                    : painelLiberado
                        ? <Financeiro key={criancaAtiva.id} crianca={criancaAtiva} responsavel={sessao.responsavel}
                            criancas={sessao.criancas} aoTrocarCrianca={selecionarCrianca} aoAdicionarCrianca={abrirAdicionarCrianca} aoSair={sair}
                            aoVoltar={() => definirPainelLiberado(false)} />
                        : <Navigate to="/home" replace />} />
                <Route path="/missoes" element={!criancaAtiva
                    ? <Navigate to={sessao ? "/selecionar-crianca" : "/login"} replace />
                    : painelLiberado
                        ? <Missoes key={criancaAtiva.id} crianca={criancaAtiva} responsavel={sessao.responsavel}
                            criancas={sessao.criancas} aoTrocarCrianca={selecionarCrianca} aoAdicionarCrianca={abrirAdicionarCrianca} aoSair={sair}
                            aoVoltar={() => definirPainelLiberado(false)} />
                        : <Navigate to="/home" replace />} />
                <Route path="/solicitacoes" element={!criancaAtiva
                    ? <Navigate to={sessao ? "/selecionar-crianca" : "/login"} replace />
                    : painelLiberado
                        ? <SolicitacoesPage key={criancaAtiva.id} crianca={criancaAtiva} responsavel={sessao.responsavel}
                            criancas={sessao.criancas} aoTrocarCrianca={selecionarCrianca} aoAdicionarCrianca={abrirAdicionarCrianca} aoSair={sair}
                            aoVoltar={() => definirPainelLiberado(false)} />
                        : <Navigate to="/home" replace />} />
            </Routes>

            {painelAberto && sessao && criancaAtiva && <PainelPaisModal
                email={sessao.responsavel.email}
                aoFechar={() => definirPainelAberto(false)}
                aoAcessar={tratarSucessoPainel}
            />}
            {adicionarCriancaAberto && sessao && <AdicionarCriancaModal
                responsavel={sessao.responsavel}
                aoFechar={() => definirAdicionarCriancaAberto(false)}
                aoConcluir={(criancas, criancaId) => {
                    atualizarCriancas(criancas, criancaId);
                    definirAdicionarCriancaAberto(false);
                    navegar("/home");
                }}
            />}
        </div>
    );
}

export default App;
