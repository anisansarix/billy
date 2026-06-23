import { Pressable, View, Text, Vibration } from "react-native";
import { useRouter } from "expo-router";
import { Receipt, Boxes, FileText, Truck } from "lucide-react-native";

const QUICK_ACTIONS = [
    { label: "Sales Invoice", icon: Receipt, route: "/(app)/sales" },
    { label: "Products", icon: Boxes, route: "/(app)/products-services" },
    { label: "GST", icon: FileText, route: "/(app)/gst-returns" },
    { label: "E-Way", icon: Truck, route: "/(app)/eway-bills" },
];

export default function QuickActionsWidget() {
    const router = useRouter();

    return (
        <View className="flex-row justify-between mb-6">
            {QUICK_ACTIONS.map((action, i) => (
                <Pressable 
                    key={i} 
                    accessibilityRole="button"
                    accessibilityLabel={`Go to ${action.label}`}
                    onPress={() => { Vibration.vibrate(10); router.push(action.route as never); }} 
                    className="items-center"
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                    <View className="bg-white size-14 rounded-2xl items-center justify-center shadow-sm border border-border mb-2">
                        <action.icon color="#081126" size={24} />
                    </View>
                    <Text className="font-sans-medium text-xs text-primary">{action.label}</Text>
                </Pressable>
            ))}
        </View>
    );
}
