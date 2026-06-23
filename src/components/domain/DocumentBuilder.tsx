"use no memo";
import { useRouter } from "expo-router";
import { ArrowLeft, Save, Plus, ChevronDown, ChevronUp, Trash2, X } from "lucide-react-native";
import { useState, useMemo } from "react";
import { Vibration, Pressable, ScrollView, Text, TextInput, View, KeyboardAvoidingView, Platform, Alert } from "react-native";
import AnimatedModal from "@/components/ui/AnimatedModal";
import { useAppStore } from "@/store";
import { useShallow } from 'zustand/react/shallow';
import { Party, LineItem } from "@/types/entities";
import { formatINR } from "../../utils/money";
import { computeLineItem, buildGSTSummary, isInterStateSupply } from "../../utils/gst";

type SectionProps = {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    summary?: string;
};

const Section = ({ title, isExpanded, onToggle, children, summary }: SectionProps) => (
    <View className="bg-white rounded-2xl shadow-sm mb-4 border border-border overflow-hidden">
        <Pressable 
            className={`flex-row justify-between items-center p-5 ${isExpanded ? 'border-b border-border bg-slate-50/50' : ''}`}
            onPress={onToggle}
        >
            <View className="flex-1 pr-4">
                <Text className="font-sans-bold text-lg text-primary">{title}</Text>
                {!isExpanded && summary && <Text className="font-sans-medium text-sm text-muted-foreground mt-1">{summary}</Text>}
            </View>
            {isExpanded ? <ChevronUp color="#0f172a" size={24} /> : <ChevronDown color="#0f172a" size={24} />}
        </Pressable>
        {isExpanded && (
            <View className="p-5">
                {children}
            </View>
        )}
    </View>
);

export interface DocumentData {
    header: {
        documentType: string;
        documentNumber: string;
        documentDate: string;
        dueDate: string;
        status: string;
    };
    selectedParty: Party;
    items: LineItem[];
    totals: {
        subtotalPaise: number;
        discountPaise: number;
        cgstPaise: number;
        sgstPaise: number;
        igstPaise: number;
        totalAmountPaise: number;
        roundOffPaise: number;
        isInterState: boolean;
    };
    payment: {
        mode: string;
        terms: string;
    };
    transport?: {
        vehicleNo: string;
        ewayBill: string;
        deliveryDate: string;
        transporterName: string;
    };
    notes: {
        internal: string;
        external: string;
    };
}

export interface DocumentBuilderProps {
    title: string;
    defaultType: string;
    defaultPrefix: string;
    defaultDocNumber?: string;
    partyLabel: string;
    partyFilter: 'customer' | 'vendor' | 'both';
    hasTransport?: boolean;
    defaultNotes?: string;
    initialData?: Partial<DocumentData>;
    onSave: (documentData: DocumentData) => void;
    subtitle?: string;
}

