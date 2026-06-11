/**
 * Paise is a branded type to ensure monetary values are always represented in paise (smallest unit)
 * and cannot be accidentally mixed with regular numbers (rupees).
 */
export type Paise = number & { readonly __brand: unique symbol };

/**
 * Converts a standard INR value (rupees) to Paise.
 * @param inr Amount in rupees
 * @returns Amount in paise
 */
export function toPaise(inr: number): Paise {
  return Math.round(inr * 100) as Paise;
}

/**
 * Converts a Paise value back to standard INR (rupees).
 * @param paise Amount in paise
 * @returns Amount in rupees
 */
export function fromPaise(paise: Paise | number): number {
  return paise / 100;
}

/**
 * Formats a Paise value as an Indian Rupee string (e.g., ₹1,234.50).
 * @param paise Amount in paise
 * @returns Formatted INR string
 */
export function formatINR(paise: Paise | number): string {
  const inr = fromPaise(paise);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(inr);
}
