import { useLocalSearchParams, useRouter } from "expo-router";
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from "../../store";
import DocumentBuilder, { DocumentData } from "@/components/DocumentBuilder";

export default function CreatePurchaseScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {  purchases, parties, addPurchase, updatePurchase  } = useAppStore(useShallow(state => ({ purchases: state.purchases, parties: state.parties, addPurchase: state.addPurchase, updatePurchase: state.updatePurchase })));

    const editId = params.id as string | undefined;
    const existingPurchase = editId ? purchases.find(p => p.id === editId) : undefined;
    
    // For edit mode, reconstruct the initial data to match what DocumentBuilder expects
    let initialData = undefined;
    if (existingPurchase) {
        const party = parties.find(p => p.id === existingPurchase.customerId) || parties.find(p => p.id === existingPurchase.vendorId);
        initialData = {
            selectedParty: party || ({ id: existingPurchase.customerId || existingPurchase.vendorId || "", name: existingPurchase.customerName || existingPurchase.vendorName || "" } as Party),
            header: {
                type: existingPurchase.type,
                number: existingPurchase.number,
                date: existingPurchase.date,
                dueDate: existingPurchase.dueDate || "",
                status: existingPurchase.status,
            },
            items: existingPurchase.items,
            payment: {
                mode: existingPurchase.paymentMode || "UPI",
                terms: existingPurchase.paymentTerms || "Immediate"
            },
            transport: existingPurchase.transport ? { 
                vehicleNo: existingPurchase.transport.vehicleNumber || "", 
                ewayBill: existingPurchase.transport.ewayBillNumber || "", 
                deliveryDate: existingPurchase.transport.deliveryDate || "" 
            } : undefined,
            notes: {
                external: existingPurchase.notes || "",
                internal: existingPurchase.internalNotes || ""
            }
        };
    }

    const handleSave = (documentData: DocumentData) => {
        const purchaseToSave = {
            id: editId || `po-${Date.now()}`,
            number: documentData.header.number,
            date: documentData.header.date,
            dueDate: documentData.header.dueDate,
            type: documentData.header.type,
            status: documentData.header.status || "Draft",
            vendorId: documentData.selectedParty.id,
            vendorName: documentData.selectedParty.name,
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
            notes: documentData.notes.external,
            internalNotes: documentData.notes.internal,
        };

        if (editId) {
            updatePurchase(purchaseToSave as Invoice);
            console.log("Updated Purchase!");
        } else {
            addPurchase(purchaseToSave as Invoice);
            console.log("Saved Purchase!");
        }
        
        router.back();
    };

    return (
        <DocumentBuilder
            title={editId ? "Edit Purchase" : "New Purchase"}
            defaultType="Purchase Order"
            defaultPrefix="PO-"
            partyLabel="Vendor"
            partyFilter="vendor"
            hasTransport={false}
            defaultNotes="Please deliver goods within 7 days."
            initialData={initialData}
            onSave={handleSave}
        />
    );
}
