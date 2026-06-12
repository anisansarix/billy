import fs from 'fs';
import path from 'path';

// --- DATA DICTIONARIES ---

const BUSINESS_NAMES_FIRST = ['Tata', 'Patel', 'Reliance', 'Jain', 'Mehta', 'Ramesh', 'Suresh', 'Gupta', 'Singh', 'Shree', 'Om', 'Balaji', 'Saraswati', 'Ganesh', 'Laxmi', 'Maruti', 'Shiv', 'Kisan'];
const BUSINESS_NAMES_LAST = ['Traders', 'Enterprise', 'Hardware', 'Industries', 'Steels', 'Electronics', 'Suppliers', 'Agencies', 'Brothers', 'Sons', 'Corporation', 'Distributors', 'Mart', 'Solutions', 'Plastics', 'Cement'];

const ITEM_DATA = [
    { name: "TMT Bar 12mm", hsn: "7214", rate: 18, basePrice: 65 },
    { name: "TMT Bar 16mm", hsn: "7214", rate: 18, basePrice: 68 },
    { name: "UltraTech Cement Bag 50kg", hsn: "2523", rate: 28, basePrice: 380 },
    { name: "Ambuja Cement Bag 50kg", hsn: "2523", rate: 28, basePrice: 370 },
    { name: "Finolex Wire 1.5 sq mm (90m)", hsn: "8544", rate: 18, basePrice: 1250 },
    { name: "Finolex Wire 2.5 sq mm (90m)", hsn: "8544", rate: 18, basePrice: 1950 },
    { name: "PVC Pipe 1 inch", hsn: "3917", rate: 18, basePrice: 120 },
    { name: "PVC Pipe 2 inch", hsn: "3917", rate: 18, basePrice: 240 },
    { name: "Asian Paints Royale 20L", hsn: "3209", rate: 18, basePrice: 6500 },
    { name: "Berger Paints 20L", hsn: "3209", rate: 18, basePrice: 5800 },
    { name: "Havells Ceiling Fan", hsn: "8414", rate: 18, basePrice: 2200 },
    { name: "Crompton LED Bulb 9W", hsn: "8539", rate: 18, basePrice: 85 },
    { name: "Anchor Switches (Box of 20)", hsn: "8536", rate: 18, basePrice: 450 },
    { name: "Ceramic Floor Tiles 2x2", hsn: "6907", rate: 18, basePrice: 550 },
    { name: "Vitrified Wall Tiles", hsn: "6907", rate: 18, basePrice: 450 },
    { name: "Godrej Padlock 50mm", hsn: "8301", rate: 18, basePrice: 350 },
    { name: "Nails 2 inch (1kg)", hsn: "7317", rate: 18, basePrice: 90 },
    { name: "Screws 1.5 inch (1 Box)", hsn: "7318", rate: 18, basePrice: 150 },
    { name: "Fevicol SH 1kg", hsn: "3506", rate: 18, basePrice: 280 },
    { name: "Dr. Fixit 1L", hsn: "3824", rate: 18, basePrice: 420 },
    { name: "Plywood 18mm (8x4)", hsn: "4412", rate: 18, basePrice: 2800 },
    { name: "Teak Wood Board", hsn: "4412", rate: 18, basePrice: 3500 },
    { name: "MDF Board 12mm", hsn: "4411", rate: 18, basePrice: 1200 },
    { name: "Glass Sheet 5mm", hsn: "7005", rate: 18, basePrice: 850 },
    { name: "Aluminum Profile", hsn: "7604", rate: 18, basePrice: 450 },
    { name: "Plaster of Paris 20kg", hsn: "2520", rate: 5, basePrice: 180 },
    { name: "White Cement 5kg", hsn: "2523", rate: 28, basePrice: 150 },
    { name: "Wall Putty 40kg", hsn: "3214", rate: 18, basePrice: 450 },
    { name: "Sintex Water Tank 500L", hsn: "3925", rate: 18, basePrice: 2500 },
    { name: "Sintex Water Tank 1000L", hsn: "3925", rate: 18, basePrice: 4500 },
    { name: "CPVC Pipe 1 inch", hsn: "3917", rate: 18, basePrice: 180 },
    { name: "UPVC Pipe 2 inch", hsn: "3917", rate: 18, basePrice: 280 },
    { name: "Tap Fitting Steel", hsn: "8481", rate: 18, basePrice: 450 },
    { name: "Shower Head", hsn: "8481", rate: 18, basePrice: 650 },
    { name: "Wash Basin", hsn: "6910", rate: 18, basePrice: 1200 },
    { name: "Western Commode", hsn: "6910", rate: 18, basePrice: 3500 },
    { name: "Water Heater 15L", hsn: "8516", rate: 18, basePrice: 4500 },
    { name: "Exhaust Fan", hsn: "8414", rate: 18, basePrice: 850 },
    { name: "MCB 32 Amp", hsn: "8536", rate: 18, basePrice: 180 },
    { name: "Distribution Board", hsn: "8537", rate: 18, basePrice: 1200 }
];

