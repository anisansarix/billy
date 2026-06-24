import { useRouter } from "expo-router";
import { useShallow } from 'zustand/react/shallow';
import { ArrowLeft, Truck, AlertCircle } from "lucide-react-native";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View , Vibration } from "react-native";
import { formatDate } from "@/utils/date";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/store";
import { formatINR } from "@/utils/money";
import { useDeferredRender } from "@/hooks/useDeferredRender";
import { ListCardSkeleton } from "@/components/ui/skeletons/ListCardSkeleton";

export default function EWayBillsScreen() {
    const router = useRouter();
    const isReady = useDeferredRender();
    const {  invoices  } = useAppStore(useShallow(state => ({ invoices: state.invoices })));
    
    // In India, interstate E-way bill limit is ₹50,000. Intrastate may vary but ₹50,000 is a safe threshold to flag.
    const EWAY_BILL_THRESHOLD = 50000;

    const pendingEwayBills = useMemo(() => {
        return invoices.filter(inv => inv.status !== 'Draft' && inv.status !== 'Cancelled' && (inv.totalAmountPaise || 0) > EWAY_BILL_THRESHOLD);
    }, [invoices]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: " bg-slate-50".includes("bg-white") ? "white" : "#f8fafc" }} className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center p-4 bg-white shadow-sm z-10 border-b border-border">
                <Pressable onPress={() => { Vibration.vibrate(10); router.back(); }} className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
                    <ArrowLeft color="#081126" size={24} />
                </Pressable>
                <View className="ml-2 flex-1">
                    <Text className="text-lg font-sans-bold text-primary">E-Way Bills</Text>
                    <Text className="text-xs font-sans-medium text-muted-foreground">Manage E-Way Bill generation</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
                
                <View className="bg-white rounded-2xl p-4 mb-4 border border-border shadow-sm">
                    <View className="flex-row items-center mb-2">
                        <Truck color="#081126" size={24} className="mr-3" />
                        <Text className="font-sans-bold text-lg text-primary">E-Way Bill Tracker</Text>
                    </View>
                            <Text className="font-sans-regular text-sm text-muted-foreground mt-2 mb-6">
                                Interstate shipments (and applicable intrastate shipments) exceeding ₹50,000 require an E-Way Bill under GST regulations.
                            </Text>
                </View>

                <Text className="font-sans-bold text-lg text-primary mb-4">Requires Attention ({pendingEwayBills.length})</Text>

                {!isReady ? (
                    <>
                        <ListCardSkeleton />
                        <ListCardSkeleton />
                        <ListCardSkeleton />
                    </>
                ) : (
                    <>
                        {pendingEwayBills.map(inv => (
                            <View key={inv.id} className="bg-white rounded-2xl p-4 mb-4 border border-amber-200 shadow-sm flex-row items-center justify-between">
                                <View>
                                    <Text className="font-sans-bold text-base text-primary">{inv.documentNumber}</Text>
                                    <Text className="font-sans-medium text-xs text-muted-foreground">{formatDate(inv.documentDate)} • {formatINR(inv.totalAmountPaise || 0)}</Text>
                                </View>
                                <Pressable className="bg-amber-100 px-4 py-2 rounded-lg border border-amber-200">
                                    <Text className="font-sans-bold text-amber-800 text-xs uppercase tracking-wider">Generate</Text>
                                </Pressable>
                            </View>
                        ))}

                        {pendingEwayBills.length === 0 && (
                            <View className="items-center justify-center py-10">
                                <View className="h-16 w-16 bg-green-100 rounded-full items-center justify-center mb-4">
                                    <AlertCircle color="#16a34a" size={32} />
                                </View>
                                <Text className="font-sans-bold text-lg text-primary mb-2 text-center">Up to Date</Text>
                                <Text className="font-sans-medium text-sm text-muted-foreground text-center">
                                    No high-value invoices require E-Way bill generation at the moment.
                                </Text>
                            </View>
                        )}
                    </>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}
