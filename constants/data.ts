import { icons } from "./icons";

export const tabs: AppTab[] = [
    { name: "index", title: "Home", icon: icons.home },
    { name: "subscriptions", title: "Subscriptions", icon: icons.wallet },
    { name: "insights", title: "Insights", icon: icons.activity },
    { name: "settings", title: "Settings", icon: icons.setting },
];

export const HOME_USER = {
    name: "Anees | Axanees",
};

export const DASHBOARD_BALANCES: BalanceCardData[] = [
    {
        title: "Sales",
        amount: 360600,
        gstAmount: 64908,
        currency: "₹",
    },
    {
        title: "Purchase",
        amount: 57500,
        gstAmount: 0,
        currency: "₹",
    }
];

export const OUTSTANDING_DATA: OutstandingSummary[] = [
    {
        title: "Sales Outstanding",
        totalReceivables: 425508.00,
        currency: "₹",
        items: [
            {
                label: "CURRENT",
                amount: 425508.00,
                status: "current"
            },
            {
                label: "OVERDUE",
                amount: 0.00,
                subtitle: "30+ Days",
                status: "overdue"
            }
        ]
    },
    {
        title: "Purchase Outstanding",
        totalReceivables: 57500.00,
        currency: "₹",
        items: [
            {
                label: "CURRENT",
                amount: 57500.00,
                status: "current"
            },
            {
                label: "OVERDUE",
                amount: 0.00,
                subtitle: "1-15 Days",
                status: "overdue"
            }
        ]
    }
];


export const PARTIES: Party[] = [
    {
        "id": "p1",
        "name": "Ramesh Traders",
        "gstin": "27AADCB2230M1Z2",
        "phone": "+91 9876543000",
        "balance": 69444,
        "type": "customer"
    },
    {
        "id": "p2",
        "name": "Tata Steel Wholesale",
        "gstin": "29AAACT2233L1Z6",
        "phone": "+91 9876543001",
        "balance": 19839,
        "type": "customer"
    },
    {
        "id": "p3",
        "name": "Patel Hardware",
        "gstin": "24AABCP4455N1Z7",
        "phone": "+91 9876543002",
        "balance": 2426,
        "type": "customer"
    },
    {
        "id": "p4",
        "name": "Sharma & Sons",
        "gstin": "09AAECS8899K1Z4",
        "phone": "+91 9876543003",
        "balance": 24537,
        "type": "customer"
    },
    {
        "id": "p5",
        "name": "Party 5 Traders",
        "gstin": "07AAACJ5566R1Z9",
        "phone": "+91 9876543004",
        "balance": 50916,
        "type": "customer"
    },
    {
        "id": "p6",
        "name": "Party 6 Traders",
        "gstin": "24AACCP1122A1Z4",
        "phone": "+91 9876543005",
        "balance": 85951,
        "type": "customer"
    },
    {
        "id": "p7",
        "name": "Party 7 Traders",
        "gstin": "19AACCN5566B1Z8",
        "phone": "+91 9876543006",
        "balance": 34027,
        "type": "customer"
    },
    {
        "id": "p8",
        "name": "Party 8 Traders",
        "gstin": "27AACCU8899T1Z5",
        "phone": "+91 9876543007",
        "balance": 66990,
        "type": "customer"
    },
    {
        "id": "p9",
        "name": "Ultra Cement Depot",
        "gstin": "03AABCV1234E1Z1",
        "phone": "+91 9876543008",
        "balance": 39627,
        "type": "vendor"
    },
    {
        "id": "p10",
        "name": "Prime Logistics",
        "gstin": "06AACCK5678F1Z2",
        "phone": "+91 9876543009",
        "balance": 45427,
        "type": "vendor"
    },
    {
        "id": "p11",
        "name": "National Metals",
        "gstin": "09AABCP3456H1Z4",
        "phone": "+91 9876543010",
        "balance": 87438,
        "type": "vendor"
    },
    {
        "id": "p12",
        "name": "Party 12 Suppliers",
        "gstin": "24AACCG7890I1Z5",
        "phone": "+91 9876543011",
        "balance": 68180,
        "type": "vendor"
    },
    {
        "id": "p13",
        "name": "Party 13 Suppliers",
        "gstin": "27AABCM9012G1Z3",
        "phone": "+91 9876543012",
        "balance": 77552,
        "type": "vendor"
    },
    {
        "id": "p14",
        "name": "Party 14 Suppliers",
        "gstin": "08AAACM2233K1Z1",
        "phone": "+91 9876543013",
        "balance": 316,
        "type": "vendor"
    },
    {
        "id": "p15",
        "name": "Party 15 Suppliers",
        "gstin": "24AADCO9988Q1Z3",
        "phone": "+91 9876543014",
        "balance": 30640,
        "type": "vendor"
    }
];

