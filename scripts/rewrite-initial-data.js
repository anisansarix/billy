const fs = require('fs');
const path = require('path');

const fileConfigs = [
    { name: 'create-delivery-challan.tsx', obj: 'existingChallan' },
    { name: 'create-estimate.tsx', obj: 'existingEstimate' },
    { name: 'create-invoice.tsx', obj: 'existingInvoice' },
    { name: 'create-purchase.tsx', obj: 'existingPurchase' },
    { name: 'create-quotation.tsx', obj: 'existingQuotation' }
];

for (const {name, obj} of fileConfigs) {
    const fullPath = path.join(__dirname, 'src/app/(app)', name);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Replace the entire if (existingX) { ... } block
    const blockRegex = new RegExp(`if \\(${obj}\\) \\{[\\s\\S]*?\\}\\s+const handleSave`, 'm');
    
    const replacement = `if (${obj}) {
        const party = parties.find(p => p.id === ${obj}.customerId) || parties.find(p => p.id === ${obj}.vendorId);
        initialData = {
            selectedParty: party || ({ id: ${obj}.customerId || ${obj}.vendorId || "", name: ${obj}.customerName || ${obj}.vendorName || "" } as Party),
            header: {
                type: ${obj}.type,
                number: ${obj}.number,
                date: ${obj}.date,
                dueDate: ${obj}.dueDate || "",
                status: ${obj}.status,
            },
            items: ${obj}.items,
            payment: {
                mode: ${obj}.paymentMode || "UPI",
                terms: ${obj}.paymentTerms || "Immediate"
            },
            transport: ${obj}.transport ? { 
                vehicleNo: ${obj}.transport.vehicleNumber || "", 
                ewayBill: ${obj}.transport.ewayBillNumber || "", 
                deliveryDate: ${obj}.transport.deliveryDate || "" 
            } : undefined,
            notes: {
                external: ${obj}.notes || "",
                internal: ${obj}.internalNotes || ""
            }
        };
    }

    const handleSave`;

    content = content.replace(blockRegex, replacement);
    fs.writeFileSync(fullPath, content);
    console.log('Fixed', name);
}
