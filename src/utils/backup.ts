import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useAppStore } from '@/store';

export async function exportBackup(): Promise<void> {
  const state = useAppStore.getState();
  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      currentBusiness: state.currentBusiness,
      invoices: state.invoices,
      purchases: state.purchases,
      parties: state.parties,
      items: state.items,
      expenses: state.expenses,
      payments: state.payments,
      documentCounters: state.documentCounters,
      invoiceSettings: state.invoiceSettings,
    }
  };
  const json = JSON.stringify(backup, null, 2);
  const filename = `billy-backup-${new Date().toISOString().split('T')[0]}.json`;
  const path = `${FileSystem.documentDirectory}${filename}`;
  await FileSystem.writeAsStringAsync(path, json, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: 'Save Billy Backup' });
}

export async function importBackup(): Promise<{ success: boolean; message: string }> {
  try {
    const DocumentPicker = require('expo-document-picker');
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
    if (result.canceled) return { success: false, message: 'Cancelled' };
    const json = await FileSystem.readAsStringAsync(result.assets[0].uri);
    const backup = JSON.parse(json);
    if (!backup.version || !backup.data) return { success: false, message: 'Invalid backup file' };
    const store = useAppStore.getState();
    const d = backup.data;
    if (d.currentBusiness) store.setCurrentBusiness(d.currentBusiness);
    if (Array.isArray(d.invoices)) d.invoices.forEach((inv: Parameters<typeof store.addInvoice>[0]) => store.addInvoice(inv));
    if (Array.isArray(d.parties)) d.parties.forEach((p: Parameters<typeof store.addParty>[0]) => store.addParty(p));
    if (Array.isArray(d.items)) d.items.forEach((i: Parameters<typeof store.addItem>[0]) => store.addItem(i));
    if (d.invoiceSettings) store.setInvoiceSettings(d.invoiceSettings);
    return { success: true, message: `Restored ${d.invoices?.length ?? 0} invoices and ${d.parties?.length ?? 0} parties.` };
  } catch (e) {
    return { success: false, message: 'Failed to read backup file.' };
  }
}
