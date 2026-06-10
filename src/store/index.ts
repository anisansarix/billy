import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INVOICES, ITEMS, PARTIES, PURCHASES, EXPENSES, PAYMENTS } from '../../constants/data';

export type AppStore = {
  invoices: Invoice[];
  items: Item[];
  parties: Party[];
  purchases: Invoice[];
  expenses: Expense[];
  payments: Payment[];
  adjustments: StockAdjustment[];
  businessProfile: BusinessProfile | null;
  setBusinessProfile: (profile: BusinessProfile | null) => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  addItem: (item: Item) => void;
  updateItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  addParty: (party: Party) => void;
  updateParty: (party: Party) => void;
  deleteParty: (id: string) => void;
  addPurchase: (purchase: Invoice) => void;
  updatePurchase: (purchase: Invoice) => void;
  deletePurchase: (id: string) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;
  addAdjustment: (adjustment: StockAdjustment) => void;
  updateAdjustment: (adjustment: StockAdjustment) => void;
  deleteAdjustment: (id: string) => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      invoices: INVOICES,
      items: ITEMS,
      parties: PARTIES,
      purchases: PURCHASES,
      expenses: EXPENSES,
      payments: PAYMENTS,
      adjustments: [],
      businessProfile: null,
      hasHydrated: false,
      
      setBusinessProfile: (profile) => set({ businessProfile: profile }),
      setHasHydrated: (state) => set({ hasHydrated: state }),

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
      name: 'billy-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
