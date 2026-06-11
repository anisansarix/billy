import fs from 'fs';
import path from 'path';

function removeUnusedImports(file: string) {
    const fp = path.join(__dirname, '../src/app/(app)', file);
    if (!fs.existsSync(fp)) return;
    let text = fs.readFileSync(fp, 'utf-8');
    
    // Quick regex to drop unused entity imports
    const unusedEntities = ['Party', 'PaymentRecord', 'InventoryItem', 'StockAdjustmentRecord', 'DocumentType', 'SalesInvoice', 'PurchaseOrder', 'ExpenseRecord'];
    
    // We will just let eslint fix it if we could, but we can't reliably string-replace comma-separated imports easily.
    // However, since we know they are mostly defined like: import { Party, PaymentRecord, ... } from "@/types/entities";
    // We can just find the entity import line and see if the variable is used anywhere else in the file.
    let lines = text.split('\n');
    const entityImportLineIndex = lines.findIndex(l => l.includes('@/types/entities'));
    if (entityImportLineIndex !== -1) {
        let importLine = lines[entityImportLineIndex];
        unusedEntities.forEach(entity => {
            // Count occurrences of the entity in the file
            const count = (text.match(new RegExp(`\\b${entity}\\b`, 'g')) || []).length;
            // If it only appears once (in the import), remove it
            if (count === 1) {
                importLine = importLine.replace(new RegExp(`\\b${entity}\\b\\s*,?\\s*`), '');
            }
        });
        
        // Clean up trailing commas in the import
        importLine = importLine.replace(/,\s*\}/, ' }').replace(/\{\s*,/, '{ ');
        
        // If the import is empty, remove the whole line
        if (importLine.match(/import\s*\{\s*\}\s*from\s*["']@\/types\/entities["'];/)) {
            lines.splice(entityImportLineIndex, 1);
        } else {
            lines[entityImportLineIndex] = importLine;
        }
        fs.writeFileSync(fp, lines.join('\n'), 'utf-8');
    }
}

const files = [
    '(finance)/eway-bills.tsx', 
    '(finance)/gst-returns.tsx', 
    '(finance)/payment.tsx', 
    '(inventory)/create-stock-adjustment.tsx', 
    '(inventory)/products-services.tsx', 
    '(parties)/customers-vendors.tsx', 
    '(sales)/create-delivery-challan.tsx', 
    '(sales)/create-estimate.tsx', 
    '(sales)/create-invoice.tsx', 
    '(sales)/create-quotation.tsx', 
    '(sales)/sales.tsx'
];

files.forEach(removeUnusedImports);
console.log("Fixed unused imports");
