import { supabase } from './supabase';
import { useAppStore } from '@/store';
import { DEFAULT_BUSINESS } from '../../constants/data';
import { INVOICES, PARTIES, ITEMS, PURCHASES, EXPENSES, PAYMENTS } from '../../constants/data';
import { Business, SalesInvoice, PurchaseOrder, Party, InventoryItem, ExpenseRecord, PaymentRecord } from '@/types/entities';

const mapBusinessToRow = (b: Business, userId: string) => ({
    id: b.id,
    user_id: userId,
    legal_name: b.legalName,
    trade_name: b.tradeName || null,
    gstin: b.gstin || null,
    pan: b.pan || null,
    gst_type: b.gstType,
    address: b.address,
    shipping_addresses: b.shippingAddresses || [],
    phone: b.phone || null,
    email: b.email || null,
    logo_uri: b.logoUri || null,
    signature_uri: b.signatureUri || null,
    bank_details: b.bankDetails || [],
    upi_vpa: b.upiVpa || null,
    fiscal_year_start: b.fiscalYearStart,
    default_currency: b.defaultCurrency,
});

const mapPartyToRow = (p: Party, userId: string) => ({
    id: p.id,
    user_id: userId,
    party_type: p.partyType,
    legal_name: p.legalName,
    trade_name: p.tradeName || null,
    gstin: p.gstin || null,
    pan: p.pan || null,
    phone: p.phone || null,
    email: p.email || null,
    gst_type: p.gstType,
    billing_address: p.billingAddress,
    shipping_addresses: p.shippingAddresses || [],
    contact_persons: p.contactPersons || [],
    payment_terms_days: p.paymentTermsDays,
    credit_limit_paise: p.creditLimitPaise,
    opening_balance_paise: p.openingBalancePaise,
    opening_balance_type: p.openingBalanceType,
    notes: p.notes || null,
});

const mapItemToRow = (i: InventoryItem, userId: string) => ({
    id: i.id,
    user_id: userId,
    name: i.name,
    type: i.type,
    unit_price_paise: i.unitPricePaise,
    purchase_price_paise: i.purchasePricePaise || null,
    hsn_sac_code: i.hsnSacCode || null,
    tax_rate: i.taxRate,
    unit: i.unit,
    stock: i.stock,
    minimum_stock: i.minimumStock || null,
    sku: i.sku || null,
    barcode: i.barcode || null,
    description: i.description || null,
});

const mapDocumentToRow = (d: SalesInvoice | PurchaseOrder | any, userId: string) => ({
    id: d.id,
    user_id: userId,
    document_type: d.documentType,
    document_number: d.documentNumber,
    document_date: d.documentDate,
    due_date: d.dueDate || null,
    business_id: d.businessId,
    party_id: d.partyId,
    party_name: d.partyName,
    line_items: d.lineItems || [],
    gst_summary: d.gstSummary || null,
    subtotal_paise: d.subtotalPaise,
    total_discount_paise: d.totalDiscountPaise,
    total_taxable_amount_paise: d.totalTaxableAmountPaise,
    total_gst_amount_paise: d.totalGSTAmountPaise,
    total_amount_paise: d.totalAmountPaise,
    total_amount_in_words: d.totalAmountInWords,
    notes: d.notes || null,
    terms_and_conditions: d.termsAndConditions || null,
    is_inter_state: d.isInterState,
    place_of_supply: d.placeOfSupply,
    status: d.status,
    irn_details: d.irnDetails || null,
    balance_due_paise: d.balanceDuePaise || null,
    paid_amount_paise: d.paidAmountPaise || null,
    payment_mode: d.paymentMode || null,
    e_way_bill_number: d.eWayBillNumber || null,
    linked_challan_id: d.linkedChallanId || null,
    expected_delivery_date: d.expectedDeliveryDate || null,
    vendor_quote_number: d.vendorQuoteNumber || null,
    original_invoice_id: d.originalInvoiceId || null,
    reason: d.reason || null,
    vehicle_number: d.vehicleNumber || null,
    transporter_name: d.transporterName || null,
    dispatch_date: d.dispatchDate || null,
});

