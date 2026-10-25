'use client';

import React from 'react';
import { Phone, Mail, MapPin, FileText, Calendar, Tag, Hash, RefreshCw } from 'lucide-react';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { HenrichBrand } from './HenrichBrand';
import { generateInvoiceNumber } from '@/lib/formatters';

export function InvoiceHeader() {
  const { invoice, updateMetadata } = useInvoiceStore();

  const handleRegenerateNumber = () => {
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    updateMetadata({ invoiceNumber: generateInvoiceNumber(randomSeq) });
  };

  return (
    <header className="w-full bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden mb-3.5 sm:mb-6">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row items-stretch justify-between relative bg-white">
        {/* Left: Brand Identity */}
        <div className="p-3 sm:p-6 flex items-center shrink-0">
          <HenrichBrand size="lg" />
        </div>

        {/* Right: Angled Contact Card */}
        <div className="relative bg-[#073763] text-white p-3 sm:p-5 sm:pl-10 flex flex-col justify-center gap-1 sm:gap-1.5 lg:min-w-[380px] lg:clip-path-banner">
          {/* Decorative red angled line on desktop */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-3 bg-[#E30613] transform -skew-x-12 -translate-x-1" />

          {/* Phone */}
          <a
            href="tel:+919884089447"
            className="flex items-center gap-2 text-xs sm:text-sm font-bold hover:text-red-300 transition-colors"
          >
            <div className="size-4.5 sm:size-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Phone className="size-2.5 sm:size-3 text-white fill-white" />
            </div>
            <span>+91 98840 89447</span>
          </a>

          {/* Email */}
          <a
            href="mailto:henrichautomotivesolution@gmail.com"
            className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-200 hover:text-white transition-colors"
          >
            <div className="size-4.5 sm:size-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Mail className="size-2.5 sm:size-3 text-white" />
            </div>
            <span className="truncate">henrichautomotivesolution@gmail.com</span>
          </a>

          {/* Address */}
          <div className="flex items-start gap-2 text-[10px] sm:text-[11px] text-slate-300 leading-tight mt-0.5">
            <div className="size-4.5 sm:size-5 rounded-full bg-red-600/30 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="size-2.5 sm:size-3 text-[#E30613]" />
            </div>
            <div>
              <span className="font-bold text-[#E30613] block">Our Location</span>
              <span>No. 15/29, 1st Street, Kamaraj Nagar, Avadi, Chennai - 600 071. India.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Horizontal Separator */}
      <div className="flex h-1.5 w-full">
        <div className="w-[72%] bg-[#073763]" />
        <div className="w-[28%] bg-[#E30613]" />
      </div>

      {/* Invoice Title & Metadata Panel */}
      <div className="p-3 sm:p-6 bg-slate-50/60 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Title */}
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center gap-1.5 text-xl sm:text-3xl font-black tracking-tight">
            <span className="text-[#073763]">SERVICE</span>
            <span className="text-[#E30613]">INVOICE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-10 sm:w-12 bg-[#073763] rounded-full" />
            <div className="h-1 w-3 sm:w-4 bg-[#E30613] rounded-full" />
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Official Billing Record</span>
          </div>
        </div>

        {/* Metadata Controls */}
        <div className="bg-white p-2.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 md:gap-5">
          <div className="hidden sm:flex size-11 rounded-lg bg-[#073763] text-white items-center justify-center shrink-0 shadow-xs">
            <FileText className="size-6 text-white" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-xs">
            {/* Invoice No */}
            <div className="pt-1 sm:pt-0 sm:px-2 flex flex-col justify-center">
              <div className="flex items-center justify-between gap-2 text-slate-500 font-medium mb-1">
                <span className="flex items-center gap-1 text-[#073763] font-semibold text-[11px] sm:text-xs">
                  <Hash className="size-3 text-[#073763]" /> Invoice No
                </span>
                <button
                  type="button"
                  onClick={handleRegenerateNumber}
                  title="Generate New Number"
                  className="text-slate-400 hover:text-[#073763] transition-colors p-0.5 rounded cursor-pointer"
                >
                  <RefreshCw className="size-3" />
                </button>
              </div>
              <input
                type="text"
                value={invoice.invoiceNumber}
                onChange={(e) => updateMetadata({ invoiceNumber: e.target.value })}
                className="font-bold text-[#E30613] text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-hidden focus:border-[#073763] focus:bg-white w-full"
                placeholder="HAS-2026-0001"
              />
            </div>

            {/* Date */}
            <div className="pt-2 sm:pt-0 sm:px-3 flex flex-col justify-center">
              <span className="flex items-center gap-1 text-[#073763] font-semibold mb-1 text-[11px] sm:text-xs">
                <Calendar className="size-3 text-[#073763]" /> Date
              </span>
              <input
                type="date"
                value={invoice.invoiceDate}
                onChange={(e) => updateMetadata({ invoiceDate: e.target.value })}
                className="font-semibold text-slate-800 text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-hidden focus:border-[#073763] focus:bg-white w-full"
              />
            </div>

            {/* Service Type */}
            <div className="pt-2 sm:pt-0 sm:pl-3 flex flex-col justify-center">
              <span className="flex items-center gap-1 text-[#073763] font-semibold mb-1 text-[11px] sm:text-xs">
                <Tag className="size-3 text-[#073763]" /> Service Type
              </span>
              <select
                value={invoice.serviceType}
                onChange={(e) => updateMetadata({ serviceType: e.target.value })}
                className="font-semibold text-slate-800 text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-hidden focus:border-[#073763] focus:bg-white cursor-pointer w-full"
              >
                <option value="General Service">General Service</option>
                <option value="Periodic Maintenance">Periodic Maintenance</option>
                <option value="Major Service">Major Service</option>
                <option value="Mechanical Repair">Mechanical Repair</option>
                <option value="Electrical Diagnosis">Electrical Diagnosis</option>
                <option value="Brake & Suspension">Brake & Suspension</option>
                <option value="AC Overhaul">AC Overhaul</option>
                <option value="BS6 / DPF Service">BS6 / DPF Service</option>
                <option value="Custom Service">Custom Service</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
