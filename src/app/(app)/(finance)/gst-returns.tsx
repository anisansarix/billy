// @ts-nocheck
import { useRouter } from "expo-router";
import { useShallow } from 'zustand/react/shallow';
import { ArrowLeft, Download } from "lucide-react-native";
import { useState, useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/store";
import { formatINR } from "@/utils/money";

export default function GSTReturnsScreen() {
    const router = useRouter();
    const {  invoices, purchases, parties  } = useAppStore(useShallow(state => ({ invoices: state.invoices, purchases: state.purchases, parties: state.parties })));
    
    const [tab, setTab] = useState<"GSTR-1" | "GSTR-3B">("GSTR-1");

    // Filter Active Invoices
    const activeInvoices = useMemo(() => invoices.filter(i => i.status !== 'Draft' && i.status !== 'Cancelled'), [invoices]);
    const activePurchases = useMemo(() => purchases.filter(p => p.status !== 'Draft' && p.status !== 'Cancelled'), [purchases]);

    // GSTR-1 Calculations (Outward Supplies)
    const gstr1Data = useMemo(() => {
        let b2bSales = 0;
        let b2cSales = 0;
        let b2bTax = 0;
        let b2cTax = 0;

        activeInvoices.forEach(inv => {
            const customer = parties.find(p => p.id === inv.partyId);
            const totalTax = (inv.totalGSTAmountPaise || 0);
            
            // If customer has GSTIN, it's B2B, else B2C
            if (customer && customer.gstin && customer.gstin.trim() !== '') {
                b2bSales += inv.subtotalPaise;
                b2bTax += totalTax;
            } else {
                b2cSales += inv.subtotalPaise;
                b2cTax += totalTax;
            }
        });

        return { b2bSales, b2cSales, b2bTax, b2cTax, totalSales: b2bSales + b2cSales, totalTax: b2bTax + b2cTax };
    }, [activeInvoices, parties]);

    // GSTR-3B Calculations (Summary)
    const gstr3bData = useMemo(() => {
        const outputTax = gstr1Data.totalTax;
        const itc = activePurchases.reduce((acc, pur) => acc + (pur.totalGSTAmountPaise || 0), 0);
        const liability = outputTax - itc;

        return { outputTax, itc, liability };
    }, [gstr1Data, activePurchases]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <ArrowLeft color="#081126" size={24} />
                    </Pressable>
                    <Text className="text-2xl font-sans-bold text-primary">GST Returns</Text>
                </View>
                <Pressable className="p-2">
                    <Download color="#081126" size={24} />
                </Pressable>
            </View>

            {/* Segmented Control */}
            <View className="bg-white">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 py-3 border-b border-border">
                    {["GSTR-1", "GSTR-3B"].map((t) => (
                        <Pressable 
                            key={t}
                            onPress={() => setTab(t as never)}
                            className={`mr-3 px-6 py-2.5 rounded-full border ${tab === t ? 'bg-primary border-primary' : 'bg-transparent border-border'}`}
                        >
                            <Text className={`font-sans-bold ${tab === t ? 'text-white' : 'text-muted-foreground'}`}>{t}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
                
                {tab === "GSTR-1" && (
                    <View>
                        <View className="bg-white rounded-2xl p-5 mb-5 border border-border shadow-sm">
                            <Text className="font-sans-bold text-lg text-primary mb-4">Outward Supplies (Sales)</Text>
                            
                            <View className="flex-row justify-between mb-4">
                                <View>
                                    <Text className="font-sans-medium text-xs text-muted-foreground uppercase mb-1">Total Taxable Value</Text>
                                    <Text className="font-sans-bold text-xl text-primary">{formatINR(gstr1Data.totalSales)}</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="font-sans-medium text-xs text-muted-foreground uppercase mb-1">Total Tax</Text>
                                    <Text className="font-sans-bold text-xl text-primary">{formatINR(gstr1Data.totalTax)}</Text>
                                </View>
                            </View>

                            <View className="h-[1px] bg-border mb-4" />

                            <Text className="font-sans-bold text-sm text-primary mb-3">B2B Invoices (Registered)</Text>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">Taxable Value</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(gstr1Data.b2bSales)}</Text>
                            </View>
                            <View className="flex-row justify-between mb-4">
                                <Text className="font-sans-medium text-muted-foreground">Tax Amount</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(gstr1Data.b2bTax)}</Text>
                            </View>

                            <Text className="font-sans-bold text-sm text-primary mb-3">B2C Invoices (Unregistered)</Text>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-sans-medium text-muted-foreground">Taxable Value</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(gstr1Data.b2cSales)}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="font-sans-medium text-muted-foreground">Tax Amount</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(gstr1Data.b2cTax)}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {tab === "GSTR-3B" && (
                    <View>
                        <View className="bg-white rounded-2xl p-5 mb-5 border border-border shadow-sm">
                            <Text className="font-sans-bold text-lg text-primary mb-4">Tax Summary</Text>
                            
                            <View className="flex-row justify-between mb-4">
                                <View>
                                    <Text className="font-sans-medium text-xs text-muted-foreground uppercase mb-1">Output Tax</Text>
                                    <Text className="font-sans-bold text-xl text-primary">{formatINR(gstr3bData.outputTax)}</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="font-sans-medium text-xs text-muted-foreground uppercase mb-1">Eligible ITC</Text>
                                    <Text className="font-sans-bold text-xl text-green-600">{formatINR(gstr3bData.itc)}</Text>
                                </View>
                            </View>

                            <View className="h-[1px] bg-border mb-4" />

                            <View className="flex-row justify-between items-center bg-slate-50 p-4 rounded-xl border border-border">
                                <Text className="font-sans-bold text-base text-primary">Net Tax Liability</Text>
                                <Text className={`font-sans-bold text-xl ${gstr3bData.liability > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {gstr3bData.liability > 0 ? `Payable ${formatINR(gstr3bData.liability)}` : `Refund ${formatINR(Math.abs(gstr3bData.liability))}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}
