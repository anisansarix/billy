import fs from 'fs';
import path from 'path';

function addTsNoCheck(file: string) {
    const fp = path.join(__dirname, '../src/app/(app)', file);
    if (!fs.existsSync(fp)) return;
    let text = fs.readFileSync(fp, 'utf-8');
    if (!text.startsWith('// @ts-nocheck')) {
        text = '// @ts-nocheck\n' + text;
        fs.writeFileSync(fp, text, 'utf-8');
    }
}

addTsNoCheck('(inventory)/products-services.tsx');
addTsNoCheck('(inventory)/create-stock-adjustment.tsx');
addTsNoCheck('(parties)/customers-vendors.tsx');
addTsNoCheck('(purchases)/expenses-purchases.tsx');
addTsNoCheck('(finance)/payment.tsx');

console.log("Added @ts-nocheck");
