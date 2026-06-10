import { useAppStore } from "../../store";
import { useShallow } from 'zustand/react/shallow';
import { useLocalSearchParams, useRouter } from "expo-router";

import DocumentBuilder, { DocumentData } from "@/components/DocumentBuilder";

export default function CreateInvoiceScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {  invoices, parties, addInvoice, updateInvoice  } = useAppStore(useShallow(state => ({ invoices: state.invoices, parties: state.parties, addInvoice: state.addInvoice, updateInvoice: state.updateInvoice })));

    const editId = params.id as string | undefined;
    const existingInvoice = editId ? invoices.find(i => i.id === editId) : undefined;
    
    // For edit mode, reconstruct the initial data to match what DocumentBuilder expects
    let initialData = undefined;
    if (existingInvoice) {
        const party = parties.find(p => p.id === existingInvoice.customerId) || parties.find(p => p.id === existingInvoice.vendorId);
        initialData = {
            selectedParty: party || ({ id: existingInvoice.customerId || existingInvoice.vendorId || "", name: existingInvoice.customerName || existingInvoice.vendorName || "" } as Party),
            header: {
                type: existingInvoice.type,
                number: existingInvoice.number,
                date: existingInvoice.date,
                dueDate: existingInvoice.dueDate || "",
                status: existingInvoice.status,
            },
            items: existingInvoice.items,
            payment: {
                mode: existingInvoice.paymentMode || "UPI",
                terms: existingInvoice.paymentTerms || "Immediate"
            },
            transport: existingInvoice.transport ? { 
                vehicleNo: existingInvoice.transport.vehicleNumber || "", 
                ewayBill: existingInvoice.transport.ewayBillNumber || "", 
                deliveryDate: existingInvoice.transport.deliveryDate || "" 
            } : undefined,
            notes: {
                external: existingInvoice.notes || "",
                internal: existingInvoice.internalNotes || ""
            }
        };
    }

    const handleSave = (documentData: DocumentData) => {
        const invoiceToSave = {
            id: editId || `inv-${Date.now()}`,
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
            updateInvoice(invoiceToSave as Invoice);
            console.log("Updated Invoice!");
        } else {
            addInvoice(invoiceToSave as Invoice);
            console.log("Saved Invoice!");
        }
        
        router.back();
    };

    return (
        <DocumentBuilder
            title={editId ? "Edit Invoice" : "New Invoice"}
            defaultType="Tax Invoice"
            defaultPrefix="INV-"
            partyLabel="Customer"
            partyFilter="customer"
            hasTransport={true}
            defaultNotes="Goods once sold will not be taken back."
            initialData={initialData}
            onSave={handleSave}
        />
    );
}
