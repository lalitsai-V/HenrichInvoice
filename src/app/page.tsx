'use client';

import React, { useState, useEffect } from 'react';
import { InvoiceNavbar } from '@/components/invoice/InvoiceNavbar';
import { InvoiceHeader } from '@/components/invoice/InvoiceHeader';
import { CustomerDetailsCard } from '@/components/invoice/CustomerDetailsCard';
import { VehicleDetailsCard } from '@/components/invoice/VehicleDetailsCard';
import { ServiceItemEditor } from '@/components/invoice/ServiceItemEditor';
import { InvoiceTotalsCard } from '@/components/invoice/InvoiceTotalsCard';
import { InvoiceFooter } from '@/components/invoice/InvoiceFooter';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { InvoiceHistoryDialog } from '@/components/invoice/InvoiceHistoryDialog';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { InvoiceData } from '@/types/invoice';

export default function Home() {
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { loadInvoice } = useInvoiceStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-full border-3 border-[#073763] border-t-[#E30613] animate-spin" />
          <span className="text-xs font-bold text-[#073763] tracking-wider uppercase">
            Loading Henrich Invoice Generator...
          </span>
        </div>
      </div>
    );
  }

  const handleSelectInvoiceFromHistory = (selected: InvoiceData) => {
    loadInvoice(selected);
    setViewMode('editor');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 pb-24 sm:pb-28 md:pb-12 text-slate-900">
      {/* Top Navbar */}
      <InvoiceNavbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenHistory={() => setHistoryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-2.5 sm:px-6 lg:px-8 py-3.5 sm:py-6">
        {viewMode === 'editor' ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Top Brand Header & Metadata */}
            <InvoiceHeader />

            {/* Customer & Vehicle Details (2-column on desktop, single-column on mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 items-stretch">
              <CustomerDetailsCard />
              <VehicleDetailsCard />
            </div>

            {/* Service / Part Line Items Editor */}
            <ServiceItemEditor />

            {/* Totals Section */}
            <InvoiceTotalsCard />

            {/* Footer with service icons */}
            <InvoiceFooter />
          </div>
        ) : (
          /* Live A4 Sheet Preview */
          <InvoicePreview />
        )}
      </main>

      {/* Saved Invoices Modal */}
      <InvoiceHistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectInvoice={handleSelectInvoiceFromHistory}
      />
    </div>
  );
}
