'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Check, AlertCircle, Wrench, Sparkles, X } from 'lucide-react';
import { SERVICE_CATALOGUE, ALL_FLAT_SERVICES, FlatServiceItem } from '@/data/serviceCatalogue';
import { useInvoiceStore } from '@/store/useInvoiceStore';

interface ServiceCatalogueDialogProps {
  open: boolean;
  onClose: () => void;
  targetItemId?: string; // If opening to fill a specific existing empty row
}

export function ServiceCatalogueDialog({ open, onClose, targetItemId }: ServiceCatalogueDialogProps) {
  const { addServicesFromCatalogue, updateItem, invoice } = useInvoiceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<FlatServiceItem[]>([]);

  // Filtered services
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ALL_FLAT_SERVICES.filter((svc) => {
      const matchesCategory = selectedCategoryId === 'all' || svc.categoryId === selectedCategoryId;
      const matchesQuery = !q || svc.name.toLowerCase().includes(q) || svc.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategoryId]);

  if (!open) return null;

  const isSelected = (svc: FlatServiceItem) =>
    selectedItems.some((s) => s.name.toLowerCase() === svc.name.toLowerCase());

  const toggleSelect = (svc: FlatServiceItem) => {
    if (isSelected(svc)) {
      setSelectedItems((prev) => prev.filter((s) => s.name.toLowerCase() !== svc.name.toLowerCase()));
    } else {
      setSelectedItems((prev) => [...prev, svc]);
    }
  };

  // Quick single add
  const handleQuickAdd = (svc: FlatServiceItem) => {
    if (targetItemId) {
      updateItem(targetItemId, { description: svc.name });
    } else {
      addServicesFromCatalogue([{ name: svc.name, category: svc.category }]);
    }
    onClose();
  };

  // Add all selected
  const handleAddSelected = () => {
    if (selectedItems.length === 0) return;

    if (targetItemId && selectedItems.length === 1) {
      updateItem(targetItemId, { description: selectedItems[0].name });
    } else {
      addServicesFromCatalogue(
        selectedItems.map((s) => ({ name: s.name, category: s.category }))
      );
    }
    setSelectedItems([]);
    onClose();
  };

  // Add custom service from search
  const handleAddCustom = () => {
    const customName = searchQuery.trim();
    if (!customName) return;

    if (targetItemId) {
      updateItem(targetItemId, { description: customName });
    } else {
      addServicesFromCatalogue([{ name: customName, category: 'Custom' }]);
    }
    setSearchQuery('');
    onClose();
  };

  const activeCategoryObj = SERVICE_CATALOGUE.find((c) => c.id === selectedCategoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] sm:max-h-[85vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#073763] to-[#0A4A85] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Wrench className="size-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">Service Catalogue</h2>
              <p className="text-xs text-blue-100">
                Browse 11 categories • Select single or multiple services
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/70 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 11 categories (e.g. Brake Pad, Engine Oil, DPF, AC...)"
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 outline-hidden focus:border-[#073763] focus:ring-2 focus:ring-[#073763]/20 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Custom service quick-add prompt if searched and no exact match */}
          {searchQuery.trim().length > 1 && (
            <div className="mt-2.5 flex items-center justify-between gap-2 p-2 px-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
              <div className="flex items-center gap-2 truncate">
                <Sparkles className="size-3.5 text-amber-600 shrink-0" />
                <span className="truncate">
                  Add custom service: <strong className="font-semibold">"{searchQuery.trim()}"</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddCustom}
                className="shrink-0 font-bold text-xs bg-[#073763] text-white hover:bg-[#E30613] px-3 py-1 rounded transition-colors"
              >
                + Add Custom
              </button>
            </div>
          )}
        </div>

        {/* Category Pills Slider */}
        <div className="px-3 sm:px-4 py-2 border-b border-slate-100 bg-white overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategoryId === 'all'
                ? 'bg-[#073763] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({ALL_FLAT_SERVICES.length})
          </button>
          {SERVICE_CATALOGUE.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategoryId === cat.id
                  ? 'bg-[#073763] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name} ({cat.services.length})
            </button>
          ))}
        </div>

        {/* Category 9 Special BS6 Notice */}
        {(selectedCategoryId === 'cat-9' || activeCategoryObj?.note) && (
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2 text-xs text-[#073763] shrink-0">
            <AlertCircle className="size-4 text-[#073763] shrink-0" />
            <span>
              <strong>Note:</strong> {activeCategoryObj?.note || "Availability depends on the vehicle's equipment and BS6 configuration."}
            </span>
          </div>
        )}

        {/* Results Count & Service List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 divide-y divide-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Showing {filteredServices.length} {filteredServices.length === 1 ? 'Service' : 'Services'}
          </div>

          {filteredServices.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Wrench className="size-10 text-slate-300 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-sm">No standard service matched "{searchQuery}"</p>
              <p className="text-xs text-slate-400 mt-1">
                You can add it as a custom service or refine your search.
              </p>
              {searchQuery.trim() && (
                <button
                  onClick={handleAddCustom}
                  className="mt-4 inline-flex items-center gap-1.5 bg-[#073763] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#E30613] transition-colors"
                >
                  <Plus className="size-4" /> Add "{searchQuery.trim()}" to Invoice
                </button>
              )}
            </div>
          ) : (
            filteredServices.map((svc) => {
              const selected = isSelected(svc);
              return (
                <div
                  key={`${svc.categoryId}-${svc.name}`}
                  className={`pt-2 pb-2 flex items-center justify-between gap-3 px-3 rounded-xl transition-all cursor-pointer ${
                    selected ? 'bg-blue-50/80 border border-blue-200' : 'hover:bg-slate-50'
                  }`}
                  onClick={() => toggleSelect(svc)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`size-5 rounded-md flex items-center justify-center border transition-colors ${
                        selected
                          ? 'bg-[#073763] border-[#073763] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {selected && <Check className="size-3.5 stroke-[3]" />}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">
                        {svc.name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="inline-block px-1.5 py-0.2 bg-slate-200/80 text-slate-700 rounded text-[9px] font-medium">
                          {svc.category}
                        </span>
                        {svc.categoryNote && (
                          <span className="text-amber-700 font-medium">
                            • BS6 dependent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(svc)}
                      title="Quick Add single service"
                      className="text-xs font-bold px-2.5 py-1 bg-slate-100 hover:bg-[#073763] hover:text-white text-slate-700 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Plus className="size-3.5" /> Add
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 font-medium">
            {selectedItems.length > 0 ? (
              <span className="text-[#073763] font-bold">
                {selectedItems.length} {selectedItems.length === 1 ? 'service' : 'services'} selected
              </span>
            ) : (
              <span>Select checkboxes or click 'Add'</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedItems.length === 0}
              onClick={handleAddSelected}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                selectedItems.length > 0
                  ? 'bg-[#E30613] hover:bg-red-700 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Plus className="size-4" /> Add Selected ({selectedItems.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
