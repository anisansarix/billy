import { useRouter } from "expo-router";
import { useShallow } from 'zustand/react/shallow';
import { ArrowLeft, Download, FileBarChart } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View, RefreshControl, Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/store";
import "../../../../global.css";
import { useDeferredRender } from "@/hooks/useDeferredRender";
import { ListCardSkeleton } from "@/components/ui/skeletons/ListCardSkeleton";
import ReportCards from "@/components/domain/reports/ReportCards";
import ReportModals from "@/components/domain/reports/ReportModals";



export default function ReportsScreen() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedReport, setSelectedReport] = useState<'pnl' | 'gst' | 'cashflow' | null>(null);

    const {  invoices, purchases, expenses, payments  } = useAppStore(useShallow(state => ({ invoices: state.invoices, purchases: state.purchases, expenses: state.expenses, payments: state.payments })));

    const isReady = useDeferredRender();

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    // --- PROFIT & LOSS CALCULATIONS ---
    const activeInvoices = invoices.filter(i => i.status !== 'Cancelled' && i.status !== 'Draft');
    const activePurchases = purchases.filter(p => p.status !== 'Cancelled' && p.status !== 'Draft');

    const revenue = activeInvoices.reduce((sum, i) => sum + i.subtotalPaise, 0); // Excluding taxes for P&L
    const cogs = activePurchases.reduce((sum, p) => sum + p.subtotalPaise, 0); // Cost of Goods Sold
    const operatingExpenses = expenses.reduce((sum, e) => sum + e.amountPaise, 0);

    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - operatingExpenses;

    // --- GST CALCULATIONS ---
    const outputCGST = activeInvoices.reduce((sum, i) => sum + Object.values(i.gstSummary?.slabs || {}).reduce((s, slab) => s + (slab.cgstAmountPaise || 0), 0), 0);
    const outputSGST = activeInvoices.reduce((sum, i) => sum + Object.values(i.gstSummary?.slabs || {}).reduce((s, slab) => s + (slab.sgstAmountPaise || 0), 0), 0);
    const outputIGST = activeInvoices.reduce((sum, i) => sum + Object.values(i.gstSummary?.slabs || {}).reduce((s, slab) => s + (slab.igstAmountPaise || 0), 0), 0);
    const totalOutputTax = activeInvoices.reduce((sum, i) => sum + (i.totalGSTAmountPaise || 0), 0);

    const inputCGST = activePurchases.reduce((sum, p) => sum + Object.values(p.gstSummary?.slabs || {}).reduce((s, slab) => s + (slab.cgstAmountPaise || 0), 0), 0);
    const inputSGST = activePurchases.reduce((sum, p) => sum + Object.values(p.gstSummary?.slabs || {}).reduce((s, slab) => s + (slab.sgstAmountPaise || 0), 0), 0);
    const inputIGST = activePurchases.reduce((sum, p) => sum + Object.values(p.gstSummary?.slabs || {}).reduce((s, slab) => s + (slab.igstAmountPaise || 0), 0), 0);
    const totalInputTax = activePurchases.reduce((sum, p) => sum + (p.totalGSTAmountPaise || 0), 0);

    const estimatedLiability = totalOutputTax - totalInputTax;

    // --- CASHFLOW CALCULATIONS ---
    const cashIn = payments.filter(p => p.type === 'in').reduce((sum, p) => sum + p.amountPaise, 0);
    const cashOut = payments.filter(p => p.type === 'out').reduce((sum, p) => sum + p.amountPaise, 0);
    const netCashflow = cashIn - cashOut;

    const isDataEmpty = invoices.length === 0 && purchases.length === 0 && expenses.length === 0 && payments.length === 0;

    const pnlData = { revenue, cogs, operatingExpenses, grossProfit, netProfit };
    const gstData = { outputCGST, outputSGST, outputIGST, totalOutputTax, inputCGST, inputSGST, inputIGST, totalInputTax, estimatedLiability };
    const cashflowData = { cashIn, cashOut, netCashflow };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10 mb-4">
                <View className="flex-row items-center">
                    <Pressable onPress={() => { Vibration.vibrate(10); router.back(); }} className="mr-4">
                        <ArrowLeft color="#081126" size={24} />
                    </Pressable>
                    <Text className="text-2xl font-sans-bold text-primary">Reports</Text>
                </View>
                <Pressable onPress={() => Vibration.vibrate(10)} className="p-2">
                    <Download color="#081126" size={24} />
                </Pressable>
            </View>

            <ScrollView 
                className="flex-1 px-5" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#208AEF" />}
            >
                {!isReady ? (
                    <View>
                        <ListCardSkeleton />
                        <ListCardSkeleton />
                        <ListCardSkeleton />
                    </View>
                ) : isDataEmpty ? (
                    <View className="items-center justify-center py-20 px-5">
                        <View className="h-24 w-24 bg-primary/5 rounded-full items-center justify-center mb-6">
                            <FileBarChart color="#208AEF" size={40} opacity={0.5} />
                        </View>
                        <Text className="font-sans-bold text-xl text-primary mb-2 text-center">No Data for Reports</Text>
                        <Text className="font-sans-medium text-sm text-muted-foreground text-center mb-8">
                            Start generating invoices, recording expenses, and receiving payments to see your business performance.
                        </Text>
                        <Pressable 
                            onPress={() => { Vibration.vibrate(10); router.push('/(app)/dashboard' as never); }}
                            className="bg-primary flex-row items-center px-6 py-3 rounded-xl"
                        >
                            <Text className="font-sans-bold text-white text-base">Go to Dashboard</Text>
                        </Pressable>
                    </View>
                ) : (
                    <ReportCards
                        pnlData={pnlData}
                        gstData={gstData}
                        cashflowData={cashflowData}
                        onSelectReport={setSelectedReport}
                    />
                )}
            </ScrollView>

            <ReportModals
                selectedReport={selectedReport}
                onClose={() => setSelectedReport(null)}
                pnlData={pnlData}
                gstData={gstData}
                cashflowData={cashflowData}
            />

        </SafeAreaView>
    );
}
