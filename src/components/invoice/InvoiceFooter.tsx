'use client';

import React from 'react';
import { Cog, Wrench, Droplet, Cpu } from 'lucide-react';

export function InvoiceFooter() {
  return (
    <footer className="w-full relative overflow-hidden bg-[#073763] text-white rounded-xl shadow-md border-[2.5px] sm:border-[3px] border-[#0A4A85]">
      {/* Top Bar: Company Name & Since */}
      <div className="px-3.5 sm:px-8 pt-2.5 pb-2 sm:pt-3.5 sm:pb-2.5 border-b border-white/20 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-white">
            HENRICH AUTOMOTIVE SOLUTIONS
          </span>
          <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#E30613] text-white shadow-xs">
            SINCE 2003
          </span>
        </div>
        <span className="text-[10.5px] sm:text-xs text-slate-300 font-medium text-center sm:text-right">
          Multi-Brand Car Service, Repairs & Advanced Diagnostics
        </span>
      </div>

      {/* Main Services Row: 2-col grid on mobile, row on desktop */}
      <div className="px-3.5 sm:px-8 py-2.5 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Service Capability Icons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 sm:gap-10 text-[11px] sm:text-[13px] font-black tracking-wider uppercase w-full sm:w-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 hover:text-red-300 transition-colors">
            <Cog className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
            <span>Engine Service</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 hover:text-red-300 transition-colors">
            <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
            <span>Repairs</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 hover:text-red-300 transition-colors">
            <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
            <span>Maintenance</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 hover:text-red-300 transition-colors">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
            <span>Diagnostics</span>
          </div>
        </div>

        {/* Diagonal Chevron Decorative Accents on Right */}
        <div className="hidden sm:flex items-center gap-2 h-7">
          <div className="w-4 h-full bg-[#E30613] transform -skew-x-24" />
          <div className="w-3 h-full bg-white transform -skew-x-24" />
          <div className="w-6 h-full bg-[#E30613] transform -skew-x-24" />
        </div>
      </div>
    </footer>
  );
}
