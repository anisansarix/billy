const fs = require('fs');
const path = require('path');

const files = [
    'create-estimate.tsx',
    'create-invoice.tsx',
    'create-purchase.tsx',
    'create-quotation.tsx'
];

for (const file of files) {
    const fullPath = path.join(__dirname, 'src/app/(app)', file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // fix transport fallback
    content = content.replace(/transport: existing[a-zA-Z]+\.transport \|\| \{ vehicleNo: "", ewayBill: "", deliveryDate: "" \}/, (match, offset, string) => {
        const varName = match.split('.')[0].replace('transport: ', '');
        return `transport: { vehicleNo: ${varName}.transport?.vehicleNumber || "", ewayBill: ${varName}.transport?.ewayBillNumber || "", deliveryDate: ${varName}.transport?.deliveryDate || "" }`;
    });
    
    // some might not have transport fallback in the same way, let's just forcefully replace transport: existingX.transport
    content = content.replace(/transport: existing[a-zA-Z]+\.transport,/, (match) => {
        const varName = match.split('.')[0].replace('transport: ', '');
        return `transport: { vehicleNo: ${varName}.transport?.vehicleNumber || "", ewayBill: ${varName}.transport?.ewayBillNumber || "", deliveryDate: ${varName}.transport?.deliveryDate || "" },`;
    });

    fs.writeFileSync(fullPath, content);
    console.log('Fixed', file);
}
