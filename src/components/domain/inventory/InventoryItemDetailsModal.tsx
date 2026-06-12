import {  } from 'react';
import { View, Text, Pressable } from "react-native";
import { X, Edit, Trash2 } from "lucide-react-native";
import AnimatedModal from "@/components/ui/AnimatedModal";
import { InventoryItem } from "@/types/entities";
import { formatINR } from "@/utils/money";

interface InventoryItemDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    item: InventoryItem | null;
    onEdit: (item: InventoryItem) => void;
    onDelete: (itemId: string) => void;
}

export default function InventoryItemDetailsModal({ visible, onClose, item, onEdit, onDelete }: InventoryItemDetailsModalProps) {
    if (!item) return null;

    return (
        <AnimatedModal visible={visible} onClose={onClose}>
            <View className="bg-white rounded-t-3xl p-6 min-h-[350px]">
                <View className="flex-row justify-between items-start mb-6">
                    <View className="flex-1 mr-4">
                        <Text className="font-sans-bold text-2xl text-primary mb-1">{item.name}</Text>
                        <Text className="font-sans-medium text-base text-muted-foreground">
                            {item.type === 'product' ? `HSN: ${item.hsnSacCode || 'N/A'}` : `SAC: ${item.hsnSacCode || 'N/A'}`} • GST @ {item.taxRate.gstComponent.igstRate}%
                        </Text>
                    </View>
                    <Pressable onPress={onClose} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                        <X color="#64748b" size={20} />
                    </Pressable>
                </View>

                <View className="p-4 rounded-2xl bg-slate-50 border border-border flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Selling Price</Text>
                        <Text className="font-sans-bold text-2xl text-primary">
                            {formatINR(item.unitPricePaise)}
                        </Text>
                    </View>
                    {item.type === 'product' && (
                        <View className={`px-3 py-1.5 rounded-md border ${item.stock && item.stock > 10 ? 'bg-green-100 border-green-200' : 'bg-amber-100 border-amber-200'}`}>
                            <Text className={`font-sans-bold text-xs uppercase ${item.stock && item.stock > 10 ? 'text-green-700' : 'text-amber-700'}`}>
                                Stock: {item.stock || 0}
                            </Text>
                        </View>
                    )}
                </View>

                {item.description && (
                    <View className="mb-6">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Description</Text>
                        <Text className="font-sans-regular text-primary">{item.description}</Text>
                    </View>
                )}

                <View className="flex-row space-x-4">
                    <Pressable
                        onPress={() => {
                            onClose();
                            onEdit(item);
                        }}
                        className="flex-1 bg-blue-100 py-4 rounded-xl flex-row justify-center items-center mr-2"
                    >
                        <Edit color="#208AEF" size={18} className="mr-2" />
                        <Text className="font-sans-bold text-primary text-base">Edit</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            onClose();
                            onDelete(item.id);
                        }}
                        className="flex-1 border border-red-200 py-4 rounded-xl flex-row justify-center items-center ml-2"
                    >
                        <Trash2 color="#ef4444" size={18} className="mr-2" />
                        <Text className="font-sans-bold text-red-500 text-base">Delete</Text>
                    </Pressable>
                </View>
            </View>
        </AnimatedModal>
    );
}
