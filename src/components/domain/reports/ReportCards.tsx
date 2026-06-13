import { View, Text } from "react-native";
import { FileBarChart, FileText, TrendingDown, TrendingUp } from "lucide-react-native";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatINR } from "@/utils/money";
import { PnlData, GstData, CashflowData } from "./types";

interface ReportCardsProps {
    pnlData: PnlData;
    gstData: GstData;
    cashflowData: CashflowData;
    onSelectReport: (report: 'pnl' | 'gst' | 'cashflow') => void;
}

export default function ReportCards({ pnlData, gstData, cashflowData, onSelectReport }: ReportCardsProps) {
    return (
        <>
            {/* Profit & Loss Card */}
            <Card className="mb-4 p-5 rounded-2xl" isPressable onPress={() => onSelectReport('pnl')}>
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <FileBarChart color="#081126" size={24} />
                        <Text className="font-sans-bold text-lg text-primary ml-2">Profit & Loss</Text>
                    </View>
                    <Text className="font-sans-medium text-xs text-muted-foreground uppercase">YTD</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                    <Text className="font-sans-medium text-muted-foreground">Gross Profit</Text>
                    <Text className={`font-sans-bold ${pnlData.grossProfit >= 0 ? 'text-primary' : 'text-red-500'}`}>
                        {formatINR(Math.abs(pnlData.grossProfit))}
                    </Text>
                </View>
                <View className="flex-row justify-between mb-4">
                    <Text className="font-sans-medium text-muted-foreground">Net Profit</Text>
                    <Text className={`font-sans-bold ${pnlData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {pnlData.netProfit < 0 ? '- ' : ''}{formatINR(Math.abs(pnlData.netProfit))}
                    </Text>
                </View>
                <Button
                    title="View Detailed P&L"
                    variant="secondary"
                    className="py-3 h-12"
                    onPress={() => onSelectReport('pnl')}
                />
            </Card>

            {/* GST Returns Card */}
            <Card className="mb-4 p-5 rounded-2xl" isPressable onPress={() => onSelectReport('gst')}>
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <FileText color="#081126" size={24} />
                        <Text className="font-sans-bold text-lg text-primary ml-2">GST Overview</Text>
                    </View>
                </View>
                
                <View className="flex-row justify-between mb-2">
                    <Text className="font-sans-medium text-muted-foreground">Output Tax (Collected)</Text>
                    <Text className="font-sans-bold text-primary">{formatINR(gstData.totalOutputTax)}</Text>
                </View>
                <View className="flex-row justify-between mb-4">
                    <Text className="font-sans-medium text-muted-foreground">Input Tax (ITC)</Text>
                    <Text className="font-sans-bold text-primary">{formatINR(gstData.totalInputTax)}</Text>
                </View>
                <View className="h-[1px] bg-border mb-3" />
                <View className="flex-row justify-between items-center">
                    <Text className="font-sans-bold text-primary">Est. Liability</Text>
                    <Text className={`font-sans-bold ${gstData.estimatedLiability > 0 ? 'text-red-500' : 'text-green-600'}`}>
                        {gstData.estimatedLiability > 0 ? `Payable ${formatINR(gstData.estimatedLiability)}` : `Refund ${formatINR(Math.abs(gstData.estimatedLiability))}`}
                    </Text>
                </View>
            </Card>

            {/* Cashflow Card */}
            <Card className="mb-6 p-5 rounded-2xl" isPressable onPress={() => onSelectReport('cashflow')}>
                <Text className="font-sans-bold text-lg text-primary mb-4">Cashflow</Text>
                <View className="flex-row mb-4">
                    <View className="flex-1 mr-2 bg-green-50 p-4 rounded-xl border border-green-100">
                        <TrendingUp color="#16a34a" size={24} className="mb-2" />
                        <Text className="font-sans-medium text-xs text-muted-foreground mb-1">Cash In</Text>
                        <Text className="font-sans-bold text-base text-green-700">{formatINR(cashflowData.cashIn)}</Text>
                    </View>
                    <View className="flex-1 ml-2 bg-red-50 p-4 rounded-xl border border-red-100">
                        <TrendingDown color="#dc2626" size={24} className="mb-2" />
                        <Text className="font-sans-medium text-xs text-muted-foreground mb-1">Cash Out</Text>
                        <Text className="font-sans-bold text-base text-red-700">{formatINR(cashflowData.cashOut)}</Text>
                    </View>
                </View>
                <View className="flex-row justify-between items-center bg-slate-50 p-3 rounded-lg border border-border">
                    <Text className="font-sans-bold text-primary">Net Cashflow</Text>
                    <Text className={`font-sans-bold ${cashflowData.netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {cashflowData.netCashflow < 0 ? '- ' : ''}{formatINR(Math.abs(cashflowData.netCashflow))}
                    </Text>
                </View>
            </Card>
        </>
    );
}