export const ITEMS: Item[] = [
    {
        "id": "i1",
        "name": "TMT Bars 12mm",
        "type": "product",
        "price": 450,
        "hsn_sac": "7214",
        "stock": 500,
        "minimumStock": 200,
        "gst_rate": 18
    },
    {
        "id": "i2",
        "name": "Ambuja Cement 50kg",
        "type": "product",
        "price": 380,
        "hsn_sac": "2523",
        "stock": 10,
        "minimumStock": 50,
        "gst_rate": 28
    },
    {
        "id": "i3",
        "name": "Office Chair Ergonomic",
        "type": "product",
        "price": 4500,
        "hsn_sac": "9401",
        "stock": 45,
        "minimumStock": 20,
        "gst_rate": 18
    },
    {
        "id": "i4",
        "name": "Accounting Software License",
        "type": "service",
        "price": 15000,
        "hsn_sac": "9984",
        "gst_rate": 18
    },
    {
        "id": "i5",
        "name": "Consulting Fees",
        "type": "service",
        "price": 5000,
        "hsn_sac": "9983",
        "gst_rate": 18
    },
    {
        "id": "i6",
        "name": "TMT Bars 16mm",
        "type": "product",
        "price": 620,
        "hsn_sac": "7214",
        "stock": 35,
        "minimumStock": 50,
        "gst_rate": 18
    },
    {
        "id": "i7",
        "name": "ACC Cement 50kg",
        "type": "product",
        "price": 395,
        "hsn_sac": "2523",
        "stock": 980,
        "minimumStock": 100,
        "gst_rate": 28
    },
    {
        "id": "i8",
        "name": "PVC Pipe 4 Inch",
        "type": "product",
        "price": 1250,
        "hsn_sac": "3917",
        "stock": 200,
        "minimumStock": 50,
        "gst_rate": 18
    },
    {
        "id": "i9",
        "name": "Copper Wire Bundle",
        "type": "product",
        "price": 2850,
        "hsn_sac": "7408",
        "stock": 160,
        "minimumStock": 100,
        "gst_rate": 18
    },
    {
        "id": "i10",
        "name": "LED Panel Light",
        "type": "product",
        "price": 950,
        "hsn_sac": "9405",
        "stock": 5,
        "minimumStock": 20,
        "gst_rate": 12
    },
    {
        "id": "i11",
        "name": "Desktop Computer",
        "type": "product",
        "price": 42000,
        "hsn_sac": "8471",
        "stock": 20,
        "minimumStock": 10,
        "gst_rate": 18
    },
    {
        "id": "i12",
        "name": "Laser Printer",
        "type": "product",
        "price": 18500,
        "hsn_sac": "8443",
        "stock": 15,
        "minimumStock": 5,
        "gst_rate": 18
    },
    {
        "id": "i13",
        "name": "GST Filing Service",
        "type": "service",
        "price": 3000,
        "hsn_sac": "9982",
        "gst_rate": 18
    },
    {
        "id": "i14",
        "name": "Annual Maintenance Contract",
        "type": "service",
        "price": 25000,
        "hsn_sac": "9987",
        "gst_rate": 18
    },
    {
        "id": "i15",
        "name": "Business Advisory",
        "type": "service",
        "price": 12000,
        "hsn_sac": "9983",
        "gst_rate": 18
    }
];