const INDIAN_STATES = [
    { name: 'Maharashtra', code: '27' },
    { name: 'Gujarat', code: '24' },
    { name: 'Karnataka', code: '29' },
    { name: 'Delhi', code: '07' },
    { name: 'Tamil Nadu', code: '33' }
];

const EXPENSE_CATEGORIES = ["Office Supplies", "Fuel", "Rent", "Salaries", "Maintenance", "Travel", "Marketing", "Electricity"];

// --- UTILS ---

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPick = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generateGSTIN = (stateCode: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    let gstin = stateCode;
    for (let i=0; i<5; i++) gstin += chars.charAt(Math.floor(Math.random() * chars.length));
    for (let i=0; i<4; i++) gstin += nums.charAt(Math.floor(Math.random() * nums.length));
    gstin += chars.charAt(Math.floor(Math.random() * chars.length));
    gstin += '1Z';
    gstin += nums.charAt(Math.floor(Math.random() * nums.length));
    return gstin;
};

// --- GENERATORS ---

const parties: any[] = [];
for (let i = 1; i <= 60; i++) {
    const state = randomInt(1, 100) < 60 ? INDIAN_STATES[0] : randomPick(INDIAN_STATES); // 60% chance of same state (Maharashtra 27)
    const partyType = randomInt(1, 100) < 60 ? 'CUSTOMER' : (randomInt(1, 100) < 50 ? 'VENDOR' : 'BOTH');
    
    parties.push({
        id: `p${i}`,
        partyType: partyType,
        legalName: `${randomPick(BUSINESS_NAMES_FIRST)} ${randomPick(BUSINESS_NAMES_LAST)}`,
        gstin: generateGSTIN(state.code),
        phone: `98${randomInt(10000000, 99999999)}`,
        email: `contact@${randomPick(BUSINESS_NAMES_FIRST).toLowerCase()}business.com`,
        gstType: 'REGULAR',
        openingBalancePaise: randomInt(-5000000, 15000000), // Random opening balances
        billingAddress: {
            line1: `Plot ${randomInt(1, 200)}, MIDC`,
            city: state.name === 'Maharashtra' ? 'Mumbai' : 'City',
            state: state.name,
            stateCode: state.code,
            pincode: `4000${randomInt(10, 99)}`,
            country: 'India'
        },
        shippingAddresses: [],
        contactPersons: [],
        paymentTermsDays: 30,
        creditLimitPaise: 5000000,
        openingBalanceType: randomInt(0, 1) === 0 ? 'DEBIT' : 'CREDIT'
    });
}

