import { icons } from "./icons";
import { DocumentType, GSTType, PartyType, SalesInvoice, PurchaseOrder, Party, InventoryItem, PaymentRecord, ExpenseRecord } from '../src/types/entities';

export const tabs: AppTab[] = [
    { name: "index", title: "Home", icon: icons.home },
    { name: "subscriptions", title: "Subscriptions", icon: icons.wallet },
    { name: "insights", title: "Insights", icon: icons.activity },
    { name: "settings", title: "Settings", icon: icons.setting },
];

export const HOME_USER = {
    "name": "Anees | Axanees"
};

export const DASHBOARD_BALANCES = [
    {
        "title": "Sales",
        "amountPaise": 36060000,
        "gstAmountPaise": 6490800,
        "currency": "₹"
    },
    {
        "title": "Purchase",
        "amountPaise": 5750000,
        "gstAmountPaise": 0,
        "currency": "₹"
    }
];

export const OUTSTANDING_DATA = [
    {
        "title": "Sales Outstanding",
        "totalReceivablesPaise": 42550800,
        "currency": "₹",
        "items": [
            {
                "label": "CURRENT",
                "amountPaise": 42550800,
                "status": "current"
            },
            {
                "label": "OVERDUE",
                "amountPaise": 0,
                "subtitle": "30+ Days",
                "status": "overdue"
            }
        ]
    },
    {
        "title": "Purchase Outstanding",
        "totalReceivablesPaise": 5750000,
        "currency": "₹",
        "items": [
            {
                "label": "CURRENT",
                "amountPaise": 5750000,
                "status": "current"
            },
            {
                "label": "OVERDUE",
                "amountPaise": 0,
                "subtitle": "1-15 Days",
                "status": "overdue"
            }
        ]
    }
];

export const PARTIES: Party[] = [
    {
        "id": "p1",
        "partyType": "CUSTOMER",
        "legalName": "Ramesh Traders",
        "tradeName": "Ramesh Traders",
        "gstin": "27AADCB2230M1Z2",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 6944400,
        "openingBalanceType": "DEBIT"
    },
    {
        "id": "p2",
        "partyType": "CUSTOMER",
        "legalName": "Tata Steel Wholesale",
        "tradeName": "Tata Steel Wholesale",
        "gstin": "29AAACT2233L1Z6",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 1983900,
        "openingBalanceType": "DEBIT"
    },
    {
        "id": "p3",
        "partyType": "CUSTOMER",
        "legalName": "Patel Hardware",
        "tradeName": "Patel Hardware",
        "gstin": "24AABCP4455N1Z7",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 242600,
        "openingBalanceType": "DEBIT"
    },
    {
        "id": "p4",
        "partyType": "CUSTOMER",
        "legalName": "Sharma & Sons",
        "tradeName": "Sharma & Sons",
        "gstin": "09AAECS8899K1Z4",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 2453700,
        "openingBalanceType": "DEBIT"
    },
    {
        "id": "p5",
        "partyType": "CUSTOMER",
        "legalName": "Party 5 Traders",
        "tradeName": "Party 5 Traders",
        "gstin": "07AAACJ5566R1Z9",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 5091600,
        "openingBalanceType": "DEBIT"
    },
    {
        "id": "p6",
        "partyType": "CUSTOMER",
        "legalName": "Party 6 Traders",
        "tradeName": "Party 6 Traders",
        "gstin": "24AACCP1122A1Z4",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 8595100,
        "openingBalanceType": "DEBIT"
    },
    {
        "id": "p7",
        "partyType": "CUSTOMER",
        "legalName": "Party 7 Traders",
        "tradeName": "Party 7 Traders",
        "gstin": "19AACCN5566B1Z8",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 3402700,
        "openingBalanceType": "DEBIT"
    },
    {
        "id": "p8",
        "partyType": "CUSTOMER",
        "legalName": "Party 8 Traders",
        "tradeName": "Party 8 Traders",
        "gstin": "27AACCU8899T1Z5",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 6699000,
        "openingBalanceType": "DEBIT"
    },
    {
        "id": "p9",
        "partyType": "VENDOR",
        "legalName": "Ultra Cement Depot",
        "tradeName": "Ultra Cement Depot",
        "gstin": "03AABCV1234E1Z1",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 3962700,
        "openingBalanceType": "DEBIT"
    },
    {
        "id": "p10",
        "partyType": "VENDOR",
        "legalName": "Prime Logistics",
        "tradeName": "Prime Logistics",
        "gstin": "06AACCK5678F1Z2",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 4542700,
        "openingBalanceType": "DEBIT"
    },
    {
        "id": "p11",
        "partyType": "VENDOR",
        "legalName": "National Metals",
        "tradeName": "National Metals",
        "gstin": "09AABCP3456H1Z4",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 8743800,
        "openingBalanceType": "DEBIT"
    },
    {
        "id": "p12",
        "partyType": "VENDOR",
        "legalName": "Party 12 Suppliers",
        "tradeName": "Party 12 Suppliers",
        "gstin": "24AACCG7890I1Z5",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 6818000,
        "openingBalanceType": "DEBIT"
    },
    {
        "id": "p13",
        "partyType": "VENDOR",
        "legalName": "Party 13 Suppliers",
        "tradeName": "Party 13 Suppliers",
        "gstin": "27AABCM9012G1Z3",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 7755200,
        "openingBalanceType": "DEBIT"
    },
    {
        "id": "p14",
        "partyType": "VENDOR",
        "legalName": "Party 14 Suppliers",
        "tradeName": "Party 14 Suppliers",
        "gstin": "08AAACM2233K1Z1",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 31600,
        "openingBalanceType": "DEBIT"
    },
    {
        "id": "p15",
        "partyType": "VENDOR",
        "legalName": "Party 15 Suppliers",
        "tradeName": "Party 15 Suppliers",
        "gstin": "24AADCO9988Q1Z3",
        "gstType": "REGULAR",
        "billingAddress": {
            "line1": "Unknown",
            "city": "Unknown",
            "state": "Maharashtra",
            "stateCode": "27",
            "pincode": "000000",
            "country": "India"
        },
        "shippingAddresses": [],
        "contactPersons": [],
        "paymentTermsDays": 30,
        "creditLimitPaise": 0,
        "openingBalancePaise": 3064000,
        "openingBalanceType": "DEBIT"
    }
];

