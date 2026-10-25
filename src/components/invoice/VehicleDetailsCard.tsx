'use client';

import React from 'react';
import { Car, Gauge, Calendar, ShieldCheck } from 'lucide-react';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { ALL_MAKES, findVehicleMake } from '@/data/vehicleCatalogue';
import { VehicleModelAutocomplete } from './VehicleModelAutocomplete';

export function VehicleDetailsCard() {
  const { invoice, updateVehicle } = useInvoiceStore();
  const { vehicle } = invoice;
  const matchedMake = findVehicleMake(vehicle.make);

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header bar with navy background and red chamfer */}
      <div className="relative bg-[#073763] px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
          <Car className="size-4 text-white" />
          <span>Vehicle Details</span>
        </div>
        {/* Red diagonal accent tab in top right */}
        <div className="w-4 h-full absolute right-0 top-0 bottom-0 bg-[#E30613] transform skew-x-12 origin-top-right" />
      </div>

      {/* Form Fields */}
      <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3 flex-1 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* Vehicle Make */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10.5px] sm:text-[11px] font-bold text-[#073763] uppercase tracking-wide">
                Vehicle Make <span className="text-[#E30613]">*</span>
              </label>
              {matchedMake && (
                <span className="text-[10px] text-slate-400 font-medium">
                  {matchedMake.models.length} models
                </span>
              )}
            </div>
            <input
              type="text"
              list="popular-makes"
              value={vehicle.make}
              onChange={(e) => updateVehicle({ make: e.target.value })}
              placeholder="e.g. Hyundai"
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 sm:py-2 text-slate-800 placeholder-slate-400 font-medium outline-hidden focus:border-[#073763] focus:bg-white focus:ring-1 focus:ring-[#073763]/20 transition-all text-xs"
            />
            <datalist id="popular-makes">
              {ALL_MAKES.map((make) => (
                <option key={make} value={make} />
              ))}
            </datalist>
          </div>

          {/* Model */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10.5px] sm:text-[11px] font-bold text-[#073763] uppercase tracking-wide">
                Model <span className="text-[#E30613]">*</span>
              </label>
              {matchedMake ? (
                <span className="text-[10px] text-[#073763] font-semibold truncate max-w-[120px]">
                  {matchedMake.make}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">All brands</span>
              )}
            </div>
            <VehicleModelAutocomplete
              value={vehicle.model}
              onChange={(model) => updateVehicle({ model })}
              selectedMake={vehicle.make}
              onSelectMakeIfEmpty={(make) => updateVehicle({ make })}
              placeholder="e.g. Creta SX (O)"
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 sm:py-2 text-slate-800 placeholder-slate-400 font-medium outline-hidden focus:border-[#073763] focus:bg-white focus:ring-1 focus:ring-[#073763]/20 transition-all text-xs"
            />
          </div>
        </div>

        {/* Registration Number */}
        <div>
          <label className="block text-[10.5px] sm:text-[11px] font-bold text-[#073763] uppercase tracking-wide mb-1">
            Registration No <span className="text-[#E30613]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1.5 sm:top-2 text-slate-400">
              <ShieldCheck className="size-3.5" />
            </span>
            <input
              type="text"
              value={vehicle.registrationNo}
              onChange={(e) => updateVehicle({ registrationNo: e.target.value.toUpperCase() })}
              placeholder="e.g. TN 02 BK 7890"
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 sm:py-2 text-slate-800 placeholder-slate-400 font-bold uppercase tracking-wider outline-hidden focus:border-[#073763] focus:bg-white focus:ring-1 focus:ring-[#073763]/20 transition-all text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* Odometer Reading */}
          <div>
            <label className="block text-[10.5px] sm:text-[11px] font-bold text-[#073763] uppercase tracking-wide mb-1">
              Odometer Reading
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400">
                <Gauge className="size-3.5" />
              </span>
              <input
                type="text"
                value={vehicle.odometer}
                onChange={(e) => updateVehicle({ odometer: e.target.value.replace(/[^0-9]/g, '') })}
                placeholder="45250"
                className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-10 py-1.5 sm:py-2 text-slate-800 placeholder-slate-400 font-medium outline-hidden focus:border-[#073763] focus:bg-white focus:ring-1 focus:ring-[#073763]/20 transition-all text-xs"
              />
              <span className="absolute right-3 text-slate-400 font-bold text-[11px]">km</span>
            </div>
          </div>

          {/* Service Date */}
          <div>
            <label className="block text-[10.5px] sm:text-[11px] font-bold text-[#073763] uppercase tracking-wide mb-1">
              Service Date
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1.5 sm:top-2 text-slate-400 pointer-events-none">
                <Calendar className="size-3.5" />
              </span>
              <input
                type="date"
                value={vehicle.serviceDate || invoice.invoiceDate}
                onChange={(e) => updateVehicle({ serviceDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 sm:py-2 text-slate-800 font-medium outline-hidden focus:border-[#073763] focus:bg-white focus:ring-1 focus:ring-[#073763]/20 transition-all text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
