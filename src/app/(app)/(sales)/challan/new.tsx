import { useRouter } from "expo-router";
import { View, Text, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/store";
import { DeliveryChallan, DocumentType } from "@/types/entities";
import DocumentBuilder, { DocumentData } from "@/components/domain/DocumentBuilder";
import { buildGSTSummary, amountInIndianWords } from "@/utils/gst";

import "../../../../../global.css";

export default function NewDeliveryChallanScreen() {
    const router = useRouter();

    const addDeliveryChallan = useAppStore(s => s.addDeliveryChallan);
    const incrementDocumentCounter = useAppStore(s => s.incrementDocumentCounter);
    const documentCounters = useAppStore(s => s.documentCounters);
    const currentBusiness = useAppStore(s => s.currentBusiness);
    const invoiceSettings = useAppStore(s => s.invoiceSettings);



    // Auto-generate document number
    const currentFY = currentBusiness?.fiscalYearStart || 'APRIL';
    const docPrefix = invoiceSettings?.dcPrefix || "DC";
    const nextDCNumber = (documentCounters[`${docPrefix}-${currentFY}`] || 1).toString().padStart(3, '0');
    const autoGenDCNumber = `${docPrefix}/${new Date().getFullYear()}/${nextDCNumber}`;

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-slate-50">
            <DocumentBuilder
                title="New Delivery Challan"
                subtitle="Record outward stock movements"
                defaultType="DELIVERY_CHALLAN"
                defaultPrefix={docPrefix}
                defaultDocNumber={autoGenDCNumber}
                partyLabel="Customer"
                partyFilter="customer"
                hasTransport={true}
                onSave={(documentData: DocumentData) => {
                    const gstSummary = buildGSTSummary(documentData.items, documentData.totals.isInterState);

                    const challan: DeliveryChallan = {
                        id: `dc-${Date.now()}`,
                        documentType: DocumentType.DELIVERY_CHALLAN,
                        documentNumber: documentData.header.documentNumber,
                        documentDate: documentData.header.documentDate,
                        dueDate: documentData.header.dueDate,
                        businessId: currentBusiness?.id || 'b1',
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
                        notes: JSON.stringify({ 
                            vehicleNumber: documentData.transport?.vehicleNo || "", 
                            transporterName: documentData.transport?.transporterName || "", 
                            dispatchDate: documentData.transport?.deliveryDate || "" 
                        }),
                        isInterState: documentData.totals.isInterState,
                        placeOfSupply: documentData.selectedParty.billingAddress?.state || "",
                        status: 'ISSUED',
                        vehicleNumber: documentData.transport?.vehicleNo || "",
                        transporterName: documentData.transport?.transporterName || "",
                        dispatchDate: documentData.transport?.deliveryDate || "",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };
                    
                    incrementDocumentCounter(docPrefix, currentFY);
                    addDeliveryChallan(challan);
                    router.back();
                    Alert.alert('Challan Created', `Delivery Challan ${challan.documentNumber} created successfully.`);
                }}
            />

        </SafeAreaView>
    );
}
