import { useRouter } from "expo-router";
import { ArrowLeft, Settings2 } from "lucide-react-native";
import { Pressable, Text, View, SafeAreaView } from "react-native";
import "../../../../global.css";

export default function InvoiceSettingsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-slate-50">
            <View className="flex-row items-center p-5 bg-white shadow-sm z-10">
                <Pressable onPress={() => router.back()} className="mr-4 p-2 min-h-[44px] min-w-[44px] items-center justify-center">
                    <ArrowLeft color="#081126" size={24} />
                </Pressable>
                <Text className="text-2xl font-sans-bold text-primary">Invoice Settings</Text>
            </View>

            <View className="flex-1 items-center justify-center px-5">
                <View className="bg-primary/5 p-4 rounded-full mb-4">
                    <Settings2 color="#208AEF" size={48} />
                </View>
                <Text className="font-sans-bold text-xl text-primary mb-2 text-center">Customization Coming Soon</Text>
                <Text className="font-sans-medium text-sm text-muted-foreground text-center">
                    Soon you'll be able to customize your document prefixes, default terms and conditions, and upload your company logo for PDFs.
                </Text>
            </View>
        </SafeAreaView>
    );
}
