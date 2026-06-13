// @ts-nocheck
import { PaymentRecord } from "@/types/entities";

import { useRouter } from "expo-router";
import { useShallow } from 'zustand/react/shallow';
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Plus, Search, X, Edit, Trash2, CreditCard, Calendar } from "lucide-react-native";
import { useState } from "react";
import {  Pressable, ScrollView, Text, TextInput, View, RefreshControl, Alert, FlatList , Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDeferredRender } from "@/hooks/useDeferredRender";
import { useTabTransition } from "@/hooks/useTabTransition";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { ListCardSkeleton } from "@/components/ui/skeletons/ListCardSkeleton";
import AnimatedModal from "@/components/ui/AnimatedModal";
import Card from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppStore } from "@/store";
import "../../../../global.css";
import { formatINR } from "@/utils/money";
import { formatDate } from "@/utils/date";



export default function PaymentScreen() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState<"in" | "out">("in");
    const [refreshing, setRefreshing] = useState(false);

    const isReady = useDeferredRender();
    const { isTabReady, startTransition } = useTabTransition();
    const isFullyReady = isReady && isTabReady;
    
    const {  payments, addPayment, updatePayment, deletePayment  } = useAppStore(useShallow(state => ({ payments: state.payments, addPayment: state.addPayment, updatePayment: state.updatePayment, deletePayment: state.deletePayment })));

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    // Form State
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
    const [formData, setFormData] = useState({
        partyName: "",
        amount: "",
        mode: "UPI",
        type: "in" as "in" | "out",
    });

    // Details State
    const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

    // Filters & Computations
    const filteredPayments = payments.filter(pay => {
        const matchesTab = pay.type === tab;
        const matchesSearch = pay.partyName.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const totalMoneyIn = payments.filter(p => p.type === 'in').reduce((sum, p) => sum + p.amountPaise, 0);
    const totalMoneyOut = payments.filter(p => p.type === 'out').reduce((sum, p) => sum + p.amountPaise, 0);

    // Handlers
    const openForm = (pay?: PaymentRecord) => {
        if (pay) {
            setEditingPayment(pay);
            setFormData({
                partyName: pay.partyName,
                amount: (pay.amountPaise / 100).toString(),
                mode: pay.mode,
                type: pay.type,
            });
        } else {
            setEditingPayment(null);
            setFormData({ partyName: "", amount: "", mode: "UPI", type: tab });
        }
        setIsFormVisible(true);
        setSelectedPayment(null);
    };

    const handleSave = () => {
        if (!formData.partyName || !formData.amount) {
            Alert.alert("Error", "Please fill party name and amount.");
            return;
        }

        const payData: PaymentRecord = {
            id: editingPayment ? editingPayment.id : `pay-${Date.now()}`,
            date: editingPayment ? editingPayment.date : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            partyName: formData.partyName,
            amountPaise: Math.round(parseFloat(formData.amount) * 100),
            mode: formData.mode as PaymentRecord["mode"],
            type: formData.type,
            partyId: editingPayment ? editingPayment.partyId : `party-${Date.now()}`
        };

        if (editingPayment) updatePayment(payData);
        else addPayment(payData);

        setIsFormVisible(false);
    };

    const handleDelete = (id: string) => {
        Alert.alert("Delete PaymentRecord", "Are you sure you want to delete this payment record?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => { deletePayment(id); setSelectedPayment(null); } }
        ]);
    };

    const header = (
        <>
            {/* Tabs */}
            <View className="bg-white pb-1 pt-3">
                <SegmentedTabs 
                    tabs={["Money In", "Money Out"]} 
                    activeTab={tab === "in" ? "Money In" : "Money Out"} 
                    onTabChange={(t) => startTransition(() => setTab(t === "Money In" ? "in" : "out"))} 
                />
            </View>

            {/* Summary Card */}
            <View className="px-5 mt-4 mb-2">
                <View className="bg-white rounded-2xl p-4 flex-row border border-border shadow-sm">
                    <View className="flex-1 border-r border-border pl-2">
                        <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Total Received</Text>
                        <Text className="font-sans-bold text-lg text-green-600">{formatINR(totalMoneyIn)}</Text>
                    </View>
                    <View className="flex-1 pl-4">
                        <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Total Paid</Text>
                        <Text className="font-sans-bold text-lg text-red-500">{formatINR(totalMoneyOut)}</Text>
                    </View>
                </View>
            </View>

            {/* Search */}
            <View className="px-5 mt-2 mb-4">
                <View className="flex-row items-center bg-white px-4 h-12 rounded-xl border border-border">
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        className="flex-1 ml-3 h-full font-sans-regular text-base text-primary"
                        placeholder={`Search ${tab === 'in' ? 'customers' : 'vendors'}...`}
                        placeholderTextColor="#9ca3af"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>
        </>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            {/* Header */}
            <View className="flex-row items-center p-5 bg-white shadow-sm z-10">
                <Pressable onPress={() => { Vibration.vibrate(10); router.back(); }} className="mr-4">
                    <ArrowLeft color="#081126" size={24} />
                </Pressable>
                <Text className="text-2xl font-sans-bold text-primary">Payments</Text>
            </View>

            {/* List */}
            {!isFullyReady ? (
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
                    data={filteredPayments}
                    keyExtractor={(payment) => payment.id}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    removeClippedSubviews={true}
                    renderItem={({ item: payment }) => (
                        <Card className="flex-row items-center mb-4 mx-5" isPressable onPress={() => setSelectedPayment(payment)}>
                            <View className={`size-12 rounded-full items-center justify-center mr-4 ${payment.type === 'in' ? 'bg-green-100' : 'bg-red-100'}`}>
                                {payment.type === 'in' ? (
                                    <ArrowDownLeft color="#16a34a" size={24} />
                                ) : (
                                    <ArrowUpRight color="#dc2626" size={24} />
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className="font-sans-bold text-base text-primary mb-1">{payment.partyName}</Text>
                                <Text className="font-sans-medium text-xs text-muted-foreground">{payment.mode} • {formatDate(payment.date)}</Text>
                            </View>
                            <View className="items-end">
                                <Text className={`font-sans-bold text-lg ${payment.type === 'in' ? 'text-green-600' : 'text-primary'}`}>
                                    {payment.type === 'in' ? '+' : '-'} {formatINR(payment.amountPaise)}
                                </Text>
                            </View>
                        </Card>
                    )}
                    ListEmptyComponent={<EmptyState title="No payments found" subtitle="You haven't made or received any payments yet." icon={<View />} />}
                />
            )}

            {/* FAB */}
            <Pressable
                onPress={() => openForm()}
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

            {/* Details Modal */}
            <AnimatedModal visible={!!selectedPayment} onClose={() => setSelectedPayment(null)}>
                <View className="bg-white rounded-t-3xl p-8 min-h-[350px]">
                    {selectedPayment && (
                        <>
                            <View className="flex-row justify-between items-start mb-6">
                                <View className="flex-1 mr-4">
                                    <Text className="font-sans-bold text-2xl text-primary mb-1">{selectedPayment.partyName}</Text>
                                    <Text className="font-sans-medium text-base text-muted-foreground">{selectedPayment.date}</Text>
                                </View>
                                <Pressable onPress={() => setSelectedPayment(null)} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                                    <X color="#64748b" size={20} />
                                </Pressable>
                            </View>

                            <View className={`p-4 rounded-2xl mb-6 ${selectedPayment.type === 'in' ? 'bg-green-50' : 'bg-red-50'}`}>
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-1">
                                    {selectedPayment.type === 'in' ? 'Amount Received' : 'Amount Paid'}
                                </Text>
                                <Text className={`font-sans-bold text-3xl ${selectedPayment.type === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                                    {formatINR(selectedPayment.amountPaise)}
                                </Text>
                            </View>

                            <View className="mb-8">
                                <View className="flex-row items-center mb-6">
                                    <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                                        <CreditCard color="#208AEF" size={24} />
                                    </View>
                                    <View>
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">PaymentRecord Mode</Text>
                                        <Text className="font-sans-bold text-base text-primary uppercase">{selectedPayment.mode}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center">
                                    <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                                        <Calendar color="#9333ea" size={24} />
                                    </View>
                                    <View>
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Transaction Date</Text>
                                        <Text className="font-sans-bold text-base text-primary">{formatDate(selectedPayment.date)}</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row space-x-4">
                                <Pressable
                                    onPress={() => openForm(selectedPayment)}
                                    className="flex-1 bg-blue-100 py-4 rounded-xl flex-row justify-center items-center mr-2"
                                >
                                    <Edit color="#208AEF" size={18} className="mr-2" />
                                    <Text className="font-sans-bold text-primary text-base">Edit</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => handleDelete(selectedPayment.id)}
                                    className="flex-1 border border-red-200 py-4 rounded-xl flex-row justify-center items-center ml-2"
                                >
                                    <Trash2 color="#ef4444" size={18} className="mr-2" />
                                    <Text className="font-sans-bold text-red-500 text-base">Delete</Text>
                                </Pressable>
                            </View>
                        </>
                    )}
                </View>
            </AnimatedModal>

            {/* Form Modal */}
            <AnimatedModal visible={isFormVisible} onClose={() => setIsFormVisible(false)} avoidKeyboard>
                <View className="bg-white rounded-t-3xl h-[85%] p-5 pb-12 shadow-xl flex-col">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-sans-bold text-xl text-primary">
                            {editingPayment ? 'Edit PaymentRecord' : 'Log PaymentRecord'}
                        </Text>
                        <Pressable onPress={() => { Vibration.vibrate(10); setIsFormVisible(false); }} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                            <X color="#64748b" size={20} />
                        </Pressable>
                    </View>
                    
                    <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                        
                        <View className="mb-6">
                            <SegmentedTabs 
                                tabs={["Money In", "Money Out"]} 
                                activeTab={formData.type === "in" ? "Money In" : "Money Out"} 
                                onTabChange={(t) => setFormData({ ...formData, type: t === "Money In" ? "in" : "out" })} 
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Party Name (Customer/Vendor)</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-4 py-3 font-sans-medium text-primary"
                                placeholder="e.g. Ramesh Traders"
                                value={formData.partyName}
                                onChangeText={t => setFormData({...formData, partyName: t})}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Amount (₹)</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-4 py-3 font-sans-bold text-lg text-primary"
                                keyboardType="numeric"
                                placeholder="0.00"
                                value={formData.amount}
                                onChangeText={t => setFormData({...formData, amount: t})}
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">PaymentRecord Mode</Text>
                            <View className="flex-row flex-wrap gap-2 mt-1">
                                {["UPI", "Bank Transfer", "Cash", "NEFT", "RTGS", "Cheque"].map(mode => (
                                    <Pressable 
                                        key={mode}
                                        onPress={() => setFormData({...formData, mode: mode as PaymentRecord["mode"]})}
                                        className={`px-4 py-2 rounded-full border ${formData.mode === mode ? 'bg-primary border-primary' : 'bg-white border-border'}`}
                                    >
                                        <Text className={`font-sans-medium text-sm ${formData.mode === mode ? 'text-white' : 'text-primary'}`}>
                                            {mode}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    <Pressable 
                        onPress={handleSave}
                        className="bg-primary rounded-xl py-4 items-center shadow-md shadow-primary/30"
                    >
                        <Text className="font-sans-bold text-white text-lg">Save PaymentRecord</Text>
                    </Pressable>
                </View>
            </AnimatedModal>
        </SafeAreaView>
    );
}
