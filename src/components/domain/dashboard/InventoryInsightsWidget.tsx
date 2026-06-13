import { View, Text } from "react-native";
import { InventoryItem } from "@/types/entities";

interface InventoryInsightsWidgetProps {
    inventoryStats: {
        topMovers: InventoryItem[];
        deadStock: InventoryItem[];
    };
}

export default function InventoryInsightsWidget({ inventoryStats }: InventoryInsightsWidgetProps) {
    return (
        <View className="mt-6 flex-row gap-4 mb-4">
            {/* Top Movers */}
            <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-border">
                <Text className="font-sans-bold text-sm text-primary mb-3">Top Movers</Text>
                {inventoryStats.topMovers.map((item, idx) => (
                <View key={`top-${idx}`} className={`flex-row justify-between py-2 ${idx !== inventoryStats.topMovers.length - 1 ? 'border-b border-border' : ''}`}>
                    <Text className="font-sans-medium text-xs text-primary flex-1 mr-2" numberOfLines={1}>{item.name}</Text>
                    <Text className="font-sans-bold text-xs text-green-600">{(item as InventoryItem & { soldQuantity?: number }).soldQuantity} sold</Text>
                </View>
                ))}
            </View>

            {/* Dead Stock */}
            <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-border">
                <Text className="font-sans-bold text-sm text-primary mb-3">Dead Stock</Text>
                {inventoryStats.deadStock.map((item, idx) => (
                <View key={`dead-${idx}`} className={`flex-row justify-between py-2 ${idx !== inventoryStats.deadStock.length - 1 ? 'border-b border-border' : ''}`}>
                    <Text className="font-sans-medium text-xs text-primary flex-1 mr-2" numberOfLines={1}>{item.name}</Text>
                    <Text className="font-sans-bold text-xs text-red-600">{item.stock} left</Text>
                </View>
                ))}
            </View>
        </View>
    );
}
