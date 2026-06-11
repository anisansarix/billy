import { useLocalSearchParams, useRouter } from "expo-router";
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from "@/store";
import DocumentBuilder, { DocumentData } from "@/components/domain/DocumentBuilder";

export default function CreateQuotationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {  invoices, parties, addInvoice, updateInvoice  } = useAppStore(useShallow(state => ({ invoices: state.invoices, parties: state.parties, addInvoice: state.addInvoice, updateInvoice: state.updateInvoice }))); // we can reuse invoices for quotations for now or define a new state later if the architect updates it.

    const editId = params.id as string | undefined;
    const existingQuotation = editId ? invoices.find(i => i.id === editId) : undefined;
    
    // For edit mode, reconstruct the initial data to match what DocumentBuilder expects
    let initialData = undefined;
    if (existingQuotation) {
        const party = parties.find(p => p.id === existingQuotation.customerId) || parties.find(p => p.id === existingQuotation.vendorId);
        initialData = {
            selectedParty: party || ({ id: existingQuotation.customerId || existingQuotation.vendorId || "", name: existingQuotation.customerName || existingQuotation.vendorName || "" } as Party),
            header: {
                type: existingQuotation.type,
                number: existingQuotation.number,
                date: existingQuotation.date,
                dueDate: existingQuotation.dueDate || "",
                status: existingQuotation.status,
            },
            items: existingQuotation.items,
            payment: {
                mode: existingQuotation.paymentMode || "UPI",
                terms: existingQuotation.paymentTerms || "Immediate"
            },
            transport: existingQuotation.transport ? { 
                vehicleNo: existingQuotation.transport.vehicleNumber || "", 
                ewayBill: existingQuotation.transport.ewayBillNumber || "", 
                deliveryDate: existingQuotation.transport.deliveryDate || "" 
            } : undefined,
            notes: {
                external: existingQuotation.notes || "",
                internal: existingQuotation.internalNotes || ""
            }
        };
    }

    const handleSave = (documentData: DocumentData) => {
        const quotationToSave = {
            id: editId || `qt-${Date.now()}`,
            number: documentData.header.number,
            date: documentData.header.date,
            dueDate: documentData.header.dueDate,
            type: documentData.header.type,
            status: documentData.header.status || "Draft",
            customerId: documentData.selectedParty.id,
            customerName: documentData.selectedParty.name,
            items: documentData.items,
            subtotal: documentData.totals.subtotal,
            discountAmount: documentData.totals.discount,
            cgstAmount: documentData.totals.cgst,
            sgstAmount: documentData.totals.sgst,
            igstAmount: documentData.totals.igst,
            roundOff: documentData.totals.roundOff,
            total: documentData.totals.total,
            paymentTerms: documentData.payment.terms,
            paymentMode: documentData.payment.mode,
            transport: documentData.transport,
            notes: documentData.notes.external,
            internalNotes: documentData.notes.internal,
        };

        if (editId) {
            updateInvoice(quotationToSave as Invoice);
            console.log("Updated Quotation!");
        } else {
            addInvoice(quotationToSave as Invoice);
            console.log("Saved Quotation!");
        }
        
        router.back();
    };

    return (
        <DocumentBuilder
            title={editId ? "Edit Quotation" : "New Quotation"}
            defaultType="Quotation"
            defaultPrefix="QT-"
            partyLabel="Customer"
            partyFilter="customer"
            hasTransport={false}
            defaultNotes="This quotation is valid for 30 days."
            initialData={initialData}
            onSave={handleSave}
        />
    );
}
