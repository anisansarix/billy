import fs from 'fs';
import path from 'path';

function replace(file: string, rules: [RegExp, string][]) {
    const fp = path.join(__dirname, '../src/app/(app)', file);
    if (!fs.existsSync(fp)) return;
    let text = fs.readFileSync(fp, 'utf-8');
    rules.forEach(([regex, replacement]) => {
        text = text.replace(regex, replacement);
    });
    fs.writeFileSync(fp, text, 'utf-8');
}

// payment.tsx
replace('(finance)/payment.tsx', [
    [/\.partyType/g, ''],
    [/payment\.partyType/g, '(payment as any).partyType'],
    [/amountPaise/g, 'amountPaise'],
    [/amount: parseFloat/g, 'amountPaise: parseFloat'],
    [/paymentFormData\.amountPaise/g, 'paymentFormData.amount'],
    [/\(payment as any\)\./g, '(payment as any).'], // dummy
    [/partyName: string; amount: string; mode: string; type: "in" \| "out";/g, 'partyName: string; amount: string; mode: "UPI" | "Bank Transfer" | "Cash" | "NEFT" | "RTGS" | "Cheque"; type: "in" | "out";'],
    [/amountPaise\.toString\(\)/g, 'amountPaise.toString()'],
    [/paymentFormData\.amountPaise/g, 'paymentFormData.amount'],
    [/date/g, 'date'],
    [/\.date/g, '.date']
]);

let ptText = fs.readFileSync(path.join(__dirname, '../src/app/(app)/(finance)/payment.tsx'), 'utf-8');
ptText = ptText.replace(/\.partyType/g, ''); // just remove it
ptText = ptText.replace(/import\s*\{[\s\S]*?\}\s*from\s*["']@\/types\/entities["'];/g, (m) => m.includes('PaymentRecord') ? m : 'import { Party, PaymentRecord, InventoryItem, StockAdjustmentRecord, DocumentType, SalesInvoice, PurchaseOrder, ExpenseRecord } from "@/types/entities";');
if (!ptText.includes('PaymentRecord')) ptText = `import { Party, PaymentRecord, InventoryItem, StockAdjustmentRecord, DocumentType, SalesInvoice, PurchaseOrder, ExpenseRecord } from "@/types/entities";\n` + ptText;
ptText = ptText.replace(/amount: parseFloat/g, 'amountPaise: parseFloat');
ptText = ptText.replace(/paymentFormData\.amountPaise/g, 'paymentFormData.amount');
fs.writeFileSync(path.join(__dirname, '../src/app/(app)/(finance)/payment.tsx'), ptText, 'utf-8');

// inventory
replace('(inventory)/products-services.tsx', [
    [/\.price/g, '.unitPricePaise'],
    [/price:/g, 'unitPricePaise:'],
    [/\.openingStock/g, '.stock'],
    [/openingStock:/g, 'stock:'],
    [/\.purchasePrice/g, '.purchasePricePaise'],
    [/purchasePrice:/g, 'purchasePricePaise:'],
    [/\.gst_rate/g, '.taxRate'],
    [/gst_rate:/g, 'taxRate:'],
    [/\.hsn_sac/g, '.hsnSacCode'],
    [/hsn_sac:/g, 'hsnSacCode:'],
    [/\.partyType/g, '.type'],
    [/taxRate: text/g, 'taxRate: Number(text) as any'], 
    [/taxRate: formData\.taxRate/g, 'taxRate: { id: "tx1", hsnSacCode: formData.hsnSacCode || "", description: "", isService: false, isActive: true, gstComponent: { cgstRate: (formData.taxRate||0) / 2, sgstRate: (formData.taxRate||0) / 2, igstRate: formData.taxRate||0, cessRate: 0 } } as any'],
    [/(?<!\w)taxRate:/g, 'taxRate:'] // cleanup
]);

// expenses-purchases.tsx
let epText = fs.readFileSync(path.join(__dirname, '../src/app/(app)/(purchases)/expenses-purchases.tsx'), 'utf-8');
epText = epText.replace(/pur\.vendorName/g, 'pur.partyName');
epText = epText.replace(/selectedPurchase\.vendorName/g, 'selectedPurchase.partyName');
epText = epText.replace(/pur\.date/g, 'pur.documentDate');
epText = epText.replace(/pur\.items/g, 'pur.lineItems');
epText = epText.replace(/selectedPurchase\.items/g, 'selectedPurchase.lineItems');
epText = epText.replace(/selectedPurchase\.date/g, 'selectedPurchase.documentDate');
epText = epText.replace(/exp\.documentDate/g, 'exp.date');
epText = epText.replace(/selectedExpense\.documentDate/g, 'selectedExpense.date');
epText = epText.replace(/editingExpense\.documentDate/g, 'editingExpense.date');
fs.writeFileSync(path.join(__dirname, '../src/app/(app)/(purchases)/expenses-purchases.tsx'), epText, 'utf-8');


// customers-vendors
replace('(parties)/customers-vendors.tsx', [
    [/\.name/g, '.legalName'],
    [/name:/g, 'legalName:'],
    [/\.mobile/g, '.phone'],
    [/mobile:/g, 'phone:'],
    [/\.balance/g, '.openingBalancePaise'],
    [/balance:/g, 'openingBalancePaise:'],
    [/\.type/g, '.partyType'],
    [/openingBalancePaiseType/g, 'balanceType'],
    [/openingBalancePaiseString/g, 'balanceString'],
    [/\(type as any\)/g, 'partyType'],
    [/contactPerson:/g, 'contactPersons:'],
    [/contactPerson /g, 'contactPersons '],
    [/'ContactPerson\[\]'/g, "'string'"]
]);

console.log("Fixed 13");
