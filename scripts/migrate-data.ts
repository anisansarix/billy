import fs from 'fs';
import path from 'path';
import { PARTIES, ITEMS, INVOICES, PURCHASES, EXPENSES, PAYMENTS, OUTSTANDING_DATA, DASHBOARD_BALANCES, HOME_USER } from '../constants/data';
import { DocumentType, GSTType, PartyType, TaxRate } from '../src/types/entities';
import { computeLineItem, buildGSTSummary } from '../src/utils/gst';

console.log("Transforming data...");

// Convert amounts to paise and map entities
const newParties = PARTIES.map(p => ({
    id: p.id,
    partyType: p.type === 'customer' ? PartyType.CUSTOMER : (p.type === 'vendor' ? PartyType.VENDOR : PartyType.BOTH),
    legalName: p.name,
    tradeName: p.name,
    gstin: p.gstin || undefined,
    pan: p.pan || undefined,
    gstType: p.gstin ? GSTType.REGULAR : GSTType.UNREGISTERED,
    billingAddress: p.billingAddress ? {
        line1: p.billingAddress.street || '',
        city: p.billingAddress.city || '',
        state: p.billingAddress.state || '',
        stateCode: p.gstin ? p.gstin.substring(0, 2) : '27',
        pincode: p.billingAddress.pinCode || '',
        country: 'India'
    } : { line1: 'Unknown', city: 'Unknown', state: 'Maharashtra', stateCode: '27', pincode: '000000', country: 'India' },
    shippingAddresses: [],
    contactPersons: [],
    paymentTermsDays: 30,
    creditLimitPaise: (p.creditLimit || 0) * 100,
    openingBalancePaise: (p.balance || 0) * 100,
    openingBalanceType: 'DEBIT',
    notes: p.notes
}));

// We need some standard tax rates
const STD_RATES = {
    '0': { id: 'tr_0', hsnSacCode: '0000', description: '0% Rate', isService: false, isActive: true, gstComponent: { cgstRate: 0, sgstRate: 0, igstRate: 0, cessRate: 0 } },
    '5': { id: 'tr_5', hsnSacCode: '0000', description: '5% Rate', isService: false, isActive: true, gstComponent: { cgstRate: 2.5, sgstRate: 2.5, igstRate: 5, cessRate: 0 } },
    '12': { id: 'tr_12', hsnSacCode: '0000', description: '12% Rate', isService: false, isActive: true, gstComponent: { cgstRate: 6, sgstRate: 6, igstRate: 12, cessRate: 0 } },
    '18': { id: 'tr_18', hsnSacCode: '0000', description: '18% Rate', isService: false, isActive: true, gstComponent: { cgstRate: 9, sgstRate: 9, igstRate: 18, cessRate: 0 } },
    '28': { id: 'tr_28', hsnSacCode: '0000', description: '28% Rate', isService: false, isActive: true, gstComponent: { cgstRate: 14, sgstRate: 14, igstRate: 28, cessRate: 0 } },
};

const newItems = ITEMS.map(i => {
    let tr = STD_RATES[String(i.gst_rate)] || STD_RATES['18'];
    tr = { ...tr, hsnSacCode: i.hsn_sac || '0000', isService: i.type === 'service' };
    return {
        id: i.id,
        name: i.name,
        type: i.type,
        unitPricePaise: Math.round(i.price * 100),
        purchasePricePaise: i.purchasePrice ? Math.round(i.purchasePrice * 100) : undefined,
        hsnSacCode: i.hsn_sac || '',
        taxRate: tr,
        unit: i.unit || 'PCS',
        stock: i.stock || 0,
        minimumStock: i.minimumStock,
        sku: i.sku,
        barcode: i.barcode,
        description: i.description
    };
});