export const ITEMS: InventoryItem[] = [
    {
        "id": "i1",
        "name": "TMT Bars 12mm",
        "type": "product",
        "unitPricePaise": 45000,
        "hsnSacCode": "7214",
        "taxRate": {
            "id": "tr_18",
            "hsnSacCode": "7214",
            "description": "18% Rate",
            "isService": false,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 9,
                "sgstRate": 9,
                "igstRate": 18,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 500,
        "minimumStock": 200
    },
    {
        "id": "i2",
        "name": "Ambuja Cement 50kg",
        "type": "product",
        "unitPricePaise": 38000,
        "hsnSacCode": "2523",
        "taxRate": {
            "id": "tr_28",
            "hsnSacCode": "2523",
            "description": "28% Rate",
            "isService": false,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 14,
                "sgstRate": 14,
                "igstRate": 28,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 10,
        "minimumStock": 50
    },
    {
        "id": "i3",
        "name": "Office Chair Ergonomic",
        "type": "product",
        "unitPricePaise": 450000,
        "hsnSacCode": "9401",
        "taxRate": {
            "id": "tr_18",
            "hsnSacCode": "9401",
            "description": "18% Rate",
            "isService": false,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 9,
                "sgstRate": 9,
                "igstRate": 18,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 45,
        "minimumStock": 20
    },
    {
        "id": "i4",
        "name": "Accounting Software License",
        "type": "service",
        "unitPricePaise": 1500000,
        "hsnSacCode": "9984",
        "taxRate": {
            "id": "tr_18",
            "hsnSacCode": "9984",
            "description": "18% Rate",
            "isService": true,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 9,
                "sgstRate": 9,
                "igstRate": 18,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 0
    },
    {
        "id": "i5",
        "name": "Consulting Fees",
        "type": "service",
        "unitPricePaise": 500000,
        "hsnSacCode": "9983",
        "taxRate": {
            "id": "tr_18",
            "hsnSacCode": "9983",
            "description": "18% Rate",
            "isService": true,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 9,
                "sgstRate": 9,
                "igstRate": 18,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 0
    },
    {
        "id": "i6",
        "name": "TMT Bars 16mm",
        "type": "product",
        "unitPricePaise": 62000,
        "hsnSacCode": "7214",
        "taxRate": {
            "id": "tr_18",
            "hsnSacCode": "7214",
            "description": "18% Rate",
            "isService": false,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 9,
                "sgstRate": 9,
                "igstRate": 18,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 35,
        "minimumStock": 50
    },
    {
        "id": "i7",
        "name": "ACC Cement 50kg",
        "type": "product",
        "unitPricePaise": 39500,
        "hsnSacCode": "2523",
        "taxRate": {
            "id": "tr_28",
            "hsnSacCode": "2523",
            "description": "28% Rate",
            "isService": false,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 14,
                "sgstRate": 14,
                "igstRate": 28,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 980,
        "minimumStock": 100
    },
    {
        "id": "i8",
        "name": "PVC Pipe 4 Inch",
        "type": "product",
        "unitPricePaise": 125000,
        "hsnSacCode": "3917",
        "taxRate": {
            "id": "tr_18",
            "hsnSacCode": "3917",
            "description": "18% Rate",
            "isService": false,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 9,
                "sgstRate": 9,
                "igstRate": 18,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 200,
        "minimumStock": 50
    },
    {
        "id": "i9",
        "name": "Copper Wire Bundle",
        "type": "product",
        "unitPricePaise": 285000,
        "hsnSacCode": "7408",
        "taxRate": {
            "id": "tr_18",
            "hsnSacCode": "7408",
            "description": "18% Rate",
            "isService": false,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 9,
                "sgstRate": 9,
                "igstRate": 18,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 160,
        "minimumStock": 100
    },
    {
        "id": "i10",
        "name": "LED Panel Light",
        "type": "product",
        "unitPricePaise": 95000,
        "hsnSacCode": "9405",
        "taxRate": {
            "id": "tr_12",
            "hsnSacCode": "9405",
            "description": "12% Rate",
            "isService": false,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 6,
                "sgstRate": 6,
                "igstRate": 12,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 5,
        "minimumStock": 20
    },
    {
        "id": "i11",
        "name": "Desktop Computer",
        "type": "product",
        "unitPricePaise": 4200000,
        "hsnSacCode": "8471",
        "taxRate": {
            "id": "tr_18",
            "hsnSacCode": "8471",
            "description": "18% Rate",
            "isService": false,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 9,
                "sgstRate": 9,
                "igstRate": 18,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 20,
        "minimumStock": 10
    },
    {
        "id": "i12",
        "name": "Laser Printer",
        "type": "product",
        "unitPricePaise": 1850000,
        "hsnSacCode": "8443",
        "taxRate": {
            "id": "tr_18",
            "hsnSacCode": "8443",
            "description": "18% Rate",
            "isService": false,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 9,
                "sgstRate": 9,
                "igstRate": 18,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 15,
        "minimumStock": 5
    },
    {
        "id": "i13",
        "name": "GST Filing Service",
        "type": "service",
        "unitPricePaise": 300000,
        "hsnSacCode": "9982",
        "taxRate": {
            "id": "tr_18",
            "hsnSacCode": "9982",
            "description": "18% Rate",
            "isService": true,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 9,
                "sgstRate": 9,
                "igstRate": 18,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 0
    },
    {
        "id": "i14",
        "name": "Annual Maintenance Contract",
        "type": "service",
        "unitPricePaise": 2500000,
        "hsnSacCode": "9987",
        "taxRate": {
            "id": "tr_18",
            "hsnSacCode": "9987",
            "description": "18% Rate",
            "isService": true,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 9,
                "sgstRate": 9,
                "igstRate": 18,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 0
    },
    {
        "id": "i15",
        "name": "Business Advisory",
        "type": "service",
        "unitPricePaise": 1200000,
        "hsnSacCode": "9983",
        "taxRate": {
            "id": "tr_18",
            "hsnSacCode": "9983",
            "description": "18% Rate",
            "isService": true,
            "isActive": true,
            "gstComponent": {
                "cgstRate": 9,
                "sgstRate": 9,
                "igstRate": 18,
                "cessRate": 0
            }
        },
        "unit": "PCS",
        "stock": 0
    }
];

export const INVOICES: SalesInvoice[] = [
    {
        "id": "inv1",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-001",
        "documentDate": "2026-02-15T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p1",
        "partyName": "Ramesh Traders",
        "lineItems": [
            {
                "id": "i1-inv1",
                "description": "TMT Bars 12mm",
                "hsnSacCode": "7214",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "7214",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 5,
                "unitPricePaise": 45000,
                "discountPercent": 0,
                "taxableAmountPaise": 225000,
                "gstAmountPaise": 40500,
                "totalAmountPaise": 265500
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 225000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 20250,
                    "sgstRate": 9,
                    "sgstAmountPaise": 20250,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 225000,
            "totalGSTAmountPaise": 40500,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 225000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 225000,
        "totalGSTAmountPaise": 40500,
        "totalAmountPaise": 265500,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "OVERDUE",
        "createdAt": "2026-06-11T08:45:07.779Z",
        "updatedAt": "2026-06-11T08:45:07.779Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 265500,
        "expectedDeliveryDate": "2026-02-15T18:30:00.000Z"
    },
    {
        "id": "inv2",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-002",
        "documentDate": "2026-04-12T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p3",
        "partyName": "Patel Hardware",
        "lineItems": [
            {
                "id": "i1-inv2",
                "description": "TMT Bars 12mm",
                "hsnSacCode": "7214",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "7214",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 3,
                "unitPricePaise": 45000,
                "discountPercent": 0,
                "taxableAmountPaise": 135000,
                "gstAmountPaise": 24300,
                "totalAmountPaise": 159300
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 135000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 12150,
                    "sgstRate": 9,
                    "sgstAmountPaise": 12150,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 135000,
            "totalGSTAmountPaise": 24300,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 135000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 135000,
        "totalGSTAmountPaise": 24300,
        "totalAmountPaise": 159300,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "OVERDUE",
        "createdAt": "2026-06-11T08:45:07.779Z",
        "updatedAt": "2026-06-11T08:45:07.779Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 159300,
        "expectedDeliveryDate": "2026-04-12T18:30:00.000Z"
    },
    {
        "id": "inv3",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-003",
        "documentDate": "2026-03-13T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p6",
        "partyName": "Party 6 Traders",
        "lineItems": [
            {
                "id": "i8-inv3",
                "description": "PVC Pipe 4 Inch",
                "hsnSacCode": "3917",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "3917",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 7,
                "unitPricePaise": 125000,
                "discountPercent": 0,
                "taxableAmountPaise": 875000,
                "gstAmountPaise": 157500,
                "totalAmountPaise": 1032500
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 875000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 78750,
                    "sgstRate": 9,
                    "sgstAmountPaise": 78750,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 875000,
            "totalGSTAmountPaise": 157500,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 875000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 875000,
        "totalGSTAmountPaise": 157500,
        "totalAmountPaise": 1032500,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "OVERDUE",
        "createdAt": "2026-06-11T08:45:07.779Z",
        "updatedAt": "2026-06-11T08:45:07.779Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 1032500,
        "expectedDeliveryDate": "2026-03-13T18:30:00.000Z"
    },
    {
        "id": "inv4",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-004",
        "documentDate": "2026-01-06T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p7",
        "partyName": "Party 7 Traders",
        "lineItems": [
            {
                "id": "i5-inv4",
                "description": "Consulting Fees",
                "hsnSacCode": "9983",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "9983",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 8,
                "unitPricePaise": 500000,
                "discountPercent": 0,
                "taxableAmountPaise": 4000000,
                "gstAmountPaise": 720000,
                "totalAmountPaise": 4720000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 4000000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 360000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 360000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 4000000,
            "totalGSTAmountPaise": 720000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 4000000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 4000000,
        "totalGSTAmountPaise": 720000,
        "totalAmountPaise": 4720000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PENDING",
        "createdAt": "2026-06-11T08:45:07.779Z",
        "updatedAt": "2026-06-11T08:45:07.779Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 4720000,
        "expectedDeliveryDate": "2026-01-06T18:30:00.000Z"
    },
    {
        "id": "inv5",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-005",
        "documentDate": "2026-04-01T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p7",
        "partyName": "Party 7 Traders",
        "lineItems": [
            {
                "id": "i11-inv5",
                "description": "Desktop Computer",
                "hsnSacCode": "8471",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "8471",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 5,
                "unitPricePaise": 4200000,
                "discountPercent": 0,
                "taxableAmountPaise": 21000000,
                "gstAmountPaise": 3780000,
                "totalAmountPaise": 24780000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 21000000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 1890000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 1890000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 21000000,
            "totalGSTAmountPaise": 3780000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 21000000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 21000000,
        "totalGSTAmountPaise": 3780000,
        "totalAmountPaise": 24780000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.779Z",
        "updatedAt": "2026-06-11T08:45:07.779Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 24780000,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-04-01T18:30:00.000Z"
    },
    {
        "id": "inv6",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-006",
        "documentDate": "2025-12-31T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p2",
        "partyName": "Tata Steel Wholesale",
        "lineItems": [
            {
                "id": "i12-inv6",
                "description": "Laser Printer",
                "hsnSacCode": "8443",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "8443",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 6,
                "unitPricePaise": 1850000,
                "discountPercent": 0,
                "taxableAmountPaise": 11100000,
                "gstAmountPaise": 1998000,
                "totalAmountPaise": 13098000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 11100000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 999000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 999000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 11100000,
            "totalGSTAmountPaise": 1998000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 11100000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 11100000,
        "totalGSTAmountPaise": 1998000,
        "totalAmountPaise": 13098000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "DRAFT",
        "createdAt": "2026-06-11T08:45:07.779Z",
        "updatedAt": "2026-06-11T08:45:07.779Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 13098000,
        "expectedDeliveryDate": "2025-12-31T18:30:00.000Z"
    },
    {
        "id": "inv7",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-007",
        "documentDate": "2026-01-05T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p2",
        "partyName": "Tata Steel Wholesale",
        "lineItems": [
            {
                "id": "i14-inv7",
                "description": "Annual Maintenance Contract",
                "hsnSacCode": "9987",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "9987",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 4,
                "unitPricePaise": 2500000,
                "discountPercent": 0,
                "taxableAmountPaise": 10000000,
                "gstAmountPaise": 1800000,
                "totalAmountPaise": 11800000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 10000000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 900000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 900000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 10000000,
            "totalGSTAmountPaise": 1800000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 10000000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 10000000,
        "totalGSTAmountPaise": 1800000,
        "totalAmountPaise": 11800000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.779Z",
        "updatedAt": "2026-06-11T08:45:07.779Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 11800000,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-01-05T18:30:00.000Z"
    },
    {
        "id": "inv8",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-008",
        "documentDate": "2026-06-25T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p1",
        "partyName": "Ramesh Traders",
        "lineItems": [
            {
                "id": "i13-inv8",
                "description": "GST Filing Service",
                "hsnSacCode": "9982",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "9982",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 3,
                "unitPricePaise": 300000,
                "discountPercent": 0,
                "taxableAmountPaise": 900000,
                "gstAmountPaise": 162000,
                "totalAmountPaise": 1062000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 900000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 81000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 81000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 900000,
            "totalGSTAmountPaise": 162000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 900000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 900000,
        "totalGSTAmountPaise": 162000,
        "totalAmountPaise": 1062000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "OVERDUE",
        "createdAt": "2026-06-11T08:45:07.779Z",
        "updatedAt": "2026-06-11T08:45:07.779Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 1062000,
        "expectedDeliveryDate": "2026-06-25T18:30:00.000Z"
    },
    {
        "id": "inv9",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-009",
        "documentDate": "2026-04-20T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p3",
        "partyName": "Patel Hardware",
        "lineItems": [
            {
                "id": "i14-inv9",
                "description": "Annual Maintenance Contract",
                "hsnSacCode": "9987",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "9987",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 2,
                "unitPricePaise": 2500000,
                "discountPercent": 0,
                "taxableAmountPaise": 5000000,
                "gstAmountPaise": 900000,
                "totalAmountPaise": 5900000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 5000000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 450000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 450000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 5000000,
            "totalGSTAmountPaise": 900000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 5000000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 5000000,
        "totalGSTAmountPaise": 900000,
        "totalAmountPaise": 5900000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PENDING",
        "createdAt": "2026-06-11T08:45:07.779Z",
        "updatedAt": "2026-06-11T08:45:07.779Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 5900000,
        "expectedDeliveryDate": "2026-04-20T18:30:00.000Z"
    },
    {
        "id": "inv10",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-010",
        "documentDate": "2026-05-18T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p2",
        "partyName": "Tata Steel Wholesale",
        "lineItems": [
            {
                "id": "i5-inv10",
                "description": "Consulting Fees",
                "hsnSacCode": "9983",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "9983",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 6,
                "unitPricePaise": 500000,
                "discountPercent": 0,
                "taxableAmountPaise": 3000000,
                "gstAmountPaise": 540000,
                "totalAmountPaise": 3540000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 3000000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 270000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 270000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 3000000,
            "totalGSTAmountPaise": 540000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 3000000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 3000000,
        "totalGSTAmountPaise": 540000,
        "totalAmountPaise": 3540000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 3540000,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-05-18T18:30:00.000Z"
    },
    {
        "id": "inv11",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-011",
        "documentDate": "2026-04-26T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p1",
        "partyName": "Ramesh Traders",
        "lineItems": [
            {
                "id": "i11-inv11",
                "description": "Desktop Computer",
                "hsnSacCode": "8471",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "8471",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 5,
                "unitPricePaise": 4200000,
                "discountPercent": 0,
                "taxableAmountPaise": 21000000,
                "gstAmountPaise": 3780000,
                "totalAmountPaise": 24780000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 21000000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 1890000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 1890000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 21000000,
            "totalGSTAmountPaise": 3780000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 21000000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 21000000,
        "totalGSTAmountPaise": 3780000,
        "totalAmountPaise": 24780000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 24780000,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-04-26T18:30:00.000Z"
    },
    {
        "id": "inv12",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-012",
        "documentDate": "2026-03-01T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p3",
        "partyName": "Patel Hardware",
        "lineItems": [
            {
                "id": "i7-inv12",
                "description": "ACC Cement 50kg",
                "hsnSacCode": "2523",
                "taxRate": {
                    "id": "tr_28",
                    "hsnSacCode": "2523",
                    "description": "28% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 14,
                        "sgstRate": 14,
                        "igstRate": 28,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 1,
                "unitPricePaise": 39500,
                "discountPercent": 0,
                "taxableAmountPaise": 39500,
                "gstAmountPaise": 11060,
                "totalAmountPaise": 50560
            }
        ],
        "gstSummary": {
            "slabs": {
                "28": {
                    "taxableValuePaise": 39500,
                    "cgstRate": 14,
                    "cgstAmountPaise": 5530,
                    "sgstRate": 14,
                    "sgstAmountPaise": 5530,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 39500,
            "totalGSTAmountPaise": 11060,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 39500,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 39500,
        "totalGSTAmountPaise": 11060,
        "totalAmountPaise": 50560,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 50560,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-03-01T18:30:00.000Z"
    },
    {
        "id": "inv13",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-013",
        "documentDate": "2026-04-18T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p1",
        "partyName": "Ramesh Traders",
        "lineItems": [
            {
                "id": "i10-inv13",
                "description": "LED Panel Light",
                "hsnSacCode": "9405",
                "taxRate": {
                    "id": "tr_12",
                    "hsnSacCode": "9405",
                    "description": "12% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 6,
                        "sgstRate": 6,
                        "igstRate": 12,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 3,
                "unitPricePaise": 95000,
                "discountPercent": 0,
                "taxableAmountPaise": 285000,
                "gstAmountPaise": 34200,
                "totalAmountPaise": 319200
            }
        ],
        "gstSummary": {
            "slabs": {
                "12": {
                    "taxableValuePaise": 285000,
                    "cgstRate": 6,
                    "cgstAmountPaise": 17100,
                    "sgstRate": 6,
                    "sgstAmountPaise": 17100,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 285000,
            "totalGSTAmountPaise": 34200,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 285000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 285000,
        "totalGSTAmountPaise": 34200,
        "totalAmountPaise": 319200,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "OVERDUE",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 319200,
        "expectedDeliveryDate": "2026-04-18T18:30:00.000Z"
    },
    {
        "id": "inv14",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-014",
        "documentDate": "2026-04-09T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p1",
        "partyName": "Ramesh Traders",
        "lineItems": [
            {
                "id": "i1-inv14",
                "description": "TMT Bars 12mm",
                "hsnSacCode": "7214",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "7214",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 9,
                "unitPricePaise": 45000,
                "discountPercent": 0,
                "taxableAmountPaise": 405000,
                "gstAmountPaise": 72900,
                "totalAmountPaise": 477900
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 405000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 36450,
                    "sgstRate": 9,
                    "sgstAmountPaise": 36450,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 405000,
            "totalGSTAmountPaise": 72900,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 405000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 405000,
        "totalGSTAmountPaise": 72900,
        "totalAmountPaise": 477900,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PENDING",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 477900,
        "expectedDeliveryDate": "2026-04-09T18:30:00.000Z"
    },
    {
        "id": "inv15",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-015",
        "documentDate": "2026-06-05T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p6",
        "partyName": "Party 6 Traders",
        "lineItems": [
            {
                "id": "i14-inv15",
                "description": "Annual Maintenance Contract",
                "hsnSacCode": "9987",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "9987",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 10,
                "unitPricePaise": 2500000,
                "discountPercent": 0,
                "taxableAmountPaise": 25000000,
                "gstAmountPaise": 4500000,
                "totalAmountPaise": 29500000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 25000000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 2250000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 2250000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 25000000,
            "totalGSTAmountPaise": 4500000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 25000000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 25000000,
        "totalGSTAmountPaise": 4500000,
        "totalAmountPaise": 29500000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 29500000,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-06-05T18:30:00.000Z"
    },
    {
        "id": "inv16",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-016",
        "documentDate": "2026-03-18T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p5",
        "partyName": "Party 5 Traders",
        "lineItems": [
            {
                "id": "i4-inv16",
                "description": "Accounting Software License",
                "hsnSacCode": "9984",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "9984",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 4,
                "unitPricePaise": 1500000,
                "discountPercent": 0,
                "taxableAmountPaise": 6000000,
                "gstAmountPaise": 1080000,
                "totalAmountPaise": 7080000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 6000000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 540000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 540000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 6000000,
            "totalGSTAmountPaise": 1080000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 6000000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 6000000,
        "totalGSTAmountPaise": 1080000,
        "totalAmountPaise": 7080000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PENDING",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 7080000,
        "expectedDeliveryDate": "2026-03-18T18:30:00.000Z"
    },
    {
        "id": "inv17",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-017",
        "documentDate": "2026-05-03T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p5",
        "partyName": "Party 5 Traders",
        "lineItems": [
            {
                "id": "i15-inv17",
                "description": "Business Advisory",
                "hsnSacCode": "9983",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "9983",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 8,
                "unitPricePaise": 1200000,
                "discountPercent": 0,
                "taxableAmountPaise": 9600000,
                "gstAmountPaise": 1728000,
                "totalAmountPaise": 11328000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 9600000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 864000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 864000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 9600000,
            "totalGSTAmountPaise": 1728000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 9600000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 9600000,
        "totalGSTAmountPaise": 1728000,
        "totalAmountPaise": 11328000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 11328000,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-05-03T18:30:00.000Z"
    },
    {
        "id": "inv18",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-018",
        "documentDate": "2026-05-04T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p5",
        "partyName": "Party 5 Traders",
        "lineItems": [
            {
                "id": "i11-inv18",
                "description": "Desktop Computer",
                "hsnSacCode": "8471",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "8471",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 4,
                "unitPricePaise": 4200000,
                "discountPercent": 0,
                "taxableAmountPaise": 16800000,
                "gstAmountPaise": 3024000,
                "totalAmountPaise": 19824000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 16800000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 1512000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 1512000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 16800000,
            "totalGSTAmountPaise": 3024000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 16800000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 16800000,
        "totalGSTAmountPaise": 3024000,
        "totalAmountPaise": 19824000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "OVERDUE",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 19824000,
        "expectedDeliveryDate": "2026-05-04T18:30:00.000Z"
    },
    {
        "id": "inv19",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-019",
        "documentDate": "2026-05-20T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p1",
        "partyName": "Ramesh Traders",
        "lineItems": [
            {
                "id": "i12-inv19",
                "description": "Laser Printer",
                "hsnSacCode": "8443",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "8443",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 10,
                "unitPricePaise": 1850000,
                "discountPercent": 0,
                "taxableAmountPaise": 18500000,
                "gstAmountPaise": 3330000,
                "totalAmountPaise": 21830000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 18500000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 1665000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 1665000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 18500000,
            "totalGSTAmountPaise": 3330000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 18500000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 18500000,
        "totalGSTAmountPaise": 3330000,
        "totalAmountPaise": 21830000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PENDING",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 21830000,
        "expectedDeliveryDate": "2026-05-20T18:30:00.000Z"
    },
    {
        "id": "inv20",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-020",
        "documentDate": "2026-04-09T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p1",
        "partyName": "Ramesh Traders",
        "lineItems": [
            {
                "id": "i9-inv20",
                "description": "Copper Wire Bundle",
                "hsnSacCode": "7408",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "7408",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 9,
                "unitPricePaise": 285000,
                "discountPercent": 0,
                "taxableAmountPaise": 2565000,
                "gstAmountPaise": 461700,
                "totalAmountPaise": 3026700
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 2565000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 230850,
                    "sgstRate": 9,
                    "sgstAmountPaise": 230850,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 2565000,
            "totalGSTAmountPaise": 461700,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 2565000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 2565000,
        "totalGSTAmountPaise": 461700,
        "totalAmountPaise": 3026700,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 3026700,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-04-09T18:30:00.000Z"
    },
    {
        "id": "inv21",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-021",
        "documentDate": "2026-03-13T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p5",
        "partyName": "Party 5 Traders",
        "lineItems": [
            {
                "id": "i10-inv21",
                "description": "LED Panel Light",
                "hsnSacCode": "9405",
                "taxRate": {
                    "id": "tr_12",
                    "hsnSacCode": "9405",
                    "description": "12% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 6,
                        "sgstRate": 6,
                        "igstRate": 12,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 8,
                "unitPricePaise": 95000,
                "discountPercent": 0,
                "taxableAmountPaise": 760000,
                "gstAmountPaise": 91200,
                "totalAmountPaise": 851200
            }
        ],
        "gstSummary": {
            "slabs": {
                "12": {
                    "taxableValuePaise": 760000,
                    "cgstRate": 6,
                    "cgstAmountPaise": 45600,
                    "sgstRate": 6,
                    "sgstAmountPaise": 45600,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 760000,
            "totalGSTAmountPaise": 91200,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 760000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 760000,
        "totalGSTAmountPaise": 91200,
        "totalAmountPaise": 851200,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PENDING",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 851200,
        "expectedDeliveryDate": "2026-03-13T18:30:00.000Z"
    },
    {
        "id": "inv22",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-022",
        "documentDate": "2026-04-21T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p7",
        "partyName": "Party 7 Traders",
        "lineItems": [
            {
                "id": "i10-inv22",
                "description": "LED Panel Light",
                "hsnSacCode": "9405",
                "taxRate": {
                    "id": "tr_12",
                    "hsnSacCode": "9405",
                    "description": "12% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 6,
                        "sgstRate": 6,
                        "igstRate": 12,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 3,
                "unitPricePaise": 95000,
                "discountPercent": 0,
                "taxableAmountPaise": 285000,
                "gstAmountPaise": 34200,
                "totalAmountPaise": 319200
            }
        ],
        "gstSummary": {
            "slabs": {
                "12": {
                    "taxableValuePaise": 285000,
                    "cgstRate": 6,
                    "cgstAmountPaise": 17100,
                    "sgstRate": 6,
                    "sgstAmountPaise": 17100,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 285000,
            "totalGSTAmountPaise": 34200,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 285000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 285000,
        "totalGSTAmountPaise": 34200,
        "totalAmountPaise": 319200,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 319200,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-04-21T18:30:00.000Z"
    },
    {
        "id": "inv23",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-023",
        "documentDate": "2026-04-09T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p4",
        "partyName": "Sharma & Sons",
        "lineItems": [
            {
                "id": "i9-inv23",
                "description": "Copper Wire Bundle",
                "hsnSacCode": "7408",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "7408",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 4,
                "unitPricePaise": 285000,
                "discountPercent": 0,
                "taxableAmountPaise": 1140000,
                "gstAmountPaise": 205200,
                "totalAmountPaise": 1345200
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 1140000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 102600,
                    "sgstRate": 9,
                    "sgstAmountPaise": 102600,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 1140000,
            "totalGSTAmountPaise": 205200,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 1140000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 1140000,
        "totalGSTAmountPaise": 205200,
        "totalAmountPaise": 1345200,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 1345200,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-04-09T18:30:00.000Z"
    },
    {
        "id": "inv24",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-024",
        "documentDate": "2026-02-17T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p7",
        "partyName": "Party 7 Traders",
        "lineItems": [
            {
                "id": "i14-inv24",
                "description": "Annual Maintenance Contract",
                "hsnSacCode": "9987",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "9987",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 9,
                "unitPricePaise": 2500000,
                "discountPercent": 0,
                "taxableAmountPaise": 22500000,
                "gstAmountPaise": 4050000,
                "totalAmountPaise": 26550000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 22500000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 2025000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 2025000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 22500000,
            "totalGSTAmountPaise": 4050000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 22500000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 22500000,
        "totalGSTAmountPaise": 4050000,
        "totalAmountPaise": 26550000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 26550000,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-02-17T18:30:00.000Z"
    },
    {
        "id": "inv25",
        "documentType": "SALES_INVOICE",
        "documentNumber": "INV-2026-025",
        "documentDate": "2026-01-01T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p5",
        "partyName": "Party 5 Traders",
        "lineItems": [
            {
                "id": "i5-inv25",
                "description": "Consulting Fees",
                "hsnSacCode": "9983",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "9983",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 1,
                "unitPricePaise": 500000,
                "discountPercent": 0,
                "taxableAmountPaise": 500000,
                "gstAmountPaise": 90000,
                "totalAmountPaise": 590000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 500000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 45000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 45000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 500000,
            "totalGSTAmountPaise": 90000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 500000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 500000,
        "totalGSTAmountPaise": 90000,
        "totalAmountPaise": 590000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "OVERDUE",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 590000,
        "expectedDeliveryDate": "2026-01-01T18:30:00.000Z"
    }
];

export const PURCHASES: PurchaseOrder[] = [
    {
        "id": "po1",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-001",
        "documentDate": "2026-03-24T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p9",
        "partyName": "Ultra Cement Depot",
        "lineItems": [
            {
                "id": "i8-po1",
                "description": "PVC Pipe 4 Inch",
                "hsnSacCode": "3917",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "3917",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 20,
                "unitPricePaise": 125000,
                "discountPercent": 0,
                "taxableAmountPaise": 2500000,
                "gstAmountPaise": 450000,
                "totalAmountPaise": 2950000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 2500000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 225000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 225000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 2500000,
            "totalGSTAmountPaise": 450000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 2500000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 2500000,
        "totalGSTAmountPaise": 450000,
        "totalAmountPaise": 2950000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 2950000,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-03-24T18:30:00.000Z"
    },
    {
        "id": "po2",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-002",
        "documentDate": "2026-06-07T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p14",
        "partyName": "Party 14 Suppliers",
        "lineItems": [
            {
                "id": "i8-po2",
                "description": "PVC Pipe 4 Inch",
                "hsnSacCode": "3917",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "3917",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 16,
                "unitPricePaise": 125000,
                "discountPercent": 0,
                "taxableAmountPaise": 2000000,
                "gstAmountPaise": 360000,
                "totalAmountPaise": 2360000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 2000000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 180000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 180000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 2000000,
            "totalGSTAmountPaise": 360000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 2000000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 2000000,
        "totalGSTAmountPaise": 360000,
        "totalAmountPaise": 2360000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PENDING",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 2360000,
        "expectedDeliveryDate": "2026-06-07T18:30:00.000Z"
    },
    {
        "id": "po3",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-003",
        "documentDate": "2026-02-03T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p9",
        "partyName": "Ultra Cement Depot",
        "lineItems": [
            {
                "id": "i2-po3",
                "description": "Ambuja Cement 50kg",
                "hsnSacCode": "2523",
                "taxRate": {
                    "id": "tr_28",
                    "hsnSacCode": "2523",
                    "description": "28% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 14,
                        "sgstRate": 14,
                        "igstRate": 28,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 8,
                "unitPricePaise": 38000,
                "discountPercent": 0,
                "taxableAmountPaise": 304000,
                "gstAmountPaise": 85120,
                "totalAmountPaise": 389120
            }
        ],
        "gstSummary": {
            "slabs": {
                "28": {
                    "taxableValuePaise": 304000,
                    "cgstRate": 14,
                    "cgstAmountPaise": 42560,
                    "sgstRate": 14,
                    "sgstAmountPaise": 42560,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 304000,
            "totalGSTAmountPaise": 85120,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 304000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 304000,
        "totalGSTAmountPaise": 85120,
        "totalAmountPaise": 389120,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 389120,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-02-03T18:30:00.000Z"
    },
    {
        "id": "po4",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-004",
        "documentDate": "2026-04-06T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p15",
        "partyName": "Party 15 Suppliers",
        "lineItems": [
            {
                "id": "i7-po4",
                "description": "ACC Cement 50kg",
                "hsnSacCode": "2523",
                "taxRate": {
                    "id": "tr_28",
                    "hsnSacCode": "2523",
                    "description": "28% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 14,
                        "sgstRate": 14,
                        "igstRate": 28,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 16,
                "unitPricePaise": 39500,
                "discountPercent": 0,
                "taxableAmountPaise": 632000,
                "gstAmountPaise": 176960,
                "totalAmountPaise": 808960
            }
        ],
        "gstSummary": {
            "slabs": {
                "28": {
                    "taxableValuePaise": 632000,
                    "cgstRate": 14,
                    "cgstAmountPaise": 88480,
                    "sgstRate": 14,
                    "sgstAmountPaise": 88480,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 632000,
            "totalGSTAmountPaise": 176960,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 632000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 632000,
        "totalGSTAmountPaise": 176960,
        "totalAmountPaise": 808960,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 808960,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-04-06T18:30:00.000Z"
    },
    {
        "id": "po5",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-005",
        "documentDate": "2026-01-23T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p9",
        "partyName": "Ultra Cement Depot",
        "lineItems": [
            {
                "id": "i6-po5",
                "description": "TMT Bars 16mm",
                "hsnSacCode": "7214",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "7214",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 16,
                "unitPricePaise": 62000,
                "discountPercent": 0,
                "taxableAmountPaise": 992000,
                "gstAmountPaise": 178560,
                "totalAmountPaise": 1170560
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 992000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 89280,
                    "sgstRate": 9,
                    "sgstAmountPaise": 89280,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 992000,
            "totalGSTAmountPaise": 178560,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 992000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 992000,
        "totalGSTAmountPaise": 178560,
        "totalAmountPaise": 1170560,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 1170560,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-01-23T18:30:00.000Z"
    },
    {
        "id": "po6",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-006",
        "documentDate": "2026-02-22T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p11",
        "partyName": "National Metals",
        "lineItems": [
            {
                "id": "i12-po6",
                "description": "Laser Printer",
                "hsnSacCode": "8443",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "8443",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 17,
                "unitPricePaise": 1850000,
                "discountPercent": 0,
                "taxableAmountPaise": 31450000,
                "gstAmountPaise": 5661000,
                "totalAmountPaise": 37111000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 31450000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 2830500,
                    "sgstRate": 9,
                    "sgstAmountPaise": 2830500,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 31450000,
            "totalGSTAmountPaise": 5661000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 31450000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 31450000,
        "totalGSTAmountPaise": 5661000,
        "totalAmountPaise": 37111000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 37111000,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-02-22T18:30:00.000Z"
    },
    {
        "id": "po7",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-007",
        "documentDate": "2026-04-10T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p14",
        "partyName": "Party 14 Suppliers",
        "lineItems": [
            {
                "id": "i15-po7",
                "description": "Business Advisory",
                "hsnSacCode": "9983",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "9983",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 24,
                "unitPricePaise": 1200000,
                "discountPercent": 0,
                "taxableAmountPaise": 28800000,
                "gstAmountPaise": 5184000,
                "totalAmountPaise": 33984000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 28800000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 2592000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 2592000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 28800000,
            "totalGSTAmountPaise": 5184000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 28800000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 28800000,
        "totalGSTAmountPaise": 5184000,
        "totalAmountPaise": 33984000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 33984000,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-04-10T18:30:00.000Z"
    },
    {
        "id": "po8",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-008",
        "documentDate": "2026-06-09T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p13",
        "partyName": "Party 13 Suppliers",
        "lineItems": [
            {
                "id": "i15-po8",
                "description": "Business Advisory",
                "hsnSacCode": "9983",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "9983",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 12,
                "unitPricePaise": 1200000,
                "discountPercent": 0,
                "taxableAmountPaise": 14400000,
                "gstAmountPaise": 2592000,
                "totalAmountPaise": 16992000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 14400000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 1296000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 1296000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 14400000,
            "totalGSTAmountPaise": 2592000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 14400000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 14400000,
        "totalGSTAmountPaise": 2592000,
        "totalAmountPaise": 16992000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "DRAFT",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 16992000,
        "expectedDeliveryDate": "2026-06-09T18:30:00.000Z"
    },
    {
        "id": "po9",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-009",
        "documentDate": "2026-01-24T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p13",
        "partyName": "Party 13 Suppliers",
        "lineItems": [
            {
                "id": "i7-po9",
                "description": "ACC Cement 50kg",
                "hsnSacCode": "2523",
                "taxRate": {
                    "id": "tr_28",
                    "hsnSacCode": "2523",
                    "description": "28% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 14,
                        "sgstRate": 14,
                        "igstRate": 28,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 12,
                "unitPricePaise": 39500,
                "discountPercent": 0,
                "taxableAmountPaise": 474000,
                "gstAmountPaise": 132720,
                "totalAmountPaise": 606720
            }
        ],
        "gstSummary": {
            "slabs": {
                "28": {
                    "taxableValuePaise": 474000,
                    "cgstRate": 14,
                    "cgstAmountPaise": 66360,
                    "sgstRate": 14,
                    "sgstAmountPaise": 66360,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 474000,
            "totalGSTAmountPaise": 132720,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 474000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 474000,
        "totalGSTAmountPaise": 132720,
        "totalAmountPaise": 606720,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 606720,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-01-24T18:30:00.000Z"
    },
    {
        "id": "po10",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-010",
        "documentDate": "2026-05-01T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p14",
        "partyName": "Party 14 Suppliers",
        "lineItems": [
            {
                "id": "i6-po10",
                "description": "TMT Bars 16mm",
                "hsnSacCode": "7214",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "7214",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 14,
                "unitPricePaise": 62000,
                "discountPercent": 0,
                "taxableAmountPaise": 868000,
                "gstAmountPaise": 156240,
                "totalAmountPaise": 1024240
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 868000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 78120,
                    "sgstRate": 9,
                    "sgstAmountPaise": 78120,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 868000,
            "totalGSTAmountPaise": 156240,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 868000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 868000,
        "totalGSTAmountPaise": 156240,
        "totalAmountPaise": 1024240,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PENDING",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 1024240,
        "expectedDeliveryDate": "2026-05-01T18:30:00.000Z"
    },
    {
        "id": "po11",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-011",
        "documentDate": "2026-05-06T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p11",
        "partyName": "National Metals",
        "lineItems": [
            {
                "id": "i12-po11",
                "description": "Laser Printer",
                "hsnSacCode": "8443",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "8443",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 18,
                "unitPricePaise": 1850000,
                "discountPercent": 0,
                "taxableAmountPaise": 33300000,
                "gstAmountPaise": 5994000,
                "totalAmountPaise": 39294000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 33300000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 2997000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 2997000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 33300000,
            "totalGSTAmountPaise": 5994000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 33300000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 33300000,
        "totalGSTAmountPaise": 5994000,
        "totalAmountPaise": 39294000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PENDING",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 39294000,
        "expectedDeliveryDate": "2026-05-06T18:30:00.000Z"
    },
    {
        "id": "po12",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-012",
        "documentDate": "2026-05-31T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p12",
        "partyName": "Party 12 Suppliers",
        "lineItems": [
            {
                "id": "i8-po12",
                "description": "PVC Pipe 4 Inch",
                "hsnSacCode": "3917",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "3917",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 19,
                "unitPricePaise": 125000,
                "discountPercent": 0,
                "taxableAmountPaise": 2375000,
                "gstAmountPaise": 427500,
                "totalAmountPaise": 2802500
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 2375000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 213750,
                    "sgstRate": 9,
                    "sgstAmountPaise": 213750,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 2375000,
            "totalGSTAmountPaise": 427500,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 2375000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 2375000,
        "totalGSTAmountPaise": 427500,
        "totalAmountPaise": 2802500,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 2802500,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-05-31T18:30:00.000Z"
    },
    {
        "id": "po13",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-013",
        "documentDate": "2026-02-28T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p14",
        "partyName": "Party 14 Suppliers",
        "lineItems": [
            {
                "id": "i3-po13",
                "description": "Office Chair Ergonomic",
                "hsnSacCode": "9401",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "9401",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 18,
                "unitPricePaise": 450000,
                "discountPercent": 0,
                "taxableAmountPaise": 8100000,
                "gstAmountPaise": 1458000,
                "totalAmountPaise": 9558000
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 8100000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 729000,
                    "sgstRate": 9,
                    "sgstAmountPaise": 729000,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 8100000,
            "totalGSTAmountPaise": 1458000,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 8100000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 8100000,
        "totalGSTAmountPaise": 1458000,
        "totalAmountPaise": 9558000,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "DRAFT",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 9558000,
        "expectedDeliveryDate": "2026-02-28T18:30:00.000Z"
    },
    {
        "id": "po14",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-014",
        "documentDate": "2026-04-03T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p9",
        "partyName": "Ultra Cement Depot",
        "lineItems": [
            {
                "id": "i7-po14",
                "description": "ACC Cement 50kg",
                "hsnSacCode": "2523",
                "taxRate": {
                    "id": "tr_28",
                    "hsnSacCode": "2523",
                    "description": "28% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 14,
                        "sgstRate": 14,
                        "igstRate": 28,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 14,
                "unitPricePaise": 39500,
                "discountPercent": 0,
                "taxableAmountPaise": 553000,
                "gstAmountPaise": 154840,
                "totalAmountPaise": 707840
            }
        ],
        "gstSummary": {
            "slabs": {
                "28": {
                    "taxableValuePaise": 553000,
                    "cgstRate": 14,
                    "cgstAmountPaise": 77420,
                    "sgstRate": 14,
                    "sgstAmountPaise": 77420,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 553000,
            "totalGSTAmountPaise": 154840,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 553000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 553000,
        "totalGSTAmountPaise": 154840,
        "totalAmountPaise": 707840,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "PAID",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 707840,
        "balanceDuePaise": 0,
        "expectedDeliveryDate": "2026-04-03T18:30:00.000Z"
    },
    {
        "id": "po15",
        "documentType": "PURCHASE_ORDER",
        "documentNumber": "PO-2026-015",
        "documentDate": "2026-05-15T18:30:00.000Z",
        "businessId": "b1",
        "partyId": "p10",
        "partyName": "Prime Logistics",
        "lineItems": [
            {
                "id": "i1-po15",
                "description": "TMT Bars 12mm",
                "hsnSacCode": "7214",
                "taxRate": {
                    "id": "tr_18",
                    "hsnSacCode": "7214",
                    "description": "18% Rate",
                    "isService": false,
                    "isActive": true,
                    "gstComponent": {
                        "cgstRate": 9,
                        "sgstRate": 9,
                        "igstRate": 18,
                        "cessRate": 0
                    }
                },
                "unit": "pcs",
                "quantityDecimal": 17,
                "unitPricePaise": 45000,
                "discountPercent": 0,
                "taxableAmountPaise": 765000,
                "gstAmountPaise": 137700,
                "totalAmountPaise": 902700
            }
        ],
        "gstSummary": {
            "slabs": {
                "18": {
                    "taxableValuePaise": 765000,
                    "cgstRate": 9,
                    "cgstAmountPaise": 68850,
                    "sgstRate": 9,
                    "sgstAmountPaise": 68850,
                    "igstRate": 0,
                    "igstAmountPaise": 0,
                    "cessRate": 0,
                    "cessAmountPaise": 0
                }
            },
            "totalTaxableValuePaise": 765000,
            "totalGSTAmountPaise": 137700,
            "totalCessAmountPaise": 0
        },
        "subtotalPaise": 765000,
        "totalDiscountPaise": 0,
        "totalTaxableAmountPaise": 765000,
        "totalGSTAmountPaise": 137700,
        "totalAmountPaise": 902700,
        "totalAmountInWords": "",
        "isInterState": false,
        "placeOfSupply": "Maharashtra",
        "status": "DRAFT",
        "createdAt": "2026-06-11T08:45:07.780Z",
        "updatedAt": "2026-06-11T08:45:07.780Z",
        "paymentMode": "UPI",
        "paidAmountPaise": 0,
        "balanceDuePaise": 902700,
        "expectedDeliveryDate": "2026-05-15T18:30:00.000Z"
    }
];

export const EXPENSES: ExpenseRecord[] = [
    {
        "id": "exp1",
        "date": "2026-06-30T18:30:00.000Z",
        "category": "Office Supplies",
        "amountPaise": 250000,
        "paymentMode": "UPI",
        "vendorName": "Stationery Mart"
    }
];

export const PAYMENTS: PaymentRecord[] = [
    {
        "id": "pay1",
        "date": "2026-06-15T18:30:00.000Z",
        "amountPaise": 5400000,
        "mode": "UPI",
        "type": "in",
        "partyId": "p1",
        "partyName": "Ramesh Traders"
    },
    {
        "id": "pay2",
        "date": "2026-06-09T18:30:00.000Z",
        "amountPaise": 15000000,
        "mode": "Bank Transfer",
        "type": "out",
        "partyId": "p1",
        "partyName": "Tata Steel Wholesale"
    },
    {
        "id": "pay3",
        "date": "2026-06-20T18:30:00.000Z",
        "amountPaise": 1500000,
        "mode": "Cash",
        "type": "in",
        "partyId": "p1",
        "partyName": "Gupta Enterprises"
    }
];

