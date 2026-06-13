import { View, Text, ScrollView, Pressable } from "react-native";
import { X, ArrowUpRight, ArrowDownLeft } from "lucide-react-native";
import AnimatedModal from "@/components/ui/AnimatedModal";
import { formatINR } from "@/utils/money";
import { PnlData, GstData, CashflowData } from "./types";

interface ReportModalsProps {
    selectedReport: 'pnl' | 'gst' | 'cashflow' | null;
    onClose: () => void;
    pnlData: PnlData;
    gstData: GstData;
    cashflowData: CashflowData;
}

export default function ReportModals({ selectedReport, onClose, pnlData, gstData, cashflowData }: ReportModalsProps) {
    return (
        <>
            {/* P&L Details Modal */}
            <AnimatedModal visible={selectedReport === 'pnl'} onClose={onClose}>
                <View className="bg-white rounded-t-3xl p-6 min-h-[500px]">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-sans-bold text-2xl text-primary">Profit & Loss</Text>
                        <Pressable onPress={onClose} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                            <X color="#64748b" size={20} />
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="mb-6">
                            <Text className="font-sans-bold text-lg text-primary mb-3">Operating Income</Text>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">Total Sales Revenue</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(pnlData.revenue)}</Text>
                            </View>
                            <View className="h-[1px] bg-border my-2" />
                            <View className="flex-row justify-between">
                                <Text className="font-sans-bold text-primary">Total Income</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(pnlData.revenue)}</Text>
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="font-sans-bold text-lg text-primary mb-3">Cost of Goods Sold (COGS)</Text>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">Purchases / Bills</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(pnlData.cogs)}</Text>
                            </View>
                            <View className="h-[1px] bg-border my-2" />
                            <View className="flex-row justify-between">
                                <Text className="font-sans-bold text-primary">Total COGS</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(pnlData.cogs)}</Text>
                            </View>
                        </View>

                        <View className="bg-slate-50 p-4 rounded-xl border border-border mb-6 flex-row justify-between">
                            <Text className="font-sans-bold text-primary text-base">Gross Profit</Text>
                            <Text className="font-sans-bold text-primary text-base">{formatINR(pnlData.grossProfit)}</Text>
                        </View>

                        <View className="mb-6">
                            <Text className="font-sans-bold text-lg text-primary mb-3">Operating Expenses</Text>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">Indirect Expenses</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(pnlData.operatingExpenses)}</Text>
                            </View>
                            <View className="h-[1px] bg-border my-2" />
                            <View className="flex-row justify-between">
                                <Text className="font-sans-bold text-primary">Total Expenses</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(pnlData.operatingExpenses)}</Text>
                            </View>
                        </View>

                        <View className={`p-4 rounded-xl border mb-8 flex-row justify-between ${pnlData.netProfit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <Text className={`font-sans-bold text-lg ${pnlData.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>Net Profit</Text>
                            <Text className={`font-sans-bold text-lg ${pnlData.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                {pnlData.netProfit < 0 ? '- ' : ''}{formatINR(Math.abs(pnlData.netProfit))}
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </AnimatedModal>

            {/* GST Details Modal */}
            <AnimatedModal visible={selectedReport === 'gst'} onClose={onClose}>
                <View className="bg-white rounded-t-3xl p-6 min-h-[450px]">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-sans-bold text-2xl text-primary">GST Overview</Text>
                        <Pressable onPress={onClose} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                            <X color="#64748b" size={20} />
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="mb-6 bg-slate-50 p-4 rounded-xl border border-border">
                            <Text className="font-sans-bold text-lg text-primary mb-4">Output Tax (Sales)</Text>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">CGST Collected</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(gstData.outputCGST)}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">SGST Collected</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(gstData.outputSGST)}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">IGST Collected</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(gstData.outputIGST)}</Text>
                            </View>
                            <View className="h-[1px] bg-border my-2" />
                            <View className="flex-row justify-between">
                                <Text className="font-sans-bold text-primary">Total Output Tax</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(gstData.totalOutputTax)}</Text>
                            </View>
                        </View>

                        <View className="mb-6 bg-slate-50 p-4 rounded-xl border border-border">
                            <Text className="font-sans-bold text-lg text-primary mb-4">Input Tax Credit (Purchases)</Text>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">CGST Paid</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(gstData.inputCGST)}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">SGST Paid</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(gstData.inputSGST)}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">IGST Paid</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(gstData.inputIGST)}</Text>
                            </View>
                            <View className="h-[1px] bg-border my-2" />
                            <View className="flex-row justify-between">
                                <Text className="font-sans-bold text-primary">Total Input Tax</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(gstData.totalInputTax)}</Text>
                            </View>
                        </View>

                        <View className={`p-4 rounded-xl border mb-8 flex-row justify-between ${gstData.estimatedLiability > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                            <Text className={`font-sans-bold text-lg ${gstData.estimatedLiability > 0 ? 'text-red-700' : 'text-green-700'}`}>Estimated Liability</Text>
                            <Text className={`font-sans-bold text-lg ${gstData.estimatedLiability > 0 ? 'text-red-700' : 'text-green-700'}`}>
                                {gstData.estimatedLiability > 0 ? `Payable ${formatINR(gstData.estimatedLiability)}` : `Refund ${formatINR(Math.abs(gstData.estimatedLiability))}`}
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </AnimatedModal>

            {/* Cashflow Details Modal */}
            <AnimatedModal visible={selectedReport === 'cashflow'} onClose={onClose}>
                <View className="bg-white rounded-t-3xl p-6 min-h-[400px]">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-sans-bold text-2xl text-primary">Cashflow Summary</Text>
                        <Pressable onPress={onClose} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                            <X color="#64748b" size={20} />
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="mb-6">
                            <Text className="font-sans-bold text-lg text-primary mb-4">Cash Sources</Text>
                            <View className="flex-row items-center justify-between mb-3 bg-green-50 p-4 rounded-xl border border-green-100">
                                <View className="flex-row items-center">
                                    <View className="bg-green-100 p-2 rounded-full mr-3">
                                        <ArrowDownLeft color="#16a34a" size={20} />
                                    </View>
                                    <Text className="font-sans-bold text-green-800">Total Money In</Text>
                                </View>
                                <Text className="font-sans-bold text-lg text-green-700">{formatINR(cashflowData.cashIn)}</Text>
                            </View>

                            <View className="flex-row items-center justify-between mb-3 bg-red-50 p-4 rounded-xl border border-red-100">
                                <View className="flex-row items-center">
                                    <View className="bg-red-100 p-2 rounded-full mr-3">
                                        <ArrowUpRight color="#dc2626" size={20} />
                                    </View>
                                    <Text className="font-sans-bold text-red-800">Total Money Out</Text>
                                </View>
                                <Text className="font-sans-bold text-lg text-red-700">{formatINR(cashflowData.cashOut)}</Text>
                            </View>
                        </View>

                        <View className="bg-slate-50 p-4 rounded-xl border border-border mb-8">
                            <Text className="font-sans-bold text-primary mb-2">Net Cash Movement</Text>
                            <Text className={`font-sans-bold text-3xl ${cashflowData.netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {cashflowData.netCashflow < 0 ? '- ' : ''}{formatINR(Math.abs(cashflowData.netCashflow))}
                            </Text>
                            <Text className="font-sans-medium text-xs text-muted-foreground mt-2">
                                {cashflowData.netCashflow >= 0 ? 'You have generated positive cash flow.' : 'You have burned more cash than you generated.'}
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </AnimatedModal>
        </>
    );
}
