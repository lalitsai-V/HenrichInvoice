import { DiscountType, InvoiceItem, InvoiceTotals } from '@/types/invoice';

/**
 * Calculates a single line item amount = quantity * unitPrice
 * Rounds to 2 decimal places to avoid floating point inaccuracies
 */
export function calculateLineAmount(quantity: number, unitPrice: number): number {
  const safeQty = Math.max(0, isNaN(quantity) ? 0 : quantity);
  const safePrice = Math.max(0, isNaN(unitPrice) ? 0 : unitPrice);
  return Math.round(safeQty * safePrice * 100) / 100;
}

/**
 * Calculates complete invoice totals including subtotal, discount, taxable amount, optional GST, and total.
 */
export function calculateInvoiceTotals(params: {
  items: InvoiceItem[];
  discountType: DiscountType;
  discountValue: number;
  gstEnabled: boolean;
  gstRate: number;
}): InvoiceTotals {
  const { items, discountType, discountValue, gstEnabled, gstRate } = params;

  // 1. Subtotal = sum of all line amounts
  const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const safeSubtotal = Math.round(subtotal * 100) / 100;

  // 2. Discount calculation
  const safeDiscountVal = Math.max(0, isNaN(discountValue) ? 0 : discountValue);
  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = (safeSubtotal * Math.min(100, safeDiscountVal)) / 100;
  } else {
    discountAmount = Math.min(safeSubtotal, safeDiscountVal);
  }
  discountAmount = Math.round(discountAmount * 100) / 100;

  // 3. Taxable amount
  const taxableAmount = Math.max(0, Math.round((safeSubtotal - discountAmount) * 100) / 100);

  // 4. GST (optional and configurable)
  const safeGstRate = Math.max(0, isNaN(gstRate) ? 0 : gstRate);
  const gstAmount = gstEnabled
    ? Math.round(((taxableAmount * safeGstRate) / 100) * 100) / 100
    : 0;

  // 5. Total amount
  const totalAmount = Math.round((taxableAmount + gstAmount) * 100) / 100;

  return {
    subtotal: safeSubtotal,
    discountType,
    discountValue: safeDiscountVal,
    discountAmount,
    taxableAmount,
    gstEnabled,
    gstRate: safeGstRate,
    gstAmount,
    totalAmount,
  };
}
