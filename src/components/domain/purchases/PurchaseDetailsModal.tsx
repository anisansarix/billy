import React from "react";
import { View, Text, Pressable } from "react-native";
import { X, Trash2, Calendar, Box, Wallet } from "lucide-react-native";
import AnimatedModal from "@/components/ui/AnimatedModal";
import { PurchaseOrder } from "@/types/entities";
import { formatINR } from "@/utils/money";

interface PurchaseDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    purchase: PurchaseOrder | null;
    onDelete: (purchaseId: string) => void;
}

export default function PurchaseDetailsModal({ visible, onClose, purchase, onDelete }: PurchaseDetailsModalProps) {
    if (!purchase) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Paid": return "bg-green-100 text-green-700";
            case "Pending": return "bg-amber-100 text-amber-700";
            case "Overdue": return "bg-red-100 text-red-700";
            case "Draft": return "bg-slate-100 text-slate-700";
            case "Sent": return "bg-blue-100 text-blue-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <AnimatedModal visible={visible} onClose={onClose}>
            <View className="bg-white rounded-t-3xl p-8 min-h-[400px]">
                <View className="flex-row justify-between items-start mb-6">
                    <View className="flex-1 mr-4">
                        <Text className="font-sans-bold text-2xl text-primary mb-1">{purchase.partyName || purchase.partyName}</Text>
                        <Text className="font-sans-medium text-base text-muted-foreground">{purchase.documentType} • {purchase.documentNumber}</Text>
                    </View>
                    <Pressable onPress={onClose} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                        <X color="#64748b" size={20} />
                    </Pressable>
                </View>

                <View className="bg-muted p-4 rounded-2xl mb-6 flex-row justify-between items-center">
                    <View>
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Total Amount</Text>
                        <Text className="font-sans-bold text-3xl text-primary">
                            {formatINR(purchase.totalAmountPaise)}
                        </Text>
                    </View>
                    <View className={`px-3 py-1.5 rounded-md ${getStatusColor(purchase.status).split(' ')[0]}`}>
                        <Text className={`font-sans-bold text-xs uppercase ${getStatusColor(purchase.status).split(' ')[1]}`}>
                            {purchase.status}
                        </Text>
                    </View>
                </View>

                <View className="mb-8">
                    <View className="flex-row items-center mb-6">
                        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                            <Calendar color="#208AEF" size={24} />
                        </View>
                        <View>
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Date</Text>
                            <Text className="font-sans-bold text-base text-primary">{purchase.documentDate}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                            <Box color="#9333ea" size={24} />
                        </View>
                        <View>
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Items Included</Text>
                            <Text className="font-sans-bold text-base text-primary">{purchase.lineItems?.length || 0} Items</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row space-x-4">
                    <Pressable
                        onPress={() => alert("Marking as Paid is mocked for now.")}
                        className="flex-1 bg-primary py-4 rounded-xl flex-row justify-center items-center mr-2 min-h-[44px]"
                    >
                        <Wallet color="white" size={18} className="mr-2" />
                        <Text className="font-sans-bold text-white text-base">Mark Paid</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            onClose();
                            onDelete(purchase.id);
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
