import { useAppStore } from "@/store";
import { getCurrentFinancialYear } from "@/utils/date";
import { useShallow } from 'zustand/react/shallow';
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Party, DocumentType, SalesInvoice } from "@/types/entities";
import DocumentBuilder, { DocumentData } from "@/components/domain/DocumentBuilder";
import { buildGSTSummary, amountInIndianWords } from "@/utils/gst";

export default function CreateInvoiceScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { invoices, deliveryChallans, parties, addInvoice, updateInvoice, documentCounters, incrementDocumentCounter, currentBusiness, invoiceSettings } = useAppStore(useShallow(state => ({ 
        invoices: state.invoices, 
        deliveryChallans: state.deliveryChallans,
        parties: state.parties, 
        addInvoice: state.addInvoice, 
        updateInvoice: state.updateInvoice, 
        documentCounters: state.documentCounters, 
        incrementDocumentCounter: state.incrementDocumentCounter, 
        currentBusiness: state.currentBusiness,
        invoiceSettings: state.invoiceSettings 
    })));

    const editId = params.id as string | undefined;
    const linkedChallanId = params.linkedChallanId as string | undefined;
    const existingDoc = editId ? invoices.find(i => i.id === editId) : undefined;
    const linkedChallan = linkedChallanId ? deliveryChallans.find(c => c.id === linkedChallanId) : undefined;
    
    const fy = getCurrentFinancialYear(currentBusiness?.fiscalYearStart || 'APRIL');
    const docPrefix = invoiceSettings?.invoicePrefix || "INV";
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
                deliveryDate: "",
                transporterName: ""
            } : undefined,
            notes: {
                external: existingDoc.notes || "",
                internal: ""
            }
        };
    } else if (linkedChallan) {
        const party = parties.find(p => p.id === linkedChallan.partyId);
        initialData = {
            selectedParty: party || ({ id: linkedChallan.partyId || "", legalName: "", partyType: "CUSTOMER" } as unknown as Party),
            header: {
                documentType: DocumentType.SALES_INVOICE,
                documentNumber: defaultDocNumber,
                documentDate: new Date().toISOString().split('T')[0],
                dueDate: "",
                status: "Draft",
            },
            items: linkedChallan.lineItems,
            payment: {
                mode: "UPI",
                terms: "Immediate"
            },
            transport: {
                vehicleNo: linkedChallan.vehicleNumber || "",
                ewayBill: "",
                deliveryDate: linkedChallan.dispatchDate || "",
                transporterName: ""
            },
            notes: {
                external: `Converted from Delivery Challan: ${linkedChallan.documentNumber}`,
                internal: ""
            }
        };
    }

    const handleSave = (documentData: DocumentData) => {
        const gstSummary = buildGSTSummary(documentData.items, documentData.totals.isInterState);

        const invoiceToSave: SalesInvoice = {
            id: editId || `${Date.now()}`,
            documentType: DocumentType.SALES_INVOICE,
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
            isInterState: documentData.totals.isInterState,
            placeOfSupply: documentData.selectedParty.billingAddress?.state || "",
            status: (existingDoc && existingDoc.paidAmountPaise > 0) 
                ? (existingDoc.paidAmountPaise >= documentData.totals.totalAmountPaise ? "Paid" : "Partially Paid") 
                : (documentData.header.status || "Draft"),
            createdAt: existingDoc ? existingDoc.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paymentMode: documentData.payment.mode,
            paidAmountPaise: existingDoc ? existingDoc.paidAmountPaise : 0,
            balanceDuePaise: existingDoc ? Math.max(0, documentData.totals.totalAmountPaise - existingDoc.paidAmountPaise) : documentData.totals.totalAmountPaise,
            eWayBillNumber: documentData.transport?.ewayBill,
            linkedChallanId: linkedChallanId || existingDoc?.linkedChallanId,
        };

        if (editId) {
            updateInvoice(invoiceToSave );
            
        } else {
            addInvoice(invoiceToSave );
            incrementDocumentCounter(docPrefix, fy);
            
        }
        
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-slate-50">
            <DocumentBuilder
                defaultDocNumber={defaultDocNumber}
                title={editId ? "Edit Sales Invoice" : "New Sales Invoice"}
                defaultType="Tax Invoice"
                defaultPrefix={`${docPrefix}-`}
                partyLabel="Customer"
                partyFilter="customer"
                hasTransport={true}
                defaultNotes="Goods once sold will not be taken back."
                initialData={initialData}
                onSave={handleSave}
            />
        </SafeAreaView>
    );
}
