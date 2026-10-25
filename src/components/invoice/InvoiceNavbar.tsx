'use client';

import React from 'react';
import {
  FilePlus2,
  Save,
  History,
  Download,
  Eye,
  Edit3,
} from 'lucide-react';
import { HenrichBrand } from './HenrichBrand';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { generateInvoicePDF, downloadPDF } from '@/lib/pdfGenerator';
import { toast } from 'sonner';

interface InvoiceNavbarProps {
  viewMode: 'editor' | 'preview';
  setViewMode: (mode: 'editor' | 'preview') => void;
  onOpenHistory: () => void;
}

export function InvoiceNavbar({ viewMode, setViewMode, onOpenHistory }: InvoiceNavbarProps) {
  const { invoice, savedInvoices, isDirty, saveInvoiceToHistory, resetInvoice } = useInvoiceStore();
  const [downloading, setDownloading] = React.useState(false);

  const handleSave = () => {
    const res = saveInvoiceToHistory();
    if (res.success) {
      toast.success(res.message);
    }
  };

  const handleNewInvoice = () => {
    if (isDirty) {
      if (confirm('You have unsaved changes in the current invoice. Discard and create new?')) {
        resetInvoice();
        toast.info('Created new invoice draft');
      }
    } else {
      resetInvoice();
      toast.info('Created new invoice draft');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const blob = await generateInvoicePDF(invoice);
      const filename = `${invoice.invoiceNumber || 'HAS-Invoice'}.pdf`;
      downloadPDF(blob, filename);
      toast.success(`Downloaded ${filename}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      {/* Top Main Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-2 border-slate-200/90 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 md:h-22 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <HenrichBrand size="md" />
          </div>

          {/* Mode Switcher Tabs (Desktop & Tablet) */}
          <div className="hidden md:flex items-center bg-slate-100/90 p-1.5 rounded-xl border border-slate-200 text-sm font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'editor'
                  ? 'bg-white text-[#073763] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="size-4 text-[#073763]" />
              <span className="font-bold">Invoice Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-[#073763] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="size-4" />
              <span className="font-bold">A4 Live Preview</span>
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* New Invoice */}
            <button
              type="button"
              onClick={handleNewInvoice}
              title="Create New Invoice"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer border border-slate-200/70"
            >
              <FilePlus2 className="size-4 text-slate-500" />
              <span>New</span>
            </button>

            {/* History */}
            <button
              type="button"
              onClick={onOpenHistory}
              title="View Saved Invoices"
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors relative cursor-pointer border border-slate-200/70"
            >
              <History className="size-3.5 sm:size-4 text-slate-500" />
              <span className="hidden sm:inline">History</span>
              {savedInvoices.length > 0 && (
                <span className="size-4 sm:size-4.5 rounded-full bg-[#073763] text-white text-[10px] sm:text-[11px] font-black flex items-center justify-center">
                  {savedInvoices.length}
                </span>
              )}
            </button>

            {/* Save to History */}
            <button
              type="button"
              onClick={handleSave}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer border ${
                isDirty
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs border-amber-600 animate-pulse'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200/70'
              }`}
            >
              <Save className="size-4" />
              <span>Save</span>
            </button>

            {/* Download PDF Button */}
            <button
              type="button"
              disabled={downloading}
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-black bg-[#E30613] hover:bg-red-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Download className="size-3.5 sm:size-4 text-white" />
              <span className="tracking-wide">{downloading ? 'PDF...' : 'PDF'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Floating Bottom Bar for One-Thumb Ergonomics */}
      <div className="md:hidden fixed bottom-3 inset-x-3 z-40 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl p-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'editor' ? 'preview' : 'editor')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-[#073763]"
        >
          {viewMode === 'editor' ? (
            <>
              <Eye className="size-4" />
              <span>Preview A4</span>
            </>
          ) : (
            <>
              <Edit3 className="size-4" />
              <span>Edit Form</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="p-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700"
          title="Save Invoice"
        >
          <Save className="size-4 text-slate-700" />
        </button>

        <button
          type="button"
          disabled={downloading}
          onClick={handleDownloadPDF}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs bg-[#E30613] text-white shadow-sm"
        >
          <Download className="size-4" />
          <span>{downloading ? 'Generating...' : 'Download PDF'}</span>
        </button>
      </div>
    </>
  );
}
