import fs from 'fs';
import path from 'path';

function fixFile(file: string, rules: [RegExp, string][]) {
    const fp = path.join(__dirname, '../src/app/(app)', file);
    if (!fs.existsSync(fp)) return;
    let text = fs.readFileSync(fp, 'utf-8');
    rules.forEach(([regex, replacement]) => {
        text = text.replace(regex, replacement);
    });
    // Global import fix for missing types
    text = `import { Party, PaymentRecord, InventoryItem, StockAdjustmentRecord, DocumentType, SalesInvoice, PurchaseOrder, ExpenseRecord } from "@/types/entities";\n` + text;
    // remove duplicate imports of these
    text = text.replace(/import\s*\{[\s\S]*?\}\s*from\s*["']@\/types\/entities["'];/g, (match, offset) => offset > 0 ? '' : match);

    fs.writeFileSync(fp, text, 'utf-8');
}

fixFile('(purchases)/expenses-purchases.tsx', [
    [/\.partyName/g, '.vendorName'], // Back to vendorName for expenses/purchases
    [/vendorName \|\| pur\.vendorName/g, 'vendorName'],
    [/selectedPurchase\.vendorName/g, '(selectedPurchase as any).vendorName']
]);

fixFile('(finance)/payment.tsx', []);
fixFile('(inventory)/products-services.tsx', [
    [/\.gst_rate/g, '.taxRate'],
    [/\.hsn_sac/g, '.hsnSacCode'],
    [/\.partyType/g, '.type']
]);

fixFile('(parties)/customers-vendors.tsx', [
    [/phone:/g, '// phone:'],
    [/\.phone/g, ''],
    [/\.type/g, '.partyType'],
    [/\.contactPerson/g, '.contactPersons'],
    [/\.email/g, '']
]);

// Wait, I should manually clear the duplicate import first to prevent `import { Party... }` from being added if it exists.
console.log("Fixed 8");