const items: any[] = [];
for (let i = 0; i < ITEM_DATA.length; i++) {
    const d = ITEM_DATA[i];
    items.push({
        id: `i${i+1}`,
        name: d.name,
        type: 'product',
        hsnSacCode: d.hsn,
        taxRate: { id: "tr_" + d.rate, hsnSacCode: d.hsn, description: d.rate + "% Rate", isService: false, isActive: true, gstComponent: { cgstRate: d.rate/2, sgstRate: d.rate/2, igstRate: d.rate, cessRate: 0 } },
        unitPricePaise: d.basePrice * 100,
        purchasePricePaise: Math.floor((d.basePrice * 100) * 0.8), // 20% margin
        stock: randomInt(0, 500),
        minimumStock: randomInt(10, 50),
        unit: 'pcs'
    });
}

const invoices: any[] = [];
const purchases: any[] = [];
const payments: any[] = [];
const expenses: any[] = [];

const startDate = new Date('2026-01-01T00:00:00Z');
const endDate = new Date('2026-06-30T23:59:59Z');

let invCounter = 1;
let purCounter = 1;
let payCounter = 1;
let expCounter = 1;

// Generate 150 Invoices
for (let i = 0; i < 150; i++) {
    const customer = randomPick(parties.filter(p => p.partyType === 'CUSTOMER' || p.partyType === 'BOTH'));
    const isSameState = customer.billingAddress.stateCode === '27';
    
    const lineItemsCount = randomInt(1, 6);
    const lineItems: any[] = [];
    let taxableAmountPaise = 0;
    let totalTaxPaise = 0;

    for(let j=0; j<lineItemsCount; j++) {
        const item = randomPick(items);
        const qty = randomInt(1, 50);
        const rate = item.unitPricePaise;
        const total = qty * rate;
        const taxRate = item.taxRate.gstComponent.igstRate;
        const tax = Math.round(total * (taxRate / 100));

        taxableAmountPaise += total;
        totalTaxPaise += tax;

        lineItems.push({
            id: `li_${invCounter}_${j}`,
            
            description: item.name,
            unit: item.unit,
            discountPercent: 0,
            hsnSacCode: item.hsnSacCode,
            quantityDecimal: qty,
            unitPricePaise: rate,
            taxableAmountPaise: total,
            taxRate: item.taxRate,
            gstAmountPaise: tax,
            totalAmountPaise: total + tax,
            
            
            
        });
    }

    const totalAmountPaise = taxableAmountPaise + totalTaxPaise;
    
    // Determine status and balance
    const date = randomDate(startDate, endDate);
    const msSince = endDate.getTime() - date.getTime();
    const daysSince = msSince / (1000 * 3600 * 24);
    
    let status = 'Pending';
    let balanceDuePaise = totalAmountPaise;

    if (daysSince > 45) {
        status = randomInt(1, 10) > 2 ? 'Paid' : 'Overdue'; // Older invoices are likely paid
    } else if (daysSince > 15) {
        status = randomInt(1, 10) > 5 ? 'Paid' : 'Pending';
    } else {
        status = randomInt(1, 10) > 8 ? 'Paid' : 'Pending';
    }

    if (status === 'Paid') balanceDuePaise = 0;
    if (status === 'Overdue' && balanceDuePaise === 0) balanceDuePaise = totalAmountPaise; // safety

    if (status === 'Paid') {
        payments.push({
            id: `pay${payCounter++}`,
            date: new Date(date.getTime() + randomInt(1, 10)*24*3600*1000).toISOString(),
            amountPaise: totalAmountPaise,
            mode: randomPick(['UPI', 'Bank Transfer', 'Cash']),
            type: 'in',
            partyId: customer.id,
            partyName: customer.legalName
        });
    }

    invoices.push({
        id: `inv${invCounter}`,
        documentType: 'SALES_INVOICE',
        documentNumber: `INV-26-${invCounter.toString().padStart(4, '0')}`,
        documentDate: date.toISOString(),
        dueDate: new Date(date.getTime() + 15*24*3600*1000).toISOString(),
        partyId: customer.id,
        partyName: customer.legalName,
        businessId: "bus1",
        gstSummary: { slabs: {}, totalTaxableValuePaise: taxableAmountPaise, totalGSTAmountPaise: totalTaxPaise, totalCessAmountPaise: 0 },
        subtotalPaise: taxableAmountPaise,
        totalDiscountPaise: 0,
        totalAmountInWords: "Sample Amount",
        isInterState: !isSameState,
        placeOfSupply: "27",
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        paymentMode: "Cash",
        paidAmountPaise: status === 'Paid' ? totalAmountPaise : 0,
        status: status,
        lineItems: lineItems,
        totalTaxableAmountPaise: taxableAmountPaise,
        totalGSTAmountPaise: totalTaxPaise,
        totalAmountPaise: totalAmountPaise,
        balanceDuePaise: balanceDuePaise,
        notes: "Thank you for doing business with us."
    });
    invCounter++;
}

