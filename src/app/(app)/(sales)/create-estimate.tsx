import { useLocalSearchParams, useRouter } from "expo-router";
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from "@/store";
import DocumentBuilder, { DocumentData } from "@/components/domain/DocumentBuilder";

export default function CreateEstimateScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {  invoices, parties, addInvoice, updateInvoice  } = useAppStore(useShallow(state => ({ invoices: state.invoices, parties: state.parties, addInvoice: state.addInvoice, updateInvoice: state.updateInvoice }))); // Using invoices collection for estimates for now

    const editId = params.id as string | undefined;
    const existingEstimate = editId ? invoices.find(i => i.id === editId) : undefined;
    
    // For edit mode, reconstruct the initial data to match what DocumentBuilder expects
    let initialData = undefined;
    if (existingEstimate) {
        const party = parties.find(p => p.id === existingEstimate.customerId) || parties.find(p => p.id === existingEstimate.vendorId);
        initialData = {
            selectedParty: party || ({ id: existingEstimate.customerId || existingEstimate.vendorId || "", name: existingEstimate.customerName || existingEstimate.vendorName || "" } as Party),
            header: {
                type: existingEstimate.type,
                number: existingEstimate.number,
                date: existingEstimate.date,
                dueDate: existingEstimate.dueDate || "",
                status: existingEstimate.status,
            },
            items: existingEstimate.items,
            payment: {
                mode: existingEstimate.paymentMode || "UPI",
                terms: existingEstimate.paymentTerms || "Immediate"
            },
            transport: existingEstimate.transport ? { 
                vehicleNo: existingEstimate.transport.vehicleNumber || "", 
                ewayBill: existingEstimate.transport.ewayBillNumber || "", 
                deliveryDate: existingEstimate.transport.deliveryDate || "" 
            } : undefined,
            notes: {
                external: existingEstimate.notes || "",
                internal: existingEstimate.internalNotes || ""
            }
        };
    }

    const handleSave = (documentData: DocumentData) => {
        const estimateToSave = {
            id: editId || `est-${Date.now()}`,
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
            updateInvoice(estimateToSave as Invoice);
            console.log("Updated Estimate!");
        } else {
            addInvoice(estimateToSave as Invoice);
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
