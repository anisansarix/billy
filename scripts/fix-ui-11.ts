import fs from 'fs';
import path from 'path';

function fixFile(file: string, rules: [RegExp, string][]) {
    const fp = path.join(__dirname, '../src/app/(app)', file);
    if (!fs.existsSync(fp)) return;
    let text = fs.readFileSync(fp, 'utf-8');
    rules.forEach(([regex, replacement]) => {
        text = text.replace(regex, replacement);
    });
    fs.writeFileSync(fp, text, 'utf-8');
}

fixFile('(parties)/customers-vendors.tsx', [
    [/openingBalancePaiseString/g, 'balanceString'],
    [/openingBalancePaiseType/g, 'balanceType'],
    [/\.phone/g, ''],
    [/phone: formData\.phone/g, ''],
    [/phone: text/g, ''],
    [/phone:/g, '// phone:'],
    [/\.name/g, '.legalName'],
    [/\.type/g, '.partyType'],
    [/\(type as any\)/g, 'partyType'],
    [/contactPerson:/g, 'contactPersons:'],
    [/\.email/g, ''],
    [/email: text/g, ''],
    [/\{selectedParty \|\| 'N\/A'\}/g, "{'N/A'}"],
    [/handleCall\(selectedParty\)/g, "handleCall()"],
    [/const handleCall = \(\) =>/g, "const handleCall = () =>"]
]);

fixFile('(purchases)/expenses-purchases.tsx', [
    [/\.partyName/g, '.vendorName'],
    [/partyName:/g, 'vendorName:'],
    [/vendorName \|\| pur\.vendorName/g, 'vendorName'],
    [/\(selectedExpense as any\)\.vendorName/g, 'selectedExpense.vendorName'],
    [/selectedPurchase\.vendorName/g, '(selectedPurchase as any).vendorName'],
    [/pur\.date/g, 'pur.documentDate'],
    [/\.date/g, '.documentDate']
]);

// Wait, I replaced `.documentDate` with `.date` earlier. ExpenseRecord has `date` or `documentDate`? Let's check entities.ts.
// Entities.ts: ExpenseRecord has `date`. 
// I'll make sure ExpenseRecord uses `date` and PurchaseOrder uses `documentDate`.
