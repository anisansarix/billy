import { InventoryItem } from "@/types/entities";
import { ListCardSkeleton } from "@/components/ui/skeletons/ListCardSkeleton";
import { useDeferredRender } from "@/hooks/useDeferredRender";
import { useTabTransition } from "@/hooks/useTabTransition";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";


import { useShallow } from 'zustand/react/shallow';
import { useRouter } from "expo-router";
import { ArrowLeft, Briefcase, Package, Plus, Search, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react-native";
import { useState } from "react";
import {  Pressable, ScrollView, Text, TextInput, View, RefreshControl, FlatList , Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "@/components/ui/Card";
import { useAppStore } from "@/store";
import "../../../../global.css";
import { formatINR } from "@/utils/money";
import InventoryItemDetailsModal from "@/components/domain/inventory/InventoryItemDetailsModal";
import InventoryItemFormModal from "@/components/domain/inventory/InventoryItemFormModal";

export default function ProductsServicesScreen() {
    const router = useRouter();
    const [view, setView] = useState<"catalog" | "adjustments">("catalog");
    const [tab, setTab] = useState<"product" | "service">("product");
    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    // Data State
    const isReady = useDeferredRender();
    const { isTabReady, startTransition } = useTabTransition();
    const isFullyReady = isReady && isTabReady;
    const { items, deleteItem, adjustments } = useAppStore(useShallow(state => ({ items: state.items, deleteItem: state.deleteItem, adjustments: state.adjustments })));

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

    const openFormModal = (item?: InventoryItem) => {
        if (item) {
            setEditingItem(item);
        } else {
            setEditingItem(null);
        }
        setIsFormModalVisible(true);
    };

    const closeFormModal = () => {
        setIsFormModalVisible(false);
        setEditingItem(null);
    };

    const handleFormSaveSuccess = (item: InventoryItem) => {
        closeFormModal();
        if (editingItem && selectedItem?.id === editingItem.id) {
            setSelectedItem(item);
        }
    };

    const handleDelete = (id: string) => {
        deleteItem(id);
        if (selectedItem?.id === id) {
            setSelectedItem(null);
        }
    };

    const header = (
        <View className="pt-4">
            <SegmentedTabs 
                tabs={["Catalog", "Stock Adjustments"]} 
                activeTab={view === "catalog" ? "Catalog" : "Stock Adjustments"} 
                onTabChange={(t) => startTransition(() => setView(t === "Catalog" ? "catalog" : "adjustments"))} 
            />

            {view === 'catalog' && (
                <View className="flex-row px-5 mt-4 mb-2 gap-3">
                    <Pressable 
                        onPress={() => startTransition(() => setTab('product'))}
                        className={`px-4 py-2 rounded-full border ${tab === 'product' ? 'bg-primary border-primary' : 'bg-transparent border-border'}`}
                    >
                        <Text className={`font-sans-medium text-sm ${tab === 'product' ? 'text-white' : 'text-muted-foreground'}`}>Products</Text>
                    </Pressable>
                    <Pressable 
                        onPress={() => startTransition(() => setTab('service'))}
                        className={`px-4 py-2 rounded-full border ${tab === 'service' ? 'bg-primary border-primary' : 'bg-transparent border-border'}`}
                    >
                        <Text className={`font-sans-medium text-sm ${tab === 'service' ? 'text-white' : 'text-muted-foreground'}`}>Services</Text>
                    </Pressable>
                </View>
            )}

            {/* Summary Card */}
            {view === 'catalog' && (
                <>
                    {tab === 'product' && lowStockItems.length > 0 && (
                        <View className="px-5 mb-4 mt-2">
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
        </View>
    );
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10">
                <View className="flex-row items-center">
                    <Pressable onPress={() => { Vibration.vibrate(10); router.back(); }} className="mr-4">
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

            {view === 'catalog' ? (
                !isFullyReady ? (
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {header}
                    <View className="flex-1 pt-4">
                        <View className="px-5"><ListCardSkeleton /></View>
                        <View className="px-5"><ListCardSkeleton /></View>
                        <View className="px-5"><ListCardSkeleton /></View>
                        <View className="px-5"><ListCardSkeleton /></View>
                    </View>
                </ScrollView>
            ) : (
                <FlatList
                    ListHeaderComponent={header}
                    className="flex-1" 
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#208AEF" />}
                    data={filteredItems}
                    keyExtractor={(item) => item.id}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    removeClippedSubviews={true}
                    renderItem={({ item }) => (
                        <Card className="flex-row items-center mb-4 p-4 mx-5" isPressable onPress={() => setSelectedItem(item)}>
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
            )
            ) : (
                !isFullyReady ? (
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {header}
                    <View className="flex-1 pt-4">
                        <View className="px-5"><ListCardSkeleton /></View>
                        <View className="px-5"><ListCardSkeleton /></View>
                        <View className="px-5"><ListCardSkeleton /></View>
                        <View className="px-5"><ListCardSkeleton /></View>
                    </View>
                </ScrollView>
            ) : (
                <FlatList
                    ListHeaderComponent={header}
                    className="flex-1" 
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#208AEF" />}
                    data={adjustments}
                    keyExtractor={(adj) => adj.id}
                    initialNumToRender={15}
                    maxToRenderPerBatch={10}
                    renderItem={({ item: adj }) => (
                        <Card className="flex-row items-center mb-4 p-4 mx-5">
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
            )
            )}

            <InventoryItemDetailsModal
                visible={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                item={selectedItem}
                onEdit={(item) => openFormModal(item)}
                onDelete={handleDelete}
            />

            <InventoryItemFormModal
                visible={isFormModalVisible}
                onClose={closeFormModal}
                itemToEdit={editingItem}
                initialTab={tab}
                onSaveSuccess={handleFormSaveSuccess}
                onDelete={handleDelete}
            />
        </SafeAreaView>
    );
}
