import {  useState, useEffect  } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Alert } from "react-native";
import { X, Save } from "lucide-react-native";
import AnimatedModal from "@/components/ui/AnimatedModal";
import { Party, PartyType } from "@/types/entities";
import { useAppStore } from "@/store";
import { useShallow } from 'zustand/react/shallow';

interface PartyFormModalProps {
    visible: boolean;
    onClose: () => void;
    partyToEdit: Party | null;
    initialPartyType?: PartyType.CUSTOMER | PartyType.VENDOR | PartyType.BOTH;
    onSaveSuccess?: (party: Party) => void;
}

export default function PartyFormModal({ visible, onClose, partyToEdit, initialPartyType, onSaveSuccess }: PartyFormModalProps) {
    const { addParty, updateParty } = useAppStore(useShallow(state => ({ addParty: state.addParty, updateParty: state.updateParty })));

    const [formData, setFormData] = useState<Partial<Party> & { balanceString: string; balanceType: string }>({
        legalName: "",
        gstin: "",
        balanceString: "0",
        partyType: PartyType.CUSTOMER,
        balanceType: "receivable"
    });
    const [showMoreDetails, setShowMoreDetails] = useState(false);

    useEffect(() => {
        if (visible) {
            if (partyToEdit) {
                setFormData({
                    ...partyToEdit,
                    balanceString: (Math.abs(partyToEdit.openingBalancePaise) / 100).toString(),
                    balanceType: partyToEdit.openingBalancePaise > 0 ? "receivable" : "payable",
                    partyType: partyToEdit.partyType
                });
                setShowMoreDetails(false);
            } else {
                setFormData({
                    legalName: "",
                    gstin: "",
                    phone: "",
                    balanceString: "0",
                    partyType: initialPartyType !== PartyType.BOTH && initialPartyType ? initialPartyType : PartyType.CUSTOMER,
                    balanceType: "receivable"
                });
                setShowMoreDetails(false);
            }
        }
    }, [visible, partyToEdit, initialPartyType]);

    const handleClose = () => {
        const isDirty = partyToEdit 
            ? formData.legalName !== partyToEdit.legalName || formData.phone !== partyToEdit.phone 
            : !!(formData.legalName || formData.phone);

        if (isDirty) {
            Alert.alert(
                "Discard Changes?",
                "You have unsaved changes. Are you sure you want to discard them?",
                [
                    { text: "Keep Editing", style: "cancel" },
                    { text: "Discard", style: "destructive", onPress: onClose }
                ]
            );
        } else {
            onClose();
        }
    };

    const handleSave = () => {
        if (!formData.legalName?.trim()) {
            Alert.alert("Error", "Name is required");
            return;
        }
        if (!formData.phone?.trim()) {
            Alert.alert("Error", "Mobile Number is required");
            return;
        }

        const numericBalance = parseFloat(formData.balanceString) || 0;
        const finalBalance = Math.round((formData.balanceType === "payable" ? -Math.abs(numericBalance) : Math.abs(numericBalance)) * 100);

        const partyData: Party = {
            ...formData,
            id: partyToEdit ? partyToEdit.id : `p${Date.now()}`,
            legalName: formData.legalName,
            gstin: formData.gstin,
            phone: formData.phone,
            openingBalancePaise: finalBalance,
            partyType: formData.partyType || PartyType.CUSTOMER,
        } as Party;

        delete (partyData as Party & { balanceString?: string }).balanceString;
        delete (partyData as Party & { balanceType?: string }).balanceType;

        if (partyToEdit) {
            updateParty(partyData);
        } else {
            addParty(partyData);
        }

        if (onSaveSuccess) {
            onSaveSuccess(partyData);
        } else {
            onClose();
        }
    };

    return (
        <AnimatedModal visible={visible} onClose={handleClose} avoidKeyboard>
            <View className="bg-white rounded-t-3xl p-6 pb-12 h-[92%] flex-col">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="font-sans-bold text-2xl text-primary">
                        {partyToEdit ? 'Edit' : 'Add'} {formData.partyType === PartyType.CUSTOMER ? 'Customer' : formData.partyType === PartyType.VENDOR ? 'Vendor' : 'Party'}
                    </Text>
                    <Pressable onPress={handleClose} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                        <X color="#64748b" size={20} />
                    </Pressable>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                    {!partyToEdit && (
                        <View className="flex-row mb-6 bg-muted p-1 rounded-xl">
                            <Pressable
                                onPress={() => setFormData({ ...formData, partyType: PartyType.CUSTOMER })}
                                className={`flex-1 py-3 items-center rounded-lg ${formData.partyType === PartyType.CUSTOMER ? "bg-white shadow-sm" : ""}`}
                            >
                                <Text className={`font-sans-bold ${formData.partyType === PartyType.CUSTOMER ? "text-primary" : "text-muted-foreground"}`}>Customer</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setFormData({ ...formData, partyType: PartyType.VENDOR })}
                                className={`flex-1 py-3 items-center rounded-lg ${formData.partyType === PartyType.VENDOR ? "bg-white shadow-sm" : ""}`}
                            >
                                <Text className={`font-sans-bold ${formData.partyType === PartyType.VENDOR ? "text-primary" : "text-muted-foreground"}`}>Vendor</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setFormData({ ...formData, partyType: PartyType.BOTH })}
                                className={`flex-1 py-3 items-center rounded-lg ${formData.partyType === PartyType.BOTH ? "bg-white shadow-sm" : ""}`}
                            >
                                <Text className={`font-sans-bold ${formData.partyType === PartyType.BOTH ? "text-primary" : "text-muted-foreground"}`}>Both</Text>
                            </Pressable>
                        </View>
                    )}

                    <View className="mb-4">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Business / Person Name *</Text>
                        <TextInput
                            className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                            placeholder="Enter name"
                            value={formData.legalName}
                            onChangeText={(text) => setFormData({ ...formData, legalName: text })}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Mobile Number *</Text>
                        <TextInput
                            className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                            placeholder="e.g. +91 9876543210"
                            keyboardType="phone-pad"
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2">GSTIN</Text>
                        <TextInput
                            className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                            placeholder="e.g. 27AADCR2311G1Z1"
                            autoCapitalize="characters"
                            value={formData.gstin}
                            onChangeText={(text) => setFormData({ ...formData, gstin: text })}
                        />
                    </View>

                    <View className="mb-2">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-4">Opening Balance (₹)</Text>
                        <View className="flex-row items-center mb-4">
                            <Pressable 
                                onPress={() => setFormData({...formData, balanceType: 'receivable'})}
                                className="flex-row items-center mr-6"
                            >
                                <View className={`w-5 h-5 rounded-full border-2 mr-2 items-center justify-center ${formData.balanceType === 'receivable' ? 'border-primary' : 'border-slate-300'}`}>
                                    {formData.balanceType === 'receivable' && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                </View>
                                <Text className="font-sans-medium text-primary">Receivable</Text>
                            </Pressable>
                            <Pressable 
                                onPress={() => setFormData({...formData, balanceType: 'payable'})}
                                className="flex-row items-center"
                            >
                                <View className={`w-5 h-5 rounded-full border-2 mr-2 items-center justify-center ${formData.balanceType === 'payable' ? 'border-primary' : 'border-slate-300'}`}>
                                    {formData.balanceType === 'payable' && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                </View>
                                <Text className="font-sans-medium text-primary">Payable</Text>
                            </Pressable>
                        </View>
                        <TextInput
                            className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                            placeholder="Amount"
                            keyboardType="numeric"
                            value={formData.balanceString}
                            onChangeText={(text) => setFormData({ ...formData, balanceString: text })}
                        />
                    </View>

                    {!showMoreDetails ? (
                        <Pressable 
                            onPress={() => setShowMoreDetails(true)}
                            className="py-6 items-center"
                        >
                            <Text className="font-sans-bold text-primary text-base">+ Add More Details</Text>
                        </Pressable>
                    ) : (
                        <View className="mt-6 border-t border-border pt-6 pb-6">
                            <Text className="font-sans-bold text-lg text-primary mb-4">Recommended Information</Text>
                            
                            <View className="mb-4">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-2">PAN (Optional)</Text>
                                <TextInput
                                    className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                    placeholder="Enter PAN"
                                    autoCapitalize="characters"
                                    value={formData.pan}
                                    onChangeText={(text) => setFormData({ ...formData, pan: text })}
                                />
                            </View>
                            
                            <Text className="font-sans-bold text-lg text-primary mb-4 mt-6">Contact Details</Text>
                            <View className="mb-4">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Contact Person Name</Text>
                                <TextInput
                                    className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                    placeholder="Name"
                                    value={formData.contactPersons?.[0]?.name || ''}
                                    onChangeText={(text) => setFormData({ ...formData, contactPersons: [{ name: text, phone: '', isPrimary: true }] })}
                                />
                            </View>
                            <View className="mb-4">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Email</Text>
                                <TextInput
                                    className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                />
                            </View>

                            <Text className="font-sans-bold text-lg text-primary mb-4 mt-6">Internal Information</Text>
                            <View className="mb-6">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Notes</Text>
                                <TextInput
                                    className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base h-24"
                                    placeholder="Add notes..."
                                    multiline
                                    textAlignVertical="top"
                                    value={formData.notes}
                                    onChangeText={(text) => setFormData({ ...formData, notes: text })}
                                />
                            </View>

                            <View className="mb-6 p-4 bg-muted rounded-2xl items-center border border-dashed border-slate-300">
                                <Text className="font-sans-medium text-primary mb-2">Upload Documents</Text>
                                <Text className="font-sans-regular text-sm text-muted-foreground text-center mb-4">Attach GST Certificate, PAN Card, etc.</Text>
                                <Pressable className="bg-white px-6 py-3 rounded-full border border-border shadow-sm">
                                    <Text className="font-sans-bold text-primary">Browse Files</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                </ScrollView>

                <Pressable
                    onPress={handleSave}
                    className="bg-primary py-4 rounded-xl flex-row justify-center items-center shadow-md shadow-primary/30"
                >
                    <Save color="white" size={20} className="mr-2" />
                    <Text className="font-sans-bold text-white text-lg">Save {formData.partyType === PartyType.CUSTOMER ? 'Customer' : formData.partyType === PartyType.VENDOR ? 'Vendor' : 'Party'}</Text>
                </Pressable>
            </View>
        </AnimatedModal>
    );
}
