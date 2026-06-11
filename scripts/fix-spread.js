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

    // remove ...existingX
    content = content.replace(/\.\.\.existing[a-zA-Z]+,\n\s*/g, '');

    fs.writeFileSync(fullPath, content);
    console.log('Fixed', file);
}
