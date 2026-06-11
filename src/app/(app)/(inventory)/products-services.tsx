import { InventoryItem, TaxRate } from "@/types/entities";

import AnimatedModal from "@/components/ui/AnimatedModal";
import { useShallow } from 'zustand/react/shallow';
import { useRouter } from "expo-router";
import { ArrowLeft, Briefcase, Package, Plus, Search, X, Save, Edit, Trash2, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View, Alert, RefreshControl, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "@/components/ui/Card";
import { useAppStore } from "@/store";
import "../../../../global.css";
import { formatINR } from "@/utils/money";

export default function ProductsServicesScreen() {
    const router = useRouter();
    const [view, setView] = useState<"catalog" | "adjustments">("catalog");
    const [tab, setTab] = useState<"product" | "service">("product");
    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    // Data State
    const {  items, addItem, updateItem, deleteItem, adjustments  } = useAppStore(useShallow(state => ({ items: state.items, addItem: state.addItem, updateItem: state.updateItem, deleteItem: state.deleteItem, adjustments: state.adjustments })));

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    const filteredItems = items.filter(
        i => i.type === tab && i.name.toLowerCase().includes(search.toLowerCase())
    );

    // Summary Logic
    const totalInventoryValue = filteredItems.reduce((sum, item) => sum + (item.unitPricePaise * (item.stock || 0)), 0);
    const topItem = filteredItems.length > 0 ? filteredItems.reduce((prev, current) => (prev.unitPricePaise > current.unitPricePaise) ? prev : current) : null;
    const lowStockItems = items.filter(i => i.type === 'product' && (i.stock || 0) <= (i.minimumStock || 5));

    // Modal States
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [isFormModalVisible, setIsFormModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
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

    const openFormModal = (item?: InventoryItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({ 
                name: item.name,
                type: item.type,
                unitPricePaise: item.unitPricePaise,
                purchasePricePaise: item.purchasePricePaise,
                hsnSacCode: item.hsnSacCode,
                gstRate: item.taxRate?.gstComponent?.igstRate || 0,
                unit: item.unit,
                stock: item.stock || 0,
                minimumStock: item.minimumStock,
                sku: item.sku,
                description: item.description,
            });
            setShowMoreDetails(false);
        } else {
            setEditingItem(null);
            setFormData({
                name: "",
                type: tab,
                unitPricePaise: 0,
                hsnSacCode: "",
                gstRate: 0,
                unit: "pcs",
                stock: 0,
            });
            setShowMoreDetails(false);
        }
        setIsFormModalVisible(true);
    };

    const closeFormModal = () => {
        setIsFormModalVisible(false);
        setEditingItem(null);
    };

    const handleCloseFormModal = () => {
        const isDirty = editingItem
            ? formData.name !== editingItem.name || formData.unitPricePaise !== editingItem.unitPricePaise
            : !!(formData.name || formData.unitPricePaise);

        if (isDirty) {
            Alert.alert(
                "Discard Changes?",
                "You have unsaved changes. Are you sure you want to discard them?",
                [
                    { text: "Keep Editing", style: "cancel" },
                    { text: "Discard", style: "destructive", onPress: closeFormModal }
                ]
            );
        } else {
            closeFormModal();
        }
    };

    const handleSave = () => {
        if (!formData.name?.trim()) {
            Alert.alert("Error", "InventoryItem Name is required");
            return;
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
            id: editingItem ? editingItem.id : `i${Date.now()}`,
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

        if (editingItem) {
            updateItem(itemData);
        } else {
            addItem(itemData);
        }

        closeFormModal();
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete InventoryItem",
            "Are you sure you want to delete this item?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteItem(id)
                }
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <ArrowLeft color="#081126" size={24} />
                    </Pressable>
                    <Text className="text-2xl font-sans-bold text-primary">Inventory</Text>
                </View>
                <Pressable onPress={() => {
                    if (view === 'catalog') openFormModal();
                    else router.push('/(app)/(inventory)/create-stock-adjustment' as any);
                }} className="p-2 bg-primary rounded-full">
                    <Plus color="white" size={20} />
                </Pressable>
            </View>

            <View className="bg-white">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 py-3 border-b border-border">
                    {[
                        { id: "catalog", label: "Catalog" },
                        { id: "adjustments", label: "Stock Adjustments" }
                    ].map((t) => (
                        <Pressable 
                            key={t.id}
                            onPress={() => setView(t.id as never)}
                            className={`mr-3 px-4 py-2 rounded-full border ${view === t.id ? 'bg-primary border-primary' : 'bg-transparent border-border'}`}
                        >
                            <Text className={`font-sans-medium ${view === t.id ? 'text-white' : 'text-muted-foreground'}`}>{t.label}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {view === 'catalog' && (
                <View className="px-5 pt-4 pb-4 flex-row">
                    {[
                        { id: "product", label: "Products" },
                        { id: "service", label: "Services" }
                    ].map((t) => (
                        <Pressable 
                            key={t.id}
                            onPress={() => setTab(t.id as never)}
                            className={`mr-3 px-4 py-2 rounded-lg border ${tab === t.id ? 'bg-white border-border shadow-sm' : 'bg-transparent border-transparent'}`}
                        >
                            <Text className={`font-sans-bold ${tab === t.id ? 'text-primary' : 'text-muted-foreground'}`}>{t.label}</Text>
                        </Pressable>
                    ))}
                </View>
            )}

            {/* Summary Card */}
            {view === 'catalog' && (
                <>
                    {tab === 'product' && lowStockItems.length > 0 && (
                        <View className="px-5 mb-4">
                            <View className="bg-red-50 border border-red-200 rounded-2xl p-4 flex-row items-center shadow-sm">
                                <View className="h-10 w-10 bg-red-100 rounded-full items-center justify-center mr-4">
                                    <AlertCircle color="#ef4444" size={20} />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-sans-bold text-red-700">Low Stock Alert</Text>
                                    <Text className="font-sans-medium text-xs text-red-600 mt-0.5">{lowStockItems.length} items need restocking</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    <View className="px-5 mb-4">
                        <View className="bg-white rounded-2xl p-4 flex-row border border-border shadow-sm">
                    {tab === 'product' ? (
                        <View className="flex-1 border-r border-border pl-2">
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Inventory Value</Text>
                            <Text className="font-sans-bold text-lg text-primary">{formatINR(totalInventoryValue)}</Text>
                        </View>
                    ) : (
                        <View className="flex-1 border-r border-border pl-2">
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Active Services</Text>
                            <Text className="font-sans-bold text-lg text-primary">{filteredItems.length}</Text>
                        </View>
                    )}
                    <View className="flex-1 pl-4 justify-center">
                        <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Top Valued</Text>
                        <Text className="font-sans-bold text-sm text-primary" numberOfLines={1}>{topItem?.name || "None"}</Text>
                        {topItem && <Text className="font-sans-medium text-[10px] text-green-600">{formatINR(topItem.unitPricePaise)}</Text>}
                    </View>
                </View>
            </View>
            </>
            )}

            {view === 'catalog' && (
                <View className="px-5 mb-4">
                    <View className="flex-row items-center bg-white px-4 h-12 rounded-xl border border-border">
                        <Search color="#9ca3af" size={20} />
                        <TextInput
                            className="flex-1 ml-3 h-full font-sans-regular text-base text-primary"
                            placeholder={`Search ${tab}s...`}
                            placeholderTextColor="#9ca3af"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                </View>
            )}

            {view === 'catalog' ? (
                <FlatList
                    className="flex-1 px-5" 
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#208AEF" />}
                    data={filteredItems}
                    keyExtractor={(item) => item.id}
                    initialNumToRender={15}
                    maxToRenderPerBatch={10}
                    renderItem={({ item }) => (
                        <Card className="flex-row items-center mb-4 p-4" isPressable onPress={() => setSelectedItem(item)}>
                            <View className="size-12 rounded-lg bg-[#e3e8fc] items-center justify-center mr-4">
                                {tab === "product" ? (
                                    <Package color="#081126" size={24} />
                                ) : (
                                    <Briefcase color="#081126" size={24} />
                                )}
                            </View>
                            <View className="flex-1 mr-2">
                                <Text className="font-sans-bold text-lg text-primary mb-1" numberOfLines={1}>{item.name}</Text>
                                <Text className="font-sans-medium text-xs text-muted-foreground" numberOfLines={1}>
                                    {tab === "product" ? "HSN" : "SAC"}: {item.hsnSacCode || "N/A"} • GST @ {item.taxRate.gstComponent.igstRate}%
                                </Text>
                            </View>
                            <View className="items-end flex-shrink-0">
                                <Text className="font-sans-bold text-base text-primary" numberOfLines={1} adjustsFontSizeToFit>
                                    {formatINR(item.unitPricePaise)}
                                </Text>
                                {tab === "product" && (
                                    <Text className="font-sans-medium text-xs text-muted-foreground mt-1">
                                        Stock: <Text className={item.stock && item.stock > (item.minimumStock || 5) ? "text-green-600" : "text-red-600"}>{item.stock || 0}</Text>
                                    </Text>
                                )}
                            </View>
                        </Card>
                    )}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-10">
                            <Text className="font-sans-medium text-muted-foreground">No {tab}s found.</Text>
                        </View>
                    }
                />
            ) : (
                <FlatList
                    className="flex-1 px-5" 
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#208AEF" />}
                    data={adjustments}
                    keyExtractor={(adj) => adj.id}
                    initialNumToRender={15}
                    maxToRenderPerBatch={10}
                    renderItem={({ item: adj }) => (
                        <Card className="flex-row items-center mb-4 p-4">
                            <View className={`size-12 rounded-lg items-center justify-center mr-4 ${adj.type === 'Stock In' ? 'bg-green-100' : 'bg-amber-100'}`}>
                                {adj.type === 'Stock In' ? (
                                    <ArrowDownRight color="#16a34a" size={24} />
                                ) : (
                                    <ArrowUpRight color="#d97706" size={24} />
                                )}
                            </View>
                            <View className="flex-1 mr-2">
                                <Text className="font-sans-bold text-base text-primary mb-1" numberOfLines={1}>{adj.itemName}</Text>
                                <Text className="font-sans-medium text-xs text-muted-foreground" numberOfLines={1}>
                                    {adj.date} • {adj.reason}
                                </Text>
                            </View>
                            <View className="items-end flex-shrink-0">
                                <Text className={`font-sans-bold text-lg ${adj.type === 'Stock In' ? 'text-green-600' : 'text-amber-600'}`} numberOfLines={1} adjustsFontSizeToFit>
                                    {adj.type === 'Stock In' ? '+' : '-'}{adj.qty}
                                </Text>
                            </View>
                        </Card>
                    )}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-10">
                            <Text className="font-sans-medium text-muted-foreground">No adjustments recorded yet.</Text>
                        </View>
                    }
                />
            )}

            {/* Details Modal */}
            <AnimatedModal visible={!!selectedItem} onClose={() => setSelectedItem(null)}>
                {selectedItem && (
                    <View className="bg-white rounded-t-3xl p-6 min-h-[350px]">
                        <View className="flex-row justify-between items-start mb-6">
                            <View className="flex-1 mr-4">
                                <Text className="font-sans-bold text-2xl text-primary mb-1">{selectedItem.name}</Text>
                                <Text className="font-sans-medium text-base text-muted-foreground">
                                    {selectedItem.type === 'product' ? `HSN: ${selectedItem.hsnSacCode || 'N/A'}` : `SAC: ${selectedItem.hsnSacCode || 'N/A'}`} • GST @ {selectedItem.taxRate.gstComponent.igstRate}%
                                </Text>
                            </View>
                            <Pressable onPress={() => setSelectedItem(null)} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                                <X color="#64748b" size={20} />
                            </Pressable>
                        </View>

                        <View className="p-4 rounded-2xl bg-slate-50 border border-border flex-row justify-between items-center mb-6">
                            <View>
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Selling Price</Text>
                                <Text className="font-sans-bold text-2xl text-primary">
                                    {formatINR(selectedItem.unitPricePaise)}
                                </Text>
                            </View>
                            {selectedItem.type === 'product' && (
                                <View className={`px-3 py-1.5 rounded-md border ${selectedItem.stock && selectedItem.stock > 10 ? 'bg-green-100 border-green-200' : 'bg-amber-100 border-amber-200'}`}>
                                    <Text className={`font-sans-bold text-xs uppercase ${selectedItem.stock && selectedItem.stock > 10 ? 'text-green-700' : 'text-amber-700'}`}>
                                        Stock: {selectedItem.stock || 0}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {selectedItem.description && (
                            <View className="mb-6">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Description</Text>
                                <Text className="font-sans-regular text-primary">{selectedItem.description}</Text>
                            </View>
                        )}

                        <View className="flex-row space-x-4">
                            <Pressable
                                onPress={() => {
                                    setSelectedItem(null);
                                    openFormModal(selectedItem);
                                }}
                                className="flex-1 bg-blue-100 py-4 rounded-xl flex-row justify-center items-center mr-2"
                            >
                                <Edit color="#208AEF" size={18} className="mr-2" />
                                <Text className="font-sans-bold text-primary text-base">Edit</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    handleDelete(selectedItem.id);
                                    setSelectedItem(null);
                                }}
                                className="flex-1 border border-red-200 py-4 rounded-xl flex-row justify-center items-center ml-2"
                            >
                                <Trash2 color="#ef4444" size={18} className="mr-2" />
                                <Text className="font-sans-bold text-red-500 text-base">Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </AnimatedModal>

            {/* Form Modal */}
            <AnimatedModal visible={isFormModalVisible} onClose={handleCloseFormModal} avoidKeyboard>
                <View className="bg-white rounded-t-3xl p-6 pb-12 h-[92%] flex-col">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-sans-bold text-2xl text-primary">
                            {editingItem ? 'Edit' : 'Add'} {formData.type === 'product' ? 'Product' : 'Service'}
                        </Text>
                        <View className="flex-row items-center">
                            {editingItem && (
                                <Pressable onPress={() => { closeFormModal(); handleDelete(editingItem.id); }} className="p-2 bg-red-50 rounded-full mr-2">
                                    <Trash2 color="#ef4444" size={20} />
                                </Pressable>
                            )}
                            <Pressable onPress={handleCloseFormModal} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                                <X color="#64748b" size={20} />
                            </Pressable>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                        {!editingItem && (
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
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-2">InventoryItem Name *</Text>
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
                                    <View className="flex-1 ml-2">
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2">{formData.type === 'product' ? 'HSN Code' : 'SAC Code'}</Text>
                                        <TextInput
                                            className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                            placeholder="e.g. 8471"
                                            value={formData.hsnSacCode}
                                            onChangeText={(text) => setFormData({ ...formData, hsnSacCode: text })}
                                        />
                                    </View>
                                </View>
                                
                                <Text className="font-sans-bold text-lg text-primary mb-4 mt-6">InventoryItem Identity</Text>
                                <View className="mb-4 flex-row">
                                    <View className="flex-1 mr-2">
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2">InventoryItem Code / SKU</Text>
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
                                    <Text className="font-sans-medium text-primary mb-2">Upload InventoryItem Image</Text>
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
        </SafeAreaView>
    );
}
