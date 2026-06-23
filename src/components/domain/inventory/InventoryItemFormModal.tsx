import {  useState, useEffect  } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Alert, FlatList } from "react-native";
import { X, Save, Trash2 } from "lucide-react-native";
import AnimatedModal from "@/components/ui/AnimatedModal";
import { InventoryItem, TaxRate } from "@/types/entities";
import { useAppStore } from "@/store";
import { useShallow } from 'zustand/react/shallow';
import HSN_DATA from '@/data/hsn.json';

interface InventoryItemFormModalProps {
    visible: boolean;
    onClose: () => void;
    itemToEdit: InventoryItem | null;
    initialTab: "product" | "service";
    onSaveSuccess?: (item: InventoryItem) => void;
    onDelete?: (itemId: string) => void;
}

interface FormState {
    name: string;
    type: 'product' | 'service';
    unitPricePaise: number;
    purchasePricePaise?: number;
    hsnSacCode: string;
    gstRate: number;
    unit: string;
    stock: number;
    minimumStock?: number;
    sku?: string;
    description?: string;
}

export default function InventoryItemFormModal({ visible, onClose, itemToEdit, initialTab, onSaveSuccess, onDelete }: InventoryItemFormModalProps) {
    const { addItem, updateItem, addAdjustment } = useAppStore(useShallow(state => ({ addItem: state.addItem, updateItem: state.updateItem, addAdjustment: state.addAdjustment })));

    const [formData, setFormData] = useState<FormState>({
        name: "",
        type: "product",
        unitPricePaise: 0,
        hsnSacCode: "",
        gstRate: 0,
        unit: "pcs",
        stock: 0,
    });
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [hsnQuery, setHsnQuery] = useState('');
    const hsnResults = hsnQuery.length >= 2 ? HSN_DATA.filter(h => h.code.startsWith(hsnQuery) || h.description.toLowerCase().includes(hsnQuery.toLowerCase())).slice(0, 8) : [];

    useEffect(() => {
        if (visible) {
            if (itemToEdit) {
                setFormData({ 
                    name: itemToEdit.name,
                    type: itemToEdit.type,
                    unitPricePaise: itemToEdit.unitPricePaise,
                    purchasePricePaise: itemToEdit.purchasePricePaise,
                    hsnSacCode: itemToEdit.hsnSacCode,
                    gstRate: itemToEdit.taxRate?.gstComponent?.igstRate || 0,
                    unit: itemToEdit.unit,
                    stock: itemToEdit.stock || 0,
                    minimumStock: itemToEdit.minimumStock,
                    sku: itemToEdit.sku,
                    description: itemToEdit.description,
                });
                setShowMoreDetails(false);
            } else {
                setFormData({
                    name: "",
                    type: initialTab,
                    unitPricePaise: 0,
                    hsnSacCode: "",
                    gstRate: 0,
                    unit: "pcs",
                    stock: 0,
                });
                setShowMoreDetails(false);
            }
        }
    }, [visible, itemToEdit, initialTab]);

    const handleClose = () => {
        const isDirty = itemToEdit
            ? formData.name !== itemToEdit.name || formData.unitPricePaise !== itemToEdit.unitPricePaise
            : !!(formData.name || formData.unitPricePaise);

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
        if (!formData.name?.trim()) {
            Alert.alert("Error", "Item Name is required");
            return;
        }

        if (formData.hsnSacCode?.trim()) {
            const hsn = formData.hsnSacCode.trim();
            if (!/^\d{4}$|^\d{6}$|^\d{8}$/.test(hsn)) {
                Alert.alert("Invalid HSN/SAC", "HSN/SAC code must be exactly 4, 6, or 8 digits.");
                return;
            }
        }

        const gstRate = formData.gstRate || 0;
        const taxRateObj: TaxRate = {
            id: `tax-${gstRate}`,
            hsnSacCode: formData.hsnSacCode || "",
            description: `GST ${gstRate}%`,
            gstComponent: {
                igstRate: gstRate,
                cgstRate: gstRate / 2,
                sgstRate: gstRate / 2,
                cessRate: 0
            },
            isService: formData.type === 'service',
            isActive: true
        };

        const itemData: InventoryItem = {
            id: itemToEdit ? itemToEdit.id : `i${Date.now()}`,
            name: formData.name,
            type: formData.type || "product",
            unitPricePaise: Number(formData.unitPricePaise) || 0,
            purchasePricePaise: formData.purchasePricePaise,
            hsnSacCode: formData.hsnSacCode || "",
            taxRate: taxRateObj,
            unit: formData.unit || "pcs",
            stock: Number(formData.stock) || 0,
            minimumStock: formData.minimumStock,
            sku: formData.sku,
            description: formData.description,
        };

        if (itemToEdit) {
            updateItem(itemData);
        } else {
            addItem(itemData);
            if (itemData.stock && itemData.stock > 0) {
                addAdjustment({
                    id: `adj-${Date.now()}`,
                    itemId: itemData.id,
                    itemName: itemData.name,
                    type: "Stock In",
                    qty: Number(itemData.stock),
                    reason: "Initial Stock",
                    date: new Date().toISOString()
                });
            }
        }

        if (onSaveSuccess) {
            onSaveSuccess(itemData);
        } else {
            onClose();
        }
    };

    return (
        <AnimatedModal visible={visible} onClose={handleClose} avoidKeyboard>
            <View className="bg-white rounded-t-3xl p-6 pb-12 h-[92%] flex-col">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="font-sans-bold text-2xl text-primary">
                        {itemToEdit ? 'Edit' : 'Add'} {formData.type === 'product' ? 'Product' : 'Service'}
                    </Text>
                    <View className="flex-row items-center">
                        {itemToEdit && onDelete && (
                            <Pressable onPress={() => { onClose(); onDelete(itemToEdit.id); }} className="p-2 bg-red-50 rounded-full mr-2">
                                <Trash2 color="#ef4444" size={20} />
                            </Pressable>
                        )}
                        <Pressable onPress={handleClose} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                            <X color="#64748b" size={20} />
                        </Pressable>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                    {!itemToEdit && (
                        <View className="flex-row mb-6 bg-muted p-1 rounded-xl">
                            <Pressable
                                onPress={() => setFormData({ ...formData, type: "product" })}
                                className={`flex-1 py-3 items-center rounded-lg ${formData.type === "product" ? "bg-white shadow-sm" : ""}`}
                            >
                                <Text className={`font-sans-bold ${formData.type === "product" ? "text-primary" : "text-muted-foreground"}`}>Product</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setFormData({ ...formData, type: "service" })}
                                className={`flex-1 py-3 items-center rounded-lg ${formData.type === "service" ? "bg-white shadow-sm" : ""}`}
                            >
                                <Text className={`font-sans-bold ${formData.type === "service" ? "text-primary" : "text-muted-foreground"}`}>Service</Text>
                            </Pressable>
                        </View>
                    )}

                    <View className="mb-4">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Item Name *</Text>
                        <TextInput
                            className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                            placeholder="Enter product or service name"
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                        />
                    </View>

                    <View className="mb-4 flex-row">
                        <View className="flex-1 mr-2">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Selling Price (₹) *</Text>
                            <TextInput
                                className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                placeholder="0"
                                keyboardType="numeric"
                                value={formData.unitPricePaise ? (formData.unitPricePaise / 100).toString() : ""}
                                onChangeText={(text) => setFormData({ ...formData, unitPricePaise: text ? Math.round(parseFloat(text) * 100) : 0 })}
                            />
                        </View>
                        {formData.type === 'product' && (
                            <View className="flex-1 ml-2">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Opening Stock</Text>
                                <TextInput
                                    className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={formData.stock?.toString() || ""}
                                    onChangeText={(text) => setFormData({ ...formData, stock: text ? parseInt(text, 10) : 0 })}
                                />
                            </View>
                        )}
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
                            <Text className="font-sans-bold text-lg text-primary mb-4">Pricing & Tax</Text>
                            
                            <View className="mb-4">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Purchase Price (₹)</Text>
                                <TextInput
                                    className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={formData.purchasePricePaise ? (formData.purchasePricePaise / 100).toString() : ""}
                                    onChangeText={(text) => setFormData({ ...formData, purchasePricePaise: text ? Math.round(parseFloat(text) * 100) : undefined })}
                                />
                            </View>

                            <View className="mb-4 flex-row">
                                <View className="flex-1 mr-2">
                                    <Text className="font-sans-medium text-sm text-muted-foreground mb-2">GST Rate (%)</Text>
                                    <TextInput
                                        className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                        placeholder="e.g. 18"
                                        keyboardType="numeric"
                                        value={formData.gstRate?.toString() || ""}
                                        onChangeText={(text) => setFormData({ ...formData, gstRate: Number(text) ? parseFloat(text) : 0 })}
                                    />
                                </View>
                                <View className="flex-1 ml-2 z-10">
                                    <Text className="font-sans-medium text-sm text-muted-foreground mb-2">{formData.type === 'product' ? 'HSN Code' : 'SAC Code'}</Text>
                                    <TextInput
                                        className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                        placeholder="e.g. 8471"
                                        value={formData.hsnSacCode}
                                        onChangeText={(text) => {
                                            setHsnQuery(text);
                                            setFormData({ ...formData, hsnSacCode: text });
                                        }}
                                    />
                                    {hsnResults.length > 0 && (
                                        <View className="absolute top-[85px] left-0 right-0 bg-white border border-border rounded-xl shadow-sm z-50 overflow-hidden" style={{ maxHeight: 200 }}>
                                            <FlatList
                                                data={hsnResults}
                                                keyExtractor={(h) => h.code}
                                                keyboardShouldPersistTaps="handled"
                                                nestedScrollEnabled={true}
                                                renderItem={({ item: h }) => (
                                                    <Pressable 
                                                        className="p-3 border-b border-border flex-row items-center justify-between"
                                                        onPress={() => {
                                                            setFormData({ ...formData, hsnSacCode: h.code, gstRate: h.gstRate });
                                                            setHsnQuery('');
                                                        }}
                                                    >
                                                        <View className="flex-1 pr-2">
                                                            <Text className="font-mono text-sm text-primary mb-0.5">{h.code}</Text>
                                                            <Text className="font-sans-medium text-xs text-muted-foreground" numberOfLines={1}>{h.description}</Text>
                                                        </View>
                                                        <View className="bg-slate-100 px-2 py-1 rounded">
                                                            <Text className="font-sans-bold text-xs text-primary">{h.gstRate}%</Text>
                                                        </View>
                                                    </Pressable>
                                                )}
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>
                            
                            <Text className="font-sans-bold text-lg text-primary mb-4 mt-6">Item Identity</Text>
                            <View className="mb-4 flex-row">
                                <View className="flex-1 mr-2">
                                    <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Item Code / SKU</Text>
                                    <TextInput
                                        className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                        placeholder="SKU-123"
                                        value={formData.sku}
                                        onChangeText={(text) => setFormData({ ...formData, sku: text })}
                                    />
                                </View>
                                <View className="flex-1 ml-2">
                                    <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Unit</Text>
                                    <TextInput
                                        className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                        placeholder="e.g. pcs, kg"
                                        value={formData.unit}
                                        onChangeText={(text) => setFormData({ ...formData, unit: text })}
                                    />
                                </View>
                            </View>

                            {formData.type === 'product' && (
                                <View className="mb-4">
                                    <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Minimum Stock to Alert</Text>
                                    <TextInput
                                        className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                        placeholder="0"
                                        keyboardType="numeric"
                                        value={formData.minimumStock?.toString() || ""}
                                        onChangeText={(text) => setFormData({ ...formData, minimumStock: text ? parseInt(text, 10) : 0 })}
                                    />
                                </View>
                            )}

                            <Text className="font-sans-bold text-lg text-primary mb-4 mt-6">Details</Text>
                            <View className="mb-6">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Description</Text>
                                <TextInput
                                    className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base h-24"
                                    placeholder="Add description..."
                                    multiline
                                    textAlignVertical="top"
                                    value={formData.description}
                                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                                />
                            </View>

                            <View className="mb-6 p-4 bg-muted rounded-2xl items-center border border-dashed border-slate-300">
                                <Text className="font-sans-medium text-primary mb-2">Upload Item Image</Text>
                                <Pressable className="bg-white px-6 py-3 rounded-full border border-border shadow-sm mt-2">
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
                    <Text className="font-sans-bold text-white text-lg">Save {formData.type === 'product' ? 'Product' : 'Service'}</Text>
                </Pressable>
            </View>
        </AnimatedModal>
    );
}
