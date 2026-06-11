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

fixFile('(inventory)/products-services.tsx', [
    [/\.sellingPricePaise/g, '.unitPricePaise'],
    [/sellingPricePaise:/g, 'unitPricePaise:'],
    [/\.openingStockQuantity/g, '.stock'],
    [/openingStockQuantity:/g, 'stock:'],
    [/purchasePricePaisePaise/g, 'purchasePricePaise'],
    [/taxRate: text/g, 'taxRate: Number(text)'], // UI parsing
    [/taxRate: formData\.taxRate/g, 'taxRate: { id: "tx1", hsnSacCode: formData.hsnSacCode || "", description: "", isService: false, isActive: true, gstComponent: { cgstRate: (formData.taxRate||0) / 2, sgstRate: (formData.taxRate||0) / 2, igstRate: formData.taxRate||0, cessRate: 0 } }']
]);

fixFile('(parties)/customers-vendors.tsx', [
    [/\.name/g, '.legalName'],
    [/name:/g, 'legalName:'],
    [/\.mobile/g, '.phone'],
    [/mobile:/g, 'phone:'],
    [/openingBalancePaiseType/g, 'balanceType'],
    [/openingBalancePaiseString/g, 'balanceString'],
    [/\(type as any\)/g, 'partyType'],
    [/value=\{formData\}/g, 'value={formData.phone}'],
    [/phone: text/g, 'phone: text'],
    [/contactPerson:/g, 'contactPersons:'],
    [/contactPerson /g, 'contactPersons '],
    [/'ContactPerson\[\]'/g, "'string'"], // This is just me escaping the type error string if it exists in UI
    [/value=\{formData\.email\}/g, 'value={formData.email}']
]);

fixFile('(purchases)/expenses-purchases.tsx', [
    [/\.partyName/g, '.vendorName'],
    [/partyName:/g, 'vendorName:'],
    [/\.documentDate/g, '.date'] // For expenses it's date
]);
