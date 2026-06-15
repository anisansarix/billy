import { useRouter } from "expo-router";
import { ArrowLeft, Building2, ChevronRight, LogOut, Receipt, User, Users, ShieldCheck } from "lucide-react-native";
import { Pressable, ScrollView, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../../../constants/images";
import "../../../../global.css";

const SettingItem = ({ icon: Icon, title, subtitle, isDestructive = false, onPress, isLast = false }: { icon: React.ElementType, title: string, subtitle?: string, isDestructive?: boolean, onPress?: () => void, isLast?: boolean }) => (
    <Pressable onPress={onPress} className={`flex-row items-center p-4 bg-white ${!isLast ? 'border-b border-black/5' : ''}`}>
        <View className={`p-2 rounded-xl ${isDestructive ? 'bg-red-50' : 'bg-primary/5'} mr-4`}>
            <Icon color={isDestructive ? '#dc2626' : '#208AEF'} size={24} />
        </View>
        <View className="flex-1">
            <Text className={`font-sans-bold text-base ${isDestructive ? 'text-red-600' : 'text-primary'}`}>{title}</Text>
            {subtitle && <Text className="font-sans-medium text-xs text-muted-foreground mt-0.5">{subtitle}</Text>}
        </View>
        {!isDestructive && <ChevronRight color="#9ca3af" size={20} />}
    </Pressable>
);

export default function SettingsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center p-5 bg-white shadow-sm z-10">
                <Pressable onPress={() => router.back()} className="mr-4">
                    <ArrowLeft color="#081126" size={24} />
                </Pressable>
                <Text className="text-2xl font-sans-bold text-primary">Settings</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}>
                
                {/* Profile Block */}
                <View className="px-5 mb-6">
                    <View className="bg-white rounded-2xl p-5 border border-border shadow-sm flex-row items-center">
                        <Image source={images.avatar} className="w-16 h-16 rounded-full mr-4 border border-primary/10" />
                        <View className="flex-1">
                            <Text className="font-sans-bold text-lg text-primary">Axanees</Text>
                            <Text className="font-sans-medium text-sm text-muted-foreground">Owner • +91 9876543210</Text>
                            <View className="flex-row items-center mt-2">
                                <ShieldCheck color="#16a34a" size={14} />
                                <Text className="font-sans-medium text-xs text-green-600 ml-1">Account Verified</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Account Section */}
                <View className="mb-6 px-5">
                    <Text className="font-sans-bold text-xs text-muted-foreground uppercase mb-2 tracking-wider ml-2">Account & Business</Text>
                    <View className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                        <SettingItem icon={User} title="Personal Profile" subtitle="Update your name, phone, password" />
                        <SettingItem 
                            icon={Building2} 
                            title="Business Details" 
                            subtitle="GSTIN, Address, Bank Accounts" 
                            isLast 
                            onPress={() => router.push('/(app)/(settings)/business-profile')}
                        />
                    </View>
                </View>

                {/* Preferences Section */}
                <View className="mb-6 px-5">
                    <Text className="font-sans-bold text-xs text-muted-foreground uppercase mb-2 tracking-wider ml-2">Preferences</Text>
                    <View className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                        <SettingItem 
                            icon={Receipt} 
                            title="SalesInvoice Customization" 
                            subtitle="Prefixes, Terms & Conditions, Logo" 
                            onPress={() => router.push('/(app)/(settings)/invoice-settings')}
                        />
                        <SettingItem icon={Users} title="User Management" subtitle="Manage staff roles and permissions" isLast />
                    </View>
                </View>

                {/* Danger Zone */}
                <View className="mb-8 px-5">
                    <Text className="font-sans-bold text-xs text-muted-foreground uppercase mb-2 tracking-wider ml-2">Session</Text>
                    <View className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                        <SettingItem 
                            icon={LogOut} 
                            title="Log Out" 
                            isDestructive 
                            isLast
                            onPress={() => {
                                router.replace("/onboarding");
                            }} 
                        />
                    </View>
                </View>
                
                <View className="items-center mt-4 mb-8">
                    <Text className="font-sans-medium text-xs text-muted-foreground mb-2">Billy App Version 1.0.1</Text>
                    <Text className="font-sans-medium text-xs text-muted-foreground text-center leading-relaxed">
                        Copyright © 2026{"\n"}
                        Billy - Omnity Industries Software{"\n"}
                        All rights reserved.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