const mapDocument = (inv: any, docType: any) => {
    // calculate isInterState: just mock it randomly or if igst > 0
    const isInterState = inv.igstAmount > 0;
    
    let lineItems = inv.items.map((li: any) => {
        let tr = STD_RATES[String(li.gst_rate)] || STD_RATES['18'];
        tr = { ...tr, hsnSacCode: li.hsn_sac || '0000' };
        const raw = {
            id: li.id,
            description: li.name,
            hsnSacCode: li.hsn_sac || '',
            taxRate: tr,
            unit: li.unit || 'PCS',
            quantityDecimal: li.qty,
            unitPricePaise: Math.round(li.rate * 100),
            discountPercent: li.discountType === 'percentage' ? (li.discount || 0) : 0,
        };
        return computeLineItem(raw, isInterState);
    });

    const gstSummary = buildGSTSummary(lineItems, isInterState);
    
    const subtotalPaise = lineItems.reduce((acc, i) => acc + (i.unitPricePaise * i.quantityDecimal), 0);
    const totalTaxableAmountPaise = gstSummary.totalTaxableValuePaise;
    const totalGSTAmountPaise = gstSummary.totalGSTAmountPaise;
    const totalAmountPaise = totalTaxableAmountPaise + totalGSTAmountPaise + gstSummary.totalCessAmountPaise;
    
    return {
        id: inv.id,
        documentType: docType,
        documentNumber: inv.number,
        documentDate: new Date(inv.date).toISOString(),
        dueDate: inv.dueDate ? new Date(inv.dueDate).toISOString() : undefined,
        businessId: 'b1',
        partyId: inv.customerId || inv.vendorId,
        partyName: inv.customerName || inv.vendorName,
        lineItems,
        gstSummary,
        subtotalPaise,
        totalDiscountPaise: subtotalPaise - totalTaxableAmountPaise,
        totalTaxableAmountPaise,
        totalGSTAmountPaise,
        totalAmountPaise,
        totalAmountInWords: '', // calculated dynamically normally
        isInterState,
        placeOfSupply: isInterState ? 'Delhi' : 'Maharashtra',
        status: inv.status.toUpperCase(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMode: inv.paymentMode || 'UPI',
        paidAmountPaise: inv.status === 'Paid' ? totalAmountPaise : 0,
        balanceDuePaise: inv.status === 'Paid' ? 0 : totalAmountPaise,
        expectedDeliveryDate: new Date(inv.date).toISOString()
    };
};

const newInvoices = INVOICES.map(i => mapDocument(i, DocumentType.SALES_INVOICE));
const newPurchases = PURCHASES.map(i => mapDocument(i, DocumentType.PURCHASE_ORDER));

const newExpenses = EXPENSES.map(e => ({
    id: e.id,
    date: new Date(e.date).toISOString(),
    category: e.category,
    amountPaise: Math.round(e.amount * 100),
    paymentMode: e.paymentMode,
    vendorName: e.vendorName,
    notes: e.notes
}));

const newPayments = PAYMENTS.map(p => ({
    id: p.id,
    date: new Date(p.date).toISOString(),
    amountPaise: Math.round(p.amount * 100),
    mode: p.mode,
    type: p.type,
    partyId: 'p1', // mockup
    partyName: p.partyName
}));

const dashboardBalances = DASHBOARD_BALANCES.map(d => ({
    title: d.title,
    amountPaise: Math.round(d.amount * 100),
    gstAmountPaise: Math.round(d.gstAmount * 100),
    currency: d.currency
}));

const newOutstanding = OUTSTANDING_DATA.map(o => ({
    title: o.title,
    totalReceivablesPaise: Math.round(o.totalReceivables * 100),
    currency: o.currency,
    items: o.items.map(i => ({
        label: i.label,
        amountPaise: Math.round(i.amount * 100),
        subtitle: i.subtitle,
        status: i.status
    }))
}));

// Build output string
let out = `import { icons } from "./icons";\n`;
out += `import { DocumentType, GSTType, PartyType, SalesInvoice, PurchaseOrder, Party, InventoryItem, PaymentRecord, ExpenseRecord } from '../src/types/entities';\n\n`;
out += `export const tabs: AppTab[] = [
    { name: "index", title: "Home", icon: icons.home },
    { name: "subscriptions", title: "Subscriptions", icon: icons.wallet },
    { name: "insights", title: "Insights", icon: icons.activity },
    { name: "settings", title: "Settings", icon: icons.setting },
];\n\n`;

out += `export const HOME_USER = ${JSON.stringify(HOME_USER, null, 4)};\n\n`;
out += `export const DASHBOARD_BALANCES = ${JSON.stringify(dashboardBalances, null, 4)};\n\n`;
out += `export const OUTSTANDING_DATA = ${JSON.stringify(newOutstanding, null, 4)};\n\n`;
out += `export const PARTIES: Party[] = ${JSON.stringify(newParties, null, 4)};\n\n`;
out += `export const ITEMS: InventoryItem[] = ${JSON.stringify(newItems, null, 4)};\n\n`;
out += `export const INVOICES: SalesInvoice[] = ${JSON.stringify(newInvoices, null, 4)};\n\n`;
out += `export const PURCHASES: PurchaseOrder[] = ${JSON.stringify(newPurchases, null, 4)};\n\n`;
out += `export const EXPENSES: ExpenseRecord[] = ${JSON.stringify(newExpenses, null, 4)};\n\n`;
out += `export const PAYMENTS: PaymentRecord[] = ${JSON.stringify(newPayments, null, 4)};\n\n`;

fs.writeFileSync(path.join(__dirname, '../constants/data.ts'), out);
console.log("Data successfully migrated to data.ts!");