export const INVOICES: Invoice[] = [
    {
        "id": "inv1",
        "number": "INV-2026-001",
        "date": "16 Feb 2026",
        "type": "Tax Invoice",
        "status": "Overdue",
        "customerId": "p1",
        "customerName": "Ramesh Traders",
        "items": [
            {
                "id": "i1-inv1",
                "productId": "i1",
                "name": "TMT Bars 12mm",
                "hsn_sac": "7214",
                "qty": 5,
                "unit": "pcs",
                "rate": 450,
                "gst_rate": 18,
                "tax_amount": 405,
                "line_total": 2250
            }
        ],
        "subtotal": 2250,
        "discountAmount": 0,
        "cgstAmount": 202.5,
        "sgstAmount": 202.5,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 2655
    },
    {
        "id": "inv2",
        "number": "INV-2026-002",
        "date": "13 Apr 2026",
        "type": "Tax Invoice",
        "status": "Overdue",
        "customerId": "p3",
        "customerName": "Patel Hardware",
        "items": [
            {
                "id": "i1-inv2",
                "productId": "i1",
                "name": "TMT Bars 12mm",
                "hsn_sac": "7214",
                "qty": 3,
                "unit": "pcs",
                "rate": 450,
                "gst_rate": 18,
                "tax_amount": 243,
                "line_total": 1350
            }
        ],
        "subtotal": 1350,
        "discountAmount": 0,
        "cgstAmount": 121.5,
        "sgstAmount": 121.5,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 1593
    },
    {
        "id": "inv3",
        "number": "INV-2026-003",
        "date": "14 Mar 2026",
        "type": "Tax Invoice",
        "status": "Overdue",
        "customerId": "p6",
        "customerName": "Party 6 Traders",
        "items": [
            {
                "id": "i8-inv3",
                "productId": "i8",
                "name": "PVC Pipe 4 Inch",
                "hsn_sac": "3917",
                "qty": 7,
                "unit": "pcs",
                "rate": 1250,
                "gst_rate": 18,
                "tax_amount": 1575,
                "line_total": 8750
            }
        ],
        "subtotal": 8750,
        "discountAmount": 0,
        "cgstAmount": 787.5,
        "sgstAmount": 787.5,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 10325
    },
    {
        "id": "inv4",
        "number": "INV-2026-004",
        "date": "07 Jan 2026",
        "type": "Tax Invoice",
        "status": "Pending",
        "customerId": "p7",
        "customerName": "Party 7 Traders",
        "items": [
            {
                "id": "i5-inv4",
                "productId": "i5",
                "name": "Consulting Fees",
                "hsn_sac": "9983",
                "qty": 8,
                "unit": "pcs",
                "rate": 5000,
                "gst_rate": 18,
                "tax_amount": 7200,
                "line_total": 40000
            }
        ],
        "subtotal": 40000,
        "discountAmount": 0,
        "cgstAmount": 3600,
        "sgstAmount": 3600,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 47200
    },
    {
        "id": "inv5",
        "number": "INV-2026-005",
        "date": "02 Apr 2026",
        "type": "Tax Invoice",
        "status": "Paid",
        "customerId": "p7",
        "customerName": "Party 7 Traders",
        "items": [
            {
                "id": "i11-inv5",
                "productId": "i11",
                "name": "Desktop Computer",
                "hsn_sac": "8471",
                "qty": 5,
                "unit": "pcs",
                "rate": 42000,
                "gst_rate": 18,
                "tax_amount": 37800,
                "line_total": 210000
            }
        ],
        "subtotal": 210000,
        "discountAmount": 0,
        "cgstAmount": 18900,
        "sgstAmount": 18900,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 247800
    },
    {
        "id": "inv6",
        "number": "INV-2026-006",
        "date": "01 Jan 2026",
        "type": "Tax Invoice",
        "status": "Draft",
        "customerId": "p2",
        "customerName": "Tata Steel Wholesale",
        "items": [
            {
                "id": "i12-inv6",
                "productId": "i12",
                "name": "Laser Printer",
                "hsn_sac": "8443",
                "qty": 6,
                "unit": "pcs",
                "rate": 18500,
                "gst_rate": 18,
                "tax_amount": 19980,
                "line_total": 111000
            }
        ],
        "subtotal": 111000,
        "discountAmount": 0,
        "cgstAmount": 9990,
        "sgstAmount": 9990,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 130980
    },
    {
        "id": "inv7",
        "number": "INV-2026-007",
        "date": "06 Jan 2026",
        "type": "Tax Invoice",
        "status": "Paid",
        "customerId": "p2",
        "customerName": "Tata Steel Wholesale",
        "items": [
            {
                "id": "i14-inv7",
                "productId": "i14",
                "name": "Annual Maintenance Contract",
                "hsn_sac": "9987",
                "qty": 4,
                "unit": "pcs",
                "rate": 25000,
                "gst_rate": 18,
                "tax_amount": 18000,
                "line_total": 100000
            }
        ],
        "subtotal": 100000,
        "discountAmount": 0,
        "cgstAmount": 9000,
        "sgstAmount": 9000,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 118000
    },
    {
        "id": "inv8",
        "number": "INV-2026-008",
        "date": "26 Jun 2026",
        "type": "Tax Invoice",
        "status": "Overdue",
        "customerId": "p1",
        "customerName": "Ramesh Traders",
        "items": [
            {
                "id": "i13-inv8",
                "productId": "i13",
                "name": "GST Filing Service",
                "hsn_sac": "9982",
                "qty": 3,
                "unit": "pcs",
                "rate": 3000,
                "gst_rate": 18,
                "tax_amount": 1620,
                "line_total": 9000
            }
        ],
        "subtotal": 9000,
        "discountAmount": 0,
        "cgstAmount": 810,
        "sgstAmount": 810,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 10620
    },
    {
        "id": "inv9",
        "number": "INV-2026-009",
        "date": "21 Apr 2026",
        "type": "Tax Invoice",
        "status": "Pending",
        "customerId": "p3",
        "customerName": "Patel Hardware",
        "items": [
            {
                "id": "i14-inv9",
                "productId": "i14",
                "name": "Annual Maintenance Contract",
                "hsn_sac": "9987",
                "qty": 2,
                "unit": "pcs",
                "rate": 25000,
                "gst_rate": 18,
                "tax_amount": 9000,
                "line_total": 50000
            }
        ],
        "subtotal": 50000,
        "discountAmount": 0,
        "cgstAmount": 4500,
        "sgstAmount": 4500,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 59000
    },
    {
        "id": "inv10",
        "number": "INV-2026-010",
        "date": "19 May 2026",
        "type": "Tax Invoice",
        "status": "Paid",
        "customerId": "p2",
        "customerName": "Tata Steel Wholesale",
        "items": [
            {
                "id": "i5-inv10",
                "productId": "i5",
                "name": "Consulting Fees",
                "hsn_sac": "9983",
                "qty": 6,
                "unit": "pcs",
                "rate": 5000,
                "gst_rate": 18,
                "tax_amount": 5400,
                "line_total": 30000
            }
        ],
        "subtotal": 30000,
        "discountAmount": 0,
        "cgstAmount": 2700,
        "sgstAmount": 2700,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 35400
    },
    {
        "id": "inv11",
        "number": "INV-2026-011",
        "date": "27 Apr 2026",
        "type": "Tax Invoice",
        "status": "Paid",
        "customerId": "p1",
        "customerName": "Ramesh Traders",
        "items": [
            {
                "id": "i11-inv11",
                "productId": "i11",
                "name": "Desktop Computer",
                "hsn_sac": "8471",
                "qty": 5,
                "unit": "pcs",
                "rate": 42000,
                "gst_rate": 18,
                "tax_amount": 37800,
                "line_total": 210000
            }
        ],
        "subtotal": 210000,
        "discountAmount": 0,
        "cgstAmount": 18900,
        "sgstAmount": 18900,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 247800
    },
    {
        "id": "inv12",
        "number": "INV-2026-012",
        "date": "02 Mar 2026",
        "type": "Tax Invoice",
        "status": "Paid",
        "customerId": "p3",
        "customerName": "Patel Hardware",
        "items": [
            {
                "id": "i7-inv12",
                "productId": "i7",
                "name": "ACC Cement 50kg",
                "hsn_sac": "2523",
                "qty": 1,
                "unit": "pcs",
                "rate": 395,
                "gst_rate": 28,
                "tax_amount": 110.6,
                "line_total": 395
            }
        ],
        "subtotal": 395,
        "discountAmount": 0,
        "cgstAmount": 55.3,
        "sgstAmount": 55.3,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 505.6
    },
    {
        "id": "inv13",
        "number": "INV-2026-013",
        "date": "19 Apr 2026",
        "type": "Tax Invoice",
        "status": "Overdue",
        "customerId": "p1",
        "customerName": "Ramesh Traders",
        "items": [
            {
                "id": "i10-inv13",
                "productId": "i10",
                "name": "LED Panel Light",
                "hsn_sac": "9405",
                "qty": 3,
                "unit": "pcs",
                "rate": 950,
                "gst_rate": 12,
                "tax_amount": 342,
                "line_total": 2850
            }
        ],
        "subtotal": 2850,
        "discountAmount": 0,
        "cgstAmount": 171,
        "sgstAmount": 171,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 3192
    },
    {
        "id": "inv14",
        "number": "INV-2026-014",
        "date": "10 Apr 2026",
        "type": "Tax Invoice",
        "status": "Pending",
        "customerId": "p1",
        "customerName": "Ramesh Traders",
        "items": [
            {
                "id": "i1-inv14",
                "productId": "i1",
                "name": "TMT Bars 12mm",
                "hsn_sac": "7214",
                "qty": 9,
                "unit": "pcs",
                "rate": 450,
                "gst_rate": 18,
                "tax_amount": 729,
                "line_total": 4050
            }
        ],
        "subtotal": 4050,
        "discountAmount": 0,
        "cgstAmount": 364.5,
        "sgstAmount": 364.5,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 4779
    },
    {
        "id": "inv15",
        "number": "INV-2026-015",
        "date": "06 Jun 2026",
        "type": "Tax Invoice",
        "status": "Paid",
        "customerId": "p6",
        "customerName": "Party 6 Traders",
        "items": [
            {
                "id": "i14-inv15",
                "productId": "i14",
                "name": "Annual Maintenance Contract",
                "hsn_sac": "9987",
                "qty": 10,
                "unit": "pcs",
                "rate": 25000,
                "gst_rate": 18,
                "tax_amount": 45000,
                "line_total": 250000
            }
        ],
        "subtotal": 250000,
        "discountAmount": 0,
        "cgstAmount": 22500,
        "sgstAmount": 22500,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 295000
    },
    {
        "id": "inv16",
        "number": "INV-2026-016",
        "date": "19 Mar 2026",
        "type": "Tax Invoice",
        "status": "Pending",
        "customerId": "p5",
        "customerName": "Party 5 Traders",
        "items": [
            {
                "id": "i4-inv16",
                "productId": "i4",
                "name": "Accounting Software License",
                "hsn_sac": "9984",
                "qty": 4,
                "unit": "pcs",
                "rate": 15000,
                "gst_rate": 18,
                "tax_amount": 10800,
                "line_total": 60000
            }
        ],
        "subtotal": 60000,
        "discountAmount": 0,
        "cgstAmount": 5400,
        "sgstAmount": 5400,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 70800
    },
    {
        "id": "inv17",
        "number": "INV-2026-017",
        "date": "04 May 2026",
        "type": "Tax Invoice",
        "status": "Paid",
        "customerId": "p5",
        "customerName": "Party 5 Traders",
        "items": [
            {
                "id": "i15-inv17",
                "productId": "i15",
                "name": "Business Advisory",
                "hsn_sac": "9983",
                "qty": 8,
                "unit": "pcs",
                "rate": 12000,
                "gst_rate": 18,
                "tax_amount": 17280,
                "line_total": 96000
            }
        ],
        "subtotal": 96000,
        "discountAmount": 0,
        "cgstAmount": 8640,
        "sgstAmount": 8640,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 113280
    },
    {
        "id": "inv18",
        "number": "INV-2026-018",
        "date": "05 May 2026",
        "type": "Tax Invoice",
        "status": "Overdue",
        "customerId": "p5",
        "customerName": "Party 5 Traders",
        "items": [
            {
                "id": "i11-inv18",
                "productId": "i11",
                "name": "Desktop Computer",
                "hsn_sac": "8471",
                "qty": 4,
                "unit": "pcs",
                "rate": 42000,
                "gst_rate": 18,
                "tax_amount": 30240,
                "line_total": 168000
            }
        ],
        "subtotal": 168000,
        "discountAmount": 0,
        "cgstAmount": 15120,
        "sgstAmount": 15120,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 198240
    },
    {
        "id": "inv19",
        "number": "INV-2026-019",
        "date": "21 May 2026",
        "type": "Tax Invoice",
        "status": "Pending",
        "customerId": "p1",
        "customerName": "Ramesh Traders",
        "items": [
            {
                "id": "i12-inv19",
                "productId": "i12",
                "name": "Laser Printer",
                "hsn_sac": "8443",
                "qty": 10,
                "unit": "pcs",
                "rate": 18500,
                "gst_rate": 18,
                "tax_amount": 33300,
                "line_total": 185000
            }
        ],
        "subtotal": 185000,
        "discountAmount": 0,
        "cgstAmount": 16650,
        "sgstAmount": 16650,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 218300
    },
    {
        "id": "inv20",
        "number": "INV-2026-020",
        "date": "10 Apr 2026",
        "type": "Tax Invoice",
        "status": "Paid",
        "customerId": "p1",
        "customerName": "Ramesh Traders",
        "items": [
            {
                "id": "i9-inv20",
                "productId": "i9",
                "name": "Copper Wire Bundle",
                "hsn_sac": "7408",
                "qty": 9,
                "unit": "pcs",
                "rate": 2850,
                "gst_rate": 18,
                "tax_amount": 4617,
                "line_total": 25650
            }
        ],
        "subtotal": 25650,
        "discountAmount": 0,
        "cgstAmount": 2308.5,
        "sgstAmount": 2308.5,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 30267
    },
    {
        "id": "inv21",
        "number": "INV-2026-021",
        "date": "14 Mar 2026",
        "type": "Tax Invoice",
        "status": "Pending",
        "customerId": "p5",
        "customerName": "Party 5 Traders",
        "items": [
            {
                "id": "i10-inv21",
                "productId": "i10",
                "name": "LED Panel Light",
                "hsn_sac": "9405",
                "qty": 8,
                "unit": "pcs",
                "rate": 950,
                "gst_rate": 12,
                "tax_amount": 912,
                "line_total": 7600
            }
        ],
        "subtotal": 7600,
        "discountAmount": 0,
        "cgstAmount": 456,
        "sgstAmount": 456,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 8512
    },
    {
        "id": "inv22",
        "number": "INV-2026-022",
        "date": "22 Apr 2026",
        "type": "Tax Invoice",
        "status": "Paid",
        "customerId": "p7",
        "customerName": "Party 7 Traders",
        "items": [
            {
                "id": "i10-inv22",
                "productId": "i10",
                "name": "LED Panel Light",
                "hsn_sac": "9405",
                "qty": 3,
                "unit": "pcs",
                "rate": 950,
                "gst_rate": 12,
                "tax_amount": 342,
                "line_total": 2850
            }
        ],
        "subtotal": 2850,
        "discountAmount": 0,
        "cgstAmount": 171,
        "sgstAmount": 171,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 3192
    },
    {
        "id": "inv23",
        "number": "INV-2026-023",
        "date": "10 Apr 2026",
        "type": "Tax Invoice",
        "status": "Paid",
        "customerId": "p4",
        "customerName": "Sharma & Sons",
        "items": [
            {
                "id": "i9-inv23",
                "productId": "i9",
                "name": "Copper Wire Bundle",
                "hsn_sac": "7408",
                "qty": 4,
                "unit": "pcs",
                "rate": 2850,
                "gst_rate": 18,
                "tax_amount": 2052,
                "line_total": 11400
            }
        ],
        "subtotal": 11400,
        "discountAmount": 0,
        "cgstAmount": 1026,
        "sgstAmount": 1026,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 13452
    },
    {
        "id": "inv24",
        "number": "INV-2026-024",
        "date": "18 Feb 2026",
        "type": "Tax Invoice",
        "status": "Paid",
        "customerId": "p7",
        "customerName": "Party 7 Traders",
        "items": [
            {
                "id": "i14-inv24",
                "productId": "i14",
                "name": "Annual Maintenance Contract",
                "hsn_sac": "9987",
                "qty": 9,
                "unit": "pcs",
                "rate": 25000,
                "gst_rate": 18,
                "tax_amount": 40500,
                "line_total": 225000
            }
        ],
        "subtotal": 225000,
        "discountAmount": 0,
        "cgstAmount": 20250,
        "sgstAmount": 20250,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 265500
    },
    {
        "id": "inv25",
        "number": "INV-2026-025",
        "date": "02 Jan 2026",
        "type": "Tax Invoice",
        "status": "Overdue",
        "customerId": "p5",
        "customerName": "Party 5 Traders",
        "items": [
            {
                "id": "i5-inv25",
                "productId": "i5",
                "name": "Consulting Fees",
                "hsn_sac": "9983",
                "qty": 1,
                "unit": "pcs",
                "rate": 5000,
                "gst_rate": 18,
                "tax_amount": 900,
                "line_total": 5000
            }
        ],
        "subtotal": 5000,
        "discountAmount": 0,
        "cgstAmount": 450,
        "sgstAmount": 450,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 5900
    }
];

