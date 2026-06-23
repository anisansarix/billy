import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Vibration, Alert } from 'react-native';
import { X, CheckCircle2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/store";
import { formatINR } from '@/utils/money';

export default function RecordPaymentScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ invoiceId: string, partyId: string, partyName: string, balanceDuePaise: string }>();
    const invoiceId = params.invoiceId || "";
    const partyId = params.partyId || "";
    const partyName = params.partyName || "";
    const balanceDuePaise = Number(params.balanceDuePaise) || 0;

    const recordInvoicePayment = useAppStore(state => state.recordInvoicePayment);
    const [amountStr, setAmountStr] = useState((balanceDuePaise / 100).toString());
    const [mode, setMode] = useState<'UPI' | 'Bank Transfer' | 'Cash' | 'NEFT' | 'RTGS' | 'Cheque'>('UPI');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSave = () => {
        Vibration.vibrate(10);
        const amountPaise = Math.round(parseFloat(amountStr || '0') * 100);
        if (amountPaise <= 0) return;
        if (amountPaise > balanceDuePaise) {
            Alert.alert("Validation Error", "Payment amount cannot exceed the balance due.");
            return;
        }

        recordInvoicePayment(invoiceId, {
            date,
            amountPaise,
            mode,
            type: 'in',
            partyId,
            partyName,
        });
        
        router.back();
    };

    const paymentModes = ['UPI', 'Bank Transfer', 'Cash', 'Cheque'] as const;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 flex-col">
                <View className="flex-row items-center mb-6 p-6 pb-2">
                    <Pressable 
                        onPress={() => { Vibration.vibrate(10); router.back(); }} 
                        className="p-2 -ml-2 mr-3"
                    >
                        <X color="#081126" size={24} />
                    </Pressable>
                    <View>
                        <Text className="font-sans-bold text-2xl text-primary">Record Payment</Text>
                        <Text className="font-sans-medium text-muted-foreground text-sm mt-1">From {partyName}</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">
                    <View className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
                        <Text className="font-sans-medium text-blue-800 mb-1">Balance Due</Text>
                        <Text className="font-sans-bold text-2xl text-blue-900">{formatINR(balanceDuePaise)}</Text>
                    </View>

                    <View className="mb-6">
                        <Text className="font-sans-medium text-sm text-primary mb-2">Payment Amount (₹)</Text>
                        <TextInput 
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-sans-bold text-xl text-primary"
                            keyboardType="numeric"
                            value={amountStr}
                            onChangeText={setAmountStr}
                            placeholder="0.00"
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="font-sans-medium text-sm text-primary mb-2">Payment Date</Text>
                        <TextInput 
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-sans-medium text-primary"
                            value={date}
                            onChangeText={setDate}
                            placeholder="YYYY-MM-DD"
                        />
                    </View>

                    <View className="mb-8">
                        <Text className="font-sans-medium text-sm text-primary mb-2">Payment Mode</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {paymentModes.map((m) => (
                                <Pressable 
                                    key={m}
                                    onPress={() => { Vibration.vibrate(10); setMode(m); }}
                                    className={`px-4 py-2.5 rounded-xl border ${mode === m ? 'bg-primary border-primary' : 'bg-white border-slate-200'}`}
                                >
                                    <Text className={`font-sans-bold ${mode === m ? 'text-white' : 'text-slate-600'}`}>{m}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                <View className="p-5 border-t border-border bg-white pb-safe">
                    <Pressable 
                        onPress={handleSave}
                        className="bg-primary py-4 rounded-xl flex-row items-center justify-center shadow-sm"
                    >
                        <CheckCircle2 color="white" size={20} className="mr-2" />
                        <Text className="font-sans-bold text-white text-base">Save Payment</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}
