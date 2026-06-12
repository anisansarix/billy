import { Text, View } from "react-native";
import "../../../global.css";

import { formatINR } from "@/utils/money";

type Props = {
    title: string;
    amountPaise: number;
    gstAmountPaise: number;
};

export default function StatCard({ title, amountPaise, gstAmountPaise }: Props) {

    return (
        <View 
            className="flex-1 rounded-2xl bg-white p-4 shadow-sm border border-white/50" 
            style={{ elevation: 2 }}
            accessible={true}
            accessibilityRole="summary"
            accessibilityLabel={`${title}. Amount is ${amountPaise / 100} rupees plus ${gstAmountPaise / 100} rupees GST.`}
        >
            <Text className="text-base font-sans-medium text-primary mb-2">
                {title}
            </Text>
            <Text 
                className="text-[22px] font-sans-bold text-primary mb-1" 
                numberOfLines={1} 
                adjustsFontSizeToFit
            >
                {formatINR(amountPaise)}
            </Text>
            <Text className="text-sm font-sans-medium text-muted-foreground">
                +GST {formatINR(gstAmountPaise)}
            </Text>
        </View>
    );
}
