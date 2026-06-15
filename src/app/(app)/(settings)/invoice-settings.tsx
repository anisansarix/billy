import { useRouter } from "expo-router";
import { ArrowLeft, Save, FileText, LayoutTemplate } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View, KeyboardAvoidingView, Platform, Alert, Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/store";
import { useShallow } from 'zustand/react/shallow';
import "../../../../global.css";

const FormField = ({ label, value, onChangeText, placeholder, keyboardType = "default", maxLength, multiline = false, numberOfLines = 1, suffix }: any) => (
    <View className="mb-4">
        <Text className="font-sans-medium text-sm text-muted-foreground mb-1.5">{label}</Text>
        <View className={`bg-slate-50 border border-border rounded-xl px-4 ${multiline ? 'py-3' : 'h-12'} flex-row items-center focus:border-primary/50 focus:bg-white transition-colors`}>
            <TextInput
                className="flex-1 font-sans-medium text-base text-primary"
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                keyboardType={keyboardType}
                maxLength={maxLength}
                multiline={multiline}
                numberOfLines={numberOfLines}
                style={multiline ? { textAlignVertical: 'top' } : {}}
            />
            {suffix && <Text className="font-sans-medium text-sm text-muted-foreground ml-2">{suffix}</Text>}
        </View>
    </View>
);

export default function InvoiceSettingsScreen() {
    const router = useRouter();
    const { invoiceSettings, setInvoiceSettings } = useAppStore(useShallow(state => ({
        invoiceSettings: state.invoiceSettings,
        setInvoiceSettings: state.setInvoiceSettings
    })));

    const [formData, setFormData] = useState({
        invoicePrefix: invoiceSettings.invoicePrefix || 'INV',
        poPrefix: invoiceSettings.poPrefix || 'PO',
        cnPrefix: invoiceSettings.cnPrefix || 'CN',
        dcPrefix: invoiceSettings.dcPrefix || 'DC',
        defaultPaymentTermsDays: String(invoiceSettings.defaultPaymentTermsDays || 30),
        defaultTnC: invoiceSettings.defaultTnC || 'Goods once sold will not be taken back. Subject to Surat jurisdiction.'
    });

    const handleSave = () => {
        setInvoiceSettings({
            ...formData,
            defaultPaymentTermsDays: parseInt(formData.defaultPaymentTermsDays, 10) || 0
        });
        Alert.alert("Saved", "Settings updated", [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
            <SafeAreaView style={{ flex: 1 }} className="bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center p-4 bg-white shadow-sm z-10 border-b border-border">
                <Pressable onPress={() => { Vibration.vibrate(10); router.back(); }} className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
                    <ArrowLeft color="#081126" size={24} />
                </Pressable>
                <View className="ml-2 flex-1">
                    <Text className="text-lg font-sans-bold text-primary">Invoice Settings</Text>
                    <Text className="text-xs font-sans-medium text-muted-foreground">Configure invoice prefixes and notes</Text>
                </View>
                <Pressable onPress={handleSave} className="flex-row items-center bg-primary px-4 py-2 min-h-[44px] rounded-full">
                    <Save color="white" size={16} className="mr-2" />
                    <Text className="font-sans-bold text-white">Save</Text>
                </Pressable>
            </View>

                <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false} contentContainerClassName="pb-32">
                    <View className="bg-white rounded-2xl p-5 mb-4 border border-border shadow-sm">
                        <View className="flex-row items-center mb-4 border-b border-slate-100 pb-3">
                            <LayoutTemplate color="#64748b" size={20} className="mr-2" />
                            <Text className="font-sans-bold text-lg text-primary">Document Prefixes</Text>
                        </View>
                        
                        <FormField 
                            label="Invoice Number Prefix" 
                            value={formData.invoicePrefix} 
                            onChangeText={(t: string) => setFormData({...formData, invoicePrefix: t.toUpperCase()})} 
                            placeholder="INV" 
                            maxLength={6}
                        />
                        <FormField 
                            label="Purchase Order Prefix" 
                            value={formData.poPrefix} 
                            onChangeText={(t: string) => setFormData({...formData, poPrefix: t.toUpperCase()})} 
                            placeholder="PO" 
                            maxLength={6}
                        />
                        <FormField 
                            label="Credit Note Prefix" 
                            value={formData.cnPrefix} 
                            onChangeText={(t: string) => setFormData({...formData, cnPrefix: t.toUpperCase()})} 
                            placeholder="CN" 
                            maxLength={6}
                        />
                        <FormField 
                            label="Delivery Challan Prefix" 
                            value={formData.dcPrefix} 
                            onChangeText={(t: string) => setFormData({...formData, dcPrefix: t.toUpperCase()})} 
                            placeholder="DC" 
                            maxLength={6}
                        />
                    </View>

                    <View className="bg-white rounded-2xl p-5 mb-4 border border-border shadow-sm">
                        <View className="flex-row items-center mb-4 border-b border-slate-100 pb-3">
                            <FileText color="#64748b" size={20} className="mr-2" />
                            <Text className="font-sans-bold text-lg text-primary">Defaults & Terms</Text>
                        </View>
                        
                        <FormField 
                            label="Default Payment Terms" 
                            value={formData.defaultPaymentTermsDays} 
                            onChangeText={(t: string) => setFormData({...formData, defaultPaymentTermsDays: t})} 
                            placeholder="30" 
                            keyboardType="numeric"
                            suffix="days"
                        />
                        <FormField 
                            label="Default Terms & Conditions" 
                            value={formData.defaultTnC} 
                            onChangeText={(t: string) => setFormData({...formData, defaultTnC: t})} 
                            placeholder="Enter terms and conditions..." 
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
