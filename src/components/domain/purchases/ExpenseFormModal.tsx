import {  useState, useEffect  } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Alert } from "react-native";
import { X } from "lucide-react-native";
import AnimatedModal from "@/components/ui/AnimatedModal";
import { ExpenseRecord } from "@/types/entities";
import { useAppStore } from "@/store";
import { useShallow } from 'zustand/react/shallow';

interface ExpenseFormModalProps {
    visible: boolean;
    onClose: () => void;
    expenseToEdit: ExpenseRecord | null;
}

export default function ExpenseFormModal({ visible, onClose, expenseToEdit }: ExpenseFormModalProps) {
    const { addExpense, updateExpense } = useAppStore(useShallow(state => ({ addExpense: state.addExpense, updateExpense: state.updateExpense })));

    const [expenseFormData, setExpenseFormData] = useState({
        category: "",
        amount: "",
        paymentMode: "UPI",
        vendorName: "",
    });

    useEffect(() => {
        if (visible) {
            if (expenseToEdit) {
                setExpenseFormData({
                    category: expenseToEdit.category,
                    amount: expenseToEdit.amountPaise ? (expenseToEdit.amountPaise / 100).toString() : "0",
                    paymentMode: expenseToEdit.paymentMode,
                    vendorName: expenseToEdit.vendorName || "",
                });
            } else {
                setExpenseFormData({ category: "", amount: "", paymentMode: "UPI", vendorName: "" });
            }
        }
    }, [visible, expenseToEdit]);

    const handleSave = () => {
        if (!expenseFormData.category || !expenseFormData.amount) {
            Alert.alert("Error", "Please fill category and amount.");
            return;
        }

        const amountNum = parseFloat(expenseFormData.amount);

        const expData: ExpenseRecord = {
            id: expenseToEdit ? expenseToEdit.id : `exp-${Date.now()}`,
            date: expenseToEdit ? expenseToEdit.date : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            category: expenseFormData.category,
            amountPaise: isNaN(amountNum) ? 0 : Math.round(amountNum * 100),
            paymentMode: expenseFormData.paymentMode as ExpenseRecord["paymentMode"],
            vendorName: expenseFormData.vendorName,
        };

        if (expenseToEdit) updateExpense(expData);
        else addExpense(expData);

        onClose();
    };

    return (
        <AnimatedModal visible={visible} onClose={onClose} avoidKeyboard>
            <View className="bg-white rounded-t-3xl h-[75%] p-5 pb-12 shadow-xl flex-col">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="font-sans-bold text-xl text-primary">
                        {expenseToEdit ? 'Edit ExpenseRecord' : 'Add Expense'}
                    </Text>
                    <Pressable onPress={onClose} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                        <X color="#64748b" size={20} />
                    </Pressable>
                </View>
                
                <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                    <View className="mb-4">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Amount (₹)</Text>
                        <TextInput 
                            className="bg-slate-50 border border-border rounded-lg px-4 py-3 font-sans-bold text-lg text-primary"
                            keyboardType="numeric"
                            placeholder="0.00"
                            value={expenseFormData.amount}
                            onChangeText={t => setExpenseFormData({...expenseFormData, amount: t})}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Category</Text>
                        <TextInput 
                            className="bg-slate-50 border border-border rounded-lg px-4 py-3 font-sans-medium text-primary"
                            placeholder="e.g. Office Supplies, Travel"
                            value={expenseFormData.category}
                            onChangeText={t => setExpenseFormData({...expenseFormData, category: t})}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Vendor/Payee (Optional)</Text>
                        <TextInput 
                            className="bg-slate-50 border border-border rounded-lg px-4 py-3 font-sans-medium text-primary"
                            placeholder="e.g. Amazon, Uber"
                            value={expenseFormData.vendorName}
                            onChangeText={t => setExpenseFormData({...expenseFormData, vendorName: t})}
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Payment Mode</Text>
                        <View className="flex-row flex-wrap gap-2 mt-1">
                            {["UPI", "Cash", "Credit Card", "Bank Transfer"].map(mode => (
                                <Pressable 
                                    key={mode}
                                    onPress={() => setExpenseFormData({...expenseFormData, paymentMode: mode})}
                                    className={`px-4 py-2 rounded-full border justify-center min-h-[44px] ${expenseFormData.paymentMode === mode ? 'bg-primary border-primary' : 'bg-white border-border'}`}
                                >
                                    <Text className={`font-sans-medium text-sm ${expenseFormData.paymentMode === mode ? 'text-white' : 'text-primary'}`}>
                                        {mode}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                <Pressable 
                    onPress={handleSave}
                    className="bg-primary rounded-xl py-4 items-center justify-center min-h-[44px] shadow-md shadow-primary/30"
                >
                    <Text className="font-sans-bold text-white text-lg">Save ExpenseRecord</Text>
                </Pressable>
            </View>
        </AnimatedModal>
    );
}