// Generate 80 Purchases
for (let i = 0; i < 80; i++) {
    const vendor = randomPick(parties.filter(p => p.partyType === 'VENDOR' || p.partyType === 'BOTH'));
    const isSameState = vendor.billingAddress.stateCode === '27';
    
    const lineItemsCount = randomInt(1, 8);
    const lineItems: any[] = [];
    let taxableAmountPaise = 0;
    let totalTaxPaise = 0;

    for(let j=0; j<lineItemsCount; j++) {
        const item = randomPick(items);
        const qty = randomInt(50, 500); // wholesale quantities
        const rate = item.purchasePricePaise;
        const total = qty * rate;
        const taxRate = item.taxRate.gstComponent.igstRate;
        const tax = Math.round(total * (taxRate / 100));

        taxableAmountPaise += total;
        totalTaxPaise += tax;

        lineItems.push({
            id: `pli_${purCounter}_${j}`,
            
            description: item.name,
            unit: item.unit,
            discountPercent: 0,
            hsnSacCode: item.hsnSacCode,
            quantityDecimal: qty,
            unitPricePaise: rate,
            taxableAmountPaise: total,
            taxRate: item.taxRate,
            gstAmountPaise: tax,
            totalAmountPaise: total + tax,
            
            
            
        });
    }

    const totalAmountPaise = taxableAmountPaise + totalTaxPaise;
    const date = randomDate(startDate, endDate);
    
    let status = 'Pending';
    let balanceDuePaise = totalAmountPaise;
    if (randomInt(1, 10) > 4) {
        status = 'Paid';
        balanceDuePaise = 0;
        
        payments.push({
            id: `pay${payCounter++}`,
            date: new Date(date.getTime() + randomInt(1, 10)*24*3600*1000).toISOString(),
            amountPaise: totalAmountPaise,
            mode: randomPick(['UPI', 'Bank Transfer']),
            type: 'out',
            partyId: vendor.id,
            partyName: vendor.legalName
        });
    } else if (randomInt(1, 10) > 8) {
        status = 'Overdue';
    }

    purchases.push({
        id: `pur${purCounter}`,
        documentType: 'PURCHASE_ORDER',
        documentNumber: `PO-26-${purCounter.toString().padStart(4, '0')}`,
        documentDate: date.toISOString(),
        dueDate: new Date(date.getTime() + 30*24*3600*1000).toISOString(),
        partyId: vendor.id,
        partyName: vendor.legalName,
        businessId: "bus1",
        gstSummary: { slabs: {}, totalTaxableValuePaise: taxableAmountPaise, totalGSTAmountPaise: totalTaxPaise, totalCessAmountPaise: 0 },
        subtotalPaise: taxableAmountPaise,
        totalDiscountPaise: 0,
        totalAmountInWords: "Sample Amount",
        isInterState: !isSameState,
        placeOfSupply: "27",
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        expectedDeliveryDate: new Date(date.getTime() + 7*24*3600*1000).toISOString(),
        status: status,
        lineItems: lineItems,
        totalTaxableAmountPaise: taxableAmountPaise,
        totalGSTAmountPaise: totalTaxPaise,
        totalAmountPaise: totalAmountPaise,
        balanceDuePaise: balanceDuePaise
    });
    purCounter++;
}

