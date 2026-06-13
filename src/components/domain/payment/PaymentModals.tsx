import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { X, Edit, Trash2, CreditCard, Calendar } from "lucide-react-native";
import AnimatedModal from "@/components/ui/AnimatedModal";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { formatINR } from "@/utils/money";
import { formatDate } from "@/utils/date";
import { PaymentRecord } from "@/types/entities";

interface PaymentModalsProps {
    selectedPayment: PaymentRecord | null;
    setSelectedPayment: (p: PaymentRecord | null) => void;
    isFormVisible: boolean;
    setIsFormVisible: (v: boolean) => void;
    editingPayment: PaymentRecord | null;
    formData: { partyName: string; amount: string; mode: string; type: "in" | "out" };
    setFormData: (d: any) => void; // TODO: properly type // TODO: properly type // TODO: properly type // TODO: properly type // TODO: properly type
    handleSave: () => void;
    handleDelete: (id: string) => void;
    openForm: (p?: PaymentRecord) => void;
}

export default function PaymentModals({ 
    selectedPayment, setSelectedPayment, isFormVisible, setIsFormVisible, 
    editingPayment, formData, setFormData, handleSave, handleDelete, openForm 
}: PaymentModalsProps) {
    return (
        <>
            {/* Details Modal */}
            <AnimatedModal visible={!!selectedPayment} onClose={() => setSelectedPayment(null)}>
                <View className="bg-white rounded-t-3xl p-8 min-h-[350px]">
                    {selectedPayment && (
                        <>
                            <View className="flex-row justify-between items-start mb-6">
                                <View className="flex-1 mr-4">
                                    <Text className="font-sans-bold text-2xl text-primary mb-1">{selectedPayment.partyName}</Text>
                                    <Text className="font-sans-medium text-base text-muted-foreground">{formatDate(selectedPayment.date)}</Text>
                                </View>
                                <Pressable onPress={() => setSelectedPayment(null)} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                                    <X color="#64748b" size={20} />
                                </Pressable>
                            </View>

                            <View className={`p-4 rounded-2xl mb-6 ${selectedPayment.type === 'in' ? 'bg-green-50' : 'bg-red-50'}`}>
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-1">
                                    {selectedPayment.type === 'in' ? 'Amount Received' : 'Amount Paid'}
                                </Text>
                                <Text className={`font-sans-bold text-3xl ${selectedPayment.type === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                                    {formatINR(selectedPayment.amountPaise)}
                                </Text>
                            </View>

                            <View className="mb-8">
                                <View className="flex-row items-center mb-6">
                                    <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                                        <CreditCard color="#208AEF" size={24} />
                                    </View>
                                    <View>
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Payment Mode</Text>
                                        <Text className="font-sans-bold text-base text-primary uppercase">{selectedPayment.mode}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center">
                                    <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                                        <Calendar color="#9333ea" size={24} />
                                    </View>
                                    <View>
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Transaction Date</Text>
                                        <Text className="font-sans-bold text-base text-primary">{formatDate(selectedPayment.date)}</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row space-x-4">
                                <Pressable
                                    onPress={() => openForm(selectedPayment)}
                                    className="flex-1 bg-blue-100 py-4 rounded-xl flex-row justify-center items-center mr-2"
                                >
                                    <Edit color="#208AEF" size={18} className="mr-2" />
                                    <Text className="font-sans-bold text-primary text-base">Edit</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => handleDelete(selectedPayment.id)}
                                    className="flex-1 border border-red-200 py-4 rounded-xl flex-row justify-center items-center ml-2"
                                >
                                    <Trash2 color="#ef4444" size={18} className="mr-2" />
                                    <Text className="font-sans-bold text-red-500 text-base">Delete</Text>
                                </Pressable>
                            </View>
                        </>
                    )}
                </View>
            </AnimatedModal>

            {/* Form Modal */}
            <AnimatedModal visible={isFormVisible} onClose={() => setIsFormVisible(false)} avoidKeyboard>
                <View className="bg-white rounded-t-3xl h-[85%] p-5 pb-12 shadow-xl flex-col">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-sans-bold text-xl text-primary">
                            {editingPayment ? 'Edit Payment' : 'Log Payment'}
                        </Text>
                        <Pressable onPress={() => setIsFormVisible(false)} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                            <X color="#64748b" size={20} />
                        </Pressable>
                    </View>
                    
                    <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                        
                        <View className="mb-6">
                            <SegmentedTabs 
                                tabs={["Money In", "Money Out"]} 
                                activeTab={formData.type === "in" ? "Money In" : "Money Out"} 
                                onTabChange={(t) => setFormData({ ...formData, type: t === "Money In" ? "in" : "out" })} 
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Party Name (Customer/Vendor)</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-4 py-3 font-sans-medium text-primary"
                                placeholder="e.g. Ramesh Traders"
                                value={formData.partyName}
                                onChangeText={t => setFormData({...formData, partyName: t})}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Amount (₹)</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-4 py-3 font-sans-bold text-lg text-primary"
                                keyboardType="numeric"
                                placeholder="0.00"
                                value={formData.amount}
                                onChangeText={t => setFormData({...formData, amount: t})}
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Payment Mode</Text>
                            <View className="flex-row flex-wrap gap-2 mt-1">
                                {["UPI", "Bank Transfer", "Cash", "NEFT", "RTGS", "Cheque"].map(mode => (
                                    <Pressable 
                                        key={mode}
                                        onPress={() => setFormData({...formData, mode: mode as PaymentRecord["mode"]})}
                                        className={`px-4 py-2 rounded-full border ${formData.mode === mode ? 'bg-primary border-primary' : 'bg-white border-border'}`}
                                    >
                                        <Text className={`font-sans-medium text-sm ${formData.mode === mode ? 'text-white' : 'text-primary'}`}>
                                            {mode}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    <Pressable 
                        onPress={handleSave}
                        className="bg-primary rounded-xl py-4 items-center shadow-md shadow-primary/30"
                    >
                        <Text className="font-sans-bold text-white text-lg">Save Payment</Text>
                    </Pressable>
                </View>
            </AnimatedModal>
        </>
    );
}
