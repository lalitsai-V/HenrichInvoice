import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';
import { InvoiceData } from '@/types/invoice';
import { formatDateForDisplay, formatINRNumber } from './formatters';

/**
 * Loads an image from URL and returns a base64 Data URL
 */
async function loadImageAsDataUrl(url: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn(`Could not load image ${url}:`, err);
    return null;
  }
}

/**
 * Builds standalone HTML matching the exact reference template layout
 * used when capturing an invoice that is not currently visible on screen.
 */
function buildStandaloneInvoiceHTML(
  invoice: InvoiceData,
  logoDataUrl: string | null,
  bgDataUrl: string | null
): string {
  // Only display actual items added by user - grows dynamically with items
  const displayRows = invoice.items.filter(
    (item) => item.description.trim() !== '' || item.unitPrice > 0 || item.amount > 0
  );
  const itemCount = displayRows.length;

  let rowHeight = '28px';
  let cellPadding = '4px 14px';
  let fontSize = '11px';
  let descFont = 'font-weight: 600; font-size: 11px;';
  let amountFont = 'font-weight: 700; font-size: 11px;';
  const minTableHeight = '220px';

  if (itemCount <= 2) {
    rowHeight = '56px';
    cellPadding = '12px 14px';
    fontSize = '13.5px';
    descFont = 'font-weight: 700; font-size: 14px;';
    amountFont = 'font-weight: 900; font-size: 15px;';
  } else if (itemCount <= 4) {
    rowHeight = '44px';
    cellPadding = '8px 14px';
    fontSize = '12.5px';
    descFont = 'font-weight: 700; font-size: 13px;';
    amountFont = 'font-weight: 800; font-size: 14px;';
  } else if (itemCount <= 7) {
    rowHeight = '34px';
    cellPadding = '5px 12px';
    fontSize = '11.5px';
    descFont = 'font-weight: 600; font-size: 12px;';
    amountFont = 'font-weight: 700; font-size: 12px;';
  } else if (itemCount <= 10) {
    rowHeight = '28px';
    cellPadding = '3px 10px';
    fontSize = '11px';
    descFont = 'font-weight: 600; font-size: 11px;';
    amountFont = 'font-weight: 700; font-size: 11px;';
  } else {
    rowHeight = '22px';
    cellPadding = '2px 8px';
    fontSize = '10px';
    descFont = 'font-weight: 600; font-size: 10px;';
    amountFont = 'font-weight: 700; font-size: 10px;';
  }

  return `
    <div style="width: 794px; height: 1123px; min-width: 794px; max-width: 794px; min-height: 1123px; max-height: 1123px; background-color: #ffffff; color: #1e293b; padding: 32px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; position: relative; overflow: hidden;">
      
      <!-- Top Section -->
      <div style="display: flex; flex-direction: column;">
        
        <!-- Header: Logo + Contact -->
        <div style="display: flex; justify-content: space-between; align-items: stretch; position: relative;">
          <!-- Left Logo -->
          <div style="display: flex; align-items: center; gap: 16px; padding: 4px 0;">
            ${
              logoDataUrl
                ? `<img src="${logoDataUrl}" alt="Henrich Logo" style="width: 96px; height: 64px; object-fit: contain;" />`
                : `<img src="/henrich-logo.svg" alt="Henrich Logo" style="width: 96px; height: 64px; object-fit: contain;" />`
            }
            <div style="display: flex; flex-direction: column; line-height: 1;">
              <span style="font-size: 38px; font-weight: 900; color: #E30613; letter-spacing: -0.5px; line-height: 1;">HENRICH</span>
              <span style="font-size: 13px; font-weight: 900; color: #073763; text-transform: uppercase; margin-top: 4px; letter-spacing: 0.8px;">AUTOMOTIVE SOLUTIONS</span>
              <span style="font-size: 8px; font-weight: 700; color: #073763; margin-top: 6px; letter-spacing: 0.2px;">
                SERVICE <span style="color: #E30613;">|</span> REPAIR <span style="color: #E30613;">|</span> MAINTENANCE <span style="color: #E30613;">|</span> DIAGNOSTICS
              </span>
            </div>
          </div>

          <!-- Right Contact Card -->
          <div style="display: flex; align-items: stretch; min-width: 310px;">
            <div style="width: 20px; background-color: #E30613; clip-path: polygon(100% 0, 100% 100%, 0 0);"></div>
            <div style="background-color: #073763; color: #ffffff; padding: 10px 16px; border-radius: 0 4px 4px 0; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px; font-size: 10px;">
              <div style="display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 11.5px;">
                <span style="width: 16px; height: 16px; border-radius: 50%; background: rgba(255,255,255,0.15); display: inline-flex; align-items: center; justify-content: center;">📞</span>
                <span>+91 98840 89447</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; color: #e2e8f0; font-size: 10px;">
                <span style="width: 16px; height: 16px; border-radius: 50%; background: rgba(255,255,255,0.15); display: inline-flex; align-items: center; justify-content: center;">✉️</span>
                <span>henrichautomotivesolution@gmail.com</span>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 8px; color: #cbd5e1; font-size: 9px; line-height: 1.25;">
                <span style="width: 16px; height: 16px; border-radius: 50%; background: rgba(255,255,255,0.15); display: inline-flex; align-items: center; justify-content: center; color: #E30613;">📍</span>
                <div>
                  <span style="font-weight: bold; color: #E30613; display: block;">Our Location</span>
                  <span>No. 15/29, 1st Street, Kamaraj Nagar, Avadi, Chennai - 600 071. India.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Full-Width Separator Stripe -->
        <div style="display: flex; height: 8px; width: 100%; margin: 12px 0 16px 0; overflow: hidden; border-radius: 2px;">
          <div style="width: 68%; background-color: #E30613; height: 100%; clip-path: polygon(0 0, 100% 0, 97% 100%, 0 100%);"></div>
          <div style="width: 34%; background-color: #073763; height: 100%; margin-left: -12px; clip-path: polygon(3% 0, 100% 0, 100% 100%, 0 100%);"></div>
        </div>

        <!-- Title & Metadata Box -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div>
            <h1 style="font-size: 30px; font-weight: 900; line-height: 1; margin: 0;">
              <span style="color: #073763;">SERVICE </span>
              <span style="color: #E30613;">INVOICE</span>
            </h1>
            <div style="display: flex; align-items: center; gap: 6px; margin-top: 8px;">
              <div style="height: 4px; width: 56px; background-color: #073763;"></div>
              <div style="height: 4px; width: 18px; background-color: #E30613;"></div>
            </div>
          </div>

          <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 14px; display: flex; align-items: center; gap: 12px; background-color: #ffffff;">
            <div style="width: 36px; height: 36px; border-radius: 6px; background: #eff6ff; border: 1px solid #bfdbfe; color: #073763; display: flex; align-items: center; justify-content: center; font-size: 18px;">
              📄
            </div>
            <div style="display: grid; grid-template-columns: 82px 8px 1fr; font-size: 11px; row-gap: 2px; align-items: center;">
              <span style="font-weight: bold; color: #073763;">Invoice No</span>
              <span style="font-weight: bold; color: #073763;">:</span>
              <span style="font-weight: bold; color: #E30613;">${invoice.invoiceNumber || 'HAS-2025-001'}</span>

              <span style="font-weight: bold; color: #073763;">Date</span>
              <span style="font-weight: bold; color: #073763;">:</span>
              <span style="color: #1e293b; font-weight: 500;">${formatDateForDisplay(invoice.invoiceDate)}</span>

              <span style="font-weight: bold; color: #073763;">Service Type</span>
              <span style="font-weight: bold; color: #073763;">:</span>
              <span style="color: #1e293b; font-weight: 500;">${invoice.serviceType || 'General Service'}</span>
            </div>
          </div>
        </div>

        <!-- Customer & Vehicle Details -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; font-size: 11px;">
          <!-- Customer Details -->
          <div style="border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #ffffff;">
            <div style="background-color: #073763; color: #ffffff; padding: 6px 12px; position: relative; font-weight: bold; text-transform: uppercase; font-size: 11px;">
              <span>👤 CUSTOMER DETAILS</span>
              <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 14px; background-color: #E30613; clip-path: polygon(100% 0, 100% 100%, 0 100%);"></div>
            </div>
            <div style="padding: 10px; display: flex; flex-direction: column; gap: 6px;">
              <div style="display: grid; grid-template-columns: 100px 8px 1fr; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
                <span style="font-weight: bold; color: #073763;">Customer Name</span>
                <span style="font-weight: bold; color: #073763;">:</span>
                <span style="font-weight: 500; color: #1e293b;">${invoice.customer.name || '—'}</span>
              </div>
              <div style="display: grid; grid-template-columns: 100px 8px 1fr; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
                <span style="font-weight: bold; color: #073763;">Phone Number</span>
                <span style="font-weight: bold; color: #073763;">:</span>
                <span style="font-weight: 500; color: #1e293b;">${invoice.customer.phone || '—'}</span>
              </div>
              <div style="display: grid; grid-template-columns: 100px 8px 1fr;">
                <span style="font-weight: bold; color: #073763;">Address</span>
                <span style="font-weight: bold; color: #073763;">:</span>
                <div>
                  <span style="font-weight: 500; color: #1e293b;">${invoice.customer.address || '—'}</span>
                  <div style="border-bottom: 1px solid #e2e8f0; margin-top: 8px;"></div>
                  <div style="border-bottom: 1px solid #e2e8f0; margin-top: 8px;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Vehicle Details -->
          <div style="border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #ffffff;">
            <div style="background-color: #073763; color: #ffffff; padding: 6px 12px; position: relative; font-weight: bold; text-transform: uppercase; font-size: 11px;">
              <span>🚗 VEHICLE DETAILS</span>
              <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 14px; background-color: #E30613; clip-path: polygon(100% 0, 100% 100%, 0 100%);"></div>
            </div>
            <div style="padding: 10px; display: flex; flex-direction: column; gap: 6px;">
              <div style="display: grid; grid-template-columns: 115px 8px 1fr; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
                <span style="font-weight: bold; color: #073763;">Vehicle Make</span>
                <span style="font-weight: bold; color: #073763;">:</span>
                <span style="font-weight: 500; color: #1e293b;">${invoice.vehicle.make || '—'}</span>
              </div>
              <div style="display: grid; grid-template-columns: 115px 8px 1fr; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
                <span style="font-weight: bold; color: #073763;">Model</span>
                <span style="font-weight: bold; color: #073763;">:</span>
                <span style="font-weight: 500; color: #1e293b;">${invoice.vehicle.model || '—'}</span>
              </div>
              <div style="display: grid; grid-template-columns: 115px 8px 1fr; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
                <span style="font-weight: bold; color: #073763;">Registration No</span>
                <span style="font-weight: bold; color: #073763;">:</span>
                <span style="font-weight: bold; color: #0f172a; text-transform: uppercase;">${invoice.vehicle.registrationNo || '—'}</span>
              </div>
              <div style="display: grid; grid-template-columns: 115px 8px 1fr; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
                <span style="font-weight: bold; color: #073763;">Odometer Reading</span>
                <span style="font-weight: bold; color: #073763;">:</span>
                <span style="font-weight: 500; color: #1e293b;">${invoice.vehicle.odometer ? `${invoice.vehicle.odometer} km` : '— km'}</span>
              </div>
              <div style="display: grid; grid-template-columns: 115px 8px 1fr;">
                <span style="font-weight: bold; color: #073763;">Service Date</span>
                <span style="font-weight: bold; color: #073763;">:</span>
                <span style="font-weight: 500; color: #1e293b;">${formatDateForDisplay(invoice.vehicle.serviceDate || invoice.invoiceDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Table with Workshop Watermark -->
        <div style="position: relative; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; margin-bottom: 14px; min-height: ${minTableHeight}; display: flex; flex-direction: column; justify-content: flex-start;">
          ${
            bgDataUrl
              ? `<div style="position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.18; display: flex; align-items: center; justify-content: center;">
                  <img src="${bgDataUrl}" alt="Watermark" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>`
              : ''
          }
          <table style="width: 100%; border-collapse: collapse; position: relative; z-index: 10; font-size: ${fontSize}; text-align: left;">
            <thead>
              <tr style="background-color: #073763; color: #ffffff; font-weight: bold; font-size: 10.5px;">
                <th style="padding: 7px 10px; text-align: center; width: 44px; border-right: 1px solid #0A4A85;">S.No</th>
                <th style="padding: 7px 14px; border-right: 1px solid #0A4A85;">Service / Part Description</th>
                <th style="padding: 7px 10px; text-align: center; width: 56px; border-right: 1px solid #0A4A85;">Qty</th>
                <th style="padding: 7px 14px; text-align: right; width: 100px; border-right: 1px solid #0A4A85;">Unit Price (₹)</th>
                <th style="padding: 7px 14px; text-align: right; width: 100px;">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${
                displayRows.length === 0
                  ? `
                <tr>
                  <td colspan="5" style="padding: 30px; text-align: center; color: #94a3b8; font-size: 12px; font-style: italic;">
                    No items added yet.
                  </td>
                </tr>
              `
                  : displayRows
                      .map(
                        (row, idx) => `
                <tr style="border-bottom: 1px solid #cbd5e1; height: ${rowHeight};">
                  <td style="padding: ${cellPadding}; text-align: center; font-weight: bold; color: #64748b; border-right: 1px solid #cbd5e1;">${idx + 1}</td>
                  <td style="padding: ${cellPadding}; ${descFont} color: #0f172a; border-right: 1px solid #cbd5e1;">${row.description || '—'}</td>
                  <td style="padding: ${cellPadding}; text-align: center; font-weight: bold; color: #334155; border-right: 1px solid #cbd5e1;">${row.quantity > 0 ? row.quantity : ''}</td>
                  <td style="padding: ${cellPadding}; text-align: right; font-weight: 500; color: #334155; border-right: 1px solid #cbd5e1;">${row.unitPrice > 0 ? formatINRNumber(row.unitPrice) : ''}</td>
                  <td style="padding: ${cellPadding}; text-align: right; ${amountFont} color: #0f172a;">${row.amount > 0 ? formatINRNumber(row.amount) : ''}</td>
                </tr>
              `
                      )
                      .join('')
              }
            </tbody>
          </table>
        </div>

        <!-- Totals Bar -->
        <div style="border-radius: 8px; overflow: hidden; border: 1px solid #cbd5e1; margin-bottom: 14px; display: flex;">
          <div style="flex: 1; background-color: #073763; color: #ffffff; display: grid; grid-template-columns: 1fr 1fr 1fr; padding: 10px;">
            <div style="text-align: center; border-right: 1px solid rgba(255,255,255,0.2);">
              <div style="font-size: 10px; color: #cbd5e1; font-weight: 500; text-transform: uppercase;">Subtotal</div>
              <div style="font-size: 14px; font-weight: bold; color: #ffffff; margin-top: 2px;">₹ ${formatINRNumber(invoice.totals.subtotal)}</div>
            </div>
            <div style="text-align: center; border-right: 1px solid rgba(255,255,255,0.2);">
              <div style="font-size: 10px; color: #cbd5e1; font-weight: 500; text-transform: uppercase;">Discount</div>
              <div style="font-size: 14px; font-weight: bold; color: #ffffff; margin-top: 2px;">₹ ${formatINRNumber(invoice.totals.discountAmount)}</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 10px; color: #cbd5e1; font-weight: 500; text-transform: uppercase;">GST (if any)</div>
              <div style="font-size: 14px; font-weight: bold; color: #ffffff; margin-top: 2px;">₹ ${formatINRNumber(invoice.totals.gstAmount)}</div>
            </div>
          </div>

          <div style="background-color: #E30613; color: #ffffff; padding: 10px 24px; display: flex; flex-direction: column; justify-content: center; align-items: flex-end; min-width: 200px; position: relative;">
            <div style="position: absolute; left: -14px; top: 0; bottom: 0; width: 14px; background-color: #073763; clip-path: polygon(100% 0, 100% 100%, 0 100%);"></div>
            <div style="font-size: 10.5px; font-weight: 800; text-transform: uppercase; color: #fee2e2;">Total Amount</div>
            <div style="font-size: 24px; font-weight: 900; color: #ffffff; margin-top: 2px;">₹ ${formatINRNumber(invoice.totals.totalAmount)}</div>
          </div>
        </div>

      </div>

      <!-- Bottom Footer Bar -->
      <div style="background-color: #073763; color: #ffffff; border-radius: 8px; border: 3px solid #0A4A85; overflow: hidden; box-sizing: border-box;">
        <!-- Top Row: Company Name & Since -->
        <div style="padding: 8px 20px 7px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 11.5px; font-weight: 900; letter-spacing: 0.8px; text-transform: uppercase; color: #ffffff;">HENRICH AUTOMOTIVE SOLUTIONS</span>
            <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; padding: 2px 7px; border-radius: 4px; background-color: #E30613; color: #ffffff; letter-spacing: 0.5px;">SINCE 2003</span>
          </div>
          <span style="font-size: 9px; font-weight: 600; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px;">EXPERT MULTI-BRAND CAR SERVICE &amp; DIAGNOSTICS</span>
        </div>

        <!-- Bottom Row: Bigger Services Bar -->
        <div style="padding: 9px 20px; display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.6px;">
          <div style="display: flex; align-items: center; gap: 24px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>ENGINE SERVICE</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
              <span>REPAIRS</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
              <span>MAINTENANCE</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><path d="M15 2v2"></path><path d="M15 20v2"></path><path d="M2 15h2"></path><path d="M2 9h2"></path><path d="M20 15h2"></path><path d="M20 9h2"></path><path d="M9 2v2"></path><path d="M9 20v2"></path></svg>
              <span>DIAGNOSTICS</span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 5px; height: 20px;">
            <div style="width: 14px; height: 100%; background-color: #E30613; transform: skewX(-24deg);"></div>
            <div style="width: 10px; height: 100%; background-color: #ffffff; transform: skewX(-24deg);"></div>
            <div style="width: 16px; height: 100%; background-color: #E30613; transform: skewX(-24deg);"></div>
          </div>
        </div>
      </div>

    </div>
  `;
}

