'use client';

import React from 'react';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  FileText,
  User,
  Car,
  Cog,
  Wrench,
  Droplet,
  Cpu,
  Download,
  Printer,
} from 'lucide-react';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { formatDateForDisplay, formatINRNumber } from '@/lib/formatters';
import { generateInvoicePDF, downloadPDF } from '@/lib/pdfGenerator';
import { toast } from 'sonner';
import { cn } from 'cn';

export function InvoicePreview() {
  const { invoice } = useInvoiceStore();
  const [downloading, setDownloading] = React.useState(false);
  const previewContainerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState<number>(1);
  const [fitToWidth, setFitToWidth] = React.useState<boolean>(true);

  React.useEffect(() => {
    const updateScale = () => {
      if (!fitToWidth) {
        setScale(1);
        return;
      }
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        if (containerWidth > 0 && containerWidth < 800) {
          setScale(Math.max(0.35, Math.min(1, (containerWidth - 8) / 794)));
          return;
        }
      }
      if (typeof window !== 'undefined') {
        const availableWidth = window.innerWidth - 20;
        if (availableWidth < 800) {
          setScale(Math.max(0.35, Math.min(1, availableWidth / 794)));
        } else {
          setScale(1);
        }
      }
    };

    updateScale();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && previewContainerRef.current) {
      ro = new ResizeObserver(() => {
        updateScale();
      });
      ro.observe(previewContainerRef.current);
    }

    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      if (ro) ro.disconnect();
    };
  }, [fitToWidth]);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const blob = await generateInvoicePDF(invoice);
      const filename = `${invoice.invoiceNumber || 'HAS-Invoice'}.pdf`;
      downloadPDF(blob, filename);
      toast.success(`Downloaded ${filename} successfully!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Only display actual items added by user - grows dynamically with items
  const displayRows = invoice.items.filter(
    (item) => item.description.trim() !== '' || item.unitPrice > 0 || item.amount > 0
  );
  const itemCount = displayRows.length;

  // Dynamic scaling:
  // For 1-2 items: grand & prominent!
  // As items increase: row height & font scale down smoothly to fit comfortably.
  const rowConfig = React.useMemo(() => {
    if (itemCount <= 2) {
      return {
        rowHeight: 'h-14 sm:h-16',
        paddingY: 'py-3.5',
        fontSize: 'text-sm',
        descSize: 'text-[14px] font-bold',
        amountSize: 'text-[15px] font-black',
        headerHeight: 'py-2.5',
        minTableHeight: 'min-h-[220px]',
      };
    } else if (itemCount <= 4) {
      return {
        rowHeight: 'h-11 sm:h-12',
        paddingY: 'py-2.5',
        fontSize: 'text-[12.5px]',
        descSize: 'text-[13px] font-bold',
        amountSize: 'text-sm font-extrabold',
        headerHeight: 'py-2',
        minTableHeight: 'min-h-[220px]',
      };
    } else if (itemCount <= 7) {
      return {
        rowHeight: 'h-9',
        paddingY: 'py-1.5',
        fontSize: 'text-xs',
        descSize: 'text-xs font-semibold',
        amountSize: 'text-xs font-bold',
        headerHeight: 'py-2',
        minTableHeight: 'min-h-[220px]',
      };
    } else if (itemCount <= 10) {
      return {
        rowHeight: 'h-7',
        paddingY: 'py-1',
        fontSize: 'text-[11px]',
        descSize: 'text-[11px] font-semibold',
        amountSize: 'text-[11px] font-bold',
        headerHeight: 'py-1.5',
        minTableHeight: 'min-h-[220px]',
      };
    } else {
      // 11+ items: compact to fit neatly
      return {
        rowHeight: 'h-6',
        paddingY: 'py-0.5',
        fontSize: 'text-[10px]',
        descSize: 'text-[10px] font-semibold',
        amountSize: 'text-[10px] font-bold',
        headerHeight: 'py-1',
        minTableHeight: 'min-h-[200px]',
      };
    }
  }, [itemCount]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Action Toolbar above preview */}
      <div className="w-full max-w-[800px] flex items-center justify-between bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center size-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 truncate max-w-[170px] sm:max-w-none">
            A4 Single-Page Invoice Preview
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Zoom / Fit Toggle */}
          <button
            type="button"
            onClick={() => setFitToWidth(!fitToWidth)}
            className="sm:hidden px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            {fitToWidth ? '100% Zoom' : 'Fit Screen'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Printer className="size-3.5" /> Print
          </button>
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-[#E30613] hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>{downloading ? 'PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Container: Responsive auto-scaling on mobile */}
      <div
        ref={previewContainerRef}
        className="w-full flex justify-center pb-24 overflow-x-auto"
        style={{
          minHeight: scale < 1 ? `${Math.round(1123 * scale + 24)}px` : 'auto',
        }}
      >
        {/* Constrains layout box to scaled dimensions on mobile */}
        <div
          className="invoice-scale-wrapper"
          style={{
            width: scale < 1 ? `${Math.round(794 * scale)}px` : '794px',
            height: scale < 1 ? `${Math.round(1123 * scale)}px` : '1123px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '794px',
              height: '1123px',
              transform: scale < 1 ? `scale(${scale})` : undefined,
              transformOrigin: 'top left',
              transition: 'transform 0.15s ease',
            }}
          >
            <div
              id="printable-invoice"
              className="w-[794px] h-[1123px] min-w-[794px] max-w-[794px] min-h-[1123px] max-h-[1123px] bg-white text-slate-800 shadow-2xl border border-slate-200 p-8 flex flex-col justify-between relative overflow-hidden select-none print:shadow-none print:border-none print:p-0 print:m-0"
              style={{ boxSizing: 'border-box' }}
            >
          {/* Top Section */}
          <div className="flex flex-col">
            {/* Top Header: Logo on left, Contact card on right */}
            <div className="flex items-stretch justify-between relative">
              {/* Brand Logo & Name */}
              <div className="flex items-center gap-4 py-1">
                <div className="relative w-24 h-16 shrink-0">
                  <Image
                    src="/henrich-logo.svg"
                    alt="Henrich Automotive Logo"
                    fill
                    className="object-contain"
                    unoptimized
                    priority
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[38px] font-black text-[#E30613] tracking-tight font-sans leading-none">
                    HENRICH
                  </span>
                  <span className="text-[13px] font-black tracking-wider text-[#073763] uppercase mt-1">
                    AUTOMOTIVE SOLUTIONS
                  </span>
                  <span className="text-[8px] font-bold tracking-tight text-[#073763] mt-1.5 opacity-90">
                    SERVICE <span className="text-[#E30613]">|</span> REPAIR{' '}
                    <span className="text-[#E30613]">|</span> MAINTENANCE{' '}
                    <span className="text-[#E30613]">|</span> DIAGNOSTICS
                  </span>
                </div>
              </div>

              {/* Right Contact Card with dynamic angled red tab and navy box */}
              <div className="flex items-stretch min-w-[310px]">
                {/* Angled Red Chamfer Tab */}
                <div
                  className="w-5 bg-[#E30613] shrink-0"
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
                />
                {/* Navy Contact Content Box */}
                <div className="bg-[#073763] text-white px-4 py-2.5 rounded-r flex-1 flex flex-col justify-center gap-1 text-[10px]">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <div className="size-4 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                      <Phone className="size-2.5 text-white fill-white" />
                    </div>
                    <span>+91 98840 89447</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200 text-[10px]">
                    <div className="size-4 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                      <Mail className="size-2.5 text-white" />
                    </div>
                    <span className="truncate">henrichautomotivesolution@gmail.com</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300 text-[9px] leading-tight">
                    <div className="size-4 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="size-2.5 text-[#E30613]" />
                    </div>
                    <div>
                      <span className="font-bold text-[#E30613] block">Our Location</span>
                      <span>No. 15/29, 1st Street, Kamaraj Nagar, Avadi, Chennai - 600 071. India.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Full-Width Header Separator Stripe */}
            <div className="flex h-2 w-full mt-3 mb-4 overflow-hidden rounded-xs">
              <div
                className="bg-[#E30613] h-full"
                style={{ width: '68%', clipPath: 'polygon(0 0, 100% 0, 97% 100%, 0 100%)' }}
              />
              <div
                className="bg-[#073763] h-full -ml-3"
                style={{ width: '34%', clipPath: 'polygon(3% 0, 100% 0, 100% 100%, 0 100%)' }}
              />
            </div>

            {/* Title & Metadata Card Row */}
            <div className="flex items-center justify-between mb-4">
              {/* Left Title: SERVICE INVOICE */}
              <div>
                <h1 className="text-3xl font-black tracking-tight leading-none">
                  <span className="text-[#073763]">SERVICE </span>
                  <span className="text-[#E30613]">INVOICE</span>
                </h1>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="h-1 w-14 bg-[#073763]" />
                  <div className="h-1 w-5 bg-[#E30613]" />
                </div>
              </div>

              {/* Right Metadata Card */}
              <div className="border border-slate-300 rounded-lg p-2 px-3.5 flex items-center gap-3 bg-white shadow-2xs">
                <div className="size-9 rounded-md bg-blue-50 border border-blue-200 text-[#073763] flex items-center justify-center shrink-0">
                  <FileText className="size-5 text-[#073763]" />
                </div>
                <div className="grid grid-cols-[82px_8px_1fr] text-[11px] gap-y-0.5 items-center">
                  <span className="font-bold text-[#073763]">Invoice No</span>
                  <span className="font-bold text-[#073763]">:</span>
                  <span className="font-bold text-[#E30613] tracking-wide">
                    {invoice.invoiceNumber || 'HAS-2025-001'}
                  </span>

                  <span className="font-bold text-[#073763]">Date</span>
                  <span className="font-bold text-[#073763]">:</span>
                  <span className="text-slate-800 font-medium">
                    {formatDateForDisplay(invoice.invoiceDate)}
                  </span>

                  <span className="font-bold text-[#073763]">Service Type</span>
                  <span className="font-bold text-[#073763]">:</span>
                  <span className="text-slate-800 font-medium">{invoice.serviceType || 'General Service'}</span>
                </div>
              </div>
            </div>

            {/* Customer & Vehicle Details Panels */}
            <div className="grid grid-cols-2 gap-3.5 mb-3.5 text-xs">
              {/* 1. Customer Details Panel */}
              <div className="border border-slate-300 rounded-lg overflow-hidden flex flex-col bg-white">
                <div className="relative bg-[#073763] text-white px-3 py-1.5 flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <User className="size-3.5 text-white" />
                    <span>Customer Details</span>
                  </span>
                  {/* Red angled tab on top right */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-3.5 bg-[#E30613]"
                    style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                  />
                </div>
                <div className="p-2.5 space-y-1.5 flex-1 text-[11px]">
                  <div className="grid grid-cols-[100px_8px_1fr] items-start border-b border-slate-100 pb-1">
                    <span className="font-bold text-[#073763]">Customer Name</span>
                    <span className="font-bold text-[#073763]">:</span>
                    <span className="font-medium text-slate-800">{invoice.customer.name || '—'}</span>
                  </div>
                  <div className="grid grid-cols-[100px_8px_1fr] items-start border-b border-slate-100 pb-1">
                    <span className="font-bold text-[#073763]">Phone Number</span>
                    <span className="font-bold text-[#073763]">:</span>
                    <span className="font-medium text-slate-800">{invoice.customer.phone || '—'}</span>
                  </div>
                  <div className="grid grid-cols-[100px_8px_1fr] items-start">
                    <span className="font-bold text-[#073763]">Address</span>
                    <span className="font-bold text-[#073763]">:</span>
                    <div className="min-w-0">
                      <span className="font-medium text-slate-800 line-clamp-1">
                        {invoice.customer.address || '—'}
                      </span>
                      {/* Clean job-card ruled underline lines */}
                      <div className="border-b border-slate-200 mt-2" />
                      <div className="border-b border-slate-200 mt-2.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Vehicle Details Panel */}
              <div className="border border-slate-300 rounded-lg overflow-hidden flex flex-col bg-white">
                <div className="relative bg-[#073763] text-white px-3 py-1.5 flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Car className="size-3.5 text-white" />
                    <span>Vehicle Details</span>
                  </span>
                  {/* Red angled tab on top right */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-3.5 bg-[#E30613]"
                    style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                  />
                </div>
                <div className="p-2.5 space-y-1.5 flex-1 text-[11px]">
                  <div className="grid grid-cols-[115px_8px_1fr] items-start border-b border-slate-100 pb-1">
                    <span className="font-bold text-[#073763]">Vehicle Make</span>
                    <span className="font-bold text-[#073763]">:</span>
                    <span className="font-medium text-slate-800">{invoice.vehicle.make || '—'}</span>
                  </div>
                  <div className="grid grid-cols-[115px_8px_1fr] items-start border-b border-slate-100 pb-1">
                    <span className="font-bold text-[#073763]">Model</span>
                    <span className="font-bold text-[#073763]">:</span>
                    <span className="font-medium text-slate-800">{invoice.vehicle.model || '—'}</span>
                  </div>
                  <div className="grid grid-cols-[115px_8px_1fr] items-start border-b border-slate-100 pb-1">
                    <span className="font-bold text-[#073763]">Registration No</span>
                    <span className="font-bold text-[#073763]">:</span>
                    <span className="font-bold text-slate-900 uppercase">
                      {invoice.vehicle.registrationNo || '—'}
                    </span>
                  </div>
                  <div className="grid grid-cols-[115px_8px_1fr] items-start border-b border-slate-100 pb-1">
                    <span className="font-bold text-[#073763]">Odometer Reading</span>
                    <span className="font-bold text-[#073763]">:</span>
                    <span className="font-medium text-slate-800">
                      {invoice.vehicle.odometer ? `${invoice.vehicle.odometer} km` : '— km'}
                    </span>
                  </div>
                  <div className="grid grid-cols-[115px_8px_1fr] items-start">
                    <span className="font-bold text-[#073763]">Service Date</span>
                    <span className="font-bold text-[#073763]">:</span>
                    <span className="font-medium text-slate-800">
                      {formatDateForDisplay(invoice.vehicle.serviceDate || invoice.invoiceDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Items Table Area with Centered Workshop Car Background Watermark */}
            <div
              className={cn(
                'relative border border-slate-300 rounded-lg overflow-hidden mb-3.5 flex flex-col justify-start',
                rowConfig.minTableHeight
              )}
            >
              {/* Subtle Car Workshop Background Watermark behind table */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <div className="relative w-full h-full opacity-18">
                  <Image
                    src="/images/car-workshop-bg.png"
                    alt="Car Workshop Watermark"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div>
                {/* Soft gradient wash ensuring high contrast readability */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[0.3px]" />
              </div>

              {/* Table */}
              <table className="w-full text-left border-collapse relative z-10">
                <thead>
                  <tr className="bg-[#073763] text-white font-bold text-[10.5px]">
                    <th
                      className={cn(
                        'px-3 text-center w-12 border-r border-[#0A4A85]',
                        rowConfig.headerHeight
                      )}
                    >
                      S.No
                    </th>
                    <th
                      className={cn(
                        'px-4 border-r border-[#0A4A85]',
                        rowConfig.headerHeight
                      )}
                    >
                      Service / Part Description
                    </th>
                    <th
                      className={cn(
                        'px-3 text-center w-16 border-r border-[#0A4A85]',
                        rowConfig.headerHeight
                      )}
                    >
                      Qty
                    </th>
                    <th
                      className={cn(
                        'px-4 text-right w-28 border-r border-[#0A4A85]',
                        rowConfig.headerHeight
                      )}
                    >
                      Unit Price (₹)
                    </th>
                    <th
                      className={cn(
                        'px-4 text-right w-28',
                        rowConfig.headerHeight
                      )}
                    >
                      Amount (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-slate-400 font-medium italic text-xs"
                      >
                        No items added yet. Add items in the Invoice Editor to preview them here.
                      </td>
                    </tr>
                  ) : (
                    displayRows.map((row, idx) => (
                      <tr
                        key={row.id}
                        className={cn(
                          'border-b border-slate-300 transition-colors',
                          rowConfig.rowHeight,
                          rowConfig.fontSize
                        )}
                      >
                        <td
                          className={cn(
                            'px-3 text-center font-bold text-slate-500 border-r border-slate-300',
                            rowConfig.paddingY
                          )}
                        >
                          {idx + 1}
                        </td>
                        <td
                          className={cn(
                            'px-4 text-slate-900 border-r border-slate-300 truncate max-w-[280px]',
                            rowConfig.paddingY,
                            rowConfig.descSize
                          )}
                        >
                          {row.description || '—'}
                        </td>
                        <td
                          className={cn(
                            'px-3 text-center font-bold text-slate-700 border-r border-slate-300',
                            rowConfig.paddingY
                          )}
                        >
                          {row.quantity > 0 ? row.quantity : ''}
                        </td>
                        <td
                          className={cn(
                            'px-4 text-right font-medium text-slate-700 border-r border-slate-300',
                            rowConfig.paddingY
                          )}
                        >
                          {row.unitPrice > 0 ? formatINRNumber(row.unitPrice) : ''}
                        </td>
                        <td
                          className={cn(
                            'px-4 text-right font-black text-slate-900',
                            rowConfig.paddingY,
                            rowConfig.amountSize
                          )}
                        >
                          {row.amount > 0 ? formatINRNumber(row.amount) : ''}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals Section matching reference */}
            <div className="rounded-lg overflow-hidden border border-slate-300 shadow-xs mb-3.5">
              <div className="flex items-stretch">
                {/* Navy Left 3 Columns: Subtotal, Discount, GST */}
                <div className="flex-1 bg-[#073763] text-white grid grid-cols-3 divide-x divide-white/20 p-2.5">
                  {/* Subtotal */}
                  <div className="text-center px-2">
                    <div className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">
                      Subtotal
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      ₹ {formatINRNumber(invoice.totals.subtotal)}
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="text-center px-2">
                    <div className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">
                      Discount
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      ₹ {formatINRNumber(invoice.totals.discountAmount)}
                    </div>
                  </div>

                  {/* GST */}
                  <div className="text-center px-2">
                    <div className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">
                      GST (if any)
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      ₹ {formatINRNumber(invoice.totals.gstAmount)}
                    </div>
                  </div>
                </div>

                {/* Dynamic Chevron divider & Red Total Amount Panel */}
                <div className="relative bg-[#E30613] text-white px-7 py-2.5 flex flex-col justify-center items-end min-w-[210px]">
                  {/* Slanted chevron cut accent on left */}
                  <div
                    className="absolute -left-3.5 top-0 bottom-0 w-4 bg-[#073763]"
                    style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                  />

                  <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-red-100">
                    Total Amount
                  </div>
                  <div className="text-2xl font-black text-white mt-0.5 tracking-tight">
                    ₹ {formatINRNumber(invoice.totals.totalAmount)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div className="relative overflow-hidden bg-[#073763] text-white rounded-lg border-[3px] border-[#0A4A85] shadow-sm">
            {/* Top Row: Company Name & Since */}
            <div className="px-5 pt-2 pb-1.5 border-b border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[11.5px] font-black tracking-wider uppercase text-white">
                  HENRICH AUTOMOTIVE SOLUTIONS
                </span>
                <span className="text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded bg-[#E30613] text-white shadow-xs">
                  SINCE 2003
                </span>
              </div>
              <div className="text-[9px] font-semibold text-slate-300 tracking-wider uppercase">
                Expert Multi-Brand Car Service & Diagnostics
              </div>
            </div>

            {/* Bottom Row: Bigger Services Bar */}
            <div className="px-5 py-2 flex items-center justify-between">
              <div className="flex items-center gap-6 text-[11px] font-black tracking-wider uppercase">
                <div className="flex items-center gap-1.5">
                  <Cog className="w-4.5 h-4.5 text-white shrink-0" />
                  <span>Engine Service</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wrench className="w-4.5 h-4.5 text-white shrink-0" />
                  <span>Repairs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplet className="w-4.5 h-4.5 text-white shrink-0" />
                  <span>Maintenance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-4.5 h-4.5 text-white shrink-0" />
                  <span>Diagnostics</span>
                </div>
              </div>

              {/* Overlapping diagonal chevrons on right */}
              <div className="flex items-center gap-1 h-5.5">
                <div className="w-3.5 h-full bg-[#E30613] transform -skew-x-24" />
                <div className="w-2.5 h-full bg-white transform -skew-x-24" />
                <div className="w-4 h-full bg-[#E30613] transform -skew-x-24" />
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
