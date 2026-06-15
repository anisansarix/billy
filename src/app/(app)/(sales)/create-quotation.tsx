import { useLocalSearchParams, useRouter } from "expo-router";
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from "@/store";
import { getCurrentFinancialYear } from "@/utils/date";
import { Party, DocumentType, DocumentBase, SalesInvoice } from "@/types/entities";
import DocumentBuilder, { DocumentData } from "@/components/domain/DocumentBuilder";
import { buildGSTSummary, amountInIndianWords } from "@/utils/gst";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateQuotationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { invoices, parties, addInvoice, updateInvoice, documentCounters, incrementDocumentCounter, currentBusiness } = useAppStore(useShallow(state => ({ invoices: state.invoices, parties: state.parties, addInvoice: state.addInvoice, updateInvoice: state.updateInvoice, documentCounters: state.documentCounters, incrementDocumentCounter: state.incrementDocumentCounter, currentBusiness: state.currentBusiness }))); // we can reuse invoices for quotations for now or define a new state later if the architect updates it.

    const editId = params.id as string | undefined;
    const existingDoc = editId ? invoices.find(i => i.id === editId) : undefined;
    
    // For edit mode, reconstruct the initial data to match what DocumentBuilder expects
    
    const fy = getCurrentFinancialYear(currentBusiness?.fiscalYearStart || 'APRIL');
    const docPrefix = "QT";
    const counterKey = `${docPrefix}-${fy}`;
    const nextNum = String((documentCounters?.[counterKey] || 0) + 1).padStart(4, '0');
    const defaultDocNumber = `${counterKey}-${nextNum}`;
    
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
                mode: existingDoc.paymentMode || "UPI",
                terms: "Immediate"
            },
            transport: existingDoc.eWayBillNumber ? { 
                vehicleNo: "", 
                ewayBill: existingDoc.eWayBillNumber, 
                deliveryDate: "" 
            } : undefined,
            notes: {
                external: existingDoc.notes || "",
                internal: ""
            }
        } as any;
    }

    const handleSave = (documentData: DocumentData) => {
        const gstSummary = buildGSTSummary(documentData.items, documentData.totals.isInterState);

        const quotationToSave = {
            id: editId || `${Date.now()}`,
            documentType: DocumentType.PROFORMA_INVOICE,
            documentNumber: documentData.header.documentNumber,
            documentDate: documentData.header.documentDate,
            dueDate: documentData.header.dueDate,
            businessId: "b1",
            partyId: documentData.selectedParty.id,
            partyName: documentData.selectedParty.legalName || "",
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
            status: documentData.header.status || "Draft",
            createdAt: existingDoc ? existingDoc.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paymentMode: documentData.payment.mode || "None",
            paidAmountPaise: 0,
            balanceDuePaise: documentData.totals.totalAmountPaise,
        } as unknown as DocumentBase & Partial<SalesInvoice>;

        if (editId) {
            updateInvoice(quotationToSave as unknown as SalesInvoice);
            
        } else {
            addInvoice(quotationToSave as unknown as SalesInvoice);
            incrementDocumentCounter(docPrefix, fy);
        }
        
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-slate-50">
            <DocumentBuilder 
                title="Create Quotation"
                subtitle="Formalize your offerings"
                defaultDocNumber={defaultDocNumber}
                defaultType="QUOTATION"
                defaultPrefix="QT-"
                partyLabel="Customer"
                partyFilter="customer"
                hasTransport={false}
                defaultNotes="This quotation is valid for 30 days."
                initialData={initialData}
                onSave={handleSave}
            />
        </SafeAreaView>
    );
}
