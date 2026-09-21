function textoMonetarioParaNumero(valor) {
    const texto = String(valor ?? "").trim().replace(/\s/g, "");
    if (!texto) return "";

    // A vírgula identifica as casas decimais no formato brasileiro.
    return texto.includes(",")
        ? texto.replace(/\./g, "").replace(",", ".")
        : texto;
}

export function valorMonetarioParaNumero(valor) {
    const numero = Number(textoMonetarioParaNumero(valor));
    return Number.isFinite(numero) ? numero : NaN;
}

export function formatarMoedaInput(valor) {
    if (String(valor ?? "").trim() === "") return "";

    const numero = valorMonetarioParaNumero(valor);
    return Number.isFinite(numero)
        ? numero.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : String(valor);
}
