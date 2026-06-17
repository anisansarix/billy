import { useLocalSearchParams, useRouter } from "expo-router";
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from "@/store";
import { getCurrentFinancialYear } from "@/utils/date";
import DocumentBuilder, { DocumentData } from "@/components/domain/DocumentBuilder";
import { PurchaseOrder, Party, DocumentType } from "@/types/entities";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreatePurchaseScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { purchases, parties, addPurchase, updatePurchase, documentCounters, incrementDocumentCounter, currentBusiness, invoiceSettings } = useAppStore(useShallow(state => ({ purchases: state.purchases, parties: state.parties, addPurchase: state.addPurchase, updatePurchase: state.updatePurchase, documentCounters: state.documentCounters, incrementDocumentCounter: state.incrementDocumentCounter, currentBusiness: state.currentBusiness, invoiceSettings: state.invoiceSettings })));

    const editId = params.id as string | undefined;
    const existingPurchase = editId ? purchases.find(p => p.id === editId) : undefined;
    
    // For edit mode, reconstruct the initial data to match what DocumentBuilder expects
    
    const fy = getCurrentFinancialYear(currentBusiness?.fiscalYearStart || 'APRIL');
    const docPrefix = invoiceSettings?.poPrefix || "PO";
    const counterKey = `${docPrefix}-${fy}`;
    const nextNum = String((documentCounters?.[counterKey] || 0) + 1).padStart(4, '0');
    const defaultDocNumber = `${counterKey}-${nextNum}`;
    
    let initialData = undefined;
    if (existingPurchase) {
        const party = parties.find(p => p.id === existingPurchase.partyId);
        initialData = {
            selectedParty: party || ({ id: existingPurchase.partyId || "", name: "" } as unknown as Party),
            header: {
                documentType: existingPurchase.documentType,
                documentNumber: existingPurchase.documentNumber,
                documentDate: existingPurchase.documentDate,
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
                deliveryDate: existingPurchase.expectedDeliveryDate,
                transporterName: ""
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
            documentType: DocumentType.PURCHASE_ORDER,
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
            incrementDocumentCounter(docPrefix, fy);
            
        }
        
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-slate-50">
        <DocumentBuilder
            defaultDocNumber={defaultDocNumber}
            title={editId ? "Edit Purchase" : "Create Purchase"}
            subtitle="Record inbound inventory and expenses"
            defaultType="PURCHASE_ORDER"
            defaultPrefix="PO-"
            partyLabel="Vendor"
            partyFilter="vendor"
            hasTransport={false}
            defaultNotes="Please deliver goods within 7 days."
            initialData={initialData}
            onSave={handleSave}
        />
        </SafeAreaView>
    );
}
