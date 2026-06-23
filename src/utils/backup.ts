import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useAppStore } from '@/store';

export const exportBackup = async () => {
    const storeState = useAppStore.getState();
    const backupData = {
        invoices: storeState.invoices,
        items: storeState.items,
        parties: storeState.parties,
        purchases: storeState.purchases,
        expenses: storeState.expenses,
        payments: storeState.payments,
        adjustments: storeState.adjustments,
        creditNotes: storeState.creditNotes,
        deliveryChallans: storeState.deliveryChallans,
        documentCounters: storeState.documentCounters,
        invoiceSettings: storeState.invoiceSettings,
        timestamp: new Date().toISOString()
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const fileName = `billy_backup_${new Date().getTime()}.json`;
    // @ts-ignore
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
        await Sharing.shareAsync(fileUri);
    } else {
        throw new Error("Sharing is not available on this device.");
    }
};

export const importBackup = async (): Promise<{ success: boolean; message: string }> => {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/json',
            copyToCacheDirectory: true
        });

        if (result.canceled) {
            return { success: false, message: 'Import cancelled' };
        }

        if (result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const fileContent = await FileSystem.readAsStringAsync(asset.uri, {
                encoding: FileSystem.EncodingType.UTF8
            });

            const parsedData = JSON.parse(fileContent);

            if (!parsedData || typeof parsedData !== 'object') {
                throw new Error("Invalid backup file format");
            }

            const store = useAppStore.getState();
            
            useAppStore.setState({ 
                ...store,
                invoices: parsedData.invoices || store.invoices,
                items: parsedData.items || store.items,
                parties: parsedData.parties || store.parties,
                purchases: parsedData.purchases || store.purchases,
                expenses: parsedData.expenses || store.expenses,
                payments: parsedData.payments || store.payments,
                adjustments: parsedData.adjustments || store.adjustments,
                creditNotes: parsedData.creditNotes || store.creditNotes,
                deliveryChallans: parsedData.deliveryChallans || store.deliveryChallans,
                documentCounters: parsedData.documentCounters || store.documentCounters,
            });

            if (parsedData.invoiceSettings) {
                store.setInvoiceSettings(parsedData.invoiceSettings);
            }

            return { success: true, message: 'Backup restored successfully' };
        }
        
        return { success: false, message: 'Failed to read file' };
    } catch (error: any) {
        return { success: false, message: error.message || 'An error occurred during import' };
    }
};
