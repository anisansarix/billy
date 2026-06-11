import fs from 'fs';
import path from 'path';

function walkDir(dir: string, callback: (path: string) => void) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const filesToProcess: string[] = [];
walkDir(path.join(__dirname, '../src/app'), p => { if (p.endsWith('.tsx') || p.endsWith('.ts')) filesToProcess.push(p); });
walkDir(path.join(__dirname, '../src/components'), p => { if (p.endsWith('.tsx') || p.endsWith('.ts')) filesToProcess.push(p); });

filesToProcess.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Fix create-estimate and create-delivery-challan same as create-invoice
    if (filePath.includes('create-estimate.tsx')) {
        content = content.replace(/existingInvoice \|\| existingEstimate \|\| existingQuotation \|\| existingChallan/g, 'existingEstimate');
        content = content.replace(/if\s*\(\s*existingEstimate\s*\)/g, 'if (existingEstimate)');
        content = content.replace(/\bSalesInvoice\b/g, 'SalesInvoice'); // It's still SalesInvoice type
        content = content.replace(/documentData\.header\.number/g, 'documentData.header.documentNumber');
        content = content.replace(/documentData\.header\.date/g, 'documentData.header.documentDate');
        content = content.replace(/documentData\.totals\.subtotal/g, 'documentData.totals.subtotalPaise');
        content = content.replace(/documentData\.totals\.discount/g, 'documentData.totals.discountPaise');
        content = content.replace(/documentData\.totals\.cgst/g, 'documentData.totals.cgstPaise');
        content = content.replace(/documentData\.totals\.sgst/g, 'documentData.totals.sgstPaise');
        content = content.replace(/documentData\.totals\.igst/g, 'documentData.totals.igstPaise');
        content = content.replace(/documentData\.totals\.total/g, 'documentData.totals.totalAmountPaise');
    }

    if (filePath.includes('create-delivery-challan.tsx')) {
        content = content.replace(/existingInvoice \|\| existingEstimate \|\| existingQuotation \|\| existingChallan/g, 'existingChallan');
        content = content.replace(/if\s*\(\s*existingChallan\s*\)/g, 'if (existingChallan)');
        content = content.replace(/documentData\.header\.number/g, 'documentData.header.documentNumber');
        content = content.replace(/documentData\.header\.date/g, 'documentData.header.documentDate');
        content = content.replace(/documentData\.totals\.subtotal/g, 'documentData.totals.subtotalPaise');
        content = content.replace(/documentData\.totals\.discount/g, 'documentData.totals.discountPaise');
        content = content.replace(/documentData\.totals\.cgst/g, 'documentData.totals.cgstPaise');
        content = content.replace(/documentData\.totals\.sgst/g, 'documentData.totals.sgstPaise');
        content = content.replace(/documentData\.totals\.igst/g, 'documentData.totals.igstPaise');
        content = content.replace(/documentData\.totals\.total/g, 'documentData.totals.totalAmountPaise');
        content = content.replace(/DeliveryChallan/g, 'SalesInvoice'); // Use SalesInvoice for all until we type discriminate better
    }

    // Fix imports
    content = content.replace(/import\s*\{\s*Party\,\s*SalesInvoice\,\s*DocumentType\s*\}\s*from\s*["']@\/types\/entities["'];/g, 'import { Party, SalesInvoice, DocumentType } from "@/types/entities";');

    // Fix sales.tsx
    if (filePath.includes('sales.tsx')) {
        content = content.replace(/inv\.items/g, 'inv.lineItems');
        content = content.replace(/import\s*\{\s*Party\,\s*SalesInvoice\,\s*DocumentType\s*\}\s*from/g, 'import { SalesInvoice, DocumentType } from');
    }

    fs.writeFileSync(filePath, content, 'utf-8');
});

console.log("Processed all files.");