// Generate 50 Expenses
for (let i = 0; i < 50; i++) {
    const date = randomDate(startDate, endDate);
    expenses.push({
        id: `exp${expCounter++}`,
        date: date.toISOString(),
        category: randomPick(EXPENSE_CATEGORIES),
        amountPaise: randomInt(50000, 2500000), // 500 to 25k rupees
        paymentMode: randomPick(['UPI', 'Bank Transfer', 'Cash', 'Credit Card']),
        vendorName: `Vendor ${expCounter}`,
        notes: "Monthly recurring"
    });
}

// Business Info
const DEFAULT_BUSINESS = {
    id: "bus1",
    legalName: "Billy Trading Co.",
    tradeName: "Billy Retail",
    gstin: "27AAACZ8901M1Z1",
    pan: "AAACZ8901M",
    gstType: "REGULAR",
    address: {
        line1: "101, Main Road",
        city: "Mumbai",
        state: "Maharashtra",
        stateCode: "27",
        pincode: "400001",
        country: "India"
    },
    shippingAddresses: [],
    phone: "9876543210",
    email: "contact@billy.com",
    bankDetails: [],
    fiscalYearStart: 'APRIL',
    defaultCurrency: 'INR'
};

let fileContent = `// THIS FILE IS AUTO-GENERATED BY scripts/generate-mock.ts
// DO NOT EDIT MANUALLY - This contains a massive dataset for testing.

import { Party, InventoryItem, SalesInvoice, PurchaseOrder, ExpenseRecord, PaymentRecord, Business, PartyType, GSTType, DocumentType } from '../src/types/entities';

export const DEFAULT_BUSINESS: Business = ${JSON.stringify(DEFAULT_BUSINESS, null, 4).replace(/"REGULAR"/g, "GSTType.REGULAR")};

export const PARTIES: Party[] = ${JSON.stringify(parties, null, 4)
    .replace(/"CUSTOMER"/g, "PartyType.CUSTOMER")
    .replace(/"VENDOR"/g, "PartyType.VENDOR")
    .replace(/"BOTH"/g, "PartyType.BOTH")
    .replace(/"REGULAR"/g, "GSTType.REGULAR")
};

export const ITEMS: InventoryItem[] = ${JSON.stringify(items, null, 4)};

export const INVOICES: SalesInvoice[] = ${JSON.stringify(invoices, null, 4)
    .replace(/"SALES_INVOICE"/g, "DocumentType.SALES_INVOICE")
    .replace(/"CUSTOMER"/g, "PartyType.CUSTOMER")
    .replace(/"VENDOR"/g, "PartyType.VENDOR")
    .replace(/"BOTH"/g, "PartyType.BOTH")
    .replace(/"REGULAR"/g, "GSTType.REGULAR")
};

export const PURCHASES: PurchaseOrder[] = ${JSON.stringify(purchases, null, 4)
    .replace(/"PURCHASE_ORDER"/g, "DocumentType.PURCHASE_ORDER")
    .replace(/"CUSTOMER"/g, "PartyType.CUSTOMER")
    .replace(/"VENDOR"/g, "PartyType.VENDOR")
    .replace(/"BOTH"/g, "PartyType.BOTH")
    .replace(/"REGULAR"/g, "GSTType.REGULAR")
};

export const EXPENSES: ExpenseRecord[] = ${JSON.stringify(expenses, null, 4)};

export const PAYMENTS: PaymentRecord[] = ${JSON.stringify(payments, null, 4)};

export const DEFAULT_TAX_RATES = [0, 0.1, 0.25, 3, 5, 12, 18, 28];
`;

fs.writeFileSync(path.join(__dirname, '../constants/data.ts'), fileContent, 'utf-8');
console.log("Mock data successfully generated and written to constants/data.ts");
