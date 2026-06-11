const fs = require('fs');
const path = require('path');

const files = [
    'create-delivery-challan.tsx',
    'create-estimate.tsx',
    'create-invoice.tsx',
    'create-purchase.tsx',
    'create-quotation.tsx'
];

for (const file of files) {
    const fullPath = path.join(__dirname, 'src/app/(app)', file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // 1. replace selectedParty fallback
    content = content.replace(/customer \|\| \{ id: (.*?), name: (.*?) \}/g, "customer || ({ id: $1, name: $2 } as Party)");
    content = content.replace(/vendor \|\| \{ id: (.*?), name: (.*?) \}/g, "vendor || ({ id: $1, name: $2 } as Party)");

    // 2. fix transport fallback in create-delivery-challan and create-invoice
    if (file === 'create-delivery-challan.tsx') {
        content = content.replace(/transport: existingChallan\.transport \|\| \{ vehicleNo: "", ewayBill: "", deliveryDate: "" \}/, "transport: { vehicleNo: existingChallan.transport?.vehicleNumber || \"\", ewayBill: existingChallan.transport?.ewayBillNumber || \"\", deliveryDate: existingChallan.transport?.deliveryDate || \"\" }");
    }

    fs.writeFileSync(fullPath, content);
    console.log('Fixed', file);
}

// 3. Fix mobile in DocumentBuilder.tsx
const dbPath = path.join(__dirname, 'src/components/DocumentBuilder.tsx');
let dbContent = fs.readFileSync(dbPath, 'utf8');
dbContent = dbContent.replace(/selectedParty\.phone \|\| selectedParty\.mobile/, "selectedParty.phone || selectedParty.alternatePhone");
fs.writeFileSync(dbPath, dbContent);
