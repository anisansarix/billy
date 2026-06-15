import { useAppStore } from "@/store";
import { getCurrentFinancialYear } from "@/utils/date";
import { useShallow } from 'zustand/react/shallow';
import { useLocalSearchParams, useRouter } from "expo-router";

import { Party, DocumentType, DeliveryChallan } from "@/types/entities";
import DocumentBuilder, { DocumentData } from "@/components/domain/DocumentBuilder";
import { buildGSTSummary, amountInIndianWords } from "@/utils/gst";

export default function CreateDeliveryChallanScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { deliveryChallans, parties, addDeliveryChallan, updateDeliveryChallan, documentCounters, incrementDocumentCounter, currentBusiness } = useAppStore(useShallow(state => ({ 
        deliveryChallans: state.deliveryChallans, 
        parties: state.parties, 
        addDeliveryChallan: state.addDeliveryChallan, 
        updateDeliveryChallan: state.updateDeliveryChallan, 
        documentCounters: state.documentCounters, 
        incrementDocumentCounter: state.incrementDocumentCounter, 
        currentBusiness: state.currentBusiness 
    })));

    const editId = params.id as string | undefined;
    const existingDoc = editId ? deliveryChallans.find(i => i.id === editId) : undefined;
    
    const fy = getCurrentFinancialYear(currentBusiness?.fiscalYearStart || 'APRIL');
    const docPrefix = "DC";
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
                mode: "UPI",
                terms: "Immediate"
            },
            transport: {
                vehicleNo: existingDoc.vehicleNumber || "",
                ewayBill: "",
                deliveryDate: existingDoc.dispatchDate || ""
            },
            notes: {
                external: existingDoc.notes || "",
                internal: ""
            }
        } as any;
    }

    const handleSave = (documentData: DocumentData) => {
        const gstSummary = buildGSTSummary(documentData.items, documentData.totals.isInterState);

        const dcToSave: DeliveryChallan = {
            id: editId || `dc-${Date.now()}`,
            documentType: DocumentType.DELIVERY_CHALLAN,
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
            status: documentData.header.status || "Draft",
            createdAt: existingDoc ? existingDoc.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            vehicleNumber: documentData.transport?.vehicleNo || "",
            dispatchDate: documentData.transport?.deliveryDate || documentData.header.documentDate,
        };

        if (editId) {
            updateDeliveryChallan(dcToSave);
        } else {
            addDeliveryChallan(dcToSave);
            incrementDocumentCounter(docPrefix, fy);
        }
        
        router.back();
    };

    return (
        <DocumentBuilder
            defaultDocNumber={defaultDocNumber}
            title={editId ? "Edit Delivery Challan" : "New Delivery Challan"}
            defaultType="Delivery Challan"
            defaultPrefix="DC-"
            partyLabel="Customer"
            partyFilter="customer"
            hasTransport={true}
            defaultNotes="Goods dispatched in good condition."
            initialData={initialData}
            onSave={handleSave}
        />
    );
}
