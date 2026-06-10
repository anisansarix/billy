const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src/components/DocumentBuilder.tsx');
let content = fs.readFileSync(p, 'utf8');

// replace initialData typing
content = content.replace(
    "initialData?: Partial<DocumentData> | Record<string, unknown>;",
    "initialData?: Partial<DocumentData>;"
);

// fix initializations that error
content = content.replace(
    /const \[header, setHeader\] = useState\(\(\) => initialData\?\.header \|\| \{([\s\S]*?)\}\);/m,
    `const [header, setHeader] = useState<DocumentData['header']>(() => initialData?.header || {
        type: defaultType,
        number: \`\${defaultPrefix}\${new Date().getFullYear()}-\${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}\`,
        date: new Date().toISOString().split('T')[0],
        dueDate: "",
        status: "Draft",
    });`
);

content = content.replace(
    /const \[selectedParty, setSelectedParty\] = useState<Party \| null>\(\(initialData as any\)\?\.selectedParty \|\| null\);/,
    "const [selectedParty, setSelectedParty] = useState<Party | null>(initialData?.selectedParty || null);"
);

content = content.replace(
    /const \[documentItems, setDocumentItems\] = useState<InvoiceItem\[\]>\(\(initialData as any\)\?\.items \|\| \[\]\);/,
    "const [documentItems, setDocumentItems] = useState<InvoiceItem[]>(initialData?.items || []);"
);

content = content.replace(
    /const \[payment, setPayment\] = useState\(initialData\?\.payment \|\| \{ mode: initialData\?\.paymentMode \|\| "UPI", terms: initialData\?\.paymentTerms \|\| "Immediate" \}\);/,
    "const [payment, setPayment] = useState<DocumentData['payment']>(initialData?.payment || { mode: \"UPI\", terms: \"Immediate\" });"
);

content = content.replace(
    /const \[transport, setTransport\] = useState\(initialData\?\.transport \|\| \{ vehicleNo: "", ewayBill: "", deliveryDate: "" \}\);/,
    "const [transport, setTransport] = useState<NonNullable<DocumentData['transport']>>(initialData?.transport || { vehicleNo: \"\", ewayBill: \"\", deliveryDate: \"\" });"
);

content = content.replace(
    /const \[notes, setNotes\] = useState\(initialData\?\.notes \|\| \{ internal: initialData\?\.internalNotes \|\| "", external: initialData\?\.notes \|\| defaultNotes \}\);/,
    "const [notes, setNotes] = useState<DocumentData['notes']>(initialData?.notes || { internal: \"\", external: defaultNotes });"
);

// also fix item creation error where 'id', 'tax_amount', 'line_total' are missing.
content = content.replace(
    /setDocumentItems\(\[\.\.\.documentItems, \{\s*productId: item\.id,\s*name: item\.name,\s*hsn_sac: item\.hsn_sac,\s*qty: 1,\s*unit: item\.unit \|\| 'pcs',\s*rate: item\.price,\s*gst_rate: item\.gst_rate,\s*discount: 0\s*\}\]\);/m,
    `setDocumentItems([...documentItems, {
                                        id: \`item-\${Date.now()}\`,
                                        productId: item.id,
                                        name: item.name,
                                        hsn_sac: item.hsn_sac,
                                        qty: 1,
                                        unit: item.unit || 'pcs',
                                        rate: item.price,
                                        gst_rate: item.gst_rate,
                                        discount: 0,
                                        tax_amount: item.price * (item.gst_rate / 100),
                                        line_total: item.price * (1 + item.gst_rate / 100)
                                    }]);`
);


fs.writeFileSync(p, content);
console.log('Fixed DocumentBuilder.tsx');
