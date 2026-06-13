import { Pressable, View, Text } from "react-native";
import { ArrowUpRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { formatCompactINR } from "@/utils/money";

interface GstLiabilityWidgetProps {
    estimatedLiability: number;
}

export default function GstLiabilityWidget({ estimatedLiability }: GstLiabilityWidgetProps) {
    const router = useRouter();

    return (
        <Pressable 
            onPress={() => router.push('/(app)/gst-returns' as never)} 
            className="bg-white rounded-2xl p-4 mb-6 border border-border shadow-sm flex-row items-center justify-between min-h-[44px]"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
            <View>
                <Text className="font-sans-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">Est. GST Liability</Text>
                <Text className={`font-sans-bold text-2xl ${estimatedLiability > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {estimatedLiability > 0 ? `Payable ${formatCompactINR(estimatedLiability)}` : `Refund ${formatCompactINR(Math.abs(estimatedLiability))}`}
                </Text>
            </View>
            <View className="h-10 w-10 bg-primary/10 rounded-full items-center justify-center">
                <ArrowUpRight color="#208AEF" size={20} />
            </View>
        </Pressable>
    );
}
