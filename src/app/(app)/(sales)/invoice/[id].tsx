import { useState } from 'react';
import { View, Text, Pressable, Vibration, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { ArrowLeft, Share2, Download } from 'lucide-react-native';
import { useAppStore } from '@/store';
import { formatINR } from '@/utils/money';
import { generateInvoicePDF } from '@/utils/pdf';


import UPIQRCard from '@/components/ui/UPIQRCard';

export default function InvoiceDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const invoice = useAppStore(s => 
        s.invoices.find(inv => inv.id === id) || 
        s.creditNotes.find(cn => cn.id === id) || 
        s.deliveryChallans.find(dc => dc.id === id)
    );
    const currentBusiness = useAppStore(s => s.currentBusiness);
    const parties = useAppStore(s => s.parties);
    const party = parties.find(p => p.id === invoice?.partyId);
    
    const [isSharing, setIsSharing] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Paid": return "bg-green-100 text-green-700 border-green-200";
            case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
            case "Overdue": return "bg-red-100 text-red-700 border-red-200";
            case "Draft": return "bg-slate-100 text-slate-700 border-slate-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const handleDownload = async () => {
        if (!invoice || !currentBusiness || !party || invoice.documentType !== "SALES_INVOICE") {
            if (invoice && invoice.documentType !== "SALES_INVOICE") {
                Alert.alert("Not Supported", "PDF generation is currently only supported for Sales Invoices.");
            }
            return;
        }
        try {
            setIsSharing(true);
            const pdfUri = await generateInvoicePDF(invoice, currentBusiness, party);
            await Sharing.shareAsync(pdfUri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Save Document PDF',
                UTI: 'com.adobe.pdf'
            });
        } catch (err: unknown) {
            Alert.alert('Failed', err instanceof Error ? err.message : String(err));
        } finally {
            setIsSharing(false);
        }
    };

    const handleShare = async () => {
        if (!invoice || !currentBusiness || !party || invoice.documentType !== "SALES_INVOICE") {
            if (invoice && invoice.documentType !== "SALES_INVOICE") {
                Alert.alert("Not Supported", "Sharing is currently only supported for Sales Invoices.");
            }
            return;
        }
        try {
            setIsSharing(true);
            const pdfUri = await generateInvoicePDF(invoice, currentBusiness, party);
            await Sharing.shareAsync(pdfUri, {
                mimeType: 'application/pdf',
                dialogTitle: `Share Document ${invoice.documentNumber}`,
                UTI: 'com.adobe.pdf'
            });
        } catch (err: unknown) {
            Alert.alert('Failed', err instanceof Error ? err.message : String(err));
        } finally {
            setIsSharing(false);
        }
    };

    if (!invoice) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1', justifyContent: 'center', alignItems: 'center' }}>
                <Text className="font-sans-bold text-xl text-primary mb-4">Invoice not found</Text>
                <Pressable onPress={() => { Vibration.vibrate(10); router.back(); }} className="bg-primary px-6 py-3 rounded-xl">
                    <Text className="font-sans-bold text-white">Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    const disableActions = !currentBusiness || isSharing;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'N/A';
        // Handle YYYY-MM-DD format manually to avoid timezone issues
        const parts = dateStr.split('T')[0].split('-');
        if (parts.length === 3) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const [year, month, day] = parts;
            return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
        }
        return dateStr; // Fallback
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View className="flex-row items-center p-4 bg-white shadow-sm z-10 border-b border-border">
                <Pressable 
                    onPress={() => { Vibration.vibrate(10); router.back(); }} 
                    disabled={isSharing}
                    className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
                >
                    <ArrowLeft color="#081126" size={24} />
                </Pressable>
                
                <View className="ml-2 flex-1">
                    <Text className="text-lg font-sans-bold text-primary">{invoice.documentNumber}</Text>
                    <Text className="text-xs font-sans-medium text-muted-foreground">Invoice Details</Text>
                </View>
                
                <View className="flex-row space-x-2">
                    <Pressable 
                        onPress={handleShare}
                        disabled={disableActions}
                        className={`h-10 w-10 items-center justify-center rounded-full active:bg-gray-100 ${disableActions ? 'opacity-50' : ''}`}
                    >
                        {isSharing ? <ActivityIndicator size="small" color="#081126" /> : <Share2 color="#081126" size={20} />}
                    </Pressable>
                    <Pressable 
                        onPress={handleDownload}
                        disabled={disableActions}
                        className={`h-10 w-10 items-center justify-center rounded-full active:bg-gray-100 ${disableActions ? 'opacity-50' : ''}`}
                    >
                        {isSharing ? <ActivityIndicator size="small" color="#081126" /> : <Download color="#081126" size={20} />}
                    </Pressable>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Hero block */}
                <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-border items-center">
                    <View className={`px-3 py-1 rounded-md border ${getStatusColor(invoice.status)} mb-3`}>
                        <Text className="font-sans-bold text-xs uppercase">{invoice.status}</Text>
                    </View>
                    {invoice.documentType === 'SALES_INVOICE' && (invoice.balanceDuePaise || 0) < invoice.totalAmountPaise && invoice.status !== 'PAID' ? (
                        <View className="items-center mb-4">
                            <Text className="font-sans-medium text-sm text-muted-foreground mb-1">Balance Due</Text>
                            <Text className="font-sans-bold text-4xl text-primary">{formatINR(invoice.balanceDuePaise || 0)}</Text>
                            <Text className="font-sans-medium text-xs text-muted-foreground mt-1">Total: {formatINR(invoice.totalAmountPaise)}</Text>
                        </View>
                    ) : (
                        <Text className="font-sans-bold text-4xl text-primary mb-4">{formatINR(invoice.totalAmountPaise)}</Text>
                    )}
                    <View className="flex-row justify-between w-full border-t border-border pt-4">
                        <View>
                            <Text className="font-sans-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">Date</Text>
                            <Text className="font-sans-bold text-sm text-primary">{formatDate(invoice.documentDate)}</Text>
                        </View>
                        {invoice.dueDate && (
                            <View className="items-end">
                                <Text className="font-sans-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">Due Date</Text>
                                <Text className="font-sans-bold text-sm text-primary">{formatDate(invoice.dueDate)}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Bill To card */}
                {party && (
                    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-border">
                        <Text className="font-sans-medium text-xs text-muted-foreground uppercase tracking-wider mb-3">Bill To</Text>
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
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View>
                            <View className="flex-row bg-gray-50 border-b border-border py-3 px-4">
                                <Text className="font-sans-bold text-xs text-muted-foreground w-10">#</Text>
                                <Text className="font-sans-bold text-xs text-muted-foreground w-40">Description</Text>
                                <Text className="font-sans-bold text-xs text-muted-foreground w-20">HSN/SAC</Text>
                                <Text className="font-sans-bold text-xs text-muted-foreground w-16 text-right">Qty</Text>
                                <Text className="font-sans-bold text-xs text-muted-foreground w-16 text-center">Unit</Text>
                                <Text className="font-sans-bold text-xs text-muted-foreground w-24 text-right">Rate</Text>
                                <Text className="font-sans-bold text-xs text-muted-foreground w-16 text-right">Disc%</Text>
                                <Text className="font-sans-bold text-xs text-muted-foreground w-28 text-right">Amount</Text>
                            </View>
                            {invoice.lineItems.map((item, idx) => (
                                <View key={item.id} className={`flex-row py-3 px-4 border-b border-border ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <Text className="font-sans-medium text-sm text-primary w-10">{idx + 1}</Text>
                                    <Text className="font-sans-medium text-sm text-primary w-40" numberOfLines={2}>{item.description}</Text>
                                    <Text className="font-sans-medium text-sm text-primary w-20">{item.hsnSacCode}</Text>
                                    <Text className="font-sans-medium text-sm text-primary w-16 text-right">{item.quantityDecimal}</Text>
                                    <Text className="font-sans-medium text-sm text-primary w-16 text-center">{item.unit}</Text>
                                    <Text className="font-sans-medium text-sm text-primary w-24 text-right">{formatINR(item.unitPricePaise)}</Text>
                                    <Text className="font-sans-medium text-sm text-primary w-16 text-right">{item.discountPercent}%</Text>
                                    <Text className="font-sans-bold text-sm text-primary w-28 text-right">{formatINR(item.totalAmountPaise)}</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* GST summary section */}
                {Object.keys(invoice.gstSummary.slabs).length > 0 && (
                    <View className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm border border-border">
                        <View className="p-4 border-b border-border">
                            <Text className="font-sans-medium text-xs text-muted-foreground uppercase tracking-wider">GST Summary</Text>
                        </View>
                        <View className="p-4 space-y-3">
                            {Object.entries(invoice.gstSummary.slabs).map(([rateKey, slab]) => (
                                <View key={rateKey} className="border-b border-border pb-3 mb-1">
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="font-sans-medium text-sm text-muted-foreground">Taxable Value</Text>
                                        <Text className="font-sans-bold text-sm text-primary">{formatINR(slab.taxableValuePaise)}</Text>
                                    </View>
                                    {invoice.isInterState ? (
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
                                <Text className="font-sans-bold text-sm text-primary">Total GST on {formatINR(invoice.gstSummary.totalTaxableValuePaise)}</Text>
                                <Text className="font-sans-bold text-base text-primary">{formatINR(invoice.gstSummary.totalGSTAmountPaise)}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* UPI pay section */}
                {invoice.documentType === 'SALES_INVOICE' && currentBusiness && (
                    <UPIQRCard business={currentBusiness} amountPaise={invoice.totalAmountPaise} documentNumber={invoice.documentNumber} />
                )}
            </ScrollView>

            {/* Sticky bottom action bar */}
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-border flex-col pb-safe">
                <View className="flex-row justify-between w-full space-x-3 mb-2">
                    <View className="flex-1 pr-1">
                        <Pressable 
                            onPress={handleShare}
                            disabled={disableActions}
                            style={({ pressed }) => ({ opacity: pressed || disableActions ? 0.7 : 1 })}
                            className={`bg-slate-100 py-3.5 rounded-xl items-center flex-row justify-center border border-slate-200`}
                        >
                            <Share2 color="#081126" size={20} className="mr-2" />
                            <Text className="font-sans-bold text-primary text-base">Share</Text>
                        </Pressable>
                    </View>
                    <View className="flex-1 pl-1">
                        <Pressable 
                            onPress={handleDownload}
                            disabled={disableActions}
                            style={({ pressed }) => ({ opacity: pressed || disableActions ? 0.7 : 1 })}
                            className={`bg-primary py-3.5 rounded-xl items-center flex-row justify-center`}
                        >
                            <Download color="white" size={20} className="mr-2" />
                            <Text className="font-sans-bold text-white text-base">Download PDF</Text>
                        </Pressable>
                    </View>
                </View>
                {invoice.documentType === 'SALES_INVOICE' && (invoice.status === 'PAID' || invoice.status === 'PARTIAL') && (
                    <Pressable 
                        onPress={() => router.push({ pathname: '/(app)/(sales)/credit-note/new', params: { invoiceId: invoice.id } })}
                        className="bg-amber-100 py-3.5 rounded-xl items-center flex-row justify-center border border-amber-200 w-full"
                    >
                        <Text className="font-sans-bold text-amber-700 text-base">Raise Credit Note</Text>
                    </Pressable>
                )}
                
                {!currentBusiness && (
                    <View className="absolute -top-10 self-center bg-gray-800 px-4 py-2 rounded-full shadow-md">
                        <Text className="text-white font-sans-medium text-xs">Set up your business profile first</Text>
                    </View>
                )}
                {invoice.documentType === 'DELIVERY_CHALLAN' && (
                    <View className="absolute -top-[52px] right-4">
                        <Pressable 
                            onPress={() => router.push(`/(app)/(sales)/create-invoice?linkedChallanId=${invoice.id}` as const)}
                            className="bg-blue-600 px-4 py-2.5 rounded-full shadow-md flex-row items-center"
                        >
                            <Text className="text-white font-sans-bold text-sm">Convert to Invoice</Text>
                        </Pressable>
                    </View>
                )}
                {invoice.documentType === 'SALES_INVOICE' && invoice.status !== 'PAID' && (
                    <View className="absolute -top-[52px] right-4">
                        <Pressable 
                            onPress={() => router.push({ pathname: '/(app)/(sales)/record-payment', params: { invoiceId: invoice.id, partyId: party?.id, partyName: party?.legalName, balanceDuePaise: (invoice.balanceDuePaise ?? invoice.totalAmountPaise).toString() } } as never)}
                            className="bg-green-600 px-4 py-2.5 rounded-full shadow-md flex-row items-center"
                        >
                            <Text className="text-white font-sans-bold text-sm">Record Payment</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
