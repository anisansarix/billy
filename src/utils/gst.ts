import { LineItem, GSTSummary, GSTSlab } from '../types/entities';

export function computeLineItem(item: Omit<LineItem, 'taxableAmountPaise' | 'gstAmountPaise' | 'totalAmountPaise'>, isInterState: boolean): LineItem {
    const qty = item.quantityDecimal ?? 1;
    const price = item.unitPricePaise || 0;
    const discount = item.discountPercent || 0;
    const rawTotalPaise = Math.round(price * qty);
    const discountAmountPaise = Math.round(rawTotalPaise * (discount / 100));
    const taxableAmountPaise = rawTotalPaise - discountAmountPaise;

    let gstAmountPaise = 0;
    if (isInterState) {
        gstAmountPaise += Math.round(taxableAmountPaise * (item.taxRate.gstComponent.igstRate / 100));
    } else {
        gstAmountPaise += Math.round(taxableAmountPaise * (item.taxRate.gstComponent.cgstRate / 100));
        gstAmountPaise += Math.round(taxableAmountPaise * (item.taxRate.gstComponent.sgstRate / 100));
    }
    gstAmountPaise += Math.round(taxableAmountPaise * (item.taxRate.gstComponent.cessRate / 100));

    const totalAmountPaise = taxableAmountPaise + gstAmountPaise;

    return {
        ...item,
        taxableAmountPaise,
        gstAmountPaise,
        totalAmountPaise
    };
}

export function buildGSTSummary(lineItems: LineItem[], isInterState: boolean): GSTSummary {
    const slabs: Record<string, GSTSlab> = {};
    let totalTaxableValuePaise = 0;
    let totalGSTAmountPaise = 0;
    let totalCessAmountPaise = 0;

    for (const item of lineItems) {
        const rateKey = isInterState ? String(item.taxRate.gstComponent.igstRate) : String(item.taxRate.gstComponent.cgstRate + item.taxRate.gstComponent.sgstRate);
        const { cgstRate, sgstRate, igstRate, cessRate } = item.taxRate.gstComponent;

        if (!slabs[rateKey]) {
            slabs[rateKey] = {
                taxableValuePaise: 0,
                cgstRate: isInterState ? 0 : cgstRate,
                cgstAmountPaise: 0,
                sgstRate: isInterState ? 0 : sgstRate,
                sgstAmountPaise: 0,
                igstRate: isInterState ? igstRate : 0,
                igstAmountPaise: 0,
                cessRate,
                cessAmountPaise: 0,
            };
        }

        const slab = slabs[rateKey];
        slab.taxableValuePaise += item.taxableAmountPaise;
        
        if (isInterState) {
            const igst = Math.round(item.taxableAmountPaise * (igstRate / 100));
            slab.igstAmountPaise += igst;
            totalGSTAmountPaise += igst;
        } else {
            const cgst = Math.round(item.taxableAmountPaise * (cgstRate / 100));
            const sgst = Math.round(item.taxableAmountPaise * (sgstRate / 100));
            slab.cgstAmountPaise += cgst;
            slab.sgstAmountPaise += sgst;
            totalGSTAmountPaise += cgst + sgst;
        }

        const cess = Math.round(item.taxableAmountPaise * (cessRate / 100));
        slab.cessAmountPaise += cess;
        totalCessAmountPaise += cess;
        
        totalTaxableValuePaise += item.taxableAmountPaise;
    }

    return {
        slabs,
        totalTaxableValuePaise,
        totalGSTAmountPaise,
        totalCessAmountPaise
    };
}

export function formatINR(paise: number): string {
    const rupees = paise / 100;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(rupees);
}

export function amountInIndianWords(paise: number): string {
    let num = Math.floor(paise / 100);
    if (num === 0) return "Zero Rupees Only";

    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (n: number, suffix: string): string => {
        let str = '';
        if (n > 19) {
            str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
        } else {
            str += a[n];
        }
        if (n) str += suffix;
        return str;
    };

    let words = '';
    words += inWords(Math.floor(num / 10000000), 'Crore ');
    words += inWords(Math.floor((num / 100000) % 100), 'Lakh ');
    words += inWords(Math.floor((num / 1000) % 100), 'Thousand ');
    words += inWords(Math.floor((num / 100) % 10), 'Hundred ');
    
    if (num > 100 && num % 100) {
        words += 'and ';
    }
    words += inWords(num % 100, '');

    return words.trim() + " Rupees Only";
}

export function isInterStateSupply(fromStateCode: string, toStateCode: string): boolean {
    return fromStateCode !== toStateCode;
}
