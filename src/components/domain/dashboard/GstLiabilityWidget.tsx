import { Pressable, View, Text } from "react-native";
import { ArrowUpRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { formatCompactINR } from "@/utils/money";

interface GstLiabilityWidgetProps {
    estimatedLiability: { outputGST: number, inputGST: number, net: number };
}

export default function GstLiabilityWidget({ estimatedLiability }: GstLiabilityWidgetProps) {
    const router = useRouter();

    return (
        <Pressable 
            onPress={() => router.push('/(app)/gst-returns' as never)} 
            className="bg-white rounded-2xl p-5 mb-6 border border-border shadow-sm"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                    <View className="h-8 w-8 bg-primary/10 rounded-full items-center justify-center mr-3">
                        <ArrowUpRight color="#208AEF" size={16} />
                    </View>
                    <Text className="font-sans-bold text-base text-primary">Est. GST Liability</Text>
                </View>
                <Text className={`font-sans-bold text-xl ${estimatedLiability.net > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCompactINR(Math.abs(estimatedLiability.net))}
                </Text>
            </View>

            <View className="h-[1px] w-full bg-border mb-4" />

            <View className="flex-row justify-between">
                <View>
                    <Text className="font-sans-medium text-xs text-muted-foreground mb-1">Payable (Output)</Text>
                    <Text className="font-sans-bold text-sm text-primary">{formatCompactINR(estimatedLiability.outputGST)}</Text>
                </View>
                <View className="items-end">
                    <Text className="font-sans-medium text-xs text-muted-foreground mb-1">Refund (Input)</Text>
                    <Text className="font-sans-bold text-sm text-primary">{formatCompactINR(estimatedLiability.inputGST)}</Text>
                </View>
            </View>
        </Pressable>
    );
}
