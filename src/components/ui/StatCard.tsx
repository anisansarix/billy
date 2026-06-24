import { Text, View } from "react-native";
import { Wallet } from "lucide-react-native";
import "../../../global.css";

import { formatCompactINR } from "@/utils/money";

type Props = {
    title: string;
    amountPaise: number;
    gstAmountPaise: number;
    icon?: React.ReactNode;
    iconBgClass?: string;
};

export default function StatCard({ title, amountPaise, gstAmountPaise, icon, iconBgClass }: Props) {
    return (
        <View 
            className="flex-1 rounded-2xl bg-white p-5 shadow-sm border border-border" 
            style={{ elevation: 2 }}
            accessible={true}
            accessibilityRole="summary"
            accessibilityLabel={`${title}. Amount is ${amountPaise / 100} rupees plus ${gstAmountPaise / 100} rupees GST.`}
        >
            <View className="flex-row items-center mb-4">
                <View className={`h-8 w-8 ${iconBgClass || 'bg-primary/10'} rounded-full items-center justify-center mr-3`}>
                    {icon ? icon : <Wallet color="#208AEF" size={16} />}
                </View>
                <Text className="text-sm font-sans-bold text-primary flex-1" numberOfLines={1}>
                    {title}
                </Text>
            </View>
            
            <View>
                <Text 
                    className="text-[22px] font-sans-bold text-primary mb-1" 
                    numberOfLines={1} 
                    adjustsFontSizeToFit
                >
                    {formatCompactINR(amountPaise)}
                </Text>
                {gstAmountPaise !== undefined && (
                    <Text className="text-xs font-sans-medium text-muted-foreground">
                        +GST {formatCompactINR(gstAmountPaise)}
                    </Text>
                )}
            </View>
        </View>
    );
}
