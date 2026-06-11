export enum DocumentType {
    SALES_INVOICE = 'SALES_INVOICE',
    PURCHASE_ORDER = 'PURCHASE_ORDER',
    CREDIT_NOTE = 'CREDIT_NOTE',
    DELIVERY_CHALLAN = 'DELIVERY_CHALLAN',
    EWAYBILL = 'EWAYBILL',
    PURCHASE_RETURN = 'PURCHASE_RETURN',
    SALES_RETURN = 'SALES_RETURN',
    PROFORMA_INVOICE = 'PROFORMA_INVOICE',
    PAYMENT_RECEIPT = 'PAYMENT_RECEIPT'
}

export enum GSTType {
    REGULAR = 'REGULAR',
    COMPOSITION = 'COMPOSITION',
    UNREGISTERED = 'UNREGISTERED',
    SEZ = 'SEZ',
    OVERSEAS = 'OVERSEAS'
}

export enum PartyType {
    CUSTOMER = 'CUSTOMER',
    VENDOR = 'VENDOR',
    BOTH = 'BOTH'
}

export interface Address {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    stateCode: string;
    pincode: string;
    country: string;
}

export interface BankDetails {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    accountType: 'SAVINGS' | 'CURRENT' | 'OD';
}

/**
 * The single source of truth for a Business entity.
 * NOTE: All monetary values in this application MUST be stored as integers representing Paise.
 * Never use floating-point numbers for Rupees to avoid JavaScript rounding errors.
 * Example: ₹10.50 should be stored as 1050.
 */
export interface Business {
    id: string;
    legalName: string;
    tradeName?: string;
    gstin: string;
    pan: string;
    gstType: GSTType;
    address: Address;
    shippingAddresses: Address[];
    phone: string;
    email: string;
    logoUri?: string;
    signatureUri?: string;
    bankDetails: BankDetails[];
    upiVpa?: string;
    fiscalYearStart: 'APRIL' | 'JANUARY';
    defaultCurrency: 'INR';
}

export interface ContactPerson {
    name: string;
    phone: string;
    email?: string;
    designation?: string;
    isPrimary: boolean;
}

export interface Party {
    id: string;
    partyType: PartyType;
    legalName: string;
    tradeName?: string;
    gstin?: string;
    pan?: string;
    phone?: string;
    email?: string;
    gstType: GSTType;
    billingAddress: Address;
    shippingAddresses: Address[];
    contactPersons: ContactPerson[];
    paymentTermsDays: number;
    creditLimitPaise: number;
    openingBalancePaise: number;
    openingBalanceType: 'DEBIT' | 'CREDIT';
    notes?: string;
}

export interface GSTComponent {
    cgstRate: number;
    sgstRate: number;
    igstRate: number;
    cessRate: number;
}

export interface TaxRate {
    id: string;
    hsnSacCode: string;
    description: string;
    gstComponent: GSTComponent;
    isService: boolean;
    isActive: boolean;
}

export interface LineItem {
    id: string;
    description: string;
    hsnSacCode: string;
    taxRate: TaxRate;
    unit: string;
    quantityDecimal: number;
    unitPricePaise: number;
    discountPercent: number;
    taxableAmountPaise: number;
    gstAmountPaise: number;
    totalAmountPaise: number;
    notes?: string;
}

export interface GSTSlab {
    taxableValuePaise: number;
    cgstRate: number;
    cgstAmountPaise: number;
    sgstRate: number;
    sgstAmountPaise: number;
    igstRate: number;
    igstAmountPaise: number;
    cessRate: number;
    cessAmountPaise: number;
}

export interface GSTSummary {
    slabs: Record<string, GSTSlab>;
    totalTaxableValuePaise: number;
    totalGSTAmountPaise: number;
    totalCessAmountPaise: number;
}

export interface IRNDetails {
    irn: string;
    ackNo: string;
    ackDate: string;
    signedQRCode: string;
    status: 'ACTIVE' | 'CANCELLED';
}

export interface DocumentBase {
    id: string;
    documentType: DocumentType;
    documentNumber: string;
    documentDate: string;
    dueDate?: string;
    businessId: string;
    partyId: string;
    partyName: string;
    lineItems: LineItem[];
    gstSummary: GSTSummary;
    subtotalPaise: number;
    totalDiscountPaise: number;
    totalTaxableAmountPaise: number;
    totalGSTAmountPaise: number;
    totalAmountPaise: number;
    totalAmountInWords: string;
    notes?: string;
    termsAndConditions?: string;
    isInterState: boolean;
    placeOfSupply: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    irnDetails?: IRNDetails;
}

export interface SalesInvoice extends DocumentBase {
    documentType: DocumentType.SALES_INVOICE;
    paymentMode: string;
    paidAmountPaise: number;
    balanceDuePaise: number;
    eWayBillNumber?: string;
}

export interface PurchaseOrder extends DocumentBase {
    documentType: DocumentType.PURCHASE_ORDER;
    expectedDeliveryDate: string;
    vendorQuoteNumber?: string;
    paymentMode?: string;
    paidAmountPaise?: number;
    balanceDuePaise?: number;
}

export interface CreditNote extends DocumentBase {
    documentType: DocumentType.CREDIT_NOTE;
    originalInvoiceId: string;
    reason: string;
}

export interface DeliveryChallan extends DocumentBase {
    documentType: DocumentType.DELIVERY_CHALLAN;
    vehicleNumber?: string;
    transporterName?: string;
    dispatchDate: string;
}

// Added to cover existing store types with paise compliance
export interface InventoryItem {
    id: string;
    name: string;
    type: 'product' | 'service';
    unitPricePaise: number;
    purchasePricePaise?: number;
    hsnSacCode: string;
    taxRate: TaxRate;
    unit: string;
    stock: number;
    minimumStock?: number;
    sku?: string;
    barcode?: string;
    description?: string;
}

export interface PaymentRecord {
    id: string;
    date: string;
    amountPaise: number;
    mode: 'UPI' | 'Bank Transfer' | 'Cash' | 'NEFT' | 'RTGS' | 'Cheque';
    type: 'in' | 'out';
    partyId: string;
    partyName: string;
}

export interface ExpenseRecord {
    id: string;
    date: string;
    category: string;
    amountPaise: number;
    paymentMode: 'UPI' | 'Bank Transfer' | 'Cash' | 'Credit Card' | 'Debit Card';
    vendorName?: string;
    notes?: string;
    receiptImage?: string;
}

export interface StockAdjustmentRecord {
    id: string;
    date: string;
    itemId: string;
    itemName: string;
    type: 'Stock In' | 'Stock Out';
    qty: number;
    reason: 'Damage' | 'Internal Use' | 'Found' | 'Initial Stock' | 'Other';
    notes?: string;
}
