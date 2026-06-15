import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text, View, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/store";
import { DeliveryChallan, DocumentType } from "@/types/entities";
import DocumentBuilder, { DocumentData } from "@/components/domain/DocumentBuilder";
import { buildGSTSummary, amountInIndianWords } from "@/utils/gst";
import { useState } from "react";
import "../../../../../global.css";

export default function NewDeliveryChallanScreen() {
    const router = useRouter();

    const addDeliveryChallan = useAppStore(s => s.addDeliveryChallan);
    const incrementDocumentCounter = useAppStore(s => s.incrementDocumentCounter);
    const documentCounters = useAppStore(s => s.documentCounters);
    const currentBusiness = useAppStore(s => s.currentBusiness);
    const invoiceSettings = useAppStore(s => s.invoiceSettings);

    // Form state for Transport Details
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [transporterName, setTransporterName] = useState("");
    const todayFormatted = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const [dispatchDate, setDispatchDate] = useState(todayFormatted);

    // Auto-generate document number
    const currentFY = currentBusiness?.fiscalYearStart || 'APRIL';
    const docPrefix = invoiceSettings?.dcPrefix || "DC";
    const nextDCNumber = (documentCounters[`${docPrefix}-${currentFY}`] || 1).toString().padStart(3, '0');
    const autoGenDCNumber = `${docPrefix}/${new Date().getFullYear()}/${nextDCNumber}`;

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-white shadow-sm z-10 border-b border-border">
                <Pressable onPress={() => router.back()} className="p-2 -ml-2 min-h-[44px] min-w-[44px] items-center justify-center mr-2">
                    <ArrowLeft color="#0f172a" size={24} />
                </Pressable>
                <Text className="font-sans-bold text-lg text-primary flex-1">New Delivery Challan</Text>
            </View>

            <DocumentBuilder
                title="New Delivery Challan"
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
                        notes: JSON.stringify({ vehicleNumber, transporterName, dispatchDate }),
                        isInterState: documentData.totals.isInterState,
                        placeOfSupply: documentData.selectedParty.billingAddress?.state || "",
                        status: 'ISSUED',
                        vehicleNumber,
                        transporterName,
                        dispatchDate,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };
                    
                    incrementDocumentCounter(docPrefix, currentFY);
                    addDeliveryChallan(challan);
                    router.back();
                    Alert.alert('Challan Created', `Delivery Challan ${challan.documentNumber} created successfully.`);
                }}
            />

            {/* Transport Details Overlay at Bottom */}
            <View className="p-4 bg-white border-t border-border shadow-sm absolute bottom-0 left-0 right-0 z-20 pb-8">
                <Text className="font-sans-bold text-base text-primary mb-3">Transport Details</Text>
                
                <View className="flex-row space-x-2 mb-2">
                    <View className="flex-1 mr-1">
                        <Text className="font-sans-medium text-xs text-muted-foreground mb-1">Vehicle Number</Text>
                        <TextInput 
                            value={vehicleNumber}
                            onChangeText={setVehicleNumber}
                            placeholder="GJ05AB1234"
                            placeholderTextColor="#94a3b8"
                            autoCapitalize="characters"
                            style={{ color: '#0f172a' }}
                            className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-sm h-10"
                        />
                    </View>
                    <View className="flex-1 ml-1">
                        <Text className="font-sans-medium text-xs text-muted-foreground mb-1">Dispatch Date</Text>
                        <TextInput 
                            value={dispatchDate}
                            onChangeText={setDispatchDate}
                            placeholder="DD-MM-YYYY"
                            placeholderTextColor="#94a3b8"
                            style={{ color: '#0f172a' }}
                            className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-sm h-10"
                        />
                    </View>
                </View>

                <View className="mb-2">
                    <Text className="font-sans-medium text-xs text-muted-foreground mb-1">Transporter Name</Text>
                    <TextInput 
                        value={transporterName}
                        onChangeText={setTransporterName}
                        placeholder="Carrier name"
                        placeholderTextColor="#94a3b8"
                        style={{ color: '#0f172a' }}
                        className="bg-slate-50 border border-border rounded-lg px-3 py-2 font-sans-medium text-sm h-10"
                    />
                </View>
                
                <Text className="font-sans-medium text-xs text-amber-600 mt-2 text-center">Save document above to finalize challan</Text>
            </View>
        </SafeAreaView>
    );
}
