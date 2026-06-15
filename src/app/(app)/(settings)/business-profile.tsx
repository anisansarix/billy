import { useRouter } from "expo-router";
import { ArrowLeft, Save, Building2, MapPin, Contact, FileText } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/store";
import { Business, GSTType } from "@/types/entities";
import "../../../../global.css";

const FormField = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }: any) => (
    <View className="mb-4">
        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">{label}</Text>
        <TextInput 
            className="bg-slate-50 border border-border rounded-lg px-4 py-3 font-sans-medium text-primary text-base"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            keyboardType={keyboardType}
        />
    </View>
);

export default function BusinessProfileScreen() {
    const router = useRouter();
    const { currentBusiness, setCurrentBusiness } = useAppStore();

    // Local form state
    const [formData, setFormData] = useState<Partial<Business>>(currentBusiness || {
        legalName: "",
        tradeName: "",
        gstin: "",
        pan: "",
        gstType: GSTType.REGULAR,
        address: { line1: "", city: "", state: "", stateCode: "", pincode: "", country: "India" },
        phone: "",
        email: ""
    });

    const updateAddress = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address!, [field]: value }
        }));
    };

    const handleSave = () => {
        if (!formData.legalName) {
            Alert.alert("Validation Error", "Legal Name is required.");
            return;
        }

        if (formData.gstin?.trim()) {
            const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
            if (!gstinRegex.test(formData.gstin.trim().toUpperCase())) {
                Alert.alert("Invalid GSTIN", "Please enter a valid 15-character GSTIN.");
                return;
            }
        }

        // Merge with existing business to keep un-edited fields like bankDetails
        const updatedBusiness = {
            ...currentBusiness,
            ...formData,
        } as Business;

        setCurrentBusiness(updatedBusiness);
        Alert.alert("Success", "Business Profile updated successfully.", [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
            <SafeAreaView style={{ flex: 1 }} className="bg-slate-50">
                <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10">
                    <View className="flex-row items-center">
                        <Pressable onPress={() => router.back()} className="mr-4 p-2 min-h-[44px] min-w-[44px] items-center justify-center">
                            <ArrowLeft color="#081126" size={24} />
                        </Pressable>
                        <Text className="text-2xl font-sans-bold text-primary">Business Profile</Text>
                    </View>
                    <Pressable onPress={handleSave} className="flex-row items-center bg-primary px-4 py-2 min-h-[44px] rounded-full">
                        <Save color="white" size={16} className="mr-2" />
                        <Text className="font-sans-bold text-white">Save</Text>
                    </Pressable>
                </View>

                <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false} contentContainerClassName="pb-32">
                    
                    {/* Basic Info */}
                    <View className="bg-white rounded-2xl p-5 mb-4 border border-border shadow-sm">
                        <View className="flex-row items-center mb-4 border-b border-slate-100 pb-3">
                            <Building2 color="#64748b" size={20} className="mr-2" />
                            <Text className="font-sans-bold text-lg text-primary">Basic Information</Text>
                        </View>
                        
                        <FormField 
                            label="Legal Name *" 
                            value={formData.legalName} 
                            onChangeText={(t: string) => setFormData({...formData, legalName: t})} 
                            placeholder="Registered Company Name" 
                        />
                        <FormField 
                            label="Trade Name (Optional)" 
                            value={formData.tradeName} 
                            onChangeText={(t: string) => setFormData({...formData, tradeName: t})} 
                            placeholder="Display Name" 
                        />
                    </View>

                    {/* Compliance */}
                    <View className="bg-white rounded-2xl p-5 mb-4 border border-border shadow-sm">
                        <View className="flex-row items-center mb-4 border-b border-slate-100 pb-3">
                            <FileText color="#64748b" size={20} className="mr-2" />
                            <Text className="font-sans-bold text-lg text-primary">Compliance</Text>
                        </View>
                        
                        <FormField 
                            label="GSTIN" 
                            value={formData.gstin} 
                            onChangeText={(t: string) => setFormData({...formData, gstin: t.toUpperCase()})} 
                            placeholder="27ABCDE1234F1Z5" 
                        />
                        <FormField 
                            label="PAN" 
                            value={formData.pan} 
                            onChangeText={(t: string) => setFormData({...formData, pan: t.toUpperCase()})} 
                            placeholder="ABCDE1234F" 
                        />

                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2 mt-2">GST Registration Type</Text>
                        <View className="flex-row flex-wrap gap-2 mb-2">
                            {Object.values(GSTType).map((type) => (
                                <Pressable 
                                    key={type}
                                    onPress={() => setFormData({...formData, gstType: type as GSTType})}
                                    className={`px-4 py-2 rounded-full border ${formData.gstType === type ? 'bg-primary border-primary' : 'bg-slate-50 border-border'}`}
                                >
                                    <Text className={`font-sans-medium text-sm ${formData.gstType === type ? 'text-white' : 'text-primary'}`}>{type}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Contact Info */}
                    <View className="bg-white rounded-2xl p-5 mb-4 border border-border shadow-sm">
                        <View className="flex-row items-center mb-4 border-b border-slate-100 pb-3">
                            <Contact color="#64748b" size={20} className="mr-2" />
                            <Text className="font-sans-bold text-lg text-primary">Contact Details</Text>
                        </View>
                        
                        <FormField 
                            label="Phone Number" 
                            value={formData.phone} 
                            onChangeText={(t: string) => setFormData({...formData, phone: t})} 
                            placeholder="+91 9876543210"
                            keyboardType="phone-pad"
                        />
                        <FormField 
                            label="Email Address" 
                            value={formData.email} 
                            onChangeText={(t: string) => setFormData({...formData, email: t})} 
                            placeholder="contact@company.com"
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Address */}
                    <View className="bg-white rounded-2xl p-5 mb-4 border border-border shadow-sm">
                        <View className="flex-row items-center mb-4 border-b border-slate-100 pb-3">
                            <MapPin color="#64748b" size={20} className="mr-2" />
                            <Text className="font-sans-bold text-lg text-primary">Registered Address</Text>
                        </View>
                        
                        <FormField 
                            label="Address Line 1" 
                            value={formData.address?.line1} 
                            onChangeText={(t: string) => updateAddress('line1', t)} 
                            placeholder="Flat, Building, Street" 
                        />
                        <View className="flex-row gap-4">
                            <View className="flex-1">
                                <FormField 
                                    label="City" 
                                    value={formData.address?.city} 
                                    onChangeText={(t: string) => updateAddress('city', t)} 
                                    placeholder="City" 
                                />
                            </View>
                            <View className="flex-1">
                                <FormField 
                                    label="Pincode" 
                                    value={formData.address?.pincode} 
                                    onChangeText={(t: string) => updateAddress('pincode', t)} 
                                    placeholder="123456"
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>
                        <View className="flex-row gap-4">
                            <View className="flex-1">
                                <FormField 
                                    label="State" 
                                    value={formData.address?.state} 
                                    onChangeText={(t: string) => updateAddress('state', t)} 
                                    placeholder="State" 
                                />
                            </View>
                            <View className="w-24">
                                <FormField 
                                    label="Code" 
                                    value={formData.address?.stateCode} 
                                    onChangeText={(t: string) => updateAddress('stateCode', t)} 
                                    placeholder="27"
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
