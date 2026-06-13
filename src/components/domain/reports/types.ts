export interface PnlData {
    revenue: number;
    cogs: number;
    operatingExpenses: number;
    grossProfit: number;
    netProfit: number;
}

export interface GstData {
    outputCGST: number; outputSGST: number; outputIGST: number; totalOutputTax: number;
    inputCGST: number; inputSGST: number; inputIGST: number; totalInputTax: number;
    estimatedLiability: number;
}

export interface CashflowData {
    cashIn: number; cashOut: number; netCashflow: number;
}
