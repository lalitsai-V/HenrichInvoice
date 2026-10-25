'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CustomerDetails, DiscountType, InvoiceData, InvoiceItem, VehicleDetails } from '@/types/invoice';
import { calculateInvoiceTotals, calculateLineAmount } from '@/lib/calculations';
import { generateInvoiceNumber, getTodayISODate } from '@/lib/formatters';

const createDefaultItem = (sNo: number, description = ''): InvoiceItem => ({
  id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}-${sNo}-${Math.random().toString(36).slice(2, 6)}`,
  sNo,
  description,
  quantity: 1,
  unitPrice: 0,
  amount: 0,
});

const createInitialItems = (): InvoiceItem[] => [
  createDefaultItem(1, 'Labour Cost'),
  createDefaultItem(2, ''),
  createDefaultItem(3, ''),
  createDefaultItem(4, ''),
  createDefaultItem(5, ''),
];

export const createInitialInvoice = (nextSeq: number = 1): InvoiceData => {
  const today = getTodayISODate();
  const items = createInitialItems();
  const totals = calculateInvoiceTotals({
    items,
    discountType: 'fixed',
    discountValue: 0,
    gstEnabled: false,
    gstRate: 18,
  });

  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `inv-${Date.now()}`,
    invoiceNumber: generateInvoiceNumber(nextSeq),
    invoiceDate: today,
    serviceType: 'General Service',
    customer: {
      name: '',
      phone: '',
      address: '',
    },
    vehicle: {
      make: '',
      model: '',
      registrationNo: '',
      odometer: '',
      serviceDate: today,
    },
    items,
    totals,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

interface InvoiceStoreState {
  invoice: InvoiceData;
  savedInvoices: InvoiceData[];
  isDirty: boolean;
  historyCounter: number;

  // Invoice Mutations
  updateMetadata: (fields: Partial<Pick<InvoiceData, 'invoiceNumber' | 'invoiceDate' | 'serviceType'>>) => void;
  updateCustomer: (fields: Partial<CustomerDetails>) => void;
  updateVehicle: (fields: Partial<VehicleDetails>) => void;
  addItem: (prefill?: { description?: string; category?: string }) => void;
  addLabourCostItem: (unitPrice?: number) => void;
  addServicesFromCatalogue: (services: { name: string; category?: string }[]) => void;
  updateItem: (id: string, fields: Partial<Pick<InvoiceItem, 'description' | 'quantity' | 'unitPrice'>>) => void;
  removeItem: (id: string) => void;
  reorderItems: (newItems: InvoiceItem[]) => void;
  setDiscount: (type: DiscountType, value: number) => void;
  setGst: (enabled: boolean, rate?: number) => void;
  resetInvoice: () => void;
  loadInvoice: (saved: InvoiceData) => void;

  // History Actions
  saveInvoiceToHistory: () => { success: boolean; message: string };
  deleteSavedInvoice: (id: string) => void;
  clearHistory: () => void;
  markClean: () => void;
}

export const useInvoiceStore = create<InvoiceStoreState>()(
  persist(
    (set, get) => ({
      invoice: createInitialInvoice(1),
      savedInvoices: [],
      isDirty: false,
      historyCounter: 1,

      updateMetadata: (fields) => {
        set((state) => {
          const updated = {
            ...state.invoice,
            ...fields,
            updatedAt: new Date().toISOString(),
          };
          return { invoice: updated, isDirty: true };
        });
      },

      updateCustomer: (fields) => {
        set((state) => {
          const updated = {
            ...state.invoice,
            customer: { ...state.invoice.customer, ...fields },
            updatedAt: new Date().toISOString(),
          };
          return { invoice: updated, isDirty: true };
        });
      },

      updateVehicle: (fields) => {
        set((state) => {
          const updated = {
            ...state.invoice,
            vehicle: { ...state.invoice.vehicle, ...fields },
            updatedAt: new Date().toISOString(),
          };
          return { invoice: updated, isDirty: true };
        });
      },

      addItem: (prefill) => {
        set((state) => {
          const currentItems = state.invoice.items;
          const nextSNo = currentItems.length + 1;
          const newItem = createDefaultItem(nextSNo, prefill?.description || '');
          if (prefill?.category) {
            newItem.category = prefill.category;
          }
          const items = [...currentItems, newItem];
          const totals = calculateInvoiceTotals({
            items,
            discountType: state.invoice.totals.discountType,
            discountValue: state.invoice.totals.discountValue,
            gstEnabled: state.invoice.totals.gstEnabled,
            gstRate: state.invoice.totals.gstRate,
          });

          return {
            invoice: { ...state.invoice, items, totals, updatedAt: new Date().toISOString() },
            isDirty: true,
          };
        });
      },

      addLabourCostItem: (unitPrice?: number) => {
        set((state) => {
          const currentItems = state.invoice.items;
          const existingIdx = currentItems.findIndex((it) => /labou?r/i.test(it.description));
          let items: InvoiceItem[];

          if (existingIdx >= 0) {
            if (unitPrice !== undefined) {
              items = currentItems.map((it, idx) =>
                idx === existingIdx
                  ? { ...it, unitPrice, amount: calculateLineAmount(it.quantity, unitPrice) }
                  : it
              );
            } else {
              return state;
            }
          } else {
            const emptyIdx = currentItems.findIndex((it) => !it.description.trim() && it.unitPrice === 0);
            const price = unitPrice ?? 0;
            if (emptyIdx >= 0) {
              items = currentItems.map((it, idx) =>
                idx === emptyIdx
                  ? {
                      ...it,
                      description: 'Labour Cost',
                      category: 'Labour Charges and Workmanship',
                      unitPrice: price,
                      amount: calculateLineAmount(it.quantity, price),
                    }
                  : it
              );
            } else {
              const newItem = createDefaultItem(currentItems.length + 1, 'Labour Cost');
              newItem.category = 'Labour Charges and Workmanship';
              newItem.unitPrice = price;
              newItem.amount = calculateLineAmount(newItem.quantity, price);
              items = [...currentItems, newItem];
            }
          }

          const totals = calculateInvoiceTotals({
            items,
            discountType: state.invoice.totals.discountType,
            discountValue: state.invoice.totals.discountValue,
            gstEnabled: state.invoice.totals.gstEnabled,
            gstRate: state.invoice.totals.gstRate,
          });

          return {
            invoice: { ...state.invoice, items, totals, updatedAt: new Date().toISOString() },
            isDirty: true,
          };
        });
      },

      addServicesFromCatalogue: (services) => {
        set((state) => {
          const currentItems = state.invoice.items;
          let currentSNo = currentItems.length;

          // If there's only 1 item and it's empty, we can replace or append
          const firstItemEmpty =
            currentItems.length === 1 &&
            !currentItems[0].description &&
            currentItems[0].unitPrice === 0;

          const baseItems = firstItemEmpty ? [] : [...currentItems];
          if (firstItemEmpty) {
            currentSNo = 0;
          }

          const newItems = services.map((svc) => {
            currentSNo += 1;
            const it = createDefaultItem(currentSNo, svc.name);
            it.category = svc.category;
            return it;
          });

          const combined = [...baseItems, ...newItems].map((item, index) => ({
            ...item,
            sNo: index + 1,
          }));

          const totals = calculateInvoiceTotals({
            items: combined,
            discountType: state.invoice.totals.discountType,
            discountValue: state.invoice.totals.discountValue,
            gstEnabled: state.invoice.totals.gstEnabled,
            gstRate: state.invoice.totals.gstRate,
          });

          return {
            invoice: { ...state.invoice, items: combined, totals, updatedAt: new Date().toISOString() },
            isDirty: true,
          };
        });
      },

      updateItem: (id, fields) => {
        set((state) => {
          const items = state.invoice.items.map((item) => {
            if (item.id !== id) return item;
            const updated = { ...item, ...fields };
            const qty = fields.quantity !== undefined ? fields.quantity : item.quantity;
            const price = fields.unitPrice !== undefined ? fields.unitPrice : item.unitPrice;
            updated.amount = calculateLineAmount(qty, price);
            return updated;
          });

          const totals = calculateInvoiceTotals({
            items,
            discountType: state.invoice.totals.discountType,
            discountValue: state.invoice.totals.discountValue,
            gstEnabled: state.invoice.totals.gstEnabled,
            gstRate: state.invoice.totals.gstRate,
          });

          return {
            invoice: { ...state.invoice, items, totals, updatedAt: new Date().toISOString() },
            isDirty: true,
          };
        });
      },

      removeItem: (id) => {
        set((state) => {
          // Keep at least 1 row
          if (state.invoice.items.length <= 1) {
            const resetSingle = [createDefaultItem(1, '')];
            const totals = calculateInvoiceTotals({
              items: resetSingle,
              discountType: state.invoice.totals.discountType,
              discountValue: state.invoice.totals.discountValue,
              gstEnabled: state.invoice.totals.gstEnabled,
              gstRate: state.invoice.totals.gstRate,
            });
            return {
              invoice: { ...state.invoice, items: resetSingle, totals, updatedAt: new Date().toISOString() },
              isDirty: true,
            };
          }

          const filtered = state.invoice.items
            .filter((it) => it.id !== id)
            .map((item, idx) => ({ ...item, sNo: idx + 1 }));

          const totals = calculateInvoiceTotals({
            items: filtered,
            discountType: state.invoice.totals.discountType,
            discountValue: state.invoice.totals.discountValue,
            gstEnabled: state.invoice.totals.gstEnabled,
            gstRate: state.invoice.totals.gstRate,
          });

          return {
            invoice: { ...state.invoice, items: filtered, totals, updatedAt: new Date().toISOString() },
            isDirty: true,
          };
        });
      },

      reorderItems: (newItems) => {
        set((state) => {
          const renumbered = newItems.map((item, idx) => ({ ...item, sNo: idx + 1 }));
          const totals = calculateInvoiceTotals({
            items: renumbered,
            discountType: state.invoice.totals.discountType,
            discountValue: state.invoice.totals.discountValue,
            gstEnabled: state.invoice.totals.gstEnabled,
            gstRate: state.invoice.totals.gstRate,
          });
          return {
            invoice: { ...state.invoice, items: renumbered, totals, updatedAt: new Date().toISOString() },
            isDirty: true,
          };
        });
      },

      setDiscount: (type, value) => {
        set((state) => {
          const totals = calculateInvoiceTotals({
            items: state.invoice.items,
            discountType: type,
            discountValue: value,
            gstEnabled: state.invoice.totals.gstEnabled,
            gstRate: state.invoice.totals.gstRate,
          });
          return {
            invoice: { ...state.invoice, totals, updatedAt: new Date().toISOString() },
            isDirty: true,
          };
        });
      },

      setGst: (enabled, rate) => {
        set((state) => {
          const gstRate = rate !== undefined ? rate : state.invoice.totals.gstRate;
          const totals = calculateInvoiceTotals({
            items: state.invoice.items,
            discountType: state.invoice.totals.discountType,
            discountValue: state.invoice.totals.discountValue,
            gstEnabled: enabled,
            gstRate,
          });
          return {
            invoice: { ...state.invoice, totals, updatedAt: new Date().toISOString() },
            isDirty: true,
          };
        });
      },

      resetInvoice: () => {
        const nextCounter = get().historyCounter + 1;
        set({
          invoice: createInitialInvoice(nextCounter),
          isDirty: false,
          historyCounter: nextCounter,
        });
      },

      loadInvoice: (saved) => {
        set({
          invoice: JSON.parse(JSON.stringify(saved)),
          isDirty: false,
        });
      },

      saveInvoiceToHistory: () => {
        const current = get().invoice;
        const savedList = get().savedInvoices;
        const existingIdx = savedList.findIndex((i) => i.id === current.id);

        let updatedList: InvoiceData[];
        if (existingIdx >= 0) {
          updatedList = [...savedList];
          updatedList[existingIdx] = { ...current, updatedAt: new Date().toISOString() };
        } else {
          updatedList = [{ ...current, updatedAt: new Date().toISOString() }, ...savedList];
        }

        set({
          savedInvoices: updatedList,
          isDirty: false,
        });

        return {
          success: true,
          message: `Invoice ${current.invoiceNumber} saved successfully to local storage.`,
        };
      },

      deleteSavedInvoice: (id) => {
        set((state) => ({
          savedInvoices: state.savedInvoices.filter((inv) => inv.id !== id),
        }));
      },

      clearHistory: () => {
        set({ savedInvoices: [] });
      },

      markClean: () => {
        set({ isDirty: false });
      },
    }),
    {
      name: 'henrich_invoice_storage_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        invoice: state.invoice,
        savedInvoices: state.savedInvoices,
        historyCounter: state.historyCounter,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.invoice?.items) return;
        const items = state.invoice.items;
        const hasLabour = items.some((it) => /labou?r/i.test(it.description));
        if (!hasLabour) {
          const emptyIdx = items.findIndex((it) => !it.description.trim() && it.unitPrice === 0);
          if (emptyIdx >= 0) {
            items[emptyIdx].description = 'Labour Cost';
            items[emptyIdx].category = 'Labour Charges and Workmanship';
          } else {
            const newItem = createDefaultItem(items.length + 1, 'Labour Cost');
            newItem.category = 'Labour Charges and Workmanship';
            items.push(newItem);
          }
          state.invoice.items = [...items];
          state.invoice.totals = calculateInvoiceTotals({
            items: state.invoice.items,
            discountType: state.invoice.totals.discountType,
            discountValue: state.invoice.totals.discountValue,
            gstEnabled: state.invoice.totals.gstEnabled,
            gstRate: state.invoice.totals.gstRate,
          });
        }
      },
    }
  )
);
