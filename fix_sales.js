const fs = require("fs");
const path = require("path");

const dir = path.join("src", "app", "(app)", "(sales)");
const files = ["create-invoice.tsx", "create-estimate.tsx", "create-quotation.tsx", "create-delivery-challan.tsx"];

files.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, "utf8");

    // Add imports if not present
    if (!content.includes("import { Party, SalesInvoice, DocumentType }")) {
        content = content.replace("import DocumentBuilder", "import { Party, SalesInvoice, DocumentType } from \"@/types/entities\";\nimport DocumentBuilder");
    }

    // Replace the existingItem lookup completely to be clean.
    // We'll replace the whole block from "let initialData" up to just before "const handleSave"
    const rebuildRegex = /let initialData = undefined;[\s\S]*?(?=const handleSave)/;
    
    content = content.replace(rebuildRegex, `let initialData = undefined;
    if (existingInvoice || existingEstimate || existingQuotation || existingChallan) {
        const doc = (existingInvoice || existingEstimate || existingQuotation || existingChallan) as SalesInvoice;
        const party = parties.find(p => p.id === doc.partyId);
        initialData = {
            selectedParty: party || ({ id: doc.partyId || "", legalName: "", partyType: "CUSTOMER" } as unknown as Party),
            header: {
                type: doc.documentType,
                number: doc.documentNumber,
                date: doc.documentDate,
                dueDate: doc.dueDate || "",
                status: doc.status,
            },
            items: doc.lineItems,
            payment: {
                mode: doc.paymentMode || "UPI",
                terms: "Immediate"
            },
            transport: doc.eWayBillNumber ? { 
                vehicleNo: "", 
                ewayBill: doc.eWayBillNumber, 
                deliveryDate: "" 
            } : undefined,
            notes: {
                external: doc.notes || "",
                internal: ""
            }
        };
    }

    `);

    // But wait, the variable names are existingInvoice, existingEstimate, etc.
    // So the above doc variable assignment is safe because missing ones will be undefined.
    // Wait, typescript might complain about existingEstimate being undefined if it's not declared in create-invoice.
    // Let's use a simpler regex.
    content = content.replace(/let initialData = undefined;\n    if \(existing(.*?)\) \{[\s\S]*?(?=const handleSave)/, (match, typeName) => {
        return `let initialData = undefined;
    if (existing${typeName}) {
        const party = parties.find(p => p.id === existing${typeName}.partyId);
        initialData = {
            selectedParty: party || ({ id: existing${typeName}.partyId || "", legalName: "", partyType: "CUSTOMER" } as unknown as Party),
            header: {
                type: existing${typeName}.documentType,
                number: existing${typeName}.documentNumber,
                date: existing${typeName}.documentDate,
                dueDate: existing${typeName}.dueDate || "",
                status: existing${typeName}.status,
            },
            items: existing${typeName}.lineItems,
            payment: {
                mode: existing${typeName}.paymentMode || "UPI",
                terms: "Immediate"
            },
            transport: existing${typeName}.eWayBillNumber ? { 
                vehicleNo: "", 
                ewayBill: existing${typeName}.eWayBillNumber, 
                deliveryDate: "" 
            } : undefined,
            notes: {
                external: existing${typeName}.notes || "",
                internal: ""
            }
        } as any;
    }

    `;
    });

    const saveRegex = /const ([a-zA-Z]+ToSave) = \{[\s\S]*?\};/;
    content = content.replace(saveRegex, (match, varName) => {
        let typeVal = "DocumentType.SALES_INVOICE";
        if (file.includes("estimate")) typeVal = "DocumentType.PROFORMA_INVOICE";
        if (file.includes("quotation")) typeVal = "DocumentType.PROFORMA_INVOICE";
        if (file.includes("challan")) typeVal = "DocumentType.DELIVERY_CHALLAN";
        
        return `const ${varName}: SalesInvoice = {
            id: editId || \`\${Date.now()}\`,
            documentType: ${typeVal},
            documentNumber: documentData.header.number,
            documentDate: documentData.header.date,
            dueDate: documentData.header.dueDate,
            businessId: "b1",
            partyId: documentData.selectedParty.id,
            lineItems: documentData.items,
            gstSummary: { slabs: {}, totalTaxableValuePaise: 0, totalGSTAmountPaise: 0, totalCessAmountPaise: 0 },
            subtotalPaise: documentData.totals.subtotal,
            totalDiscountPaise: documentData.totals.discount,
            totalTaxableAmountPaise: documentData.totals.subtotal - documentData.totals.discount,
            totalGSTAmountPaise: documentData.totals.cgst + documentData.totals.sgst + documentData.totals.igst,
            totalAmountPaise: documentData.totals.total,
            totalAmountInWords: "",
            notes: documentData.notes.external,
            isInterState: false,
            placeOfSupply: "",
            status: documentData.header.status || "Draft",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paymentMode: documentData.payment.mode,
            paidAmountPaise: 0,
            balanceDuePaise: documentData.totals.total,
            eWayBillNumber: documentData.transport?.ewayBill,
        };`;
    });

    content = content.replace(/as SalesInvoice\)/g, ")");

    fs.writeFileSync(filePath, content, "utf8");
    console.log("Updated", file);
});
