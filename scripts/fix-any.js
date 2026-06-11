const fs = require('fs');
const path = require('path');

const filesToFix = [
    'create-estimate.tsx',
    'create-invoice.tsx',
    'create-purchase.tsx',
    'create-quotation.tsx'
];

for (const file of filesToFix) {
    const fullPath = path.join(__dirname, 'src/app/(app)', file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // 1. Import DocumentData
    content = content.replace(
        'import DocumentBuilder from "@/components/DocumentBuilder";',
        'import DocumentBuilder, { DocumentData } from "@/components/DocumentBuilder";'
    );

    // 2. fix handleSave parameter
    content = content.replace(
        'const handleSave = (documentData: any) => {',
        'const handleSave = (documentData: DocumentData) => {'
    );

    // 3. fix updateInvoice/addInvoice cast
    content = content.replace(/updateInvoice\(([a-zA-Z]+) as any\);/g, 'updateInvoice($1 as Invoice);');
    content = content.replace(/addInvoice\(([a-zA-Z]+) as any\);/g, 'addInvoice($1 as Invoice);');
    content = content.replace(/updatePurchase\(([a-zA-Z]+) as any\);/g, 'updatePurchase($1 as Invoice);');
    content = content.replace(/addPurchase\(([a-zA-Z]+) as any\);/g, 'addPurchase($1 as Invoice);');

    fs.writeFileSync(fullPath, content);
    console.log('Fixed', file);
}