export default function DocumentBuilder({
    title,
    defaultType,
    defaultPrefix,
    defaultDocNumber,
    partyLabel,
    partyFilter,
    hasTransport = false,
    defaultNotes = "",
    initialData,
    onSave,
    subtitle
}: DocumentBuilderProps) {
    const router = useRouter();
    const { parties, items, currentBusiness } = useAppStore(useShallow(state => ({ parties: state.parties, items: state.items, currentBusiness: state.currentBusiness })));

    const [expandedSections, setExpandedSections] = useState({
        header: true,
        party: false,
        items: false,
        payment: false,
        transport: false,
        notes: false,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Form State
    const [header, setHeader] = useState<DocumentData['header']>(() => initialData?.header || {
        documentType: defaultType,
        documentNumber: defaultDocNumber || `${defaultPrefix}${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        documentDate: new Date().toISOString().split('T')[0],
        dueDate: "",
        status: "Draft",
    });

    const [selectedParty, setSelectedParty] = useState<Party | null>(initialData?.selectedParty || null);
    const [partyModalVisible, setPartyModalVisible] = useState(false);

    const [documentItems, setDocumentItems] = useState<LineItem[]>(initialData?.items || []);
    const [itemModalVisible, setItemModalVisible] = useState(false);

    const [payment, setPayment] = useState<DocumentData['payment']>(initialData?.payment || { mode: "UPI", terms: "Immediate" });
    const [transport, setTransport] = useState({
        vehicleNo: initialData?.transport?.vehicleNo || "",
        ewayBill: initialData?.transport?.ewayBill || "",
        deliveryDate: initialData?.transport?.deliveryDate || "",
        transporterName: initialData?.transport?.transporterName || "",
    });
    const [notes, setNotes] = useState<DocumentData['notes']>(initialData?.notes || { internal: "", external: defaultNotes });

    const isInterState = useMemo(() => {
        if (!currentBusiness?.address?.stateCode || !selectedParty?.billingAddress?.stateCode) return false;
        return isInterStateSupply(currentBusiness.address.stateCode, selectedParty.billingAddress.stateCode);
    }, [currentBusiness, selectedParty]);

    const handlePartySelect = (party: Party) => {
        setSelectedParty(party);
        setPartyModalVisible(false);
        const newIsInterState = currentBusiness?.address?.stateCode && party.billingAddress?.stateCode ? isInterStateSupply(currentBusiness.address.stateCode, party.billingAddress.stateCode) : false;
        
        if (documentItems.length > 0) {
            setDocumentItems(documentItems.map(item => computeLineItem(item, newIsInterState)));
        }
    };

    // Computed totals
    const totals = useMemo(() => {
        const summary = buildGSTSummary(documentItems, isInterState);
        let discountPaise = 0;
        let subtotalPaise = 0;
        
        documentItems.forEach(item => {
            const rawTotal = Math.round((item.unitPricePaise || 0) * (item.quantityDecimal ?? 1));
            const lineDiscount = Math.round(rawTotal * ((item.discountPercent || 0) / 100));
            discountPaise += lineDiscount;
            subtotalPaise += rawTotal - lineDiscount;
        });

        const rawTotalAmountPaise = summary.totalTaxableValuePaise + summary.totalGSTAmountPaise + summary.totalCessAmountPaise;
        const roundedTotalPaise = Math.round(rawTotalAmountPaise / 100) * 100;
        const roundOffPaise = roundedTotalPaise - rawTotalAmountPaise;

        let cgstPaise = 0, sgstPaise = 0, igstPaise = 0;
        Object.values(summary.slabs).forEach(slab => {
            cgstPaise += slab.cgstAmountPaise;
            sgstPaise += slab.sgstAmountPaise;
            igstPaise += slab.igstAmountPaise;
        });

        return { 
            subtotalPaise, 
            discountPaise, 
            cgstPaise, 
            sgstPaise, 
            igstPaise, 
            totalAmountPaise: roundedTotalPaise, 
            roundOffPaise,
            isInterState
        };
    }, [documentItems, isInterState]);

    const handleSave = () => {
        if (!selectedParty) {
            Alert.alert("Validation Error", `Please select a ${partyLabel.toLowerCase()}`);
            return;
        }

        if (documentItems.length === 0) {
            Alert.alert("Validation Error", "Please add at least one item to the document");
            return;
        }

        if (!header.documentType || !header.documentNumber || !header.documentDate) {
            Alert.alert("Validation Error", "Please fill in all required document details (Type, Number, Date).");
            return;
        }

        const invalidItem = documentItems.find(item => !item.quantityDecimal || item.quantityDecimal <= 0 || item.unitPricePaise < 0);
        if (invalidItem) {
            Alert.alert("Validation Error", "Please ensure all items have a valid quantity (> 0) and rate (>= 0).");
            return;
        }

        const isOutward = header.documentType.includes('INVOICE') || header.documentType.includes('SalesInvoice') || header.documentType.includes('CHALLAN');
        if (isOutward) {
            const outOfStockItem = documentItems.find(li => {
                const storeItem = items.find(i => i.id === li.inventoryItemId);
                // Allow if editing existing invoice and the quantity is just unchanged or increased? 
                // Wait, it's safer just to check if current store stock + original item stock in invoice is >= li.quantityDecimal.
                // But for now, just checking store stock is better than nothing.
                // If it's an edit, store stock already has the item removed. So we shouldn't block if they just press save.
                // Actually, initialData has the old items. We should probably only block if (storeItem.stock || 0) < (li.quantityDecimal - oldQty).
                // Let's just do a simple check.
                const oldItem = initialData?.items?.find(oi => oi.id === li.id);
                const oldQty = oldItem ? oldItem.quantityDecimal : 0;
                return storeItem && (storeItem.stock || 0) + oldQty < li.quantityDecimal;
            });
            if (outOfStockItem) {
                Alert.alert("Validation Error", `Insufficient stock for ${outOfStockItem.description}. Cannot sell more than available stock.`);
                return;
            }
        }

        const documentData = {
            header,
            selectedParty,
            items: documentItems,
            totals,
            payment,
            transport: hasTransport ? transport : undefined,
            notes
        };

        onSave(documentData);
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} className="flex-1" behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
            <View style={{ flex: 1 }} className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center p-4 bg-white shadow-sm z-10 border-b border-border">
                <Pressable onPress={() => { Vibration.vibrate(10); router.back(); }} className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
                    <ArrowLeft color="#081126" size={24} />
                </Pressable>
                <View className="ml-2">
                    <Text className="text-lg font-sans-bold text-primary">{title}</Text>
                    {subtitle && <Text className="text-xs font-sans-medium text-muted-foreground">{subtitle}</Text>}
                </View>
            </View>

            <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false} contentContainerClassName="pb-32">
                
                {/* 1. Header Details */}
                <Section 
                    title="Document Details" 
                    isExpanded={expandedSections.header} 
                    onToggle={() => toggleSection('header')}
                    summary={`${header.documentNumber} • ${header.documentDate}`}
                >
                    <View className="mb-4">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Document Type</Text>
                        <TextInput 
                            className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                            value={header.documentType}
                            onChangeText={t => setHeader({...header, documentType: t})}
                        />
                    </View>
                    <View className="flex-row gap-4 mb-4">
                        <View className="flex-1">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Document No</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                                value={header.documentNumber}
                                onChangeText={t => setHeader({...header, documentNumber: t})}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Date</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                                value={header.documentDate}
                                onChangeText={t => setHeader({...header, documentDate: t})}
                            />
                        </View>
                    </View>
                </Section>

                {/* 2. Party Details */}
                <Section 
                    title={`${partyLabel} Details`} 
                    isExpanded={expandedSections.party} 
                    onToggle={() => toggleSection('party')}
                    summary={selectedParty ? `${selectedParty.legalName} (${selectedParty.gstin || 'Unregistered'})` : `No ${partyLabel.toLowerCase()} selected`}
                >
                    {selectedParty ? (
                        <View className="bg-slate-50 p-3 rounded-lg border border-border mb-3">
                            <Text className="font-sans-bold text-primary text-base">{selectedParty.legalName}</Text>
                            <Text className="font-sans-medium text-muted-foreground text-sm mt-1">{selectedParty.contactPersons?.[0]?.phone || ''}</Text>
                            {selectedParty.gstin && <Text className="font-sans-bold text-green-700 text-xs mt-1">GSTIN: {selectedParty.gstin}</Text>}
                        </View>
                    ) : null}
                    
                    <Pressable 
                        className="bg-primary/10 border border-primary/20 rounded-lg p-3 min-h-[44px] items-center justify-center flex-row"
                        onPress={() => setPartyModalVisible(true)}
                    >
                        <Text className="font-sans-bold text-primary">{selectedParty ? `Change ${partyLabel}` : `Select ${partyLabel}`}</Text>
                    </Pressable>
                </Section>

                {/* 3. Items Grid */}
                <Section 
                    title="Items" 
                    isExpanded={expandedSections.items} 
                    onToggle={() => toggleSection('items')}
                    summary={`${documentItems.length} items • ${formatINR(totals.totalAmountPaise)}`}
                >
                    {documentItems.map((item, index) => {
                        try {
                            return (
                                <View key={index} className="bg-slate-50 border border-border rounded-lg p-3 mb-3">
                                    <View className="flex-row justify-between items-start mb-2">
                                        <View className="flex-1">
                                            <Text className="font-sans-bold text-primary">{item.description}</Text>
                                            <Text className="font-sans-medium text-xs text-muted-foreground">HSN/SAC: {item.hsnSacCode}</Text>
                                        </View>
                                        <Pressable onPress={() => setDocumentItems(documentItems.filter((_, i) => i !== index))} className="h-11 w-11 items-center justify-center -mr-2 -mt-2">
                                            <Trash2 color="#ef4444" size={18} />
                                        </Pressable>
                                    </View>
                                    <View className="flex-row flex-wrap justify-between items-end mt-2 border-t border-border pt-2 gap-y-2">
                                        <View className="flex-1 min-w-[30%]">
                                            <Text className="font-sans-medium text-xs text-muted-foreground">Qty</Text>
                                            <View className="flex-row items-center mt-1">
                                                <TextInput 
                                                    style={{ backgroundColor: 'white', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, width: 64, textAlign: 'center', color: '#081126', fontWeight: 'bold' }}
                                                    value={item.quantityDecimal !== undefined ? String(item.quantityDecimal) : ''}
                                                    keyboardType="numeric"
                                                    onChangeText={t => {
                                                        const newItems = [...documentItems];
                                                        const parsed = parseFloat(t);
                                                        newItems[index].quantityDecimal = isNaN(parsed) ? 0 : parsed;
                                                        newItems[index] = computeLineItem(newItems[index], isInterState);
                                                        setDocumentItems(newItems);
                                                    }}
                                                />
                                                <Text className="font-sans-medium text-xs text-muted-foreground ml-1">{item.unit}</Text>
                                            </View>
                                        </View>
                                        <View className="flex-1 min-w-[30%]">
                                            <Text className="font-sans-medium text-xs text-muted-foreground">Rate</Text>
                                            <TextInput 
                                                style={{ backgroundColor: 'white', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, width: 96, marginTop: 4, color: '#081126', fontWeight: 'bold' }}
                                                keyboardType="numeric"
                                                placeholder="0.00"
                                                value={item.unitPricePaise !== undefined ? String(item.unitPricePaise / 100) : ''}
                                                onChangeText={val => {
                                                    const newItems = [...documentItems];
                                                    const parsed = parseFloat(val);
                                                    newItems[index].unitPricePaise = isNaN(parsed) ? 0 : Math.round(parsed * 100);
                                                    newItems[index] = computeLineItem(newItems[index], isInterState);
                                                    setDocumentItems(newItems);
                                                }}
                                            />
                                        </View>
                                        <View className="flex-1 min-w-[30%] items-end pb-1">
                                            <Text className="font-sans-medium text-xs text-muted-foreground">Total (incl. GST)</Text>
                                            <Text className="font-sans-bold text-primary mt-1">
                                                {formatINR(item.totalAmountPaise || 0)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        } catch (e) {
                            return <Text key={index}>Error rendering item</Text>;
                        }
                    })}

                    <Pressable 
                        className="bg-primary/10 border border-primary/20 rounded-lg p-3 min-h-[44px] items-center justify-center flex-row mb-4"
                        onPress={() => setItemModalVisible(true)}
                    >
                        <Plus color="#0f172a" size={16} className="mr-2" />
                        <Text className="font-sans-bold text-primary">Add InventoryItem from Catalog</Text>
                    </Pressable>

                    {documentItems.length > 0 && (
                        <View className="bg-slate-100 rounded-lg p-4 border border-border">
                            <Text className="font-sans-bold text-primary mb-2">Tax Summary</Text>
                            <View className="flex-row justify-between mb-1">
                                <Text className="font-sans-medium text-muted-foreground">Subtotal</Text>
                                <Text className="font-sans-bold text-primary">{formatINR(totals.subtotalPaise)}</Text>
                            </View>
                            {isInterState ? (
                                <View className="flex-row justify-between mb-2">
                                    <Text className="font-sans-medium text-muted-foreground">IGST</Text>
                                    <Text className="font-sans-bold text-primary">{formatINR(totals.igstPaise)}</Text>
                                </View>
                            ) : (
                                <>
                                    <View className="flex-row justify-between mb-1">
                                        <Text className="font-sans-medium text-muted-foreground">CGST</Text>
                                        <Text className="font-sans-bold text-primary">{formatINR(totals.cgstPaise)}</Text>
                                    </View>
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="font-sans-medium text-muted-foreground">SGST</Text>
                                        <Text className="font-sans-bold text-primary">{formatINR(totals.sgstPaise)}</Text>
                                    </View>
                                </>
                            )}
                            <View className="h-[1px] w-full bg-border mb-2" />
                            <View className="flex-row justify-between items-center">
                                <Text className="font-sans-bold text-lg text-primary">Grand Total</Text>
                                <Text className="font-sans-bold text-xl text-primary">{formatINR(totals.totalAmountPaise)}</Text>
                            </View>
                        </View>
                    )}
                </Section>

                {/* 4. PaymentRecord Info */}
                <Section 
                    title="Payment Information" 
                    isExpanded={expandedSections.payment} 
                    onToggle={() => toggleSection('payment')}
                    summary={`${payment.mode} • ${payment.terms}`}
                >
                    <View className="flex-row gap-4 mb-4">
                        <View className="flex-1">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Payment Mode</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                                value={payment.mode}
                                onChangeText={t => setPayment({...payment, mode: t})}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Payment Terms</Text>
                            <TextInput 
                                className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                                value={payment.terms}
                                onChangeText={t => setPayment({...payment, terms: t})}
                            />
                        </View>
                    </View>
                </Section>

                {/* 5. Transport Info (Optional) */}
                {hasTransport && (
                    <Section 
                        title="Transport & E-Way Bill" 
                        isExpanded={expandedSections.transport} 
                        onToggle={() => toggleSection('transport')}
                        summary={transport.vehicleNo || 'Not specified'}
                    >
                        <View className="flex-row gap-4 mb-4">
                            <View className="flex-1">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Vehicle No</Text>
                                <TextInput 
                                    className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                                    value={transport.vehicleNo}
                                    onChangeText={t => setTransport({...transport, vehicleNo: t})}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-1">E-Way Bill No</Text>
                                <TextInput 
                                    className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                                    value={transport.ewayBill}
                                    onChangeText={t => setTransport({...transport, ewayBill: t})}
                                />
                            </View>
                        </View>
                        <View className="flex-row gap-4 mb-4">
                            <View className="flex-1">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Dispatch Date</Text>
                                <TextInput 
                                    className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                                    value={transport.deliveryDate}
                                    onChangeText={t => setTransport({...transport, deliveryDate: t})}
                                    placeholder="DD-MM-YYYY"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Transporter Name</Text>
                                <TextInput 
                                    className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary"
                                    value={transport.transporterName}
                                    onChangeText={t => setTransport({...transport, transporterName: t})}
                                />
                            </View>
                        </View>
                    </Section>
                )}

                {/* 6. Notes */}
                <Section 
                    title="Notes & Remarks" 
                    isExpanded={expandedSections.notes} 
                    onToggle={() => toggleSection('notes')}
                >
                    <View className="mb-4">
                        <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Terms & Conditions (Visible on Document)</Text>
                        <TextInput 
                            className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-primary h-20"
                            multiline
                            textAlignVertical="top"
                            value={notes.external}
                            onChangeText={t => setNotes({...notes, external: t})}
                        />
                    </View>
                </Section>

            </ScrollView>

            {/* Party Selector Modal */}
            <AnimatedModal visible={partyModalVisible} onClose={() => setPartyModalVisible(false)}>
                <View className="bg-white rounded-t-3xl h-[600px] p-5 shadow-xl">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="font-sans-bold text-xl text-primary">Select {partyLabel}</Text>
                        <Pressable onPress={() => setPartyModalVisible(false)} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                            <X color="#64748b" size={20} />
                        </Pressable>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {parties.filter(p => partyFilter === 'both' || p.partyType === partyFilter.toUpperCase() || p.partyType === 'BOTH').map(party => (
                            <Pressable 
                                key={party.id} 
                                className="p-4 border-b border-border flex-row justify-between items-center"
                                onPress={() => handlePartySelect(party)}
                            >
                                <View>
                                    <Text className="font-sans-bold text-primary">{party.legalName}</Text>
                                    <Text className="font-sans-medium text-muted-foreground text-xs mt-1">
                                        {party.gstin ? `GST: ${party.gstin}` : 'Unregistered'}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </AnimatedModal>

            {/* InventoryItem Selector Modal */}
            <AnimatedModal visible={itemModalVisible} onClose={() => setItemModalVisible(false)}>
                <View className="bg-white rounded-t-3xl h-[700px] p-5 shadow-xl">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="font-sans-bold text-xl text-primary">Add InventoryItem</Text>
                        <Pressable onPress={() => setItemModalVisible(false)} className="h-11 w-11 items-center justify-center bg-muted rounded-full">
                            <X color="#64748b" size={20} />
                        </Pressable>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {items.map(item => (
                            <Pressable 
                                key={item.id} 
                                className="p-4 border-b border-border flex-row justify-between items-center"
                                onPress={() => { 
                                    const newItem = computeLineItem({
                                        id: `li-${item.id}-${Date.now()}`,
                                        inventoryItemId: item.id,
                                        description: item.name,
                                        hsnSacCode: item.hsnSacCode,
                                        taxRate: item.taxRate,
                                        unit: item.unit || 'pcs',
                                        quantityDecimal: 1,
                                        unitPricePaise: item.unitPricePaise,
                                        discountPercent: 0,
                                    }, isInterState);
                                    setDocumentItems([...documentItems, newItem]); 
                                    setItemModalVisible(false); 
                                }}
                            >
                                <View>
                                    <Text className="font-sans-bold text-primary">{item.name}</Text>
                                    <Text className="font-sans-medium text-muted-foreground text-xs mt-1">
                                        {formatINR(item.unitPricePaise)} • Stock: {item.stock || 0}
                                    </Text>
                                </View>
                                <View className="bg-primary/10 px-2 py-1 rounded">
                                    <Text className="font-sans-bold text-[10px] text-primary">ADD</Text>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </AnimatedModal>

            {/* Bottom Action Bar */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-3 flex-row shadow-lg pb-8 z-20">
                <Pressable onPress={handleSave} className="flex-1 bg-primary items-center justify-center rounded-xl min-h-[48px] flex-row">
                    <Save color="white" size={16} className="mr-2" />
                    <Text className="font-sans-bold text-white">Save</Text>
                </Pressable>
            </View>
            </View>
        </KeyboardAvoidingView>
    );
}
