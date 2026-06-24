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
                <View className="bg-amber-50 border border-amber-100 shadow-sm rounded-2xl p-5 mb-4">
                    <View className="flex-row items-center gap-3 mb-4">
                        <View className="h-8 w-8 bg-amber-100 rounded-full items-center justify-center">
                            <AlertCircle color="#d97706" size={16} />
                        </View>
                        <Text className="font-sans-bold text-primary text-base">Low Stock Alert</Text>
                    </View>
                    {lowStockItems.slice(0, 3).map((item, idx) => (
                        <View key={item.id} className={`flex-row justify-between items-center py-2 ${idx !== Math.min(lowStockItems.length, 3) - 1 ? 'border-b border-border' : ''}`}>
                            <Text className="font-sans-medium text-muted-foreground flex-1 mr-2" numberOfLines={1}>{item.name}</Text>
                            <Text className="font-sans-bold text-amber-600">{item.stock || 0} left</Text>
                        </View>
                    ))}
                    {lowStockItems.length > 3 && (
                        <Pressable onPress={() => { Vibration.vibrate(10); router.push({ pathname: '/(app)/products-services', params: { filter: 'LOW_STOCK' } } as never); }} className="mt-3 pt-3 border-t border-border min-h-[44px] justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="font-sans-medium text-primary text-center text-xs">+ {lowStockItems.length - 3} more items need restocking</Text>
                        </Pressable>
                    )}
                    {lowStockItems.length <= 3 && (
                        <Pressable onPress={() => { Vibration.vibrate(10); router.push({ pathname: '/(app)/products-services', params: { filter: 'LOW_STOCK' } } as never); }} className="mt-3 pt-3 border-t border-border min-h-[44px] justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="font-sans-medium text-primary text-center text-xs">View all products</Text>
                        </Pressable>
                    )}
                </View>
            )}

            {unpaidInvoices.length > 0 && (
                <View className="bg-red-50 border border-red-100 shadow-sm rounded-2xl p-5 mb-4">
                    <View className="flex-row items-center gap-3 mb-4">
                        <View className="h-8 w-8 bg-red-100 rounded-full items-center justify-center">
                            <AlertCircle color="#ef4444" size={16} />
                        </View>
                        <Text className="font-sans-bold text-primary text-base">Overdue Payments</Text>
                    </View>
                    {unpaidInvoices.slice(0, 3).map((inv, idx) => (
                        <View key={inv.id} className={`flex-row justify-between items-center py-2 ${idx !== Math.min(unpaidInvoices.length, 3) - 1 ? 'border-b border-border' : ''}`}>
                            <Text className="font-sans-medium text-muted-foreground" numberOfLines={1}>{inv.partyName}</Text>
                            <Text className="font-sans-bold text-red-600">{formatCompactINR(inv.totalAmountPaise || 0)}</Text>
                        </View>
                    ))}
                    {unpaidInvoices.length > 3 && (
                        <Pressable onPress={() => { Vibration.vibrate(10); router.push({ pathname: '/(app)/sales', params: { filter: 'OVERDUE' } } as never); }} className="mt-3 pt-3 border-t border-border min-h-[44px] justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="font-sans-medium text-primary text-center text-xs">+ {unpaidInvoices.length - 3} more overdue invoices</Text>
                        </Pressable>
                    )}
                    {unpaidInvoices.length <= 3 && (
                        <Pressable onPress={() => { Vibration.vibrate(10); router.push({ pathname: '/(app)/sales', params: { filter: 'OVERDUE' } } as never); }} className="mt-3 pt-3 border-t border-border min-h-[44px] justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                            <Text className="font-sans-medium text-primary text-center text-xs">View all invoices</Text>
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
