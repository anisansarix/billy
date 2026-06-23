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
            className="bg-white rounded-2xl p-4 mb-6 border border-border shadow-sm flex-row items-center justify-between min-h-[44px]"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
            <View className="flex-1 mr-4">
                <Text className="font-sans-medium text-xs text-muted-foreground uppercase tracking-wider mb-2">Est. GST Liability</Text>
                <View className="mb-2">
                    <Text className="font-sans-medium text-xs text-muted-foreground">Payable (Output)</Text>
                    <Text className="font-sans-bold text-lg text-red-600">{formatCompactINR(estimatedLiability.outputGST)}</Text>
                </View>
                <View>
                    <Text className="font-sans-medium text-xs text-muted-foreground">Refund (Input)</Text>
                    <Text className="font-sans-bold text-lg text-green-600">{formatCompactINR(estimatedLiability.inputGST)}</Text>
                </View>
            </View>
            <View className="items-end">
                <View className="h-10 w-10 bg-primary/10 rounded-full items-center justify-center mb-3">
                    <ArrowUpRight color="#208AEF" size={20} />
                </View>
                <View className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 items-end">
                    <Text className="font-sans-medium text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Net</Text>
                    <Text className={`font-sans-bold text-sm ${estimatedLiability.net > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCompactINR(Math.abs(estimatedLiability.net))}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}