const mapPaymentToRow = (p: PaymentRecord, userId: string) => ({
    id: p.id,
    user_id: userId,
    date: p.date,
    amount_paise: p.amountPaise,
    mode: p.mode,
    type: p.type,
    party_id: p.partyId,
    party_name: p.partyName,
    document_id: p.documentId || null,
    document_number: p.documentNumber || null,
});

const mapExpenseToRow = (e: ExpenseRecord, userId: string) => ({
    id: e.id,
    user_id: userId,
    date: e.date,
    category: e.category,
    amount_paise: e.amountPaise,
    payment_mode: e.paymentMode,
    vendor_name: e.vendorName || null,
    notes: e.notes || null,
    receipt_image: e.receiptImage || null,
});

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks = [];
  for(let i=0; i<arr.length; i+=size) {
    chunks.push(arr.slice(i, i+size));
  }
  return chunks;
}

export async function pushMockData() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) throw new Error("No user authenticated");
  const userId = session.user.id;

  await supabase.from('businesses').upsert(mapBusinessToRow(DEFAULT_BUSINESS, userId));

  const pChunks = chunkArray(PARTIES, 100);
  for(const chunk of pChunks) await supabase.from('parties').upsert(chunk.map(c => mapPartyToRow(c, userId)));

  const iChunks = chunkArray(ITEMS, 100);
  for(const chunk of iChunks) await supabase.from('inventory_items').upsert(chunk.map(c => mapItemToRow(c, userId)));

  const docChunks = chunkArray([...INVOICES, ...PURCHASES], 100);
  for(const chunk of docChunks) await supabase.from('documents').upsert(chunk.map(c => mapDocumentToRow(c, userId)));

  const expChunks = chunkArray(EXPENSES, 100);
  for(const chunk of expChunks) await supabase.from('expenses').upsert(chunk.map(c => mapExpenseToRow(c, userId)));

  const payChunks = chunkArray(PAYMENTS, 100);
  for(const chunk of payChunks) await supabase.from('payments').upsert(chunk.map(c => mapPaymentToRow(c, userId)));
}

export async function pullInitialData() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) return;
  
  const [bRes, pRes, iRes, dRes, eRes, payRes] = await Promise.all([
    supabase.from('businesses').select('*'),
    supabase.from('parties').select('*'),
    supabase.from('inventory_items').select('*'),
    supabase.from('documents').select('*'),
    supabase.from('expenses').select('*'),
    supabase.from('payments').select('*'),
  ]);

  const store = useAppStore.getState();

  if (bRes.data && bRes.data.length > 0) {
      const b = bRes.data[0];
      store.setCurrentBusiness({
          id: b.id,
          legalName: b.legal_name,
          tradeName: b.trade_name,
          gstin: b.gstin,
          pan: b.pan,
          gstType: b.gst_type,
          address: b.address,
          shippingAddresses: b.shipping_addresses,
          phone: b.phone,
          email: b.email,
          logoUri: b.logo_uri,
          signatureUri: b.signature_uri,
          bankDetails: b.bank_details,
          upiVpa: b.upi_vpa,
          fiscalYearStart: b.fiscal_year_start,
          defaultCurrency: b.default_currency,
      });
  }

  const mapFromRow = (r: any) => {
      const camelObj: any = {};
      for (const key in r) {
          const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
          camelObj[camelKey] = r[key];
      }
      return camelObj;
  };

  if (pRes.data) useAppStore.setState({ parties: pRes.data.map(mapFromRow) });
  if (iRes.data) useAppStore.setState({ items: iRes.data.map(mapFromRow) });
  if (eRes.data) useAppStore.setState({ expenses: eRes.data.map(mapFromRow) });
  if (payRes.data) useAppStore.setState({ payments: payRes.data.map(mapFromRow) });
  
  if (dRes.data) {
      const docs = dRes.data.map(mapFromRow);
      useAppStore.setState({
          invoices: docs.filter((d: any) => d.documentType === 'SALES_INVOICE'),
          purchases: docs.filter((d: any) => d.documentType === 'PURCHASE_ORDER'),
      });
  }
}
