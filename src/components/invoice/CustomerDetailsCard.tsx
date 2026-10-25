'use client';

import React from 'react';
import { User, Phone, MapPin } from 'lucide-react';
import { useInvoiceStore } from '@/store/useInvoiceStore';

export function CustomerDetailsCard() {
  const { invoice, updateCustomer } = useInvoiceStore();
  const { customer } = invoice;

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header bar with navy background and red chamfer */}
      <div className="relative bg-[#073763] px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
          <User className="size-4 text-white" />
          <span>Customer Details</span>
        </div>
        {/* Red diagonal accent tab in top right */}
        <div className="w-4 h-full absolute right-0 top-0 bottom-0 bg-[#E30613] transform skew-x-12 origin-top-right" />
      </div>

      {/* Form Fields */}
      <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3.5 flex-1 text-xs">
        {/* Customer Name */}
        <div>
          <label className="block text-[10.5px] sm:text-[11px] font-bold text-[#073763] uppercase tracking-wide mb-1">
            Customer Name <span className="text-[#E30613]">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={customer.name}
              onChange={(e) => updateCustomer({ name: e.target.value })}
              placeholder="e.g. Rajesh Kumar"
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 sm:py-2 text-slate-800 placeholder-slate-400 font-medium outline-hidden focus:border-[#073763] focus:bg-white focus:ring-1 focus:ring-[#073763]/20 transition-all text-xs"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-[10.5px] sm:text-[11px] font-bold text-[#073763] uppercase tracking-wide mb-1">
            Phone Number <span className="text-[#E30613]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1.5 sm:top-2 text-slate-400">
              <Phone className="size-3.5" />
            </span>
            <input
              type="tel"
              value={customer.phone}
              onChange={(e) => updateCustomer({ phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 sm:py-2 text-slate-800 placeholder-slate-400 font-medium outline-hidden focus:border-[#073763] focus:bg-white focus:ring-1 focus:ring-[#073763]/20 transition-all text-xs"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-[10.5px] sm:text-[11px] font-bold text-[#073763] uppercase tracking-wide mb-1">
            Address
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 sm:top-2.5 text-slate-400">
              <MapPin className="size-3.5" />
            </span>
            <textarea
              rows={2}
              value={customer.address}
              onChange={(e) => updateCustomer({ address: e.target.value })}
              placeholder="Street name, Area, City, Pin Code"
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 sm:py-2 text-slate-800 placeholder-slate-400 font-medium outline-hidden focus:border-[#073763] focus:bg-white focus:ring-1 focus:ring-[#073763]/20 transition-all text-xs resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
