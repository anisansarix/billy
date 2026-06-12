import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INVOICES, ITEMS, PARTIES, PURCHASES, EXPENSES, PAYMENTS } from '../../constants/data';
import { Business, TaxRate, GSTType, SalesInvoice, PurchaseOrder, Party, InventoryItem, PaymentRecord, ExpenseRecord, StockAdjustmentRecord } from '../types/entities';

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return AsyncStorage.setItem(name, value);
  },
  getItem: (name) => {
    return AsyncStorage.getItem(name);
  },
  removeItem: (name) => {
    return AsyncStorage.removeItem(name);
  },
};
export const DEFAULT_BUSINESS: Business = {
    id: 'b1',
    legalName: 'Billy Textiles & Co.',
    tradeName: 'Billy Textiles',
    gstin: '27AABCU9603R1ZX',
    pan: 'AABCU9603R',
    gstType: GSTType.REGULAR,
    address: {
        line1: '104, Textile Market',
        city: 'Surat',
        state: 'Gujarat',
        stateCode: '24',
        pincode: '395002',
        country: 'India'
    },
    shippingAddresses: [],
    phone: '+91 9876543210',
    email: 'contact@billytextiles.com',
    bankDetails: [
        {
            bankName: 'HDFC Bank',
            accountNumber: '50100234567890',
            ifscCode: 'HDFC0001234',
            branch: 'Surat Ring Road',
            accountType: 'CURRENT'
        }
    ],
    upiVpa: 'billybusiness@upi',
    fiscalYearStart: 'APRIL',
    defaultCurrency: 'INR'
};

const DEFAULT_TAX_RATES: TaxRate[] = [
    { id: 'tr_0', hsnSacCode: '0000', description: 'Exempt / Nil Rated', gstComponent: { cgstRate: 0, sgstRate: 0, igstRate: 0, cessRate: 0 }, isService: false, isActive: true },
    { id: 'tr_5_textile', hsnSacCode: '5208', description: 'Woven Fabrics of Cotton (5%)', gstComponent: { cgstRate: 2.5, sgstRate: 2.5, igstRate: 5, cessRate: 0 }, isService: false, isActive: true },
    { id: 'tr_5_garment', hsnSacCode: '6101', description: 'Apparel under ₹1000 (5%)', gstComponent: { cgstRate: 2.5, sgstRate: 2.5, igstRate: 5, cessRate: 0 }, isService: false, isActive: true },
    { id: 'tr_12_garment', hsnSacCode: '6101', description: 'Apparel above ₹1000 (12%)', gstComponent: { cgstRate: 6, sgstRate: 6, igstRate: 12, cessRate: 0 }, isService: false, isActive: true },
    { id: 'tr_12_electronics', hsnSacCode: '8517', description: 'Mobile Phones (12%)', gstComponent: { cgstRate: 6, sgstRate: 6, igstRate: 12, cessRate: 0 }, isService: false, isActive: true },
    { id: 'tr_18_service', hsnSacCode: '9983', description: 'IT / Professional Services (18%)', gstComponent: { cgstRate: 9, sgstRate: 9, igstRate: 18, cessRate: 0 }, isService: true, isActive: true },
    { id: 'tr_18_electronics', hsnSacCode: '8471', description: 'Computers & Laptops (18%)', gstComponent: { cgstRate: 9, sgstRate: 9, igstRate: 18, cessRate: 0 }, isService: false, isActive: true },
    { id: 'tr_28_electronics', hsnSacCode: '8528', description: 'Monitors & TVs > 32 inch (28%)', gstComponent: { cgstRate: 14, sgstRate: 14, igstRate: 28, cessRate: 0 }, isService: false, isActive: true }
];

