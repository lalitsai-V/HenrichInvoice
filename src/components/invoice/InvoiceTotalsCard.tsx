'use client';

import React from 'react';
import { Percent, IndianRupee, HelpCircle, Check } from 'lucide-react';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { formatINRNumber } from '@/lib/formatters';
import { DiscountType } from '@/types/invoice';

export function InvoiceTotalsCard() {
  const { invoice, setDiscount, setGst } = useInvoiceStore();
  const { totals } = invoice;

  return (
    <div className="space-y-3 sm:space-y-4 mb-3.5 sm:mb-6">
      {/* Calculation Controls (Toggles & Inputs for Discount and GST) */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-3 sm:p-4">
        <div className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 sm:mb-3 flex items-center justify-between">
          <span>Billing Calculations & Tax</span>
          <span className="text-[10px] lowercase text-slate-400 font-normal">
            Taxable: ₹{formatINRNumber(totals.taxableAmount)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Discount Settings */}
          <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5 sm:gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="discount-input">Discount</label>
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[10px] sm:text-[11px]">
                <button
                  type="button"
                  onClick={() => setDiscount('fixed', totals.discountValue)}
                  className={`px-2 sm:px-2.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    totals.discountType === 'fixed'
                      ? 'bg-[#073763] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ₹ Flat
                </button>
                <button
                  type="button"
                  onClick={() => setDiscount('percentage', totals.discountValue)}
                  className={`px-2 sm:px-2.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    totals.discountType === 'percentage'
                      ? 'bg-[#073763] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  % Percent
                </button>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1.5 sm:top-2 text-slate-400 font-bold text-xs">
                {totals.discountType === 'fixed' ? '₹' : '%'}
              </span>
              <input
                id="discount-input"
                type="number"
                min="0"
                max={totals.discountType === 'percentage' ? 100 : totals.subtotal}
                step="any"
                value={totals.discountValue === 0 ? '' : totals.discountValue}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setDiscount(totals.discountType, isNaN(val) ? 0 : Math.max(0, val));
                }}
                placeholder="0"
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 font-bold outline-hidden focus:border-[#073763]"
              />
            </div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>Applied discount:</span>
              <span className="font-bold text-slate-700">- ₹ {formatINRNumber(totals.discountAmount)}</span>
            </div>
          </div>

          {/* GST Settings */}
          <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5 sm:gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="gst-toggle" className="flex items-center gap-1.5 cursor-pointer">
                <input
                  id="gst-toggle"
                  type="checkbox"
                  checked={totals.gstEnabled}
                  onChange={(e) => setGst(e.target.checked)}
                  className="rounded border-slate-300 text-[#073763] focus:ring-[#073763] cursor-pointer"
                />
                <span>Apply GST (Optional)</span>
              </label>

              {totals.gstEnabled && (
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px]">
                  {[5, 12, 18, 28].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setGst(true, rate)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        totals.gstRate === rate
                          ? 'bg-[#073763] text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <span className="text-[10px] sm:text-[11px] text-slate-500 truncate max-w-[180px] sm:max-w-none">
                {totals.gstEnabled
                  ? `GST Rate: ${totals.gstRate}%`
                  : 'GST disabled'}
              </span>
              <span className="font-bold text-slate-700 shrink-0">
                + ₹ {formatINRNumber(totals.gstAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Totals Box Matching Reference Image */}
      <div className="rounded-xl shadow-md overflow-hidden border border-slate-300">
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* Left Columns: Navy Background */}
          <div className="flex-1 bg-[#073763] text-white grid grid-cols-3 divide-x divide-white/20 p-2.5 sm:p-4">
            {/* Subtotal */}
            <div className="text-center px-1 sm:px-3">
              <div className="text-[10px] sm:text-xs text-slate-300 font-medium uppercase tracking-wider mb-0.5">
                Subtotal
              </div>
              <div className="text-xs sm:text-base font-bold text-white tracking-tight">
                ₹ {formatINRNumber(totals.subtotal)}
              </div>
            </div>

            {/* Discount */}
            <div className="text-center px-1 sm:px-3">
              <div className="text-[10px] sm:text-xs text-slate-300 font-medium uppercase tracking-wider mb-0.5">
                Discount
              </div>
              <div className="text-xs sm:text-base font-bold text-white tracking-tight">
                ₹ {formatINRNumber(totals.discountAmount)}
              </div>
            </div>

            {/* GST (if any) */}
            <div className="text-center px-1 sm:px-3">
              <div className="text-[10px] sm:text-xs text-slate-300 font-medium uppercase tracking-wider mb-0.5">
                {totals.gstEnabled ? `GST (${totals.gstRate}%)` : 'GST'}
              </div>
              <div className="text-xs sm:text-base font-bold text-white tracking-tight">
                ₹ {formatINRNumber(totals.gstAmount)}
              </div>
            </div>
          </div>

          {/* Right Column: Red Highlighted Total Panel with Navy Wedge Accents */}
          <div className="relative bg-[#E30613] text-white px-5 sm:px-8 py-3 sm:py-4 flex flex-col justify-center items-center sm:items-end min-w-[180px] sm:min-w-[260px]">
            {/* Diagonal Chevron Cut Accent for large screens */}
            <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-4 bg-[#073763] transform -skew-x-12 -translate-x-2" />

            <div className="text-[10.5px] sm:text-xs uppercase font-extrabold tracking-wider text-red-100">
              Total Amount
            </div>
            <div className="text-xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
              ₹ {formatINRNumber(totals.totalAmount)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
