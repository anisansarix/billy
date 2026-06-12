import React from "react";
import { View, Text, Pressable } from "react-native";
import { X, Edit, Trash2, User, CreditCard } from "lucide-react-native";
import AnimatedModal from "@/components/ui/AnimatedModal";
import { ExpenseRecord } from "@/types/entities";
import { formatINR } from "@/utils/money";

interface ExpenseDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    expense: ExpenseRecord | null;
    onEdit: (expense: ExpenseRecord) => void;
    onDelete: (expenseId: string) => void;
}

export default function ExpenseDetailsModal({ visible, onClose, expense, onEdit, onDelete }: ExpenseDetailsModalProps) {
    if (!expense) return null;

    return (
        <AnimatedModal visible={visible} onClose={onClose}>
            <View className="bg-white rounded-t-3xl p-8 min-h-[350px]">
                <View className="flex-row justify-between items-start mb-6">
                    <View className="flex-1 mr-4">
                        <Text className="font-sans-bold text-2xl text-primary mb-1">{expense.category}</Text>
                        <Text className="font-sans-medium text-base text-muted-foreground">{expense.date}</Text>
                    </View>
                    <Pressable onPress={onClose} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                        <X color="#64748b" size={20} />
                    </Pressable>
                </View>

                <View className="bg-muted p-4 rounded-2xl mb-6">
                    <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Amount</Text>
                    <Text className="font-sans-bold text-3xl text-primary">
                        {formatINR(expense.amountPaise)}
                    </Text>
                </View>

                <View className="mb-8">
                    <View className="flex-row items-center mb-6">
                        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                            <User color="#208AEF" size={24} />
                        </View>
                        <View>
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Vendor / Payee</Text>
                            <Text className="font-sans-bold text-base text-primary">{expense.vendorName || 'Not Specified'}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                            <CreditCard color="#9333ea" size={24} />
                        </View>
                        <View>
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Payment Mode</Text>
                            <Text className="font-sans-bold text-base text-primary uppercase">{expense.paymentMode}</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row space-x-4">
                    <Pressable
                        onPress={() => {
                            onClose();
                            onEdit(expense);
                        }}
                        className="flex-1 bg-blue-100 py-4 rounded-xl flex-row justify-center items-center mr-2 min-h-[44px]"
                    >
                        <Edit color="#208AEF" size={18} className="mr-2" />
                        <Text className="font-sans-bold text-primary text-base">Edit</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            onClose();
                            onDelete(expense.id);
                        }}
                        className="flex-1 border border-red-200 py-4 rounded-xl flex-row justify-center items-center ml-2 min-h-[44px]"
                    >
                        <Trash2 color="#ef4444" size={18} className="mr-2" />
                        <Text className="font-sans-bold text-red-500 text-base">Delete</Text>
                    </Pressable>
                </View>
            </View>
        </AnimatedModal>
    );
}
