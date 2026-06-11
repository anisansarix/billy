import { useLocalSearchParams, useRouter } from "expo-router";
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from "@/store";
import { Party, SalesInvoice, DocumentType } from "@/types/entities";
import DocumentBuilder, { DocumentData } from "@/components/domain/DocumentBuilder";

export default function CreateEstimateScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {  invoices, parties, addInvoice, updateInvoice  } = useAppStore(useShallow(state => ({ invoices: state.invoices, parties: state.parties, addInvoice: state.addInvoice, updateInvoice: state.updateInvoice }))); // Using invoices collection for estimates for now

    const editId = params.id as string | undefined;
    const existingDoc = editId ? invoices.find(i => i.id === editId) : undefined;
    
    // For edit mode, reconstruct the initial data to match what DocumentBuilder expects
    let initialData = undefined;
    if (existingDoc) {
        const party = parties.find(p => p.id === existingDoc.partyId);
        initialData = {
            selectedParty: party || ({ id: existingDoc.partyId || "", legalName: "", partyType: "CUSTOMER" } as unknown as Party),
            header: {
                type: existingDoc.documentType,
                number: existingDoc.documentNumber,
                date: existingDoc.documentDate,
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
        const estimateToSave: any = {
            id: editId || `${Date.now()}`,
            documentType: DocumentType.PROFORMA_INVOICE,
            documentNumber: documentData.header.documentNumber,
            documentDate: documentData.header.documentDate,
            dueDate: documentData.header.dueDate,
            businessId: "b1",
            partyId: documentData.selectedParty.id,
            lineItems: documentData.items,
            gstSummary: { slabs: {}, totalTaxableValuePaise: 0, totalGSTAmountPaise: 0, totalCessAmountPaise: 0 },
            subtotalPaise: documentData.totals.subtotalPaise,
            totalDiscountPaise: documentData.totals.discountPaise,
            totalTaxableAmountPaise: documentData.totals.subtotalPaise - documentData.totals.discountPaise,
            totalGSTAmountPaise: documentData.totals.cgstPaise + documentData.totals.sgstPaise + documentData.totals.igstPaise,
            totalAmountPaise: documentData.totals.totalAmountPaise,
            totalAmountInWords: "",
            notes: documentData.notes.external,
            isInterState: false,
            placeOfSupply: "",
            status: documentData.header.status || "Draft",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paymentMode: documentData.payment.mode,
            paidAmountPaise: 0,
            balanceDuePaise: documentData.totals.totalAmountPaise,
            eWayBillNumber: documentData.transport?.ewayBill,
        };

        if (editId) {
            updateInvoice(estimateToSave );
            console.log("Updated Estimate!");
        } else {
            addInvoice(estimateToSave );
            console.log("Saved Estimate!");
        }
        
        router.back();
    };

    return (
        <DocumentBuilder
            title={editId ? "Edit Estimate" : "New Estimate"}
            defaultType="Estimate"
            defaultPrefix="EST-"
            partyLabel="Customer"
            partyFilter="customer"
            hasTransport={false}
            defaultNotes="This estimate is valid for 30 days."
            initialData={initialData}
            onSave={handleSave}
        />
    );
}
