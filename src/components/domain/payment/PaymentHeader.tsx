import { View, Text, TextInput } from "react-native";
import { Search } from "lucide-react-native";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { formatINR } from "@/utils/money";

interface PaymentHeaderProps {
    tab: "in" | "out";
    setTab: (t: "in" | "out") => void;
    startTransition: (cb: () => void) => void;
    totalMoneyIn: number;
    totalMoneyOut: number;
    search: string;
    setSearch: (s: string) => void;
}

export default function PaymentHeader({ tab, setTab, startTransition, totalMoneyIn, totalMoneyOut, search, setSearch }: PaymentHeaderProps) {
    return (
        <>
            {/* Tabs */}
            <View className="bg-white pb-1 pt-3">
                <SegmentedTabs 
                    tabs={["Money In", "Money Out"]} 
                    activeTab={tab === "in" ? "Money In" : "Money Out"} 
                    onTabChange={(t) => startTransition(() => setTab(t === "Money In" ? "in" : "out"))} 
                />
            </View>

            {/* Summary Card */}
            <View className="px-5 mt-4 mb-2">
                <View className="bg-white rounded-2xl p-4 flex-row border border-border shadow-sm">
                    <View className="flex-1 border-r border-border pl-2">
                        <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Total Received</Text>
                        <Text className="font-sans-bold text-lg text-green-600">{formatINR(totalMoneyIn)}</Text>
                    </View>
                    <View className="flex-1 pl-4">
                        <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Total Paid</Text>
                        <Text className="font-sans-bold text-lg text-red-500">{formatINR(totalMoneyOut)}</Text>
                    </View>
                </View>
            </View>

            {/* Search */}
            <View className="px-5 mt-2 mb-4">
                <View className="flex-row items-center bg-white px-4 h-12 rounded-xl border border-border">
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        className="flex-1 ml-3 h-full font-sans-regular text-base text-primary"
                        placeholder={`Search ${tab === 'in' ? 'customers' : 'vendors'}...`}
                        placeholderTextColor="#64748b"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>
        </>
    );
}
