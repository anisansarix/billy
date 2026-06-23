import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Vibration, Alert } from 'react-native';
import { X, CheckCircle2 } from 'lucide-react-native';
import AnimatedModal from '@/components/ui/AnimatedModal';
import { formatINR } from '@/utils/money';
import { PaymentRecord } from '@/types/entities';

interface RecordPaymentModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (paymentData: Omit<PaymentRecord, 'id'>) => void;
    invoiceId: string;
    partyId: string;
    partyName: string;
    balanceDuePaise: number;
}

export default function RecordPaymentModal({
    visible,
    onClose,
    onSave,
    partyId,
    partyName,
    balanceDuePaise
}: RecordPaymentModalProps) {
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

        onSave({
            date,
            amountPaise,
            mode,
            type: 'in',
            partyId,
            partyName,
        });
        
        // Reset and close
        setAmountStr((balanceDuePaise / 100).toString());
        setMode('UPI');
        onClose();
    };

    const paymentModes = ['UPI', 'Bank Transfer', 'Cash', 'Cheque'] as const;

    return (
        <AnimatedModal visible={visible} onClose={onClose} placement="bottom" avoidKeyboard>
            <View className="bg-white rounded-t-3xl min-h-[500px] p-5">
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="font-sans-bold text-xl text-primary">Record Payment</Text>
                        <Text className="font-sans-medium text-muted-foreground text-sm mt-1">From {partyName}</Text>
                    </View>
                    <Pressable 
                        onPress={() => { Vibration.vibrate(10); onClose(); }} 
                        className="h-10 w-10 items-center justify-center bg-slate-100 rounded-full"
                    >
                        <X color="#64748b" size={20} />
                    </Pressable>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
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

                <View className="pt-4 border-t border-slate-100">
                    <Pressable 
                        onPress={handleSave}
                        className="bg-primary py-4 rounded-xl flex-row items-center justify-center shadow-sm"
                    >
                        <CheckCircle2 color="white" size={20} className="mr-2" />
                        <Text className="font-sans-bold text-white text-base">Save Payment</Text>
                    </Pressable>
                </View>
            </View>
        </AnimatedModal>
    );
}
