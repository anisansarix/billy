import React from "react";
import { View, Text, Pressable, Alert, Linking } from "react-native";
import { X, Phone, Edit, Trash2 } from "lucide-react-native";
import AnimatedModal from "@/components/ui/AnimatedModal";
import { Party } from "@/types/entities";
import { formatINR } from "@/utils/money";

interface PartyDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    party: Party | null;
    onEdit: (party: Party) => void;
    onDelete: (partyId: string) => void;
}

export default function PartyDetailsModal({ visible, onClose, party, onEdit, onDelete }: PartyDetailsModalProps) {
    if (!party) return null;

    const handleCall = () => {
        if (party.phone) {
            Linking.openURL(`tel:${party.phone}`);
        } else {
            Alert.alert("No Phone Number", "This party does not have a phone number saved.");
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Party",
            "Are you sure you want to delete this party?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        onDelete(party.id);
                    }
                }
            ]
        );
    };

    return (
        <AnimatedModal visible={visible} onClose={onClose}>
            <View className="bg-white rounded-t-3xl p-8 min-h-[400px]">
                <View className="flex-row justify-between items-start mb-6">
                    <View className="flex-1 mr-4">
                        <Text className="font-sans-bold text-2xl text-primary mb-1">{party.legalName}</Text>
                        <Text className="font-sans-medium text-base text-muted-foreground capitalize">{party.partyType}</Text>
                    </View>
                    <Pressable onPress={onClose} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                        <X color="#64748b" size={20} />
                    </Pressable>
                </View>

                <View className="bg-muted p-4 rounded-2xl mb-6">
                    <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Current Balance</Text>
                    <Text className={`font-sans-bold text-3xl ${party.openingBalancePaise > 0 ? (party.partyType === 'customer' ? 'text-green-600' : 'text-red-500') : 'text-primary'}`}>
                        {formatINR(Math.abs(party.openingBalancePaise))}
                    </Text>
                    <Text className="font-sans-medium text-sm mt-1 text-muted-foreground">
                        {party.openingBalancePaise > 0 ? (party.partyType === 'customer' ? 'To Receive' : 'To Pay') : 'Advance'}
                    </Text>
                </View>

                <View className="mb-8">
                    <View className="flex-row items-center mb-6">
                        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                            <Phone color="#208AEF" size={24} />
                        </View>
                        <View>
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Phone Number</Text>
                            <Text className="font-sans-bold text-base text-primary">{party.phone || 'N/A'}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                            <Text className="font-sans-bold text-lg text-purple-600">G</Text>
                        </View>
                        <View>
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">GSTIN</Text>
                            <Text className="font-sans-bold text-base text-primary">{party.gstin || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row space-x-4">
                    <Pressable
                        onPress={handleCall}
                        className="flex-1 bg-primary py-4 rounded-xl flex-row justify-center items-center mr-2"
                    >
                        <Phone color="white" size={18} className="mr-2" />
                        <Text className="font-sans-bold text-white text-base">Call</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => onEdit(party)}
                        className="flex-1 bg-blue-100 py-4 rounded-xl flex-row justify-center items-center ml-2"
                    >
                        <Edit color="#208AEF" size={18} className="mr-2" />
                        <Text className="font-sans-bold text-primary text-base">Edit</Text>
                    </Pressable>
                </View>

                <Pressable
                    onPress={handleDelete}
                    className="mt-4 py-4 rounded-xl flex-row justify-center items-center border border-red-200"
                >
                    <Trash2 color="#ef4444" size={18} className="mr-2" />
                    <Text className="font-sans-bold text-red-500 text-base">Delete {party.partyType === 'customer' ? 'Customer' : 'Vendor'}</Text>
                </Pressable>
            </View>
        </AnimatedModal>
    );
}
