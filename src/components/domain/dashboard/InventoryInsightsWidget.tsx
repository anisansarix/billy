import { View, Text } from "react-native";
import { TrendingUp, PackageX } from "lucide-react-native";
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
            <View className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-border">
                <View className="flex-row items-center gap-2 mb-4">
                    <View className="h-7 w-7 bg-green-100 rounded-full items-center justify-center">
                        <TrendingUp color="#16a34a" size={14} />
                    </View>
                    <Text className="font-sans-bold text-sm text-primary">Top Movers</Text>
                </View>
                {inventoryStats.topMovers.map((item, idx) => (
                <View key={`top-${idx}`} className={`flex-row justify-between items-center py-2 ${idx !== inventoryStats.topMovers.length - 1 ? 'border-b border-border' : ''}`}>
                    <Text className="font-sans-medium text-xs text-muted-foreground flex-1 mr-2" numberOfLines={1}>{item.name}</Text>
                    <Text className="font-sans-bold text-xs text-green-600">{(item as InventoryItem & { soldQuantity?: number }).soldQuantity} sold</Text>
                </View>
                ))}
            </View>

            {/* Dead Stock */}
            <View className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-border">
                <View className="flex-row items-center gap-2 mb-4">
                    <View className="h-7 w-7 bg-red-100 rounded-full items-center justify-center">
                        <PackageX color="#ef4444" size={14} />
                    </View>
                    <Text className="font-sans-bold text-sm text-primary">Dead Stock</Text>
                </View>
                {inventoryStats.deadStock.map((item, idx) => (
                <View key={`dead-${idx}`} className={`flex-row justify-between items-center py-2 ${idx !== inventoryStats.deadStock.length - 1 ? 'border-b border-border' : ''}`}>
                    <Text className="font-sans-medium text-xs text-muted-foreground flex-1 mr-2" numberOfLines={1}>{item.name}</Text>
                    <Text className="font-sans-bold text-xs text-red-600">{item.stock} left</Text>
                </View>
                ))}
            </View>
        </View>
    );
}
