import React from "react";
import RegistrarMovimentacao from "./RegistrarMovimentacao";

export default function RegistrarRetirada({ crianca, saldo, aoFechar, aoRegistrar }) {
    return <RegistrarMovimentacao crianca={crianca} saldo={saldo} tipo="RETIRADA" aoFechar={aoFechar} aoRegistrar={aoRegistrar} />;
}