export const PURCHASES: Invoice[] = [
    {
        "id": "po1",
        "number": "PO-2026-001",
        "date": "25 Mar 2026",
        "type": "Vendor Bill",
        "status": "Paid",
        "customerId": "p9",
        "customerName": "Ultra Cement Depot",
        "vendorId": "p9",
        "vendorName": "Ultra Cement Depot",
        "items": [
            {
                "id": "i8-po1",
                "productId": "i8",
                "name": "PVC Pipe 4 Inch",
                "hsn_sac": "3917",
                "qty": 20,
                "unit": "pcs",
                "rate": 1250,
                "gst_rate": 18,
                "tax_amount": 4500,
                "line_total": 25000
            }
        ],
        "subtotal": 25000,
        "discountAmount": 0,
        "cgstAmount": 2250,
        "sgstAmount": 2250,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 29500
    },
    {
        "id": "po2",
        "number": "PO-2026-002",
        "date": "08 Jun 2026",
        "type": "Vendor Bill",
        "status": "Pending",
        "customerId": "p14",
        "customerName": "Party 14 Suppliers",
        "vendorId": "p14",
        "vendorName": "Party 14 Suppliers",
        "items": [
            {
                "id": "i8-po2",
                "productId": "i8",
                "name": "PVC Pipe 4 Inch",
                "hsn_sac": "3917",
                "qty": 16,
                "unit": "pcs",
                "rate": 1250,
                "gst_rate": 18,
                "tax_amount": 3600,
                "line_total": 20000
            }
        ],
        "subtotal": 20000,
        "discountAmount": 0,
        "cgstAmount": 1800,
        "sgstAmount": 1800,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 23600
    },
    {
        "id": "po3",
        "number": "PO-2026-003",
        "date": "04 Feb 2026",
        "type": "Vendor Bill",
        "status": "Paid",
        "customerId": "p9",
        "customerName": "Ultra Cement Depot",
        "vendorId": "p9",
        "vendorName": "Ultra Cement Depot",
        "items": [
            {
                "id": "i2-po3",
                "productId": "i2",
                "name": "Ambuja Cement 50kg",
                "hsn_sac": "2523",
                "qty": 8,
                "unit": "pcs",
                "rate": 380,
                "gst_rate": 28,
                "tax_amount": 851.2,
                "line_total": 3040
            }
        ],
        "subtotal": 3040,
        "discountAmount": 0,
        "cgstAmount": 425.6,
        "sgstAmount": 425.6,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 3891.2
    },
    {
        "id": "po4",
        "number": "PO-2026-004",
        "date": "07 Apr 2026",
        "type": "Vendor Bill",
        "status": "Paid",
        "customerId": "p15",
        "customerName": "Party 15 Suppliers",
        "vendorId": "p15",
        "vendorName": "Party 15 Suppliers",
        "items": [
            {
                "id": "i7-po4",
                "productId": "i7",
                "name": "ACC Cement 50kg",
                "hsn_sac": "2523",
                "qty": 16,
                "unit": "pcs",
                "rate": 395,
                "gst_rate": 28,
                "tax_amount": 1769.6,
                "line_total": 6320
            }
        ],
        "subtotal": 6320,
        "discountAmount": 0,
        "cgstAmount": 884.8,
        "sgstAmount": 884.8,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 8089.6
    },
    {
        "id": "po5",
        "number": "PO-2026-005",
        "date": "24 Jan 2026",
        "type": "Vendor Bill",
        "status": "Paid",
        "customerId": "p9",
        "customerName": "Ultra Cement Depot",
        "vendorId": "p9",
        "vendorName": "Ultra Cement Depot",
        "items": [
            {
                "id": "i6-po5",
                "productId": "i6",
                "name": "TMT Bars 16mm",
                "hsn_sac": "7214",
                "qty": 16,
                "unit": "pcs",
                "rate": 620,
                "gst_rate": 18,
                "tax_amount": 1785.6,
                "line_total": 9920
            }
        ],
        "subtotal": 9920,
        "discountAmount": 0,
        "cgstAmount": 892.8,
        "sgstAmount": 892.8,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 11705.6
    },
    {
        "id": "po6",
        "number": "PO-2026-006",
        "date": "23 Feb 2026",
        "type": "Vendor Bill",
        "status": "Paid",
        "customerId": "p11",
        "customerName": "National Metals",
        "vendorId": "p11",
        "vendorName": "National Metals",
        "items": [
            {
                "id": "i12-po6",
                "productId": "i12",
                "name": "Laser Printer",
                "hsn_sac": "8443",
                "qty": 17,
                "unit": "pcs",
                "rate": 18500,
                "gst_rate": 18,
                "tax_amount": 56610,
                "line_total": 314500
            }
        ],
        "subtotal": 314500,
        "discountAmount": 0,
        "cgstAmount": 28305,
        "sgstAmount": 28305,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 371110
    },
    {
        "id": "po7",
        "number": "PO-2026-007",
        "date": "11 Apr 2026",
        "type": "Vendor Bill",
        "status": "Paid",
        "customerId": "p14",
        "customerName": "Party 14 Suppliers",
        "vendorId": "p14",
        "vendorName": "Party 14 Suppliers",
        "items": [
            {
                "id": "i15-po7",
                "productId": "i15",
                "name": "Business Advisory",
                "hsn_sac": "9983",
                "qty": 24,
                "unit": "pcs",
                "rate": 12000,
                "gst_rate": 18,
                "tax_amount": 51840,
                "line_total": 288000
            }
        ],
        "subtotal": 288000,
        "discountAmount": 0,
        "cgstAmount": 25920,
        "sgstAmount": 25920,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 339840
    },
    {
        "id": "po8",
        "number": "PO-2026-008",
        "date": "10 Jun 2026",
        "type": "Vendor Bill",
        "status": "Draft",
        "customerId": "p13",
        "customerName": "Party 13 Suppliers",
        "vendorId": "p13",
        "vendorName": "Party 13 Suppliers",
        "items": [
            {
                "id": "i15-po8",
                "productId": "i15",
                "name": "Business Advisory",
                "hsn_sac": "9983",
                "qty": 12,
                "unit": "pcs",
                "rate": 12000,
                "gst_rate": 18,
                "tax_amount": 25920,
                "line_total": 144000
            }
        ],
        "subtotal": 144000,
        "discountAmount": 0,
        "cgstAmount": 12960,
        "sgstAmount": 12960,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 169920
    },
    {
        "id": "po9",
        "number": "PO-2026-009",
        "date": "25 Jan 2026",
        "type": "Vendor Bill",
        "status": "Paid",
        "customerId": "p13",
        "customerName": "Party 13 Suppliers",
        "vendorId": "p13",
        "vendorName": "Party 13 Suppliers",
        "items": [
            {
                "id": "i7-po9",
                "productId": "i7",
                "name": "ACC Cement 50kg",
                "hsn_sac": "2523",
                "qty": 12,
                "unit": "pcs",
                "rate": 395,
                "gst_rate": 28,
                "tax_amount": 1327.2,
                "line_total": 4740
            }
        ],
        "subtotal": 4740,
        "discountAmount": 0,
        "cgstAmount": 663.6,
        "sgstAmount": 663.6,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 6067.2
    },
    {
        "id": "po10",
        "number": "PO-2026-010",
        "date": "02 May 2026",
        "type": "Vendor Bill",
        "status": "Pending",
        "customerId": "p14",
        "customerName": "Party 14 Suppliers",
        "vendorId": "p14",
        "vendorName": "Party 14 Suppliers",
        "items": [
            {
                "id": "i6-po10",
                "productId": "i6",
                "name": "TMT Bars 16mm",
                "hsn_sac": "7214",
                "qty": 14,
                "unit": "pcs",
                "rate": 620,
                "gst_rate": 18,
                "tax_amount": 1562.4,
                "line_total": 8680
            }
        ],
        "subtotal": 8680,
        "discountAmount": 0,
        "cgstAmount": 781.2,
        "sgstAmount": 781.2,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 10242.4
    },
    {
        "id": "po11",
        "number": "PO-2026-011",
        "date": "07 May 2026",
        "type": "Vendor Bill",
        "status": "Pending",
        "customerId": "p11",
        "customerName": "National Metals",
        "vendorId": "p11",
        "vendorName": "National Metals",
        "items": [
            {
                "id": "i12-po11",
                "productId": "i12",
                "name": "Laser Printer",
                "hsn_sac": "8443",
                "qty": 18,
                "unit": "pcs",
                "rate": 18500,
                "gst_rate": 18,
                "tax_amount": 59940,
                "line_total": 333000
            }
        ],
        "subtotal": 333000,
        "discountAmount": 0,
        "cgstAmount": 29970,
        "sgstAmount": 29970,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 392940
    },
    {
        "id": "po12",
        "number": "PO-2026-012",
        "date": "01 Jun 2026",
        "type": "Vendor Bill",
        "status": "Paid",
        "customerId": "p12",
        "customerName": "Party 12 Suppliers",
        "vendorId": "p12",
        "vendorName": "Party 12 Suppliers",
        "items": [
            {
                "id": "i8-po12",
                "productId": "i8",
                "name": "PVC Pipe 4 Inch",
                "hsn_sac": "3917",
                "qty": 19,
                "unit": "pcs",
                "rate": 1250,
                "gst_rate": 18,
                "tax_amount": 4275,
                "line_total": 23750
            }
        ],
        "subtotal": 23750,
        "discountAmount": 0,
        "cgstAmount": 2137.5,
        "sgstAmount": 2137.5,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 28025
    },
    {
        "id": "po13",
        "number": "PO-2026-013",
        "date": "01 Mar 2026",
        "type": "Vendor Bill",
        "status": "Draft",
        "customerId": "p14",
        "customerName": "Party 14 Suppliers",
        "vendorId": "p14",
        "vendorName": "Party 14 Suppliers",
        "items": [
            {
                "id": "i3-po13",
                "productId": "i3",
                "name": "Office Chair Ergonomic",
                "hsn_sac": "9401",
                "qty": 18,
                "unit": "pcs",
                "rate": 4500,
                "gst_rate": 18,
                "tax_amount": 14580,
                "line_total": 81000
            }
        ],
        "subtotal": 81000,
        "discountAmount": 0,
        "cgstAmount": 7290,
        "sgstAmount": 7290,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 95580
    },
    {
        "id": "po14",
        "number": "PO-2026-014",
        "date": "04 Apr 2026",
        "type": "Vendor Bill",
        "status": "Paid",
        "customerId": "p9",
        "customerName": "Ultra Cement Depot",
        "vendorId": "p9",
        "vendorName": "Ultra Cement Depot",
        "items": [
            {
                "id": "i7-po14",
                "productId": "i7",
                "name": "ACC Cement 50kg",
                "hsn_sac": "2523",
                "qty": 14,
                "unit": "pcs",
                "rate": 395,
                "gst_rate": 28,
                "tax_amount": 1548.4,
                "line_total": 5530
            }
        ],
        "subtotal": 5530,
        "discountAmount": 0,
        "cgstAmount": 774.2,
        "sgstAmount": 774.2,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 7078.4
    },
    {
        "id": "po15",
        "number": "PO-2026-015",
        "date": "16 May 2026",
        "type": "Vendor Bill",
        "status": "Draft",
        "customerId": "p10",
        "customerName": "Prime Logistics",
        "vendorId": "p10",
        "vendorName": "Prime Logistics",
        "items": [
            {
                "id": "i1-po15",
                "productId": "i1",
                "name": "TMT Bars 12mm",
                "hsn_sac": "7214",
                "qty": 17,
                "unit": "pcs",
                "rate": 450,
                "gst_rate": 18,
                "tax_amount": 1377,
                "line_total": 7650
            }
        ],
        "subtotal": 7650,
        "discountAmount": 0,
        "cgstAmount": 688.5,
        "sgstAmount": 688.5,
        "igstAmount": 0,
        "roundOff": 0,
        "total": 9027
    }
];

export const PAYMENTS: Payment[] = [
    { id: "pay1", date: "16 Jun 2026", amount: 54000, mode: "UPI", type: "in", partyName: "Ramesh Traders" },
    { id: "pay2", date: "10 Jun 2026", amount: 150000, mode: "Bank Transfer", type: "out", partyName: "Tata Steel Wholesale" },
    { id: "pay3", date: "21 Jun 2026", amount: 15000, mode: "Cash", type: "in", partyName: "Gupta Enterprises" }
];

export const EXPENSES: Expense[] = [
    { id: "exp1", date: "01 Jul 2026", category: "Office Supplies", amount: 2500, paymentMode: "UPI", vendorName: "Stationery Mart" }
];
