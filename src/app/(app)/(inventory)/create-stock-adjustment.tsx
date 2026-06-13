import { InventoryItem, StockAdjustmentRecord } from "@/types/entities";
import { useRouter } from "expo-router";
import { useShallow } from 'zustand/react/shallow';
import { ArrowLeft, Save, Search } from "lucide-react-native";
import { useState, useMemo } from "react";
import { Pressable, ScrollView, Text, TextInput, View, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/store";
import "../../../../global.css";
import AnimatedModal from "@/components/ui/AnimatedModal";
import { formatINR } from "@/utils/money";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";

export default function CreateStockAdjustmentScreen() {
    const router = useRouter();
    const {  items, addAdjustment, updateItem  } = useAppStore(useShallow(state => ({ items: state.items, addAdjustment: state.addAdjustment, updateItem: state.updateItem })));
    
    const [type, setType] = useState<"Stock In" | "Stock Out">("Stock In");
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [qty, setQty] = useState("");
    const [reason, setReason] = useState<StockAdjustmentRecord["reason"]>("Other");
    const [notes, setNotes] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // InventoryItem Selection Modal
    const [isItemModalVisible, setIsItemModalVisible] = useState(false);
    const [search, setSearch] = useState("");

    const filteredItems = useMemo(() => 
        items.filter(i => i.type === 'product' && i.name.toLowerCase().includes(search.toLowerCase())),
    [items, search]);

    const handleSave = () => {
        if (!selectedItem) {
            Alert.alert("Error", "Please select an item");
            return;
        }
        if (!qty || isNaN(Number(qty)) || Number(qty) <= 0) {
            Alert.alert("Error", "Please enter a valid quantity");
            return;
        }

        const quantity = Number(qty);
        const adjustment: StockAdjustmentRecord = {
            id: `adj-${Date.now()}`,
            date,
            itemId: selectedItem.id,
            itemName: selectedItem.name,
            type,
            qty: quantity,
            reason,
            notes
        };

        // Update InventoryItem Stock
        const newStock = type === 'Stock In' 
            ? (selectedItem.stock || 0) + quantity
            : (selectedItem.stock || 0) - quantity;

        if (newStock < 0) {
            Alert.alert("Error", "Stock Out quantity cannot exceed available stock.");
            return;
        }

        updateItem({ ...selectedItem, stock: newStock });
        addAdjustment(adjustment);
        
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <ArrowLeft color="#081126" size={24} />
                    </Pressable>
                    <Text className="text-xl font-sans-bold text-primary">New Stock Adjustment</Text>
                </View>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
                    
                    {/* Type Selection */}
                    <View className="mb-6">
                        <SegmentedTabs 
                            tabs={["Stock In", "Stock Out"]} 
                            activeTab={type} 
                            onTabChange={(t) => setType(t as "Stock In" | "Stock Out")} 
                        />
                    </View>

                    {/* InventoryItem Selection */}
                    <View className="mb-6">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Product *</Text>
                        <Pressable 
                            onPress={() => setIsItemModalVisible(true)}
                            className="bg-white border border-border rounded-xl px-4 py-4 flex-row justify-between items-center"
                        >
                            <Text className={`font-sans-regular text-base ${selectedItem ? 'text-primary' : 'text-muted-foreground'}`}>
                                {selectedItem ? selectedItem.name : "Select Product"}
                            </Text>
                            {selectedItem && (
                                <View className="bg-slate-100 px-2 py-1 rounded-md">
                                    <Text className="font-sans-medium text-xs text-primary">Stock: {selectedItem.stock || 0}</Text>
                                </View>
                            )}
                        </Pressable>
                    </View>

                    {/* Quantity & Date */}
                    <View className="flex-row mb-6">
                        <View className="flex-1 mr-2">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Quantity *</Text>
                            <TextInput
                                className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                placeholder="0"
                                keyboardType="numeric"
                                value={qty}
                                onChangeText={setQty}
                            />
                        </View>
                        <View className="flex-1 ml-2">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Date *</Text>
                            <TextInput
                                className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base"
                                value={date}
                                onChangeText={setDate}
                            />
                        </View>
                    </View>

                    {/* Reason */}
                    <View className="mb-6">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Reason</Text>
                        <View className="flex-row flex-wrap">
                            {["Damage", "Internal Use", "Found", "Initial Stock", "Other"].map((r) => (
                                <Pressable
                                    key={r}
                                    onPress={() => setReason(r as StockAdjustmentRecord["reason"])}
                                    className={`mr-2 mb-2 px-4 py-2 rounded-full border ${reason === r ? 'bg-primary border-primary' : 'bg-white border-border'}`}
                                >
                                    <Text className={`font-sans-medium text-sm ${reason === r ? 'text-white' : 'text-muted-foreground'}`}>{r}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Notes */}
                    <View className="mb-8">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-2">Notes</Text>
                        <TextInput
                            className="bg-white border border-border rounded-xl px-4 py-4 font-sans-regular text-primary text-base min-h-[100px]"
                            placeholder="Add internal notes..."
                            multiline
                            textAlignVertical="top"
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>

                </ScrollView>

                <View className="p-5 bg-white border-t border-border">
                    <Pressable
                        onPress={handleSave}
                        className="bg-primary py-4 rounded-xl flex-row justify-center items-center shadow-md shadow-primary/30"
                    >
                        <Save color="white" size={20} className="mr-2" />
                        <Text className="font-sans-bold text-white text-lg">Save Adjustment</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>

            {/* Select InventoryItem Modal */}
            <AnimatedModal visible={isItemModalVisible} onClose={() => setIsItemModalVisible(false)} placement="bottom" avoidKeyboard>
                <View className="bg-white rounded-t-3xl p-6 h-[80%]">
                    <Text className="font-sans-bold text-xl text-primary mb-4">Select Product</Text>
                    <View className="flex-row items-center bg-slate-100 px-4 h-12 rounded-xl mb-4">
                        <Search color="#9ca3af" size={20} />
                        <TextInput
                            className="flex-1 ml-3 h-full font-sans-regular text-base text-primary"
                            placeholder="Search products..."
                            placeholderTextColor="#9ca3af"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {filteredItems.length === 0 ? (
                            <View className="py-8 items-center justify-center">
                                <Text className="font-sans-medium text-muted-foreground text-center">No products found.</Text>
                            </View>
                        ) : (
                            filteredItems.map(item => (
                                <Pressable 
                                    key={item.id}
                                    className="py-4 border-b border-border flex-row justify-between items-center"
                                    onPress={() => {
                                        setSelectedItem(item);
                                        setIsItemModalVisible(false);
                                    }}
                                >
                                    <View>
                                        <Text className="font-sans-bold text-base text-primary mb-1">{item.name}</Text>
                                        <Text className="font-sans-medium text-xs text-muted-foreground">{formatINR(item.unitPricePaise)}</Text>
                                    </View>
                                    <View className="bg-slate-100 px-3 py-1.5 rounded-md">
                                        <Text className="font-sans-medium text-xs text-primary">Stock: {item.stock || 0}</Text>
                                    </View>
                                </Pressable>
                            ))
                        )}
                    </ScrollView>
                </View>
            </AnimatedModal>
        </SafeAreaView>
    );
}
