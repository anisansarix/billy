import * as Print from 'expo-print';
import { Paths, File } from 'expo-file-system';
import type { SalesInvoice, PurchaseOrder, CreditNote, DeliveryChallan, Business, Party } from '@/types/entities';
import { formatINR } from '@/utils/money';
import { amountInIndianWords } from '@/utils/gst';

function buildInvoiceHTML(
  invoice: SalesInvoice | PurchaseOrder | CreditNote | DeliveryChallan,
  business: Business,
  party: Party
): string {
  const isInterState = invoice.isInterState;
  
  const headerHtml = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="margin: 0; font-size: 24px;">${business.legalName}</h1>
      <p style="margin: 4px 0; font-size: 14px;">GSTIN: ${business.gstin}</p>
      <p style="margin: 4px 0; font-size: 14px;">${business.address.line1}, ${business.address.city}, ${business.address.state} - ${business.address.pincode}</p>
      <p style="margin: 4px 0; font-size: 14px;">Phone: ${business.phone} | Email: ${business.email}</p>
    </div>
  `;

  const titleHtml = `
    <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 8px 0; text-align: center; margin-bottom: 20px;">
      <h2 style="margin: 0; font-size: 18px;">TAX INVOICE</h2>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px;">
      <div><strong>Invoice No:</strong> ${invoice.documentNumber}</div>
      <div><strong>Date:</strong> ${invoice.documentDate}</div>
    </div>
  `;

  const shippingAddressStr = party.shippingAddresses && party.shippingAddresses.length > 0 
    ? `${party.shippingAddresses[0].line1}<br/>${party.shippingAddresses[0].city}, ${party.shippingAddresses[0].state} - ${party.shippingAddresses[0].pincode}`
    : 'Same as Billing Address';

  const billToHtml = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px;">
      <div style="width: 48%; border: 1px solid #ccc; padding: 10px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Bill To</h3>
        <strong>${party.legalName}</strong><br/>
        GSTIN: ${party.gstin || 'N/A'}<br/>
        ${party.billingAddress.line1}<br/>
        ${party.billingAddress.city}, ${party.billingAddress.state} - ${party.billingAddress.pincode}
      </div>
      <div style="width: 48%; border: 1px solid #ccc; padding: 10px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">Ship To</h3>
        <strong>${party.legalName}</strong><br/>
        ${shippingAddressStr}
      </div>
    </div>
  `;

  const lineItemsHtml = invoice.lineItems.map((item, index) => {
    const gstPercent = isInterState 
      ? item.taxRate.gstComponent.igstRate 
      : (item.taxRate.gstComponent.cgstRate + item.taxRate.gstComponent.sgstRate);
      
    return `
      <tr>
        <td style="border: 1px solid #000; padding: 4px; text-align: center;">${index + 1}</td>
        <td style="border: 1px solid #000; padding: 4px;">${item.description}</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: center;">${item.hsnSacCode}</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: right;">${item.quantityDecimal}</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: center;">${item.unit}</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: right;">${formatINR(item.unitPricePaise)}</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: right;">${item.discountPercent}%</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: right;">${formatINR(item.taxableAmountPaise)}</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: right;">${gstPercent}%</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: right;">${formatINR(item.totalAmountPaise)}</td>
      </tr>
    `;
  }).join('');

  const tableHtml = `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="border: 1px solid #000; padding: 4px;">#</th>
          <th style="border: 1px solid #000; padding: 4px; text-align: left;">Description</th>
          <th style="border: 1px solid #000; padding: 4px;">HSN/SAC</th>
          <th style="border: 1px solid #000; padding: 4px; text-align: right;">Qty</th>
          <th style="border: 1px solid #000; padding: 4px;">Unit</th>
          <th style="border: 1px solid #000; padding: 4px; text-align: right;">Rate</th>
          <th style="border: 1px solid #000; padding: 4px; text-align: right;">Disc%</th>
          <th style="border: 1px solid #000; padding: 4px; text-align: right;">Taxable</th>
          <th style="border: 1px solid #000; padding: 4px; text-align: right;">GST%</th>
          <th style="border: 1px solid #000; padding: 4px; text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${lineItemsHtml}
      </tbody>
    </table>
  `;

  const gstSlabsHtml = Object.values(invoice.gstSummary.slabs).map((slab) => {
    if (isInterState) {
      return `
        <tr>
          <td style="border: 1px solid #000; padding: 4px; text-align: right;">${formatINR(slab.taxableValuePaise)}</td>
          <td style="border: 1px solid #000; padding: 4px; text-align: right;">${slab.igstRate}%</td>
          <td style="border: 1px solid #000; padding: 4px; text-align: right;">${formatINR(slab.igstAmountPaise)}</td>
        </tr>
      `;
    }
    return `
      <tr>
        <td style="border: 1px solid #000; padding: 4px; text-align: right;">${formatINR(slab.taxableValuePaise)}</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: right;">${slab.cgstRate}%</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: right;">${formatINR(slab.cgstAmountPaise)}</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: right;">${slab.sgstRate}%</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: right;">${formatINR(slab.sgstAmountPaise)}</td>
      </tr>
    `;
  }).join('');

  const gstSummaryHeader = isInterState ? `
    <tr style="background-color: #f2f2f2;">
      <th style="border: 1px solid #000; padding: 4px; text-align: right;">Taxable Value</th>
      <th style="border: 1px solid #000; padding: 4px; text-align: right;">IGST Rate</th>
      <th style="border: 1px solid #000; padding: 4px; text-align: right;">IGST Amount</th>
    </tr>
  ` : `
    <tr style="background-color: #f2f2f2;">
      <th style="border: 1px solid #000; padding: 4px; text-align: right;">Taxable Value</th>
      <th style="border: 1px solid #000; padding: 4px; text-align: right;">CGST Rate</th>
      <th style="border: 1px solid #000; padding: 4px; text-align: right;">CGST Amount</th>
      <th style="border: 1px solid #000; padding: 4px; text-align: right;">SGST Rate</th>
      <th style="border: 1px solid #000; padding: 4px; text-align: right;">SGST Amount</th>
    </tr>
  `;

  const gstSummaryHtml = `
    <div style="margin-bottom: 20px;">
      <h3 style="margin: 0 0 8px 0; font-size: 14px;">GST Summary</h3>
      <table style="width: 50%; border-collapse: collapse; font-size: 12px;">
        <thead>${gstSummaryHeader}</thead>
        <tbody>${gstSlabsHtml}</tbody>
      </table>
    </div>
  `;

  const calculatedTotal = invoice.totalTaxableAmountPaise + invoice.totalGSTAmountPaise;
  const roundOffPaise = invoice.totalAmountPaise - calculatedTotal;

  const subtotalHtml = `
    <div style="display: flex; justify-content: flex-end; margin-bottom: 20px; font-size: 14px;">
      <table style="width: 40%; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px; font-weight: bold;">Subtotal:</td>
          <td style="padding: 4px; text-align: right;">${formatINR(invoice.subtotalPaise)}</td>
        </tr>
        <tr>
          <td style="padding: 4px; font-weight: bold;">Discount:</td>
          <td style="padding: 4px; text-align: right;">${formatINR(invoice.totalDiscountPaise)}</td>
        </tr>
        <tr>
          <td style="padding: 4px; font-weight: bold;">Taxable Amount:</td>
          <td style="padding: 4px; text-align: right;">${formatINR(invoice.totalTaxableAmountPaise)}</td>
        </tr>
        <tr>
          <td style="padding: 4px; font-weight: bold;">Total GST:</td>
          <td style="padding: 4px; text-align: right;">${formatINR(invoice.totalGSTAmountPaise)}</td>
        </tr>
        <tr>
          <td style="padding: 4px; font-weight: bold;">Round-off:</td>
          <td style="padding: 4px; text-align: right;">${formatINR(roundOffPaise)}</td>
        </tr>
        <tr style="border-top: 2px solid #000; border-bottom: 2px solid #000;">
          <td style="padding: 8px 4px; font-weight: bold; font-size: 16px;">GRAND TOTAL:</td>
          <td style="padding: 8px 4px; text-align: right; font-weight: bold; font-size: 16px;">${formatINR(invoice.totalAmountPaise)}</td>
        </tr>
      </table>
    </div>
  `;

  const amountInWordsHtml = `
    <div style="margin-bottom: 20px; font-size: 14px;">
      <strong>Amount in Words:</strong> ${amountInIndianWords(invoice.totalAmountPaise)}
    </div>
  `;

  const upiHtml = business.upiVpa ? `<p style="margin: 4px 0;"><strong>UPI VPA:</strong> ${business.upiVpa}</p>` : '';
  const footerHtml = `
    <div style="border-top: 1px solid #000; padding-top: 10px; font-size: 12px;">
      ${upiHtml}
      <p style="margin: 4px 0;"><strong>Terms & Conditions:</strong><br/>${invoice.termsAndConditions || 'As per standard terms.'}</p>
      <p style="margin: 20px 0 0 0; text-align: center; font-style: italic;">This is a computer-generated invoice and does not require a signature.</p>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TAX INVOICE</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; color: #000; line-height: 1.5; margin: 0; background-color: #fff;">
  ${headerHtml}
  ${titleHtml}
  ${billToHtml}
  ${tableHtml}
  ${gstSummaryHtml}
  ${subtotalHtml}
  ${amountInWordsHtml}
  ${footerHtml}
</body>
</html>`;
}

export async function generateInvoicePDF(
  invoice: SalesInvoice | PurchaseOrder | CreditNote | DeliveryChallan,
  business: Business,
  party: Party
): Promise<string> {
  const html = buildInvoiceHTML(invoice, business, party);
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  const partyName = (party.tradeName ?? party.legalName).replace(/\s+/g, '_');
  const filename = `${invoice.documentType}-${invoice.documentNumber}-${partyName}.pdf`;
  const destFile = new File(Paths.cache, filename);
  await new File(uri).move(destFile);
  return destFile.uri;
}
