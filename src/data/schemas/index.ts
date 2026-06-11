import { z } from 'zod';
import { DocumentType, GSTType, PartyType } from '../../types/entities';

export const AddressSchema = z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    stateCode: z.string(),
    pincode: z.string(),
    country: z.string()
});

export const BankDetailsSchema = z.object({
    bankName: z.string(),
    accountNumber: z.string(),
    ifscCode: z.string(),
    branch: z.string(),
    accountType: z.enum(['SAVINGS', 'CURRENT', 'OD'])
});

export const BusinessSchema = z.object({
    id: z.string(),
    legalName: z.string(),
    tradeName: z.string().optional(),
    gstin: z.string(),
    pan: z.string(),
    gstType: z.nativeEnum(GSTType),
    address: AddressSchema,
    shippingAddresses: z.array(AddressSchema),
    phone: z.string(),
    email: z.string(),
    logoUri: z.string().optional(),
    signatureUri: z.string().optional(),
    bankDetails: z.array(BankDetailsSchema),
    upiVpa: z.string().optional(),
    fiscalYearStart: z.enum(['APRIL', 'JANUARY']),
    defaultCurrency: z.literal('INR')
});

export const ContactPersonSchema = z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    designation: z.string().optional(),
    isPrimary: z.boolean()
});

export const PartySchema = z.object({
    id: z.string(),
    partyType: z.nativeEnum(PartyType),
    legalName: z.string(),
    tradeName: z.string().optional(),
    gstin: z.string().optional(),
    pan: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    gstType: z.nativeEnum(GSTType),
    billingAddress: AddressSchema,
    shippingAddresses: z.array(AddressSchema),
    contactPersons: z.array(ContactPersonSchema),
    paymentTermsDays: z.number(),
    creditLimitPaise: z.number().int(),
    openingBalancePaise: z.number().int(),
    openingBalanceType: z.enum(['DEBIT', 'CREDIT']),
    notes: z.string().optional()
});

export const GSTComponentSchema = z.object({
    cgstRate: z.number(),
    sgstRate: z.number(),
    igstRate: z.number(),
    cessRate: z.number()
});

export const TaxRateSchema = z.object({
    id: z.string(),
    hsnSacCode: z.string(),
    description: z.string(),
    gstComponent: GSTComponentSchema,
    isService: z.boolean(),
    isActive: z.boolean()
});

export const LineItemSchema = z.object({
    id: z.string(),
    description: z.string(),
    hsnSacCode: z.string(),
    taxRate: TaxRateSchema,
    unit: z.string(),
    quantityDecimal: z.number(),
    unitPricePaise: z.number().int(),
    discountPercent: z.number(),
    taxableAmountPaise: z.number().int(),
    gstAmountPaise: z.number().int(),
    totalAmountPaise: z.number().int(),
    notes: z.string().optional()
});

export const GSTSlabSchema = z.object({
    taxableValuePaise: z.number().int(),
    cgstRate: z.number(),
    cgstAmountPaise: z.number().int(),
    sgstRate: z.number(),
    sgstAmountPaise: z.number().int(),
    igstRate: z.number(),
    igstAmountPaise: z.number().int(),
    cessRate: z.number(),
    cessAmountPaise: z.number().int()
});

export const GSTSummarySchema = z.object({
    slabs: z.record(z.string(), GSTSlabSchema),
    totalTaxableValuePaise: z.number().int(),
    totalGSTAmountPaise: z.number().int(),
    totalCessAmountPaise: z.number().int()
});

export const IRNDetailsSchema = z.object({
    irn: z.string(),
    ackNo: z.string(),
    ackDate: z.string(),
    signedQRCode: z.string(),
    status: z.enum(['ACTIVE', 'CANCELLED'])
});

export const DocumentBaseSchema = z.object({
    id: z.string(),
    documentType: z.nativeEnum(DocumentType),
    documentNumber: z.string(),
    documentDate: z.string(),
    dueDate: z.string().optional(),
    businessId: z.string(),
    partyId: z.string(),
    partyName: z.string(),
    lineItems: z.array(LineItemSchema),
    gstSummary: GSTSummarySchema,
    subtotalPaise: z.number().int(),
    totalDiscountPaise: z.number().int(),
    totalTaxableAmountPaise: z.number().int(),
    totalGSTAmountPaise: z.number().int(),
    totalAmountPaise: z.number().int(),
    totalAmountInWords: z.string(),
    notes: z.string().optional(),
    termsAndConditions: z.string().optional(),
    isInterState: z.boolean(),
    placeOfSupply: z.string(),
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    irnDetails: IRNDetailsSchema.optional()
});

export const SalesInvoiceSchema = DocumentBaseSchema.extend({
    documentType: z.literal(DocumentType.SALES_INVOICE),
    paymentMode: z.string(),
    paidAmountPaise: z.number().int(),
    balanceDuePaise: z.number().int(),
    eWayBillNumber: z.string().optional()
});

export const PurchaseOrderSchema = DocumentBaseSchema.extend({
    documentType: z.literal(DocumentType.PURCHASE_ORDER),
    expectedDeliveryDate: z.string(),
    vendorQuoteNumber: z.string().optional()
});

export const CreditNoteSchema = DocumentBaseSchema.extend({
    documentType: z.literal(DocumentType.CREDIT_NOTE),
    originalInvoiceId: z.string(),
    reason: z.string()
});

export const DeliveryChallanSchema = DocumentBaseSchema.extend({
    documentType: z.literal(DocumentType.DELIVERY_CHALLAN),
    vehicleNumber: z.string().optional(),
    transporterName: z.string().optional(),
    dispatchDate: z.string()
});

export const InventoryItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['product', 'service']),
    unitPricePaise: z.number().int(),
    purchasePricePaise: z.number().int().optional(),
    hsnSacCode: z.string(),
    taxRate: TaxRateSchema,
    unit: z.string(),
    stock: z.number(),
    minimumStock: z.number().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    description: z.string().optional()
});

export const PaymentRecordSchema = z.object({
    id: z.string(),
    date: z.string(),
    amountPaise: z.number().int(),
    mode: z.enum(['UPI', 'Bank Transfer', 'Cash', 'NEFT', 'RTGS', 'Cheque']),
    type: z.enum(['in', 'out']),
    partyId: z.string(),
    partyName: z.string()
});

export const ExpenseRecordSchema = z.object({
    id: z.string(),
    date: z.string(),
    category: z.string(),
    amountPaise: z.number().int(),
    paymentMode: z.enum(['UPI', 'Bank Transfer', 'Cash', 'Credit Card', 'Debit Card']),
    vendorName: z.string().optional(),
    notes: z.string().optional(),
    receiptImage: z.string().optional()
});

export const StockAdjustmentRecordSchema = z.object({
    id: z.string(),
    date: z.string(),
    itemId: z.string(),
    itemName: z.string(),
    type: z.enum(['Stock In', 'Stock Out']),
    qty: z.number(),
    reason: z.enum(['Damage', 'Internal Use', 'Found', 'Initial Stock', 'Other']),
    notes: z.string().optional()
});
