import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Info } from "lucide-react-native";
import { Pressable, Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/store";
import { CreditNote, DocumentType, Party } from "@/types/entities";
import DocumentBuilder, { DocumentData } from "@/components/domain/DocumentBuilder";
import { buildGSTSummary, amountInIndianWords } from "@/utils/gst";
import { useMemo } from "react";
import "../../../../../global.css";

export default function NewCreditNoteScreen() {
    const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();
    const router = useRouter();

    const originalInvoice = useAppStore(s => s.invoices.find(i => i.id === invoiceId));
    const parties = useAppStore(s => s.parties);
    const addCreditNote = useAppStore(s => s.addCreditNote);
    const incrementDocumentCounter = useAppStore(s => s.incrementDocumentCounter);
    const documentCounters = useAppStore(s => s.documentCounters);
    const currentBusiness = useAppStore(s => s.currentBusiness);
    const invoiceSettings = useAppStore(s => s.invoiceSettings);

    // Auto-generate document number
    const currentFY = currentBusiness?.fiscalYearStart || 'APRIL';
    const docPrefix = invoiceSettings?.cnPrefix || "CN";
    const nextCNNumber = (documentCounters[`${docPrefix}-${currentFY}`] || 1).toString().padStart(3, '0');
    const autoGenCNNumber = `${docPrefix}/${new Date().getFullYear()}/${nextCNNumber}`;

    const initialData = useMemo(() => {
        if (!originalInvoice) return undefined;
        const party = parties.find(p => p.id === originalInvoice.partyId);
        return {
            selectedParty: party || ({ id: originalInvoice.partyId || "", legalName: "", partyType: "CUSTOMER" } as unknown as Party),
            header: {
                documentType: DocumentType.CREDIT_NOTE,
                documentNumber: autoGenCNNumber,
                documentDate: new Date().toISOString(),
                dueDate: "",
                status: "Draft",
            },
            items: originalInvoice.lineItems,
            payment: {
                mode: "UPI",
                terms: "Immediate"
            },
            notes: {
                internal: "",
                external: `Against Invoice: ${originalInvoice.documentNumber}`
            }
        } as Partial<DocumentData>;
    }, [originalInvoice, parties, autoGenCNNumber]);

    if (!originalInvoice) {
        return (
            <SafeAreaView style={{ flex: 1 }} className="bg-slate-50 items-center justify-center">
                <Text className="font-sans-bold text-lg text-primary mb-4">Original Invoice not found</Text>
                <Pressable onPress={() => router.back()} className="px-6 py-3 bg-primary rounded-full">
                    <Text className="font-sans-bold text-white">Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-white shadow-sm z-10 border-b border-border">
                <Pressable onPress={() => router.back()} className="p-2 -ml-2 min-h-[44px] min-w-[44px] items-center justify-center mr-2">
                    <ArrowLeft color="#0f172a" size={24} />
                </Pressable>
                <Text className="font-sans-bold text-lg text-primary flex-1">New Credit Note</Text>
            </View>

            {/* Info Banner */}
            <View className="bg-amber-50 px-4 py-3 border-b border-amber-200 flex-row items-center">
                <Info color="#d97706" size={16} className="mr-2" />
                <Text className="font-sans-medium text-sm text-amber-800">
                    Credit note for Invoice {originalInvoice.documentNumber}
                </Text>
            </View>

            <DocumentBuilder
                title="New Credit Note"
                defaultType="CREDIT_NOTE"
                defaultPrefix={docPrefix}
                defaultDocNumber={autoGenCNNumber}
                partyLabel="Customer"
                partyFilter="customer"
                initialData={initialData}
                onSave={(documentData: DocumentData) => {
                    const gstSummary = buildGSTSummary(documentData.items, documentData.totals.isInterState);

                    const creditNote: CreditNote = {
                        id: `cn-${Date.now()}`,
                        documentType: DocumentType.CREDIT_NOTE,
                        documentNumber: documentData.header.documentNumber,
                        documentDate: documentData.header.documentDate,
                        dueDate: documentData.header.dueDate,
                        businessId: currentBusiness?.id || 'b1',
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
                        isInterState: documentData.totals.isInterState,
                        placeOfSupply: documentData.selectedParty.billingAddress?.state || "",
                        status: 'ISSUED',
                        originalInvoiceId: invoiceId,
                        reason: 'Customer return',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };
                    
                    incrementDocumentCounter(docPrefix, currentFY);
                    addCreditNote(creditNote);
                    router.back();
                    Alert.alert('Credit Note Created', `${creditNote.documentNumber} raised against ${originalInvoice.documentNumber}`);
                }}
            />
        </SafeAreaView>
    );
}
