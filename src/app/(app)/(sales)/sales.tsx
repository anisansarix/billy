import { SalesInvoice, DocumentType } from "@/types/entities";
import { useRouter } from "expo-router";
import { useShallow } from 'zustand/react/shallow';
import { ArrowLeft, Plus, ReceiptText, Search, X, Edit, Trash2, Box } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedModal from "@/components/ui/AnimatedModal";
import Card from "@/components/ui/Card";
import { useAppStore } from "@/store";
import "../../../../global.css";

export default function SalesScreen() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState<"All" | "Invoices" | "Estimates" | "Quotations" | "Challans">("All");
    const [refreshing, setRefreshing] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    
    // Details Modal State
    const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(null);

    const {  invoices, deleteInvoice  } = useAppStore(useShallow(state => ({ invoices: state.invoices, deleteInvoice: state.deleteInvoice })));

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Paid": return "bg-green-100 text-green-700 border-green-200";
            case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
            case "Overdue": return "bg-red-100 text-red-700 border-red-200";
            case "Draft": return "bg-slate-100 text-slate-700 border-slate-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const filteredInvoices = invoices.filter(inv => {
        let matchesTab = true;
        if (tab === "Invoices") matchesTab = inv.documentType === "SALES_INVOICE" || (inv.documentType as any) === "PROFORMA_INVOICE";
        else if (tab === "Estimates") matchesTab = (inv.documentType as any) === "PROFORMA_INVOICE";
        else if (tab === "Quotations") matchesTab = (inv.documentType as any) === "PROFORMA_INVOICE";
        else if (tab === "Challans") matchesTab = (inv.documentType as any) === "DELIVERY_CHALLAN";

        const matchesSearch = inv.partyName.toLowerCase().includes(search.toLowerCase()) || inv.documentNumber.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // Summary Calculations
    const totalInvoicesValue = filteredInvoices.reduce((sum, inv) => sum + inv.totalAmountPaise, 0);

    const handleDelete = (id: string) => {
        Alert.alert("Delete SalesInvoice", "Are you sure you want to delete this invoice?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Delete", 
                style: "destructive", 
                onPress: () => { 
                    deleteInvoice(id); 
                    setSelectedInvoice(null);
                } 
            }
        ]);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            {/* Header */}
            <View className="flex-row items-center p-5 bg-white shadow-sm z-10">
                <Pressable onPress={() => router.back()} className="mr-4 p-2 min-h-[44px] min-w-[44px] items-center justify-center">
                    <ArrowLeft color="#081126" size={24} />
                </Pressable>
                <Text className="text-2xl font-sans-bold text-primary">Sales Documents</Text>
            </View>

            {/* Tabs */}
            <View className="bg-white">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 py-3 border-b border-border">
                    {["All", "Invoices", "Estimates", "Quotations", "Challans"].map((t) => (
                        <Pressable 
                            key={t}
                            onPress={() => setTab(t as never)}
                            className={`mr-3 px-4 py-2 rounded-full border justify-center min-h-[44px] ${tab === t ? 'bg-primary border-primary' : 'bg-transparent border-border'}`}
                        >
                            <Text className={`font-sans-medium ${tab === t ? 'text-white' : 'text-muted-foreground'}`}>{t}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Summary Card */}
            <View className="px-5 mt-4">
                <View className="bg-white rounded-2xl p-4 flex-row border border-border shadow-sm">
                    <View className="flex-1 border-r border-border pl-2">
                        <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
                            {tab === 'All' ? 'Total Sales' : `${tab} Value`}
                        </Text>
                        <Text className="font-sans-bold text-lg text-primary">₹ {totalInvoicesValue.toLocaleString('en-IN')}</Text>
                    </View>
                    <View className="flex-1 pl-4 justify-center">
                        <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Documents Count</Text>
                        <Text className="font-sans-bold text-lg text-primary">{filteredInvoices.length}</Text>
                    </View>
                </View>
            </View>

            {/* Search */}
            <View className="px-5 mt-4 mb-4">
                <View className="flex-row items-center bg-white px-4 h-12 rounded-xl border border-border">
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        className="flex-1 ml-3 h-full font-sans-regular text-base text-primary"
                        placeholder="Search by name or number..."
                        placeholderTextColor="#9ca3af"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            {/* List */}
            <ScrollView 
                className="flex-1 px-5" 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#208AEF" />}
            >
                {filteredInvoices.map((inv) => (
                    <Card key={inv.id} className="mb-4" isPressable onPress={() => setSelectedInvoice(inv)}>
                        <View className="flex-row justify-between items-start mb-3">
                            <View>
                                <Text className="font-sans-bold text-base text-primary">{inv.partyName}</Text>
                                <Text className="font-sans-medium text-xs text-muted-foreground mt-1">{inv.documentNumber} • {inv.documentDate}</Text>
                            </View>
                            <View className={`px-2 py-1 rounded-md border ${getStatusColor(inv.status)}`}>
                                <Text className="font-sans-bold text-[10px] uppercase">
                                    {inv.status}
                                </Text>
                            </View>
                        </View>

                        <View className="h-[1px] w-full bg-border mb-3" />

                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="font-sans-medium text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Items</Text>
                                <Text className="font-sans-bold text-sm text-primary">{inv.lineItems ? inv.lineItems.length : 0}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="font-sans-medium text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total Amount</Text>
                                <Text className="font-sans-bold text-lg text-primary">₹ {inv.totalAmountPaise.toLocaleString('en-IN')}</Text>
                            </View>
                        </View>
                    </Card>
                ))}
                {filteredInvoices.length === 0 && (
                    <View className="items-center justify-center py-20 px-5">
                        <View className="h-24 w-24 bg-primary/5 rounded-full items-center justify-center mb-6">
                            <ReceiptText color="#208AEF" size={40} opacity={0.5} />
                        </View>
                        <Text className="font-sans-bold text-xl text-primary mb-2 text-center">No Documents Found</Text>
                        <Text className="font-sans-medium text-sm text-muted-foreground text-center mb-8">
                            {search ? `We couldn't find any documents matching "${search}".` : "You haven't created any sales documents yet."}
                        </Text>
                        {!search && (
                            <Pressable 
                                onPress={() => setCreateModalVisible(true)}
                                className="bg-primary flex-row items-center justify-center px-6 py-3 rounded-xl min-h-[44px]"
                            >
                                <Plus color="white" size={20} className="mr-2" />
                                <Text className="font-sans-bold text-white text-base">Create Document</Text>
                            </Pressable>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* FAB */}
            <Pressable
                onPress={() => setCreateModalVisible(true)}
                className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-primary"
                style={{
                    elevation: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                }}
            >
                <Plus color="white" size={28} />
            </Pressable>

            {/* Details Modal */}
            <AnimatedModal visible={!!selectedInvoice} onClose={() => setSelectedInvoice(null)}>
                <View className="bg-white rounded-t-3xl p-6 min-h-[400px]">
                    {selectedInvoice && (
                        <>
                            <View className="flex-row justify-between items-start mb-6">
                                <View className="flex-1 mr-4">
                                    <Text className="font-sans-bold text-2xl text-primary mb-1">{selectedInvoice.partyName}</Text>
                                    <Text className="font-sans-medium text-base text-muted-foreground">{selectedInvoice.documentNumber}</Text>
                                </View>
                                <Pressable onPress={() => setSelectedInvoice(null)} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                                    <X color="#64748b" size={20} />
                                </Pressable>
                            </View>

                            <View className="p-4 rounded-2xl bg-slate-50 border border-border flex-row justify-between items-center mb-6">
                                <View>
                                    <Text className="font-sans-medium text-sm text-muted-foreground mb-1">SalesInvoice Total</Text>
                                    <Text className="font-sans-bold text-2xl text-primary">
                                        ₹ {selectedInvoice.totalAmountPaise.toLocaleString('en-IN')}
                                    </Text>
                                </View>
                                <View className={`px-3 py-1.5 rounded-md border ${getStatusColor(selectedInvoice.status)}`}>
                                    <Text className="font-sans-bold text-xs uppercase">
                                        {selectedInvoice.status}
                                    </Text>
                                </View>
                            </View>

                            <View className="mb-8">
                                <View className="flex-row items-center mb-4">
                                    <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                                        <Box color="#208AEF" size={20} />
                                    </View>
                                    <View>
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Items Included</Text>
                                        <Text className="font-sans-bold text-base text-primary">{selectedInvoice.lineItems?.length || 0} Products/Services</Text>
                                    </View>
                                </View>
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4">
                                        <ReceiptText color="#9333ea" size={20} />
                                    </View>
                                    <View>
                                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">SalesInvoice Date</Text>
                                        <Text className="font-sans-bold text-base text-primary">{selectedInvoice.documentDate}</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row space-x-4">
                                <Pressable
                                    onPress={() => {
                                        const id = selectedInvoice.id;
                                        const type = selectedInvoice.documentType;
                                        setSelectedInvoice(null);
                                        
                                        let route = '/(app)/create-invoice';
                                        if ((type as any) === 'PROFORMA_INVOICE') route = '/(app)/create-estimate';
                                        if ((type as any) === 'PROFORMA_INVOICE') route = '/(app)/create-quotation';
                                        if ((type as any) === 'DELIVERY_CHALLAN') route = '/(app)/create-delivery-challan';
                                        
                                        router.push({ pathname: route, params: { id } } as never);
                                    }}
                                    className="flex-1 bg-blue-100 py-4 rounded-xl flex-row justify-center items-center mr-2"
                                >
                                    <Edit color="#208AEF" size={18} className="mr-2" />
                                    <Text className="font-sans-bold text-primary text-base">Edit</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => handleDelete(selectedInvoice.id)}
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

            {/* Create Options Modal */}
            <AnimatedModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} placement="bottom">
                <View className="bg-white rounded-t-3xl p-6 pb-12 w-full">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-sans-bold text-xl text-primary">Create Document</Text>
                        <Pressable onPress={() => setCreateModalVisible(false)} className="h-10 w-10 items-center justify-center bg-muted rounded-full">
                            <X color="#64748b" size={18} />
                        </Pressable>
                    </View>
                    <View className="space-y-4">
                        {[
                            { title: "Tax SalesInvoice", route: "/(app)/create-invoice", icon: <ReceiptText color="#208AEF" size={20} />, bg: "bg-blue-50" },
                            { title: "Estimate", route: "/(app)/create-estimate", icon: <ReceiptText color="#f59e0b" size={20} />, bg: "bg-amber-50" },
                            { title: "Quotation", route: "/(app)/create-quotation", icon: <ReceiptText color="#8b5cf6" size={20} />, bg: "bg-purple-50" },
                            { title: "Delivery Challan", route: "/(app)/create-delivery-challan", icon: <Box color="#10b981" size={20} />, bg: "bg-emerald-50" },
                        ].map((item, idx) => (
                            <Pressable 
                                key={idx} 
                                className="flex-row items-center p-4 border border-border rounded-2xl mb-3"
                                onPress={() => {
                                    setCreateModalVisible(false);
                                    router.push(item.route as never);
                                }}
                            >
                                <View className={`h-12 w-12 rounded-xl items-center justify-center mr-4 ${item.bg}`}>
                                    {item.icon}
                                </View>
                                <View className="flex-1">
                                    <Text className="font-sans-bold text-base text-primary">{item.title}</Text>
                                    <Text className="font-sans-medium text-xs text-muted-foreground mt-0.5">Create a new {item.title.toLowerCase()}</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </AnimatedModal>
        </SafeAreaView>
    );
}
