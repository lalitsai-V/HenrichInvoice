export type DiscountType = 'fixed' | 'percentage';

export interface InvoiceItem {
  id: string;
  sNo: number;
  description: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}

export interface VehicleDetails {
  make: string;
  model: string;
  registrationNo: string;
  odometer: string;
  serviceDate: string;
}

export interface InvoiceTotals {
  subtotal: number;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  taxableAmount: number;
  gstEnabled: boolean;
  gstRate: number; // percentage e.g. 18 for 18%
  gstAmount: number;
  totalAmount: number;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  serviceType: string;
  customer: CustomerDetails;
  vehicle: VehicleDetails;
  items: InvoiceItem[];
  totals: InvoiceTotals;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCatalogueCategory {
  id: string;
  name: string;
  note?: string;
  services: string[];
}
