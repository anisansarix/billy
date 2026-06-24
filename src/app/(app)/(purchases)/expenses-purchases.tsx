import { useRouter } from "expo-router";
import { ArrowLeft, Plus, Receipt, Wallet, Box } from "lucide-react-native";
import { useState } from "react";
import {  Pressable, ScrollView, Text, View, RefreshControl, FlatList , Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "@/components/ui/Card";
import { useAppStore } from "@/store";
import { useShallow } from 'zustand/react/shallow';
import { ExpenseRecord, PurchaseOrder } from "@/types/entities";
import { ListCardSkeleton } from "@/components/ui/skeletons/ListCardSkeleton";
import { useDeferredRender } from "@/hooks/useDeferredRender";
import { useTabTransition } from "@/hooks/useTabTransition";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import "../../../../global.css";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatINR } from "@/utils/money";
import { formatDate } from "@/utils/date";
import { FilterPills } from "@/components/ui/FilterPills";
import { SearchBar } from "@/components/ui/SearchBar";
import ExpenseDetailsModal from "@/components/domain/purchases/ExpenseDetailsModal";
import PurchaseDetailsModal from "@/components/domain/purchases/PurchaseDetailsModal";
import ExpenseFormModal from "@/components/domain/purchases/ExpenseFormModal";
export default function ExpenseRecordsPurchasesScreen() {
    const router = useRouter();
    const isReady = useDeferredRender();
    const { isTabReady, startTransition } = useTabTransition();
    const isFullyReady = isReady && isTabReady;
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    
    const toggleFilter = (filter: string) => {
        startTransition(() => {
            setActiveFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
        });
    };
    const [mainTab, setMainTab] = useState<"purchases" | "expenses">("purchases");

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    const { expenses, deleteExpense, purchases, deletePurchase } = useAppStore(useShallow(state => ({
        expenses: state.expenses,
        addExpense: state.addExpense,
        updateExpense: state.updateExpense,
        deleteExpense: state.deleteExpense,
        purchases: state.purchases,
        deletePurchase: state.deletePurchase
    })));

    // ExpenseRecord Form State
    const [isExpenseRecordFormVisible, setIsExpenseRecordFormVisible] = useState(false);
    const [editingExpenseRecord, setEditingExpenseRecord] = useState<ExpenseRecord | null>(null);

    // Details Modals State
    const [selectedExpenseRecord, setSelectedExpenseRecord] = useState<ExpenseRecord | null>(null);
    const [selectedPurchase, setSelectedPurchase] = useState<PurchaseOrder | null>(null);

    // Filter Logic
    const filteredExpenseRecords = expenses.filter(exp => {
        const vendor = exp.vendorName || "";
        const cat = exp.category || "";
        const matchesSearch = vendor.toLowerCase().includes(search.toLowerCase()) || cat.toLowerCase().includes(search.toLowerCase());
        
        let matchesFilters = true;
        if (activeFilters.length > 0) {
            if (activeFilters.includes("Recent")) {
                const daysDiff = (new Date().getTime() - new Date(exp.date).getTime()) / (1000 * 3600 * 24);
                if (daysDiff > 7) matchesFilters = false;
            }
            const statusFilters = activeFilters.filter(f => f !== "Recent");
            if (matchesFilters && statusFilters.length > 0 && !statusFilters.includes("Paid")) {
                matchesFilters = false;
            }
        }
        return matchesSearch && matchesFilters;
    }).sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());

    const filteredPurchases = purchases.filter(pur => {
        const vendorName = pur.partyName || "";
        const matchesSearch = vendorName.toLowerCase().includes(search.toLowerCase()) || pur.documentNumber?.toLowerCase().includes(search.toLowerCase());
        
        let matchesFilters = true;
        if (activeFilters.length > 0) {
            const statusFilters = activeFilters.filter(f => f !== "Recent");
            if (statusFilters.length > 0) {
                matchesFilters = statusFilters.includes(pur.status);
            }
            if (matchesFilters && activeFilters.includes("Recent")) {
                const daysDiff = (new Date().getTime() - new Date(pur.documentDate).getTime()) / (1000 * 3600 * 24);
                if (daysDiff > 7) matchesFilters = false;
            }
        }
        return matchesSearch && matchesFilters;
    }).sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());

    // Summaries
    const totalExpenseRecords = filteredExpenseRecords.reduce((sum, exp) => sum + (exp.amountPaise || 0), 0);
    const totalPurchasesOutstanding = filteredPurchases.reduce((sum, pur) => {
        if (pur.status === "Pending" || pur.status === "Overdue" || pur.status === "Partially Paid") {
            return sum + pur.totalAmountPaise;
        }
        return sum;
    }, 0);

    // ExpenseRecord Handlers
    const openExpenseRecordForm = (exp?: ExpenseRecord) => {
        if (exp) {
            setEditingExpenseRecord(exp);
        } else {
            setEditingExpenseRecord(null);
        }
        setIsExpenseRecordFormVisible(true);
        setSelectedExpenseRecord(null); // close details if open
    };

    const handleDeleteExpenseRecord = (id: string) => {
        deleteExpense(id);
        setSelectedExpenseRecord(null);
    };

    // Purchase Handlers
    const handleDeletePurchase = (id: string) => {
        deletePurchase(id);
        setSelectedPurchase(null);
    };

    const header = (
        <>
            {/* Main Tabs */}
            <View className="bg-white pb-1 pt-3">
                <SegmentedTabs 
                    tabs={["Purchases", "Expenses"]} 
                    activeTab={mainTab === "purchases" ? "Purchases" : "Expenses"} 
                    onTabChange={(t) => startTransition(() => setMainTab(t === "Purchases" ? "purchases" : "expenses"))} 
                />
            </View>

            {/* Summary Cards */}
            <View className="px-5 mt-4 mb-2">
                <View className="bg-white rounded-2xl p-4 flex-row border border-border shadow-sm">
                    {mainTab === 'expenses' ? (
                        <View className="flex-1 pl-2">
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Total Expenses</Text>
                            <Text className="font-sans-bold text-lg text-primary">{formatINR(totalExpenseRecords)}</Text>
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mt-1">Based on current filters</Text>
                        </View>
                    ) : (
                        <View className="flex-1 pl-2">
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Total Outstanding Bills</Text>
                            <Text className="font-sans-bold text-lg text-red-500">{formatINR(totalPurchasesOutstanding)}</Text>
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mt-1">Based on current filters</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Search */}
            <View className="pb-2">
                <SearchBar 
                    value={search} 
                    onChangeText={setSearch} 
                    placeholder={`Search ${mainTab}...`} 
                    className="px-5 mt-4" 
                />
                <FilterPills
                    options={["Recent", "Paid", "Overdue"]}
                    activeFilters={activeFilters}
                    onToggleFilter={toggleFilter}
                />
            </View>
        </>
    );
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            {/* Header */}
            <View className="flex-row items-center p-4 bg-white shadow-sm z-10 border-b border-border">
                <Pressable onPress={() => { Vibration.vibrate(10); router.back(); }} className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
                    <ArrowLeft color="#081126" size={24} />
                </Pressable>
                <View className="ml-2 flex-1">
                    <Text className="text-lg font-sans-bold text-primary">Expenses & Purchases</Text>
                    <Text className="text-xs font-sans-medium text-muted-foreground">Track outgoing payments and bills</Text>
                </View>
            </View>
            {mainTab === 'expenses' ? (
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
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#208AEF" />}
                    data={filteredExpenseRecords}
                    keyExtractor={(exp) => exp.id}
                    initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={true}
                    renderItem={({ item: exp }) => (
                        <Card className="mb-4 mx-5 p-5 rounded-2xl shadow-sm border border-border" isPressable onPress={() => setSelectedExpenseRecord(exp)}>
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-row items-center flex-1 mr-2">
                                    <View className="bg-primary/10 p-2 rounded-full mr-3">
                                        <Receipt color="#081126" size={20} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-sans-bold text-base text-primary" numberOfLines={1}>{exp.category}</Text>
                                        {exp.vendorName ? (
                                            <Text className="font-sans-medium text-xs text-muted-foreground mt-0.5" numberOfLines={1}>{exp.vendorName}</Text>
                                        ) : null}
                                    </View>
                                </View>
                                <View className="items-end flex-shrink-0">
                                    <Text className="font-sans-bold text-lg text-primary" numberOfLines={1} adjustsFontSizeToFit>{formatINR(exp.amountPaise || 0)}</Text>
                                    <Text className="font-sans-medium text-xs text-muted-foreground mt-0.5">{formatDate(exp.date)}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center mt-2 border-t border-border pt-2">
                                <Wallet color="#64748b" size={14} />
                                <Text className="font-sans-medium text-xs text-slate-500 ml-1.5 uppercase">{exp.paymentMode}</Text>
                            </View>
                        </Card>
                    )}
                    ListEmptyComponent={<EmptyState title="No items found" subtitle="Nothing matches your search criteria." icon={<View />} />}
                />
            )
            ) : (
                /* Purchases List */
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
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#208AEF" />}
                    data={filteredPurchases}
                    keyExtractor={(pur) => pur.id}
                    initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={true}
                    renderItem={({ item: pur }) => {
                        const getStatusPillStyle = (status: string) => {
                            switch(status.toUpperCase()) {
                                case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
                                case 'PARTIAL': return 'bg-orange-100 text-orange-700 border-orange-200';
                                case 'OVERDUE': return 'bg-red-100 text-red-700 border-red-200';
                                default: return 'bg-blue-100 text-blue-700 border-blue-200';
                            }
                        };
                        const getStatusBorder = (status: string) => {
                            switch(status.toUpperCase()) {
                                case 'PAID': return 'border-l-[6px] border-l-green-500';
                                case 'PARTIAL': return 'border-l-[6px] border-l-orange-500';
                                case 'OVERDUE': return 'border-l-[6px] border-l-red-500';
                                default: return 'border-l-[6px] border-l-blue-500';
                            }
                        };
                        const borderStyle = getStatusBorder(pur.status);
                        const pillStyle = getStatusPillStyle(pur.status);
                        return (
                        <Card className={`mb-4 mx-5 p-5 rounded-2xl shadow-sm border border-border overflow-hidden ${borderStyle}`} isPressable onPress={() => router.push(`/(app)/(purchases)/purchase/${pur.id}` as never)}>
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1 mr-2">
                                    <Text className="font-sans-bold text-base text-primary" numberOfLines={1}>{pur.partyName || pur.partyName}</Text>
                                    <Text className="font-sans-medium text-xs text-muted-foreground mt-1">{pur.documentNumber} • {formatDate(pur.documentDate)}</Text>
                                </View>
                                <View className={`px-2 py-1 rounded-md border ${pillStyle.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('border-')).join(' ')} flex-shrink-0`}>
                                    <Text className={`font-sans-bold text-[10px] uppercase ${pillStyle.split(' ').find(c => c.startsWith('text-'))}`}>
                                        {pur.status}
                                    </Text>
                                </View>
                            </View>

                            <View className="h-[1px] w-full bg-border mb-3" />

                            <View className="flex-row justify-between items-center">
                                <View>
                                    <Text className="font-sans-medium text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Type</Text>
                                    <Text className="font-sans-bold text-sm text-primary">{pur.documentType}</Text>
                                </View>
                                <View className="items-end flex-shrink">
                                    <Text className="font-sans-medium text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total Amount</Text>
                                    <Text className="font-sans-bold text-lg text-primary" numberOfLines={1} adjustsFontSizeToFit>{formatINR(pur.totalAmountPaise)}</Text>
                                </View>
                            </View>
                        </Card>
                        );
                    }}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-20 px-5">
                            <View className="h-24 w-24 bg-primary/5 rounded-full items-center justify-center mb-6">
                                <Box color="#208AEF" size={40} opacity={0.5} />
                            </View>
                            <Text className="font-sans-bold text-xl text-primary mb-2 text-center">No Purchases Found</Text>
                            <Text className="font-sans-medium text-sm text-muted-foreground text-center mb-8">
                                {search ? `We couldn't find any purchases matching "${search}".` : "You haven't recorded any purchases. Create your first purchase order or bill."}
                            </Text>
                            {!search && (
                                <Pressable 
                                    onPress={() => router.push('/(app)/(purchases)/create-purchase')}
                                    className="bg-primary flex-row items-center justify-center px-6 py-3 rounded-xl min-h-[44px]"
                                >
                                    <Plus color="white" size={20} className="mr-2" />
                                    <Text className="font-sans-bold text-white text-base">Create Purchase</Text>
                                </Pressable>
                            )}
                        </View>
                    }
                />
            )
            )}

            {/* Floating Action Button */}
            <Pressable
                onPress={() => {
                    if (mainTab === 'expenses') openExpenseRecordForm();
                    else router.push('/(app)/(purchases)/create-purchase');
                }}
                className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-primary"
                style={{
                    elevation: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                }}
            >
                <Plus color="white" size={32} />
            </Pressable>

            <ExpenseDetailsModal
                visible={!!selectedExpenseRecord}
                onClose={() => setSelectedExpenseRecord(null)}
                expense={selectedExpenseRecord}
                onEdit={openExpenseRecordForm}
                onDelete={handleDeleteExpenseRecord}
            />

            <PurchaseDetailsModal
                visible={!!selectedPurchase}
                onClose={() => setSelectedPurchase(null)}
                purchase={selectedPurchase}
                onDelete={handleDeletePurchase}
            />

            <ExpenseFormModal
                visible={isExpenseRecordFormVisible}
                onClose={() => setIsExpenseRecordFormVisible(false)}
                expenseToEdit={editingExpenseRecord}
            />
        </SafeAreaView>
    );
}
