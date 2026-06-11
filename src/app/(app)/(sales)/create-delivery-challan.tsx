import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppStore } from "@/store";
import DocumentBuilder, { DocumentData } from "@/components/domain/DocumentBuilder";

export default function CreateDeliveryChallanScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { invoices, parties, addInvoice, updateInvoice } = useAppStore(); // Using invoices collection for estimates for now

    const editId = params.id as string | undefined;
    const existingChallan = editId ? invoices.find(i => i.id === editId) : undefined;
    
    // For edit mode, reconstruct the initial data to match what DocumentBuilder expects
    let initialData = undefined;
    if (existingChallan) {
        const party = parties.find(p => p.id === existingChallan.customerId) || parties.find(p => p.id === existingChallan.vendorId);
        initialData = {
            selectedParty: party || ({ id: existingChallan.customerId || existingChallan.vendorId || "", name: existingChallan.customerName || existingChallan.vendorName || "" } as Party),
            header: {
                type: existingChallan.type,
                number: existingChallan.number,
                date: existingChallan.date,
                dueDate: existingChallan.dueDate || "",
                status: existingChallan.status,
            },
            items: existingChallan.items,
            payment: {
                mode: existingChallan.paymentMode || "UPI",
                terms: existingChallan.paymentTerms || "Immediate"
            },
            transport: existingChallan.transport ? { 
                vehicleNo: existingChallan.transport.vehicleNumber || "", 
                ewayBill: existingChallan.transport.ewayBillNumber || "", 
                deliveryDate: existingChallan.transport.deliveryDate || "" 
            } : undefined,
            notes: {
                external: existingChallan.notes || "",
                internal: existingChallan.internalNotes || ""
            }
        };
    }

    const handleSave = (documentData: DocumentData) => {
        const challanToSave = {
            id: editId || `dc-${Date.now()}`,
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
            updateInvoice(challanToSave as Invoice);
            console.log("Updated Delivery Challan!");
        } else {
            addInvoice(challanToSave as Invoice);
            console.log("Saved Delivery Challan!");
        }
        
        router.back();
    };

    return (
        <DocumentBuilder
            title={editId ? "Edit Delivery Challan" : "New Delivery Challan"}
            defaultType="Delivery Challan"
            defaultPrefix="DC-"
            partyLabel="Customer"
            partyFilter="customer"
            hasTransport={true}
            defaultNotes="Goods delivered as per the above details."
            initialData={initialData}
            onSave={handleSave}
        />
    );
}
