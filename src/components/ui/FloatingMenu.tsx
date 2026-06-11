import { useEffect, useState } from "react";
import {
    Modal,
    Pressable,
    Text,
    View,
} from "react-native";

import { BlurView } from "expo-blur";

import { useRouter, usePathname } from "expo-router";
import AnimatedModal from "@/components/ui/AnimatedModal";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

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
        label: "Sales | Invoices",
        icon: ReceiptText,
        href: "/(app)/sales",
    },
    {
        label: "Expenses | Purchases",
        icon: Wallet,
        href: "/(app)/expenses-purchases",
    },
    {
        label: "Customers | Vendors",
        icon: Users,
        href: "/(app)/customers-vendors",
    },
    {
        label: "Products | Services",
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
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);

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

    useEffect(() => {
        if (visible) {
            scale.value = withTiming(1, {
                duration: 250,
            });

            opacity.value = withTiming(1, {
                duration: 250,
            });
        } else {
            scale.value = withTiming(0.8, {
                duration: 180,
            });

            opacity.value = withTiming(0, {
                duration: 180,
            });
        }
    }, [visible, opacity, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            {
                scale: scale.value,
            },
        ],
    }));

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
        >
            <Pressable
                className="flex-1"
                onPress={onClose}
            >
                <BlurView
                    intensity={12}
                    tint="light"
                    className="absolute inset-0"
                />

                <View className="flex-1 justify-end items-end px-5 pb-24">
                    <Animated.View
                        style={[
                            animatedStyle,
                            {
                                width: 300,
                                borderRadius: 32,
                                backgroundColor: "white",
                                padding: 20,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 15 },
                                shadowOpacity: 0.2,
                                shadowRadius: 30,
                                elevation: 25,
                                borderWidth: 1,
                                borderColor: "rgba(0,0,0,0.05)",
                            },
                        ]}
                    >
                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Pressable
                                    key={item.label}
                                    className="flex-row items-center py-4"
                                    onPress={() => {
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
                            onPress={() => setFyModalVisible(true)}
                        >
                            <ArrowDown size={18} color="#081126" />

                            <Text className="ml-2 text-sm font-sans-medium text-primary">
                                {selectedFy}
                            </Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </Pressable>

            <AnimatedModal visible={fyModalVisible} onClose={() => setFyModalVisible(false)} placement="center">
                <View className="bg-white rounded-3xl w-3/4 p-4 shadow-xl">
                    <Text className="font-sans-bold text-lg text-primary mb-4 text-center">Select Financial Year</Text>
                    {fyOptions.map(fy => (
                        <Pressable 
                            key={fy} 
                            className="py-4 border-b border-border" 
                            onPress={() => { setSelectedFy(fy); setFyModalVisible(false); }}
                        >
                            <Text className={`text-center text-base ${selectedFy === fy ? 'text-primary font-sans-bold' : 'text-muted-foreground font-sans-medium'}`}>
                                {fy}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </AnimatedModal>
        </Modal>
    );
}
