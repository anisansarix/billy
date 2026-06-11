import { BlurView } from "expo-blur";
import { Text, View } from "react-native";
import "../../../global.css";

type AgingData = {
    current: number;
    days1_30: number;
    days31_60: number;
    days61_90: number;
    days90Plus: number;
};

type Props = {
    data: {
        title: string;
        currency: string;
        data: AgingData;
    }
};

export default function OutstandingList({ data }: Props) {
    const { title, currency, data: aging } = data;
    const total = aging.current + aging.days1_30 + aging.days31_60 + aging.days61_90 + aging.days90Plus;

    const getWidth = (val: number) => {
        if (total === 0) return 0;
        return (val / total) * 100;
    };

    const formatAmt = (val: number) => {
        return `${currency}${val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    };

    return (
        <View className="mb-6">
            <Text className="text-xl font-sans-medium text-primary mb-1">
                {title}
            </Text>
            <Text className="text-sm font-sans-medium text-primary mb-4">
                Total Receivables: {formatAmt(total)}
            </Text>

            {/* Segmented Progress Bar */}
            <View className="h-3 flex-row rounded-full overflow-hidden mb-6 bg-slate-200">
                {aging.current > 0 && <View style={{ width: `${getWidth(aging.current)}%` }} className="bg-emerald-500" />}
                {aging.days1_30 > 0 && <View style={{ width: `${getWidth(aging.days1_30)}%` }} className="bg-yellow-400" />}
                {aging.days31_60 > 0 && <View style={{ width: `${getWidth(aging.days31_60)}%` }} className="bg-orange-400" />}
                {aging.days61_90 > 0 && <View style={{ width: `${getWidth(aging.days61_90)}%` }} className="bg-orange-600" />}
                {aging.days90Plus > 0 && <View style={{ width: `${getWidth(aging.days90Plus)}%` }} className="bg-red-500" />}
            </View>

            {/* Grid of Glassmorphic Cards */}
            <View className="flex-row flex-wrap justify-between">
                <View className="w-[48%] mb-4 rounded-2xl overflow-hidden border border-white/40">
                    <BlurView intensity={40} tint="light" className="p-4 bg-white/30">
                        <View className="flex-row items-center mb-2">
                            <View className="size-3 rounded-full bg-emerald-500 mr-2" />
                            <Text className="font-sans-medium text-xs text-primary uppercase tracking-wide">Current</Text>
                        </View>
                        <Text className="font-sans-bold text-base text-primary">{formatAmt(aging.current)}</Text>
                    </BlurView>
                </View>
                
                <View className="w-[48%] mb-4 rounded-2xl overflow-hidden border border-white/40">
                    <BlurView intensity={40} tint="light" className="p-4 bg-white/30">
                        <View className="flex-row items-center mb-2">
                            <View className="size-3 rounded-full bg-yellow-400 mr-2" />
                            <Text className="font-sans-medium text-xs text-primary uppercase tracking-wide">1-30 Days</Text>
                        </View>
                        <Text className="font-sans-bold text-base text-primary">{formatAmt(aging.days1_30)}</Text>
                    </BlurView>
                </View>

                <View className="w-[48%] mb-4 rounded-2xl overflow-hidden border border-white/40">
                    <BlurView intensity={40} tint="light" className="p-4 bg-white/30">
                        <View className="flex-row items-center mb-2">
                            <View className="size-3 rounded-full bg-orange-400 mr-2" />
                            <Text className="font-sans-medium text-xs text-primary uppercase tracking-wide">31-60 Days</Text>
                        </View>
                        <Text className="font-sans-bold text-base text-primary">{formatAmt(aging.days31_60)}</Text>
                    </BlurView>
                </View>

                <View className="w-[48%] mb-4 rounded-2xl overflow-hidden border border-white/40">
                    <BlurView intensity={40} tint="light" className="p-4 bg-white/30">
                        <View className="flex-row items-center mb-2">
                            <View className="size-3 rounded-full bg-orange-600 mr-2" />
                            <Text className="font-sans-medium text-xs text-primary uppercase tracking-wide">61-90 Days</Text>
                        </View>
                        <Text className="font-sans-bold text-base text-primary">{formatAmt(aging.days61_90)}</Text>
                    </BlurView>
                </View>

                <View className="w-[48%] mb-4 rounded-2xl overflow-hidden border border-white/40">
                    <BlurView intensity={40} tint="light" className="p-4 bg-white/30">
                        <View className="flex-row items-center mb-2">
                            <View className="size-3 rounded-full bg-red-500 mr-2" />
                            <Text className="font-sans-medium text-xs text-primary uppercase tracking-wide">90+ Days</Text>
                        </View>
                        <Text className="font-sans-bold text-base text-primary">{formatAmt(aging.days90Plus)}</Text>
                    </BlurView>
                </View>
            </View>
        </View>
    );
}
