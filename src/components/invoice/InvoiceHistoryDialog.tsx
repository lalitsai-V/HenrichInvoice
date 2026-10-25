'use client';

import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  FileText,
  Download,
  Trash2,
  FolderOpen,
  X,
  FileDown,
  Calendar,
  Car,
  User,
  AlertTriangle,
} from 'lucide-react';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { formatDateForDisplay, formatINR } from '@/lib/formatters';
import { generateInvoicePDF, downloadPDF } from '@/lib/pdfGenerator';
import { InvoiceData } from '@/types/invoice';
import { toast } from 'sonner';

interface InvoiceHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectInvoice: (invoice: InvoiceData) => void;
}

export function InvoiceHistoryDialog({ open, onClose, onSelectInvoice }: InvoiceHistoryDialogProps) {
  const { savedInvoices, deleteSavedInvoice, clearHistory, isDirty } = useInvoiceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingLoadInvoice, setPendingLoadInvoice] = useState<InvoiceData | null>(null);

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return savedInvoices;
    return savedInvoices.filter(
      (inv) =>
        inv.invoiceNumber?.toLowerCase().includes(q) ||
        inv.customer?.name?.toLowerCase().includes(q) ||
        inv.customer?.phone?.includes(q) ||
        inv.vehicle?.registrationNo?.toLowerCase().includes(q) ||
        inv.vehicle?.make?.toLowerCase().includes(q) ||
        inv.vehicle?.model?.toLowerCase().includes(q)
    );
  }, [savedInvoices, searchQuery]);

  if (!open) return null;

  const handleOpenInvoice = (inv: InvoiceData) => {
    if (isDirty) {
      setPendingLoadInvoice(inv);
    } else {
      onSelectInvoice(inv);
      toast.success(`Loaded invoice ${inv.invoiceNumber}`);
      onClose();
    }
  };

  const confirmDiscardAndLoad = () => {
    if (pendingLoadInvoice) {
      onSelectInvoice(pendingLoadInvoice);
      toast.success(`Loaded invoice ${pendingLoadInvoice.invoiceNumber}`);
      setPendingLoadInvoice(null);
      onClose();
    }
  };

  const handleDownloadDirectPDF = async (inv: InvoiceData, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      toast.info(`Preparing PDF for ${inv.invoiceNumber}...`);
      const blob = await generateInvoicePDF(inv);
      downloadPDF(blob, `${inv.invoiceNumber || 'HAS-Invoice'}.pdf`);
      toast.success(`Downloaded ${inv.invoiceNumber}.pdf`);
    } catch (err) {
      console.error(err);
      toast.error('Could not generate PDF');
    }
  };

  const handleExportBackup = () => {
    if (savedInvoices.length === 0) {
      toast.error('No saved invoices to export.');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedInvoices, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `henrich-invoices-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Invoice history exported as JSON');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] sm:max-h-[85vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#073763] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <History className="size-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">Invoice History</h2>
              <p className="text-xs text-blue-100">
                {savedInvoices.length} {savedInvoices.length === 1 ? 'invoice' : 'invoices'} stored in browser storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedInvoices.length > 0 && (
              <button
                type="button"
                onClick={handleExportBackup}
                title="Export JSON Backup"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <FileDown className="size-3.5" />
                <span>Export JSON</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Warning Modal if user has unsaved draft */}
        {pendingLoadInvoice && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-3 text-xs text-amber-900 shrink-0">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">You have unsaved changes in your current invoice!</p>
              <p className="text-amber-800 mt-0.5">
                Opening <strong>{pendingLoadInvoice.invoiceNumber}</strong> will replace your active unsaved form data.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={confirmDiscardAndLoad}
                  className="px-3 py-1 bg-[#E30613] text-white font-bold rounded hover:bg-red-700 transition-colors"
                >
                  Discard & Open
                </button>
                <button
                  onClick={() => setPendingLoadInvoice(null)}
                  className="px-3 py-1 bg-white border border-amber-300 rounded font-medium hover:bg-amber-100 text-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Invoice No, Customer Name, Phone, Registration No..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm placeholder-slate-400 outline-hidden focus:border-[#073763] focus:ring-2 focus:ring-[#073763]/20 shadow-xs"
            />
          </div>
        </div>

        {/* Invoice List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {filteredInvoices.length === 0 ? (
            <div className="py-14 text-center text-slate-400">
              <FileText className="size-12 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="font-semibold text-sm text-slate-600">
                {savedInvoices.length === 0 ? 'No invoices saved yet.' : 'No matching invoices found.'}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {savedInvoices.length === 0
                  ? 'Click "Save Invoice" in the top bar to save invoices to this device for future retrieval or re-download.'
                  : 'Try adjusting your search terms.'}
              </p>
            </div>
          ) : (
            filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                onClick={() => handleOpenInvoice(inv)}
                className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-[#073763] hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left Info */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#073763] group-hover:text-[#E30613] transition-colors">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
                      {inv.serviceType || 'General Service'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-medium text-slate-800">
                      <User className="size-3 text-slate-400" />
                      {inv.customer?.name || 'Walk-in Customer'}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Car className="size-3 text-slate-400" />
                      {inv.vehicle?.registrationNo || `${inv.vehicle?.make || ''} ${inv.vehicle?.model || ''}` || '—'}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="size-3" />
                      {formatDateForDisplay(inv.invoiceDate)}
                    </span>
                  </div>
                </div>

                {/* Right Amount + Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Total</div>
                    <div className="text-sm sm:text-base font-extrabold text-[#073763]">
                      {formatINR(inv.totals?.totalAmount || 0)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleOpenInvoice(inv)}
                      title="Open & Edit"
                      className="p-2 rounded-lg bg-slate-100 hover:bg-[#073763] hover:text-white text-slate-700 transition-colors"
                    >
                      <FolderOpen className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDownloadDirectPDF(inv, e)}
                      title="Download PDF"
                      className="p-2 rounded-lg bg-slate-100 hover:bg-[#E30613] hover:text-white text-slate-700 transition-colors"
                    >
                      <Download className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete invoice ${inv.invoiceNumber} from history?`)) {
                          deleteSavedInvoice(inv.id);
                          toast.success('Invoice deleted');
                        }
                      }}
                      title="Delete Invoice"
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="text-[11px]">
            Saved on this browser's local storage.
          </span>
          {savedInvoices.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Clear all saved invoice history? This cannot be undone.')) {
                  clearHistory();
                  toast.success('History cleared');
                }
              }}
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Clear All History
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
