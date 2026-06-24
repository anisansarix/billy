import { useState } from "react";
import {
    Pressable,
    Text,
    View,
} from "react-native";
import * as Haptics from 'expo-haptics';

import { useRouter, usePathname } from "expo-router";
import AnimatedModal from "@/components/ui/AnimatedModal";

import {
    Boxes,
    FileBarChart,
    LayoutDashboard,
    ReceiptText,
    Settings,
    Users,
    Wallet,
    ArrowDown,
} from "lucide-react-native";

type Props = {
    visible: boolean;
    onClose: () => void;
    onScrollToTop?: () => void;
};

const menuItems = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/(app)/dashboard",
    },
    {
        label: "Sales Documents",
        icon: ReceiptText,
        href: "/(app)/sales",
    },
    {
        label: "Purchases & Bills",
        icon: Wallet,
        href: "/(app)/expenses-purchases",
    },
    {
        label: "Customers & Vendors",
        icon: Users,
        href: "/(app)/customers-vendors",
    },
    {
        label: "Products & Services",
        icon: Boxes,
        href: "/(app)/products-services",
    },
    {
        label: "Payments",
        icon: Wallet,
        href: "/(app)/payment",
    },
    {
        label: "Reports",
        icon: FileBarChart,
        href: "/(app)/reports",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/(app)/settings",
    },
];

export default function FloatingMenu({
    visible,
    onClose,
    onScrollToTop
}: Props) {
    const router = useRouter();
    const pathname = usePathname();

    const [fyModalVisible, setFyModalVisible] = useState(false);
    const [selectedFy, setSelectedFy] = useState("F.Y. 2026-2027");
    
    const fyOptions = [
        "F.Y. 2026-2027",
        "F.Y. 2025-2026",
        "F.Y. 2024-2025",
        "F.Y. 2023-2024",
        "F.Y. 2022-2023",
        "F.Y. 2021-2022",
    ];

    return (
        <>
            <AnimatedModal visible={visible} onClose={onClose} placement="bottom">
                <View className="w-full items-end px-5 pb-24">
                    <View className="w-[300px] rounded-[32px] bg-white p-5 shadow-2xl shadow-black/20 border border-border">
                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Pressable
                                    key={item.label}
                                    className="flex-row items-center py-4"
                                    accessibilityRole="menuitem"
                                    accessibilityLabel={`Navigate to ${item.label}`}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        onClose();
                                        if (item.label === "Dashboard" && (pathname === '/(app)/dashboard' || pathname === '/dashboard' || pathname === '/')) {
                                            if (onScrollToTop) {
                                                onScrollToTop();
                                            }
                                        } else {
                                            router.push(item.href as never);
                                        }
                                    }}
                                >
                                    <Icon
                                        color="#081126"
                                        size={22}
                                        strokeWidth={2}
                                    />

                                    <Text className="ml-4 text-base font-sans-medium text-primary">
                                        {item.label}
                                    </Text>
                                </Pressable>
                            );
                        })}

                        <Pressable 
                            className="mt-2 flex-row items-center justify-center rounded-3xl border border-primary min-h-[44px] py-3"
                            onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setFyModalVisible(true);
                            }}
                            accessibilityRole="button"
                            accessibilityLabel={`Select Financial Year, currently ${selectedFy}`}
                        >
                            <ArrowDown size={18} color="#081126" />

                            <Text className="ml-2 text-sm font-sans-medium text-primary">
                                {selectedFy}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </AnimatedModal>

            <AnimatedModal visible={fyModalVisible} onClose={() => setFyModalVisible(false)} placement="center">
                <View className="bg-white rounded-3xl w-3/4 p-4 shadow-xl border border-border">
                    <Text className="font-sans-bold text-lg text-primary mb-4 text-center">Select Financial Year</Text>
                    {fyOptions.map((fy, index) => (
                        <Pressable 
                            key={fy} 
                            className={`py-4 ${index !== fyOptions.length - 1 ? 'border-b border-border' : ''}`}
                            onPress={() => { setSelectedFy(fy); setFyModalVisible(false); }}
                        >
                            <Text className={`text-center text-base ${selectedFy === fy ? 'text-primary font-sans-bold' : 'text-muted-foreground font-sans-medium'}`}>
                                {fy}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </AnimatedModal>
        </>
    );
}
