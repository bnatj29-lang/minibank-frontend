import React, { useEffect, useState } from "react";
import { buscarExtrato } from "../services/extratoService";
import RegistrarEconomia from "../components/RegistrarEconomia";
import RegistrarRetirada from "../components/RegistrarRetirada";

function Financeiro(){
    const [extrato, setExtrato] = useState([]); //guarda lista de movimentacoes
    const [saldo, setSaldo] = useState(0); //guarda o saldo calculado
    const criancaId = 1; //id da crianca consultada (isso é temporario)

    const [economiaAberta, setEconomiaAberta] = useState(false);

    useEffect(() => {
        carregarExtrato();
    }, []);
    //executado quando a pagina é carregada

    //buscar extrato no backend
    async function carregarExtrato(){
        try {
            const dados = await buscarExtrato(criancaId);

            setExtrato(dados);

            let saldoCalculado = 0; //ponto de partida do calculo é zero

            dados.forEach((movimentacao) => {
                if(movimentacao.tipo === "ENTRADA"){
                    saldoCalculado += Number(movimentacao.valor);
                }
                if(movimentacao.tipo === "RETIRADA"){
                    saldoCalculado -= Number(movimentacao.valor);
                }
            });

            setSaldo(saldoCalculado);
        } catch (erro){
            console.error("Erro ao carregar extrato:", erro);
        }
    }

    //2 = casas decimais que quer mostrar
    return (
        <div>

            <h1>Financeiro</h1>

            <h2>
                Saldo: R$ {saldo.toFixed(2)}
            </h2>

            <button onClick={() => setEconomiaAberta(true)}>
                Registrar Economia
            </button>

            <RegistrarEconomia
             isOpen={economiaAberta}
             onClose={() => setEconomiaAberta(false)}
             onRegistro={carregarExtrato}
            />


            <RegistrarRetirada onRegistro={carregarExtrato}/>

            <h2>Extrato</h2>

            {extrato.map((movimentacao) => (
                <div key={movimentacao.id}>

                    <p>
                        Tipo: {movimentacao.tipo}
                    </p>

                    <p>
                        Valor: R$ {movimentacao.valor}
                    </p>

                    <p>
                        Descrição: {movimentacao.descricao}
                    </p>

                    <p>
                        Data: {movimentacao.data}
                    </p>

                    <hr />

                </div>
            ))}

        </div>
    );
}

export default Financeiro;