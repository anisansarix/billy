import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { INVOICES, ITEMS, PARTIES, PURCHASES, EXPENSES, PAYMENTS } from '../../constants/data';
import { Business, TaxRate, GSTType, SalesInvoice, PurchaseOrder, Party, InventoryItem, PaymentRecord, ExpenseRecord, StockAdjustmentRecord, CreditNote, DeliveryChallan } from '../types/entities';

const mmkv = createMMKV();

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return mmkv.set(name, value);
  },
  getItem: (name) => {
    const value = mmkv.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return mmkv.remove(name);
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
  creditNotes: CreditNote[];
  deliveryChallans: DeliveryChallan[];
  documentCounters: Record<string, number>;
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
  incrementDocumentCounter: (prefix: string, fy: string) => void;
  recordInvoicePayment: (invoiceId: string, payment: Omit<PaymentRecord, 'id'>) => void;
  markPurchaseAsReceived: (purchaseId: string) => void;
  addCreditNote: (creditNote: CreditNote) => void;
  updateCreditNote: (creditNote: CreditNote) => void;
  deleteCreditNote: (id: string) => void;
  addDeliveryChallan: (challan: DeliveryChallan) => void;
  updateDeliveryChallan: (challan: DeliveryChallan) => void;
  deleteDeliveryChallan: (id: string) => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      currentBusiness: null,
      taxRates: DEFAULT_TAX_RATES,
      invoices: INVOICES,
      items: ITEMS,
      parties: PARTIES,
      purchases: PURCHASES,
      expenses: EXPENSES,
      payments: PAYMENTS,
      adjustments: [],
      creditNotes: [],
      deliveryChallans: [],
      documentCounters: {},
      hasHydrated: false,
      
      setHasHydrated: (state) => set({ hasHydrated: state }),
      setCurrentBusiness: (b) => set({ currentBusiness: b }),

      addInvoice: (invoice) => set((state) => {
        // Deduct stock for all items, unless it's linked to a delivery challan
        const updatedItems = [...state.items];
        if (!invoice.linkedChallanId) {
          invoice.lineItems.forEach(lineItem => {
            if (lineItem.inventoryItemId) {
              const itemIndex = updatedItems.findIndex(i => i.id === lineItem.inventoryItemId);
              if (itemIndex >= 0) {
                updatedItems[itemIndex] = {
                  ...updatedItems[itemIndex],
                  stock: (updatedItems[itemIndex].stock || 0) - lineItem.quantityDecimal
                };
              }
            }
          });
        }
        return { invoices: [invoice, ...state.invoices], items: updatedItems };
      }),
      updateInvoice: (invoice) => set((state) => ({ invoices: state.invoices.map((i) => (i.id === invoice.id ? invoice : i)) })),
      deleteInvoice: (id) => set((state) => {
        const invoice = state.invoices.find(i => i.id === id);
        if (!invoice) return state;
        const updatedItems = [...state.items];
        invoice.lineItems.forEach(lineItem => {
          if (lineItem.inventoryItemId) {
            const itemIndex = updatedItems.findIndex(i => i.id === lineItem.inventoryItemId);
            if (itemIndex >= 0) {
              updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                stock: (updatedItems[itemIndex].stock || 0) + lineItem.quantityDecimal
              };
            }
          }
        });
        return { invoices: state.invoices.filter((i) => i.id !== id), items: updatedItems };
      }),

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

      addCreditNote: (creditNote) => set((state) => {
        // 1. Increase stock (items returned)
        const updatedItems = [...state.items];
        creditNote.lineItems.forEach(lineItem => {
          if (lineItem.inventoryItemId) {
            const itemIndex = updatedItems.findIndex(i => i.id === lineItem.inventoryItemId);
            if (itemIndex >= 0) {
              updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                stock: (updatedItems[itemIndex].stock || 0) + lineItem.quantityDecimal
              };
            }
          }
        });

        // 2. Reduce invoice balanceDue
        const updatedInvoices = [...state.invoices];
        if (creditNote.originalInvoiceId) {
          const invoiceIndex = updatedInvoices.findIndex(i => i.id === creditNote.originalInvoiceId);
          if (invoiceIndex >= 0) {
            const invoice = updatedInvoices[invoiceIndex];
            const newBalance = invoice.balanceDuePaise - creditNote.totalAmountPaise;
            let newStatus = invoice.status;
            if (newBalance <= 0) newStatus = 'PAID';
            else if (invoice.paidAmountPaise > 0 || newBalance < invoice.totalAmountPaise) newStatus = 'PARTIAL';

            updatedInvoices[invoiceIndex] = {
              ...invoice,
              balanceDuePaise: newBalance > 0 ? newBalance : 0,
              status: newStatus
            };
          }
        }

        return { creditNotes: [creditNote, ...state.creditNotes], items: updatedItems, invoices: updatedInvoices };
      }),
      updateCreditNote: (creditNote) => set((state) => ({ creditNotes: state.creditNotes.map((c) => (c.id === creditNote.id ? creditNote : c)) })),
      deleteCreditNote: (id) => set((state) => ({ creditNotes: state.creditNotes.filter((c) => c.id !== id) })),

      addDeliveryChallan: (challan) => set((state) => {
        // Decrease stock
        const updatedItems = [...state.items];
        challan.lineItems.forEach(lineItem => {
          if (lineItem.inventoryItemId) {
            const itemIndex = updatedItems.findIndex(i => i.id === lineItem.inventoryItemId);
            if (itemIndex >= 0) {
              updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                stock: (updatedItems[itemIndex].stock || 0) - lineItem.quantityDecimal
              };
            }
          }
        });
        return { deliveryChallans: [challan, ...state.deliveryChallans], items: updatedItems };
      }),
      updateDeliveryChallan: (challan) => set((state) => ({ deliveryChallans: state.deliveryChallans.map((c) => (c.id === challan.id ? challan : c)) })),
      deleteDeliveryChallan: (id) => set((state) => ({ deliveryChallans: state.deliveryChallans.filter((c) => c.id !== id) })),

      incrementDocumentCounter: (prefix, fy) => set((state) => {
        const key = `${prefix}-${fy}`;
        return {
          documentCounters: {
            ...state.documentCounters,
            [key]: (state.documentCounters[key] || 1) + 1
          }
        };
      }),

      recordInvoicePayment: (invoiceId, paymentData) => set((state) => {
        const invoiceIndex = state.invoices.findIndex(i => i.id === invoiceId);
        if (invoiceIndex === -1) return state;

        const invoice = state.invoices[invoiceIndex];
        const newPaidAmount = (invoice.paidAmountPaise || 0) + paymentData.amountPaise;
        const newBalance = invoice.totalAmountPaise - newPaidAmount;
        
        let newStatus = invoice.status;
        if (newBalance <= 0) newStatus = 'PAID';
        else if (newPaidAmount > 0) newStatus = 'PARTIAL';

        const updatedInvoice = {
          ...invoice,
          paidAmountPaise: newPaidAmount,
          balanceDuePaise: newBalance > 0 ? newBalance : 0,
          status: newStatus
        };

        const newPayment: PaymentRecord = {
          ...paymentData,
          id: `pay-${Date.now()}`,
          documentId: invoice.id,
          documentNumber: invoice.documentNumber
        };

        const updatedInvoices = [...state.invoices];
        updatedInvoices[invoiceIndex] = updatedInvoice;

        return {
          invoices: updatedInvoices,
          payments: [newPayment, ...state.payments]
        };
      }),

      markPurchaseAsReceived: (purchaseId) => set((state) => {
        const purchaseIndex = state.purchases.findIndex(p => p.id === purchaseId);
        if (purchaseIndex === -1) return state;

        const purchase = state.purchases[purchaseIndex];
        if (purchase.status === 'RECEIVED') return state; // Already received

        // Increase stock
        const updatedItems = [...state.items];
        purchase.lineItems.forEach(lineItem => {
          if (lineItem.inventoryItemId) {
            const itemIndex = updatedItems.findIndex(i => i.id === lineItem.inventoryItemId);
            if (itemIndex >= 0) {
              updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                stock: (updatedItems[itemIndex].stock || 0) + lineItem.quantityDecimal
              };
            }
          }
        });

        const updatedPurchases = [...state.purchases];
        updatedPurchases[purchaseIndex] = {
          ...purchase,
          status: 'RECEIVED'
        };

        return {
          purchases: updatedPurchases,
          items: updatedItems
        };
      }),
    }),
    {
      name: 'billy-app-store-v3',
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