/**
 * Generates an exact single-page A4 PDF that 100% matches the visual template
 */
export async function generateInvoicePDF(invoice: InvoiceData): Promise<Blob> {
  let targetElement = document.getElementById('printable-invoice');
  let temporaryContainer: HTMLElement | null = null;

  // If the printable-invoice element on screen matches the current invoice number, capture it
  // Otherwise, create an offscreen container with the exact standalone markup
  const needsStandalone =
    !targetElement ||
    !targetElement.textContent?.includes(invoice.invoiceNumber || '');

  if (needsStandalone) {
    const [logoDataUrl, bgDataUrl] = await Promise.all([
      loadImageAsDataUrl('/henrich-logo.svg'),
      loadImageAsDataUrl('/images/car-workshop-bg.png'),
    ]);

    temporaryContainer = document.createElement('div');
    temporaryContainer.style.position = 'fixed';
    temporaryContainer.style.top = '-99999px';
    temporaryContainer.style.left = '-99999px';
    temporaryContainer.style.zIndex = '-99999';
    temporaryContainer.style.opacity = '1';
    temporaryContainer.innerHTML = buildStandaloneInvoiceHTML(
      invoice,
      logoDataUrl,
      bgDataUrl
    );
    document.body.appendChild(temporaryContainer);
    targetElement = temporaryContainer.firstElementChild as HTMLElement;
  }

  if (!targetElement) {
    throw new Error('Could not find or create invoice preview element');
  }

  try {
    // Render at high-resolution 2.5x pixel ratio for ultra-crisp print quality
    const imgData = await toJpeg(targetElement, {
      quality: 0.95,
      pixelRatio: 2.5,
      backgroundColor: '#ffffff',
      canvasWidth: 794 * 2.5,
      canvasHeight: 1123 * 2.5,
    });

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Exactly 1 page: 210mm x 297mm full bleed
    doc.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

    return doc.output('blob');
  } finally {
    if (temporaryContainer && temporaryContainer.parentNode) {
      temporaryContainer.parentNode.removeChild(temporaryContainer);
    }
  }
}

export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 400);
}
