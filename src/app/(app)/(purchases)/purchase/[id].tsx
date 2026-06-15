import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Download } from "lucide-react-native";
import { Pressable, ScrollView, Text, View, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/store";
import { formatINR } from "@/utils/money";
import { formatDate } from "@/utils/date";
import { generateInvoicePDF } from "@/utils/pdf";
import * as Sharing from 'expo-sharing';
import { useState } from "react";
import "../../../../../global.css";

export default function PurchaseDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    
    const purchase = useAppStore(s => s.purchases.find(p => p.id === id));
    const party = useAppStore(s => s.parties.find(p => p.id === purchase?.partyId));
    const currentBusiness = useAppStore(s => s.currentBusiness);
    const markPurchaseAsReceived = useAppStore(s => s.markPurchaseAsReceived);
    
    const [isDownloading, setIsDownloading] = useState(false);

    if (!purchase) {
        return (
            <SafeAreaView style={{ flex: 1 }} className="bg-slate-50 items-center justify-center">
                <Text className="font-sans-bold text-lg text-primary mb-4">Purchase not found</Text>
                <Pressable onPress={() => router.back()} className="px-6 py-3 bg-primary rounded-full">
                    <Text className="font-sans-bold text-white">Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    const handleDownload = async () => {
        if (!currentBusiness || !party) {
            Alert.alert("Error", "Business or Vendor details missing.");
            return;
        }
        setIsDownloading(true);
        try {
            const uri = await generateInvoicePDF(purchase as any, currentBusiness, party);
            if (uri) {
                await Sharing.shareAsync(uri);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to generate PDF.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleMarkReceived = () => {
        markPurchaseAsReceived(purchase.id);
        Alert.alert('Done', 'Purchase marked as received. Stock updated.', [
            { text: "OK" }
        ]);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "RECEIVED": return "bg-green-100 text-green-700";
            case "PENDING": return "bg-amber-100 text-amber-700";
            case "CANCELLED": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-slate-50">
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 py-3 bg-white shadow-sm z-10 border-b border-border">
                <Pressable onPress={() => router.back()} className="p-2 -ml-2 min-h-[44px] min-w-[44px] items-center justify-center">
                    <ArrowLeft color="#0f172a" size={24} />
                </Pressable>
                <Text className="font-sans-bold text-lg text-primary flex-1 text-center" numberOfLines={1}>{purchase.documentNumber}</Text>
                <Pressable onPress={handleDownload} disabled={isDownloading} className="p-2 -mr-2 min-h-[44px] min-w-[44px] items-center justify-center">
                    {isDownloading ? <ActivityIndicator size="small" color="#208AEF" /> : <Download color="#208AEF" size={24} />}
                </Pressable>
            </View>

            <ScrollView className="flex-1" contentContainerClassName="p-4 pb-32" showsVerticalScrollIndicator={false}>
                {/* Hero block */}
                <View className="items-center mb-6 pt-4">
                    <Text className="font-sans-medium text-sm text-muted-foreground mb-1 uppercase tracking-wider">Total Amount</Text>
                    <Text className="font-sans-bold text-4xl text-primary mb-3">{formatINR(purchase.totalAmountPaise)}</Text>
                    <View className={`px-3 py-1 rounded-full ${getStatusColor(purchase.status)} mb-5`}>
                        <Text className="font-sans-bold text-xs uppercase">{purchase.status}</Text>
                    </View>
                    
                    <View className="flex-row justify-between w-full bg-white rounded-2xl p-4 border border-border shadow-sm">
                        <View>
                            <Text className="font-sans-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">Document Date</Text>
                            <Text className="font-sans-bold text-sm text-primary">{formatDate(purchase.documentDate)}</Text>
                        </View>
                        {purchase.expectedDeliveryDate && (
                            <View className="items-end">
                                <Text className="font-sans-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">Expected Delivery</Text>
                                <Text className="font-sans-bold text-sm text-primary">{formatDate(purchase.expectedDeliveryDate)}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Vendor card */}
                {party && (
                    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-border">
                        <Text className="font-sans-medium text-xs text-muted-foreground uppercase tracking-wider mb-3">Vendor Details</Text>
                        <Text className="font-sans-bold text-base text-primary mb-1">{party.legalName}</Text>
                        {party.gstin && <Text className="font-sans-medium text-sm text-muted-foreground mb-1">GSTIN: {party.gstin}</Text>}
                        <Text className="font-sans-medium text-sm text-muted-foreground">
                            {[party.billingAddress.line1, party.billingAddress.city, party.billingAddress.state, party.billingAddress.pincode].filter(Boolean).join(', ')}
                        </Text>
                    </View>
                )}

                {/* Line items section */}
                <View className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm border border-border">
                    <View className="p-4 border-b border-border">
                        <Text className="font-sans-medium text-xs text-muted-foreground uppercase tracking-wider">Line Items</Text>
                    </View>
                    <View>
                        {purchase.lineItems.map((item, idx) => (
                            <View key={item.id} className={`py-3 px-4 border-b border-border ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <View className="flex-row justify-between mb-1">
                                    <Text className="font-sans-bold text-sm text-primary flex-1 mr-2" numberOfLines={2}>
                                        {idx + 1}. {item.description}
                                    </Text>
                                    <Text className="font-sans-bold text-sm text-primary">{formatINR(item.totalAmountPaise)}</Text>
                                </View>
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <Text className="font-sans-medium text-xs text-muted-foreground">
                                            {item.quantityDecimal} {item.unit} × {formatINR(item.unitPricePaise)}
                                        </Text>
                                    </View>
                                    <Text className="font-sans-medium text-xs text-muted-foreground">
                                        HSN: {item.hsnSacCode}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* GST summary section */}
                {Object.keys(purchase.gstSummary.slabs).length > 0 && (
                    <View className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm border border-border">
                        <View className="p-4 border-b border-border">
                            <Text className="font-sans-medium text-xs text-muted-foreground uppercase tracking-wider">GST Summary</Text>
                        </View>
                        <View className="p-4 space-y-3">
                            {Object.entries(purchase.gstSummary.slabs).map(([rateKey, slab]) => (
                                <View key={rateKey} className="border-b border-border pb-3 mb-1">
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="font-sans-medium text-sm text-muted-foreground">Taxable Value</Text>
                                        <Text className="font-sans-bold text-sm text-primary">{formatINR(slab.taxableValuePaise)}</Text>
                                    </View>
                                    {purchase.isInterState ? (
                                        <View className="flex-row justify-between">
                                            <Text className="font-sans-medium text-sm text-muted-foreground">IGST ({slab.igstRate}%)</Text>
                                            <Text className="font-sans-medium text-sm text-primary">{formatINR(slab.igstAmountPaise)}</Text>
                                        </View>
                                    ) : (
                                        <>
                                            <View className="flex-row justify-between mb-1">
                                                <Text className="font-sans-medium text-sm text-muted-foreground">CGST ({slab.cgstRate}%)</Text>
                                                <Text className="font-sans-medium text-sm text-primary">{formatINR(slab.cgstAmountPaise)}</Text>
                                            </View>
                                            <View className="flex-row justify-between">
                                                <Text className="font-sans-medium text-sm text-muted-foreground">SGST ({slab.sgstRate}%)</Text>
                                                <Text className="font-sans-medium text-sm text-primary">{formatINR(slab.sgstAmountPaise)}</Text>
                                            </View>
                                        </>
                                    )}
                                </View>
                            ))}
                            <View className="flex-row justify-between pt-2">
                                <Text className="font-sans-bold text-sm text-primary">Total Tax</Text>
                                <Text className="font-sans-bold text-sm text-primary">{formatINR(purchase.gstSummary.totalGSTAmountPaise)}</Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Action Bar */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-3 flex-row shadow-lg pb-4">
                <Pressable onPress={handleDownload} disabled={isDownloading} className="flex-1 bg-primary/10 border border-primary/20 items-center justify-center rounded-xl min-h-[48px] mr-2 flex-row">
                    {isDownloading ? <ActivityIndicator size="small" color="#208AEF" /> : <Download color="#208AEF" size={20} />}
                    <Text className="font-sans-bold text-primary ml-2">Download PDF</Text>
                </Pressable>
                
                {purchase.status !== 'RECEIVED' && (
                    <Pressable onPress={handleMarkReceived} className="flex-1 bg-primary items-center justify-center rounded-xl min-h-[48px] ml-2">
                        <Text className="font-sans-bold text-white">Mark as Received</Text>
                    </Pressable>
                )}
            </View>
        </SafeAreaView>
    );
}
