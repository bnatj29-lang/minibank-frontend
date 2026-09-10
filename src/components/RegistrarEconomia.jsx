import React from "react";
import RegistrarMovimentacao from "./RegistrarMovimentacao";

export default function RegistrarEconomia({ crianca, saldo, aoFechar, aoRegistrar }) {
    return <RegistrarMovimentacao crianca={crianca} saldo={saldo} tipo="ENTRADA" aoFechar={aoFechar} aoRegistrar={aoRegistrar} />;
}