export type AppStore = {
  currentBusiness: Business | null;
  taxRates: TaxRate[];
  invoices: SalesInvoice[];
  items: InventoryItem[];
  parties: Party[];
  purchases: PurchaseOrder[];
  expenses: ExpenseRecord[];
  payments: PaymentRecord[];
  adjustments: StockAdjustmentRecord[];
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setCurrentBusiness: (business: Business | null) => void;
  addInvoice: (invoice: SalesInvoice) => void;
  updateInvoice: (invoice: SalesInvoice) => void;
  deleteInvoice: (id: string) => void;
  addItem: (item: InventoryItem) => void;
  updateItem: (item: InventoryItem) => void;
  deleteItem: (id: string) => void;
  addParty: (party: Party) => void;
  updateParty: (party: Party) => void;
  deleteParty: (id: string) => void;
  addPurchase: (purchase: PurchaseOrder) => void;
  updatePurchase: (purchase: PurchaseOrder) => void;
  deletePurchase: (id: string) => void;
  addExpense: (expense: ExpenseRecord) => void;
  updateExpense: (expense: ExpenseRecord) => void;
  deleteExpense: (id: string) => void;
  addPayment: (payment: PaymentRecord) => void;
  updatePayment: (payment: PaymentRecord) => void;
  deletePayment: (id: string) => void;
  addAdjustment: (adjustment: StockAdjustmentRecord) => void;
  updateAdjustment: (adjustment: StockAdjustmentRecord) => void;
  deleteAdjustment: (id: string) => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      currentBusiness: DEFAULT_BUSINESS,
      taxRates: DEFAULT_TAX_RATES,
      invoices: INVOICES,
      items: ITEMS,
      parties: PARTIES,
      purchases: PURCHASES,
      expenses: EXPENSES,
      payments: PAYMENTS,
      adjustments: [],
      hasHydrated: false,
      
      setHasHydrated: (state) => set({ hasHydrated: state }),
      setCurrentBusiness: (b) => set({ currentBusiness: b }),

      addInvoice: (invoice) => set((state) => ({ invoices: [invoice, ...state.invoices] })),
      updateInvoice: (invoice) => set((state) => ({ invoices: state.invoices.map((i) => (i.id === invoice.id ? invoice : i)) })),
      deleteInvoice: (id) => set((state) => ({ invoices: state.invoices.filter((i) => i.id !== id) })),

      addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
      updateItem: (item) => set((state) => ({ items: state.items.map((i) => (i.id === item.id ? item : i)) })),
      deleteItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      addParty: (party) => set((state) => ({ parties: [party, ...state.parties] })),
      updateParty: (party) => set((state) => ({ parties: state.parties.map((p) => (p.id === party.id ? party : p)) })),
      deleteParty: (id) => set((state) => ({ parties: state.parties.filter((p) => p.id !== id) })),

      addPurchase: (purchase) => set((state) => ({ purchases: [purchase, ...state.purchases] })),
      updatePurchase: (purchase) => set((state) => ({ purchases: state.purchases.map((p) => (p.id === purchase.id ? purchase : p)) })),
      deletePurchase: (id) => set((state) => ({ purchases: state.purchases.filter((p) => p.id !== id) })),

      addExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] })),
      updateExpense: (expense) => set((state) => ({ expenses: state.expenses.map((e) => (e.id === expense.id ? expense : e)) })),
      deleteExpense: (id) => set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),

      addPayment: (payment) => set((state) => ({ payments: [payment, ...state.payments] })),
      updatePayment: (payment) => set((state) => ({ payments: state.payments.map((p) => (p.id === payment.id ? payment : p)) })),
      deletePayment: (id) => set((state) => ({ payments: state.payments.filter((p) => p.id !== id) })),

      addAdjustment: (adjustment) => set((state) => ({ adjustments: [adjustment, ...state.adjustments] })),
      updateAdjustment: (adjustment) => set((state) => ({ adjustments: state.adjustments.map((a) => (a.id === adjustment.id ? adjustment : a)) })),
      deleteAdjustment: (id) => set((state) => ({ adjustments: state.adjustments.filter((a) => a.id !== id) })),
    }),
    {
      name: 'billy-app-store-v2',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
