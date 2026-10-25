'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Search, Sparkles, Layers, Wrench } from 'lucide-react';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { ServiceCatalogueDialog } from './ServiceCatalogueDialog';
import { ServiceDescriptionAutocomplete } from './ServiceDescriptionAutocomplete';
import { formatINRNumber } from '@/lib/formatters';

export function ServiceItemEditor() {
  const { invoice, addItem, addLabourCostItem, updateItem, removeItem } = useInvoiceStore();
  const { items } = invoice;

  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [targetRowId, setTargetRowId] = useState<string | undefined>(undefined);

  const openCatalogueForSpecificRow = (rowId: string) => {
    setTargetRowId(rowId);
    setCatalogueOpen(true);
  };

  const openCatalogueToAddNew = () => {
    setTargetRowId(undefined);
    setCatalogueOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden mb-3.5 sm:mb-6">
      {/* Table Header Section */}
      <div className="bg-[#073763] px-3 py-2.5 sm:px-4 sm:py-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-white">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Layers className="size-3.5 sm:size-4 text-white" />
          <h3 className="font-bold text-[11px] sm:text-xs uppercase tracking-wider">
            Line Items ({items.length})
          </h3>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => addLabourCostItem()}
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 rounded-lg text-[11px] sm:text-xs font-bold transition-colors cursor-pointer"
            title="Add or ensure Labour Cost line item exists"
          >
            <Wrench className="size-3 sm:size-3.5 text-amber-300" />
            <span className="hidden sm:inline">+ Labour Cost</span>
            <span className="sm:hidden">+ Labour</span>
          </button>
          <button
            type="button"
            onClick={openCatalogueToAddNew}
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-[#E30613] hover:bg-red-700 text-white rounded-lg text-[11px] sm:text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Search className="size-3 sm:size-3.5" />
            <span className="hidden sm:inline">Browse Catalogue</span>
            <span className="sm:hidden">Catalogue</span>
          </button>
          <button
            type="button"
            onClick={() => addItem()}
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-[11px] sm:text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="size-3 sm:size-3.5" />
            <span className="hidden sm:inline">Add Row</span>
            <span className="sm:hidden">+ Row</span>
          </button>
        </div>
      </div>

      {/* Desktop & Tablet Table (Hidden on small mobile screens to prevent cramped horizontal scrolling) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#073763]/90 text-white text-[11px] font-bold uppercase tracking-wider">
              <th className="py-2.5 px-3 text-center w-12">S.No</th>
              <th className="py-2.5 px-4 min-w-[280px]">Service / Part Description</th>
              <th className="py-2.5 px-3 text-center w-24">Qty</th>
              <th className="py-2.5 px-4 text-right w-36">Unit Price (₹)</th>
              <th className="py-2.5 px-4 text-right w-36">Amount (₹)</th>
              <th className="py-2.5 px-3 text-center w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                {/* S.No */}
                <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                  {idx + 1}
                </td>

                {/* Description + Catalogue picker */}
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    {/labou?r/i.test(item.description) && (
                      <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        Labour
                      </span>
                    )}
                    <ServiceDescriptionAutocomplete
                      value={item.description}
                      onChange={(val) => updateItem(item.id, { description: val })}
                      placeholder="Type service description or choose from catalogue..."
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 placeholder-slate-400 font-medium outline-hidden focus:border-[#073763] focus:bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => openCatalogueForSpecificRow(item.id)}
                      title="Select from Catalogue"
                      className="shrink-0 p-1.5 rounded bg-slate-100 hover:bg-[#073763] hover:text-white text-slate-600 transition-colors cursor-pointer"
                    >
                      <Search className="size-3.5" />
                    </button>
                  </div>
                </td>

                {/* Qty */}
                <td className="py-2 px-2 text-center">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      updateItem(item.id, { quantity: isNaN(val) ? 0 : Math.max(0, val) });
                    }}
                    placeholder="1"
                    className="w-20 text-center bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-800 font-semibold outline-hidden focus:border-[#073763] focus:bg-white text-xs"
                  />
                </td>

                {/* Unit Price (Entered Manually) */}
                <td className="py-2 px-3 text-right">
                  <div className="relative inline-block w-full">
                    <span className="absolute left-2.5 top-1.5 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.unitPrice === 0 ? '' : item.unitPrice}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        updateItem(item.id, { unitPrice: isNaN(val) ? 0 : Math.max(0, val) });
                      }}
                      placeholder="0.00"
                      className="w-full pl-6 pr-2.5 py-1.5 text-right bg-slate-50 border border-slate-200 rounded text-slate-800 font-bold outline-hidden focus:border-[#073763] focus:bg-white text-xs"
                    />
                  </div>
                </td>

                {/* Amount */}
                <td className="py-2.5 px-4 text-right font-black text-slate-800 text-xs">
                  ₹ {formatINRNumber(item.amount)}
                </td>

                {/* Remove Row */}
                <td className="py-2 px-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    title="Remove item"
                    className="p-1.5 text-slate-300 hover:text-red-600 transition-colors rounded cursor-pointer group-hover:text-slate-400"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (Designed specifically for 360px+ screens) */}
      <div className="block md:hidden p-2.5 space-y-2.5 bg-slate-50/50">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200 shadow-2xs space-y-2 relative"
          >
            {/* Top row: S.No + Badges + Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#073763] text-white font-bold text-[10px]">
                  Item #{idx + 1}
                </span>
                {/labou?r/i.test(item.description) && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Labour
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-slate-400 hover:text-red-600 p-1 rounded"
              >
                <Trash2 className="size-3.5 text-slate-400" />
              </button>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                Service / Part Description
              </label>
              <div className="flex items-center gap-1.5">
                <ServiceDescriptionAutocomplete
                  value={item.description}
                  onChange={(val) => updateItem(item.id, { description: val })}
                  placeholder="Service description..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium outline-hidden focus:border-[#073763] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => openCatalogueForSpecificRow(item.id)}
                  title="Pick from catalogue"
                  className="p-1.5 rounded-lg bg-[#073763] text-white shrink-0"
                >
                  <Search className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Qty, Unit Price, Amount */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                  Qty
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={item.quantity === 0 ? '' : item.quantity}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    updateItem(item.id, { quantity: isNaN(val) ? 0 : Math.max(0, val) });
                  }}
                  placeholder="1"
                  className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-1 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                  Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={item.unitPrice === 0 ? '' : item.unitPrice}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    updateItem(item.id, { unitPrice: isNaN(val) ? 0 : Math.max(0, val) });
                  }}
                  placeholder="0"
                  className="w-full text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5 text-right">
                  Amount
                </label>
                <div className="py-1 text-right font-black text-xs text-[#073763]">
                  ₹ {formatINRNumber(item.amount)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-2.5 sm:p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => addItem()}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white border border-slate-200 hover:border-[#073763] text-[#073763] rounded-lg text-[11px] sm:text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add Row</span>
          </button>
          <button
            type="button"
            onClick={() => addLabourCostItem()}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-amber-50 border border-amber-200 hover:border-amber-400 text-amber-900 rounded-lg text-[11px] sm:text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Wrench className="size-3.5 text-amber-600" />
            <span>+ Labour Cost</span>
          </button>
        </div>

        <span className="text-[10px] sm:text-[11px] text-slate-500 italic">
          * Unit prices are entered manually and line amounts calculate immediately.
        </span>
      </div>

      {/* Catalogue Dialog */}
      <ServiceCatalogueDialog
        open={catalogueOpen}
        onClose={() => setCatalogueOpen(false)}
        targetItemId={targetRowId}
      />
    </div>
  );
}
