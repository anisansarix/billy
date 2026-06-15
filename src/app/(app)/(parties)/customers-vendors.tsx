import { Party } from "@/types/entities";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListCardSkeleton } from "@/components/ui/skeletons/ListCardSkeleton";
import { useDeferredRender } from "@/hooks/useDeferredRender";
import { useTabTransition } from "@/hooks/useTabTransition";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { useShallow } from 'zustand/react/shallow';
import { useRouter } from "expo-router";
import { ArrowLeft, Plus, Search } from "lucide-react-native";
import { useState } from "react";
import {  Pressable, RefreshControl, ScrollView, Text, TextInput, View, FlatList , Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "@/components/ui/Card";
import { useAppStore } from "@/store";
import "../../../../global.css";
import { formatINR } from "@/utils/money";
import PartyDetailsModal from "@/components/domain/parties/PartyDetailsModal";
import PartyFormModal from "@/components/domain/parties/PartyFormModal";


export default function CustomersVendorsScreen() {
    const router = useRouter();
    const [tab, setTab] = useState<"customer" | "vendor" | "both">("customer");
    const [search, setSearch] = useState("");

    // State for refreshing
    const isReady = useDeferredRender();
    const { isTabReady, startTransition } = useTabTransition();
    const isFullyReady = isReady && isTabReady;
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    // State for data
    const {  parties, deleteParty  } = useAppStore(useShallow(state => ({ parties: state.parties, deleteParty: state.deleteParty })));

    // State for Details Modal
    const [selectedParty, setSelectedParty] = useState<Party | null>(null);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

    // State for Form Modal
    const [isFormModalVisible, setIsFormModalVisible] = useState(false);
    const [editingParty, setEditingParty] = useState<Party | null>(null);

    let filterTab = tab === "customer" ? "CUSTOMER" : tab === "vendor" ? "VENDOR" : null;
    const filteredParties = parties.filter(p => 
        (filterTab ? p.partyType === filterTab : true) && p.legalName?.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());

    const totalReceivable = filteredParties.reduce((sum, p) => p.openingBalancePaise > 0 ? sum + p.openingBalancePaise : sum, 0);
    const totalPayable = filteredParties.reduce((sum, p) => p.openingBalancePaise < 0 ? sum + Math.abs(p.openingBalancePaise) : sum, 0);

    const openDetailsModal = (party: Party) => {
        setSelectedParty(party);
        setIsDetailsModalVisible(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalVisible(false);
        setSelectedParty(null);
    };

    const openFormModal = (party?: Party) => {
        if (party) {
            setEditingParty(party);
        } else {
            setEditingParty(null);
        }
        setIsFormModalVisible(true);
        setIsDetailsModalVisible(false); // Close details if open
    };

    const closeFormModal = () => {
        setIsFormModalVisible(false);
        setEditingParty(null);
    };

    const handleFormSaveSuccess = (party: Party) => {
        closeFormModal();
        if (editingParty && selectedParty?.id === editingParty.id) {
            setSelectedParty(party);
            setIsDetailsModalVisible(true);
        }
    };

    const handleDelete = (partyId: string) => {
        deleteParty(partyId);
        closeDetailsModal();
    };

    

    const header = (
        <View className="pt-4">
            {/* Tabs */}
            <SegmentedTabs 
                tabs={["Customers", "Vendors", "Both"]} 
                activeTab={tab === "customer" ? "Customers" : tab === "vendor" ? "Vendors" : "Both"} 
                onTabChange={(t) => startTransition(() => setTab(t === "Customers" ? "customer" : t === "Vendors" ? "vendor" : "both"))} 
            />

            {/* Summary Card */}
            <View className="px-5 mb-4 mt-4">
                <View className="bg-white rounded-2xl p-4 flex-row border border-border shadow-sm">
                    <View className="flex-1 border-r border-border pl-2">
                        <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Total Receivable</Text>
                        <Text className="font-sans-bold text-lg text-green-600">{formatINR(totalReceivable)}</Text>
                        {tab === 'vendor' && totalReceivable > 0 && (
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mt-1">(Advance: {formatINR(totalReceivable)})</Text>
                        )}
                    </View>
                    <View className="flex-1 pl-4">
                        <Text className="font-sans-medium text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Total Payable</Text>
                        <Text className="font-sans-bold text-lg text-red-500">{formatINR(totalPayable)}</Text>
                        {tab === 'customer' && totalPayable > 0 && (
                            <Text className="font-sans-medium text-[10px] text-muted-foreground mt-1">(Advance: {formatINR(totalPayable)})</Text>
                        )}
                    </View>
                </View>
            </View>

            {/* Search */}
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
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
            {/* Header */}
            <View className="flex-row items-center justify-between p-5 bg-white shadow-sm z-10">
                <View className="flex-row items-center">
                    <Pressable onPress={() => { Vibration.vibrate(10); router.back(); }} className="mr-4 p-2 min-h-[44px] min-w-[44px] items-center justify-center">
                        <ArrowLeft color="#081126" size={24} />
                    </Pressable>
                    <Text className="text-2xl font-sans-bold text-primary">Directory</Text>
                </View>
            </View>

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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#208AEF" />
                }
                data={filteredParties}
                keyExtractor={(party) => party.id}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={true}
                renderItem={({ item: party }) => (
                    <Card className="flex-row justify-between items-center mb-4 mx-5" isPressable onPress={() => openDetailsModal(party)}>
                        <View className="flex-1 mr-2">
                            <Text className="font-sans-bold text-lg text-primary mb-1" numberOfLines={1}>{party.legalName}</Text>
                            <Text className="font-sans-regular text-sm text-muted-foreground" numberOfLines={1}>GSTIN: {party.gstin}</Text>
                        </View>
                        <View className="items-end flex-shrink-0">
                            <Text className={`font-sans-bold text-base ${party.openingBalancePaise > 0 ? (tab === 'customer' ? 'text-green-600' : 'text-red-500') : 'text-primary'}`} numberOfLines={1} adjustsFontSizeToFit>
                                {formatINR(Math.abs(party.openingBalancePaise))}
                            </Text>
                            <Text className="font-sans-medium text-xs text-muted-foreground">
                                {party.openingBalancePaise > 0 ? (tab === 'customer' ? 'To Receive' : 'To Pay') : 'Advance'}
                            </Text>
                        </View>
                    </Card>
                )}
                ListEmptyComponent={<EmptyState title={`No ${tab}s found`} subtitle="Try adding a new party." icon={<View />} />}
            />
            )}

            <Pressable 
                onPress={() => { Vibration.vibrate(10); openFormModal(); }}
                className="absolute bottom-6 right-6 h-14 w-14 bg-primary rounded-full items-center justify-center shadow-lg active:scale-95"
                style={{ elevation: 5, shadowColor: '#081126', shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: 0, height: 3 } }}
            >
                <Plus color="white" size={24} />
            </Pressable>

            <PartyDetailsModal
                visible={isDetailsModalVisible}
                onClose={closeDetailsModal}
                party={selectedParty}
                onEdit={openFormModal}
                onDelete={handleDelete}
            />

            <PartyFormModal
                visible={isFormModalVisible}
                onClose={closeFormModal}
                partyToEdit={editingParty}
                initialPartyType={tab as any}
                onSaveSuccess={handleFormSaveSuccess}
            />
        </SafeAreaView>
    );
}

