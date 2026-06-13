import { useLocalSearchParams, useRouter } from "expo-router";
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from "@/store";
import DocumentBuilder, { DocumentData } from "@/components/domain/DocumentBuilder";
import { PurchaseOrder, Party } from "@/types/entities";

export default function CreatePurchaseScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {  purchases, parties, addPurchase, updatePurchase  } = useAppStore(useShallow(state => ({ purchases: state.purchases, parties: state.parties, addPurchase: state.addPurchase, updatePurchase: state.updatePurchase })));

    const editId = params.id as string | undefined;
    const existingPurchase = editId ? purchases.find(p => p.id === editId) : undefined;
    
    // For edit mode, reconstruct the initial data to match what DocumentBuilder expects
    let initialData = undefined;
    if (existingPurchase) {
        const party = parties.find(p => p.id === existingPurchase.partyId);
        initialData = {
            selectedParty: party || ({ id: existingPurchase.partyId || "", name: "" } as unknown as Party),
            header: {
                type: existingPurchase.documentType,
                number: existingPurchase.documentNumber,
                date: existingPurchase.documentDate,
                dueDate: existingPurchase.dueDate || "",
                status: existingPurchase.status,
            },
            items: existingPurchase.lineItems,
            payment: {
                mode: "UPI",
                terms: "Immediate"
            },
            transport: existingPurchase.expectedDeliveryDate ? { 
                vehicleNo: "", 
                ewayBill: "", 
                deliveryDate: existingPurchase.expectedDeliveryDate 
            } : undefined,
            notes: {
                external: existingPurchase.notes || "",
                internal: ""
            }
        };
    }

    const handleSave = (documentData: DocumentData) => {
        const purchaseToSave: PurchaseOrder = {
            id: editId || `po-${Date.now()}`,
            businessId: "b1",
            partyId: documentData.selectedParty.id,
            partyName: documentData.selectedParty.legalName,
            documentType: "PURCHASE_ORDER" as any,
            documentNumber: documentData.header.documentNumber,
            documentDate: documentData.header.documentDate,
            dueDate: documentData.header.dueDate,
            status: documentData.header.status || "Draft",
            lineItems: documentData.items,
            subtotalPaise: documentData.totals.subtotalPaise,
            totalDiscountPaise: documentData.totals.discountPaise,
            totalTaxableAmountPaise: documentData.totals.subtotalPaise - documentData.totals.discountPaise,
            totalGSTAmountPaise: documentData.totals.cgstPaise + documentData.totals.sgstPaise + documentData.totals.igstPaise,
            totalAmountPaise: documentData.totals.totalAmountPaise,
            totalAmountInWords: "",
            gstSummary: {
                slabs: {},
                totalTaxableValuePaise: documentData.totals.subtotalPaise - documentData.totals.discountPaise,
                totalGSTAmountPaise: documentData.totals.cgstPaise + documentData.totals.sgstPaise + documentData.totals.igstPaise,
                totalCessAmountPaise: 0,
            },
            isInterState: false,
            placeOfSupply: "24",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            expectedDeliveryDate: documentData.transport?.deliveryDate || "",
            notes: documentData.notes.external,
        };

        if (editId) {
            updatePurchase(purchaseToSave);
            
        } else {
            addPurchase(purchaseToSave);
            
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
            initialData={initialData as any}
            onSave={handleSave}
        />
    );
}
