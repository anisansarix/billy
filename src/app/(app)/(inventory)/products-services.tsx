import { InventoryItem } from "@/types/entities";
import { ListCardSkeleton } from "@/components/ui/skeletons/ListCardSkeleton";
import { useDeferredRender } from "@/hooks/useDeferredRender";
import { useTabTransition } from "@/hooks/useTabTransition";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { useShallow } from 'zustand/react/shallow';
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Briefcase, Package, Plus, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react-native";
import { useState, useEffect } from "react";
import {  Pressable, ScrollView, Text, View, RefreshControl, FlatList , Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterPills } from "@/components/ui/FilterPills";
import Card from "@/components/ui/Card";
import { useAppStore } from "@/store";
import "../../../../global.css";
import { formatINR } from "@/utils/money";
import InventoryItemDetailsModal from "@/components/domain/inventory/InventoryItemDetailsModal";

export default function ProductsServicesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ filter?: string }>();
    const [view, setView] = useState<"catalog" | "adjustments">("catalog");
    const [tab, setTab] = useState<"product" | "service">("product");
    const [search, setSearch] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    
    const toggleFilter = (filter: string) => {
        startTransition(() => {
            setActiveFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
        });
    };

    useEffect(() => {
        if (params.filter === 'LOW_STOCK' && !activeFilters.includes('Low Stock')) {
            startTransition(() => {
                setActiveFilters(prev => [...prev, 'Low Stock']);
            });
        }
    }, [params.filter]);

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
        i => {
            if (i.type !== tab) return false;
            if (!i.name.toLowerCase().includes(search.toLowerCase())) return false;
            
            let matchesFilters = true;
            if (activeFilters.length > 0) {
                if (activeFilters.includes("Recently added")) {
                    const daysDiff = (new Date().getTime() - new Date(i.createdAt || 0).getTime()) / (1000 * 3600 * 24);
                    if (daysDiff > 7) matchesFilters = false;
                }
                if (matchesFilters && activeFilters.includes("Low stock")) {
                    if (i.type !== 'product' || (i.stock || 0) > (i.minimumStock || 5)) matchesFilters = false;
                }
                if (matchesFilters && activeFilters.includes("High Stock")) {
                    if (i.type !== 'product' || (i.stock || 0) <= (i.minimumStock || 5)) matchesFilters = false;
                }
            }
            return matchesFilters;
        }
    ).sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());

    // Summary Logic
    const totalInventoryValue = filteredItems.reduce((sum, item) => sum + (item.unitPricePaise * (item.stock || 0)), 0);
    const topItem = filteredItems.length > 0 ? filteredItems.reduce((prev, current) => (prev.unitPricePaise > current.unitPricePaise) ? prev : current) : null;
    const lowStockItems = items.filter(i => i.type === 'product' && (i.stock || 0) <= (i.minimumStock || 5));

    // Modal States
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const openFormModal = (item?: InventoryItem) => {
        if (item) {
            router.push({ pathname: '/(app)/(inventory)/item-form', params: { id: item.id, tab: tab } } as never);
        } else {
            router.push({ pathname: '/(app)/(inventory)/item-form', params: { tab: tab } } as never);
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
                <View className="pb-2">
                    <SearchBar 
                        value={search} 
                        onChangeText={setSearch} 
                        placeholder={`Search ${tab}s...`} 
                        className="px-5 mt-4" 
                    />
                    <FilterPills
                        options={["Recently added", "Low stock", "High Stock"]}
                        activeFilters={activeFilters}
                        onToggleFilter={toggleFilter}
                    />
                </View>
            )}
        </View>
    );
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            {/* Header */}
            <View className="flex-row items-center p-4 bg-white shadow-sm z-10 border-b border-border">
                <Pressable onPress={() => { Vibration.vibrate(10); router.back(); }} className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
                    <ArrowLeft color="#081126" size={24} />
                </Pressable>
                <View className="ml-2 flex-1">
                    <Text className="text-lg font-sans-bold text-primary">Inventory</Text>
                    <Text className="text-xs font-sans-medium text-muted-foreground">Manage products and services</Text>
                </View>
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
                    renderItem={({ item }) => {
                        const isLowStock = item.stock && item.stock <= (item.minimumStock || 5);
                        const stockStyle = isLowStock ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-green-500';
                        return (
                        <Card className={`flex-row items-center mb-4 p-4 mx-5 ${stockStyle}`} isPressable onPress={() => setSelectedItem(item)}>
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
                        );
                    }}
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
                    data={[...adjustments].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
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

            <Pressable 
                onPress={() => { Vibration.vibrate(10); if (view === 'catalog') openFormModal(); else router.push('/(app)/(inventory)/create-stock-adjustment' as const); }}
                className="absolute bottom-6 right-6 h-14 w-14 bg-primary rounded-full items-center justify-center shadow-lg"
                style={{ elevation: 5, shadowColor: '#081126', shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: 0, height: 3 } }}
            >
                <Plus color="white" size={24} />
            </Pressable>

            <InventoryItemDetailsModal
                visible={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                item={selectedItem}
                onEdit={() => {
                    if (selectedItem) {
                        openFormModal(selectedItem);
                        setSelectedItem(null);
                    }
                }}
                onDelete={handleDelete}
            />
        </SafeAreaView>
    );
}
