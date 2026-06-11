import fs from 'fs';
import path from 'path';

function walkDir(dir: string, callback: (path: string) => void) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const uiDir1 = path.join(__dirname, '../src/app');
const uiDir2 = path.join(__dirname, '../src/components');

const filesToProcess: string[] = [];
walkDir(uiDir1, p => { if (p.endsWith('.tsx') || p.endsWith('.ts')) filesToProcess.push(p); });
walkDir(uiDir2, p => { if (p.endsWith('.tsx') || p.endsWith('.ts')) filesToProcess.push(p); });

filesToProcess.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Store renaming
    content = content.replace(/setBusinessProfile/g, 'setCurrentBusiness');
    content = content.replace(/businessProfile/g, 'currentBusiness');

    // Model renaming
    content = content.replace(/\bInvoice\b/g, 'SalesInvoice');
    content = content.replace(/\bInvoiceItem\b/g, 'LineItem');
    content = content.replace(/\bItem\b/g, 'InventoryItem'); // Need to be careful with Item vs InventoryItem, but usually Item was the type
    content = content.replace(/\bExpense\b/g, 'ExpenseRecord');
    content = content.replace(/\bPayment\b/g, 'PaymentRecord');
    content = content.replace(/\bStockAdjustment\b/g, 'StockAdjustmentRecord');

    // Props mapping
    // invoice
    content = content.replace(/\.number\b/g, '.documentNumber');
    content = content.replace(/\.customerName\b/g, '.partyName');
    content = content.replace(/\.vendorName\b/g, '.partyName');
    content = content.replace(/\.customerId\b/g, '.partyId');
    content = content.replace(/\.vendorId\b/g, '.partyId');
    content = content.replace(/\.date\b/g, '.documentDate');
    content = content.replace(/\.total\b/g, '.totalAmountPaise');
    content = content.replace(/\.subtotal\b/g, '.subtotalPaise');
    content = content.replace(/\.discountAmount\b/g, '.totalDiscountPaise');
    content = content.replace(/\.cgstAmount\b/g, '.totalGSTAmountPaise'); // approximate
    content = content.replace(/\.type === ['"]Tax Invoice['"]/g, '.documentType === "SALES_INVOICE"');
    
    // items
    content = content.replace(/\.price\b/g, '.unitPricePaise');
    content = content.replace(/\.purchasePrice\b/g, '.purchasePricePaise');
    content = content.replace(/\.hsn_sac\b/g, '.hsnSacCode');
    content = content.replace(/\.gst_rate\b/g, '.taxRate.gstComponent.igstRate'); // quick fix, will need formatINR
    content = content.replace(/\.qty\b/g, '.quantityDecimal');
    content = content.replace(/\.rate\b/g, '.unitPricePaise');
    content = content.replace(/\.line_total\b/g, '.totalAmountPaise');
    content = content.replace(/\.tax_amount\b/g, '.gstAmountPaise');

    // party
    content = content.replace(/\.name\b/g, '.legalName');
    content = content.replace(/\.balance\b/g, '.openingBalancePaise');
    
    // expense / payment
    content = content.replace(/\.amount\b/g, '.amountPaise');

    fs.writeFileSync(filePath, content, 'utf-8');
});

console.log(`Processed ${filesToProcess.length} files.`);
