import { Pressable, View, Text, Vibration } from "react-native";
import { useRouter } from "expo-router";
import { AlertCircle } from "lucide-react-native";
import { InventoryItem, SalesInvoice } from "@/types/entities";
import { formatCompactINR } from "@/utils/money";

interface NeedsAttentionWidgetProps {
    lowStockItems: InventoryItem[];
    unpaidInvoices: SalesInvoice[];
}

export default function NeedsAttentionWidget({ lowStockItems, unpaidInvoices }: NeedsAttentionWidgetProps) {
    const router = useRouter();

    return (
        <View className="mb-6">
            <Text className="font-sans-bold text-lg text-primary mb-3">Needs Attention</Text>
            
            {lowStockItems.length > 0 && (
                <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3">
                    <View className="flex-row items-center gap-2 mb-3">
                        <AlertCircle color="#d97706" size={20} />
                        <Text className="font-sans-bold text-amber-800 text-base">Low Stock Alert</Text>
                    </View>
                    {lowStockItems.slice(0, 3).map((item, idx) => (
                        <View key={item.id} className={`flex-row justify-between items-center py-2 ${idx !== Math.min(lowStockItems.length, 3) - 1 ? 'border-b border-amber-200/50' : ''}`}>
                            <Text className="font-sans-medium text-amber-900 flex-1 mr-2" numberOfLines={1}>{item.name}</Text>
                            <Text className="font-sans-bold text-amber-700">{item.stock || 0} left</Text>
                        </View>
                    ))}
                    {lowStockItems.length > 3 && (
                        <Pressable onPress={() => { Vibration.vibrate(10); router.push('/(app)/products-services' as never); }} className="mt-2 pt-2 border-t border-amber-200/50 min-h-[44px] justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="font-sans-medium text-amber-700 text-center text-xs">+ {lowStockItems.length - 3} more items need restocking</Text>
                        </Pressable>
                    )}
                    {lowStockItems.length <= 3 && (
                        <Pressable onPress={() => { Vibration.vibrate(10); router.push('/(app)/products-services' as never); }} className="mt-2 pt-2 border-t border-amber-200/50 min-h-[44px] justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="font-sans-medium text-amber-700 text-center text-xs">View all products</Text>
                        </Pressable>
                    )}
                </View>
            )}

            {unpaidInvoices.length > 0 && (
                <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-3">
                    <View className="flex-row items-center gap-2 mb-3">
                        <AlertCircle color="#ef4444" size={20} />
                        <Text className="font-sans-bold text-red-800 text-base">Overdue Payments</Text>
                    </View>
                    {unpaidInvoices.slice(0, 3).map((inv, idx) => (
                        <View key={inv.id} className={`flex-row justify-between items-center py-2 ${idx !== Math.min(unpaidInvoices.length, 3) - 1 ? 'border-b border-red-200/50' : ''}`}>
                            <Text className="font-sans-medium text-primary" numberOfLines={1}>{inv.partyName}</Text>
                            <Text className="font-sans-bold text-red-700">{formatCompactINR(inv.totalAmountPaise || 0)}</Text>
                        </View>
                    ))}
                    {unpaidInvoices.length > 3 && (
                        <Pressable onPress={() => { Vibration.vibrate(10); router.push('/(app)/sales' as never); }} className="mt-2 pt-2 border-t border-red-200/50 min-h-[44px] justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="font-sans-medium text-red-700 text-center text-xs">+ {unpaidInvoices.length - 3} more overdue invoices</Text>
                        </Pressable>
                    )}
                    {unpaidInvoices.length <= 3 && (
                        <Pressable onPress={() => router.push('/(app)/sales' as never)} className="mt-2 pt-2 border-t border-red-200/50 min-h-[44px] justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="font-sans-medium text-red-700 text-center text-xs">View all invoices</Text>
                        </Pressable>
                    )}
                </View>
            )}
            
            {lowStockItems.length === 0 && unpaidInvoices.length === 0 && (
                <View className="bg-white border border-border rounded-xl p-4 items-center justify-center">
                    <Text className="font-sans-medium text-muted-foreground">All caught up! 🎉</Text>
                </View>
            )}
        </View>
    );
}
