import { useAppStore } from "@/store";
import { getCurrentFinancialYear } from "@/utils/date";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Ban, ChevronRight, ReceiptText, Search } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, Vibration, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from 'zustand/react/shallow';

import DocumentBuilder, { DocumentData } from "@/components/domain/DocumentBuilder";
import { CreditNote, DocumentType, Party, SalesInvoice } from "@/types/entities";
import { formatDate } from "@/utils/date";
import { amountInIndianWords, buildGSTSummary } from "@/utils/gst";
import { formatINR } from "@/utils/money";

export default function CreateCreditNoteScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { creditNotes, invoices, parties, addCreditNote, updateCreditNote, documentCounters, incrementDocumentCounter, currentBusiness } = useAppStore(useShallow(state => ({
        creditNotes: state.creditNotes,
        invoices: state.invoices,
        parties: state.parties,
        addCreditNote: state.addCreditNote,
        updateCreditNote: state.updateCreditNote,
        documentCounters: state.documentCounters,
        incrementDocumentCounter: state.incrementDocumentCounter,
        currentBusiness: state.currentBusiness
    })));

    const editId = params.id as string | undefined;
    const existingDoc = editId ? creditNotes.find(i => i.id === editId) : undefined;

    // UI State for 2-step flow
    const [step, setStep] = useState<"PICK_INVOICE" | "BUILD_DOCUMENT">(existingDoc ? "BUILD_DOCUMENT" : "PICK_INVOICE");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOriginalInvoice, setSelectedOriginalInvoice] = useState<SalesInvoice | null>(null);

    const fy = getCurrentFinancialYear(currentBusiness?.fiscalYearStart || 'APRIL');
    const docPrefix = "CN";
    const counterKey = `${docPrefix}-${fy}`;
    const nextNum = String((documentCounters?.[counterKey] || 0) + 1).padStart(4, '0');
    const defaultDocNumber = `${counterKey}-${nextNum}`;

    // Prepare initial data based on either existing doc or selected original invoice
    let initialData = undefined;
    if (existingDoc) {
        const party = parties.find(p => p.id === existingDoc.partyId);
        initialData = {
            selectedParty: party || ({ id: existingDoc.partyId || "", legalName: "", partyType: "CUSTOMER" } as unknown as Party),
            header: {
                documentType: existingDoc.documentType,
                documentNumber: existingDoc.documentNumber,
                documentDate: existingDoc.documentDate,
                dueDate: existingDoc.dueDate || "",
                status: existingDoc.status,
            },
            items: existingDoc.lineItems,
            payment: {
                mode: "UPI",
                terms: "Immediate"
            },
            notes: {
                external: existingDoc.reason || "",
                internal: ""
            }
        };
    } else if (selectedOriginalInvoice) {
        const party = parties.find(p => p.id === selectedOriginalInvoice.partyId);
        initialData = {
            selectedParty: party || ({ id: selectedOriginalInvoice.partyId || "", legalName: "", partyType: "CUSTOMER" } as unknown as Party),
            header: {
                documentType: DocumentType.CREDIT_NOTE,
                documentNumber: defaultDocNumber,
                documentDate: new Date().toISOString(),
                dueDate: "",
                status: "Draft",
            },
            items: selectedOriginalInvoice.lineItems, // Prefill all items!
            payment: {
                mode: "UPI",
                terms: "Immediate"
            },
            notes: {
                external: `Return against Invoice: ${selectedOriginalInvoice.documentNumber}`,
                internal: ""
            }
        };
    }

    const handleSave = (documentData: DocumentData) => {
        const gstSummary = buildGSTSummary(documentData.items, documentData.totals.isInterState);

        const cnToSave: CreditNote = {
            id: editId || `cn-${Date.now()}`,
            documentType: DocumentType.CREDIT_NOTE,
            documentNumber: documentData.header.documentNumber,
            documentDate: documentData.header.documentDate,
            dueDate: documentData.header.dueDate,
            businessId: "b1",
            partyId: documentData.selectedParty.id,
            partyName: documentData.selectedParty.legalName,
            lineItems: documentData.items,
            gstSummary: gstSummary,
            subtotalPaise: documentData.totals.subtotalPaise,
            totalDiscountPaise: documentData.totals.discountPaise,
            totalTaxableAmountPaise: documentData.totals.subtotalPaise - documentData.totals.discountPaise,
            totalGSTAmountPaise: documentData.totals.cgstPaise + documentData.totals.sgstPaise + documentData.totals.igstPaise,
            totalAmountPaise: documentData.totals.totalAmountPaise,
            totalAmountInWords: amountInIndianWords(documentData.totals.totalAmountPaise),
            notes: documentData.notes.external,
            reason: documentData.notes.external || "Sales Return",
            originalInvoiceId: selectedOriginalInvoice?.id || existingDoc?.originalInvoiceId || "",
            isInterState: documentData.totals.isInterState,
            placeOfSupply: documentData.selectedParty.billingAddress?.state || "",
            status: documentData.header.status || "Draft",
            createdAt: existingDoc ? existingDoc.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (editId) {
            updateCreditNote(cnToSave);
        } else {
            addCreditNote(cnToSave);
            incrementDocumentCounter(docPrefix, fy);
        }

        router.back();
    };

    // --- STEP 1 UI: Invoice Picker ---
    if (step === "PICK_INVOICE") {
        const filteredInvoices = invoices.filter(inv => {
            if (inv.documentType !== "SALES_INVOICE") return false;
            const searchLower = searchQuery.toLowerCase();
            return inv.documentNumber.toLowerCase().includes(searchLower) || inv.partyName.toLowerCase().includes(searchLower);
        }).sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }} edges={['top', 'left', 'right']}>
                <View className="flex-row items-center p-4 bg-white shadow-sm z-10 border-b border-border">
                    <Pressable onPress={() => { Vibration.vibrate(10); router.back(); }} className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
                        <ArrowLeft color="#081126" size={24} />
                    </Pressable>
                    <View className="ml-2 flex-1">
                        <Text className="text-lg font-sans-bold text-primary">Create Credit Note</Text>
                        <Text className="text-xs font-sans-medium text-muted-foreground">Step 1: Select Invoice</Text>
                    </View>
                </View>

                <View className="p-4">
                    <Pressable
                        onPress={() => {
                            Vibration.vibrate(10);
                            setSelectedOriginalInvoice(null);
                            setStep("BUILD_DOCUMENT");
                        }}
                        className="bg-white border border-border rounded-xl p-4 flex-row items-center mb-4 active:bg-slate-50 shadow-sm"
                    >
                        <View className="bg-slate-100 p-2 rounded-full mr-3">
                            <Ban color="#64748b" size={20} />
                        </View>
                        <View className="flex-1">
                            <Text className="font-sans-bold text-base text-primary">Blank Credit Note</Text>
                            <Text className="font-sans-medium text-xs text-muted-foreground mt-0.5">Create without linking to a specific invoice</Text>
                        </View>
                        <ChevronRight color="#cbd5e1" size={20} />
                    </Pressable>

                    <Text className="font-sans-bold text-sm text-primary mb-3">Or select an existing invoice to return against:</Text>

                    <View className="bg-white flex-row items-center px-4 h-12 rounded-xl border border-border mb-4">
                        <Search color="#94a3b8" size={18} />
                        <TextInput
                            className="flex-1 font-sans-medium text-sm text-primary ml-2 h-full"
                            placeholder="Search invoice number or customer..."
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <Pressable onPress={() => setSearchQuery("")} className="p-2">
                                <Text className="text-xs text-blue-500 font-sans-bold">Clear</Text>
                            </Pressable>
                        )}
                    </View>
                </View>

                <FlatList
                    data={filteredInvoices}
                    keyExtractor={item => item.id}
                    initialNumToRender={10}
                    windowSize={10}
                    maxToRenderPerBatch={5}
                    removeClippedSubviews={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                    renderItem={({ item }) => (
                        <Pressable
                            className="bg-white border border-border rounded-xl p-4 mb-3 flex-row items-center shadow-sm active:bg-slate-50"
                            onPress={() => {
                                Vibration.vibrate(10);
                                setSelectedOriginalInvoice(item);
                                setStep("BUILD_DOCUMENT");
                            }}
                        >
                            <View className="bg-blue-50 p-3 rounded-full mr-4">
                                <ReceiptText color="#208AEF" size={20} />
                            </View>
                            <View className="flex-1">
                                <Text className="font-sans-bold text-base text-primary">{item.partyName}</Text>
                                <Text className="font-sans-medium text-xs text-muted-foreground mt-1">
                                    {item.documentNumber} • {formatDate(item.documentDate)}
                                </Text>
                            </View>
                            <View className="items-end justify-center ml-2">
                                <Text className="font-sans-bold text-sm text-primary">{formatINR(item.totalAmountPaise)}</Text>
                                <Text className="font-sans-medium text-[10px] text-muted-foreground uppercase mt-1">Total</Text>
                            </View>
                        </Pressable>
                    )}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-10 px-4">
                            <Text className="font-sans-medium text-base text-muted-foreground text-center">No invoices found.</Text>
                        </View>
                    }
                />
            </SafeAreaView>
        );
    }

    // --- STEP 2 UI: Document Builder ---
    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-slate-50">
            <DocumentBuilder
                defaultDocNumber={defaultDocNumber}
                title={editId ? "Edit Credit Note" : "New Credit Note"}
                defaultType="Credit Note"
                defaultPrefix="CN-"
                partyLabel="Customer"
                partyFilter="customer"
                hasTransport={false}
                defaultNotes="Sales Return"
                initialData={initialData}
                onSave={handleSave}
            />
        </SafeAreaView>
    );
}
