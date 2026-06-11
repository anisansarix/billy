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

const dirs = [
    path.join(__dirname, '../src/app/(app)/(sales)'),
    path.join(__dirname, '../src/app/(app)/(purchases)'),
    path.join(__dirname, '../src/app/(auth)')
];

const filesToProcess: string[] = [];
dirs.forEach(d => walkDir(d, p => { if (p.endsWith('.tsx') || p.endsWith('.ts')) filesToProcess.push(p); }));

filesToProcess.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Fix the broken `existingInvoice || ...` bug
    content = content.replace(/if\s*\(\s*existingInvoice\s*\|\|\s*existingEstimate\s*\|\|\s*existingQuotation\s*\|\|\s*existingChallan\s*\)/g, 'if (existingInvoice)');
    content = content.replace(/existingInvoice\s*\|\|\s*existingEstimate\s*\|\|\s*existingQuotation\s*\|\|\s*existingChallan/g, 'existingInvoice');
    
    // Sometimes it's existingEstimate or existingChallan alone because of my manual edits
    content = content.replace(/if\s*\(\s*existingEstimate\s*\|\|\s*existingQuotation\s*\|\|\s*existingChallan\s*\)/g, 'if (existingEstimate)');
    content = content.replace(/existingEstimate\s*\|\|\s*existingQuotation\s*\|\|\s*existingChallan/g, 'existingEstimate');

    // In sales.tsx and purchases.tsx
    content = content.replace(/\binv\.type\b/g, 'inv.documentType');
    content = content.replace(/=== "Tax SalesInvoice"/g, '=== "SALES_INVOICE"');
    content = content.replace(/=== "Proforma SalesInvoice"/g, '=== "PROFORMA_INVOICE"');
    content = content.replace(/=== "Estimate"/g, '=== "PROFORMA_INVOICE"');
    content = content.replace(/=== "Quotation"/g, '=== "PROFORMA_INVOICE"');
    content = content.replace(/=== "Delivery Challan"/g, '=== "DELIVERY_CHALLAN"');
    
    content = content.replace(/selectedInvoice\.type/g, 'selectedInvoice.documentType');
    content = content.replace(/selectedPurchase\.type/g, 'selectedPurchase.documentType');
    
    // sign-up.tsx fixes
    if (filePath.includes('sign-up.tsx')) {
        content = content.replace(/setCurrentBusiness\(\{\s*firstName: trimmedFirstName,\s*lastName: trimmedLastName,\s*companyName: trimmedCompanyName,\s*phone: trimmedPhone,\s*gstin: sanitizedGst \|\| ""\s*\}\);/g, 
        `setCurrentBusiness({
            id: "b1",
            legalName: trimmedCompanyName || (trimmedFirstName + " " + trimmedLastName),
            tradeName: trimmedCompanyName,
            gstin: sanitizedGst || "",
            pan: "",
            gstType: "REGULAR" as any,
            address: { line1: "", city: "", state: "", stateCode: "", pincode: "", country: "India" },
            shippingAddresses: [],
            phone: trimmedPhone,
            email: "",
            bankDetails: [],
            fiscalYearStart: "APRIL",
            defaultCurrency: "INR"
        });`);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
});

console.log(`Processed ${filesToProcess.length} files.`);
