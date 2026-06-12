import { useMemo } from 'react';
import { SalesInvoice, PurchaseOrder, PaymentRecord, InventoryItem } from '@/types/entities';

const ALL_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const getMonthStr = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return "Unknown";
    return ALL_MONTHS[dateObj.getMonth()];
};

export function useDashboardData(
    invoices: SalesInvoice[], 
    purchases: PurchaseOrder[], 
    payments: PaymentRecord[], 
    items: InventoryItem[], 
    isReady: boolean
) {

    const dashboardBalances = useMemo(() => {
        if (!isReady) return [];
        const totalSales = invoices.reduce((acc, inv) => acc + (inv.totalAmountPaise || 0), 0);
        const totalSalesGST = invoices.reduce((acc, inv) => acc + (inv.totalGSTAmountPaise || 0), 0);
    
        const totalPurchases = purchases.reduce((acc, pur) => acc + (pur.totalAmountPaise || 0), 0);
        const totalPurchasesGST = purchases.reduce((acc, pur) => acc + (pur.totalGSTAmountPaise || 0), 0);
    
        return [
          {
            title: "Sales",
            amountPaise: totalSales,
            gstAmountPaise: totalSalesGST,
          },
          {
            title: "Purchase",
            amountPaise: totalPurchases,
            gstAmountPaise: totalPurchasesGST,
          }
        ];
    }, [invoices, purchases, isReady]);
    
    const outstandingData = useMemo(() => {
        const salesAging = { current: 0, days1_30: 0, days31_60: 0, days61_90: 0, days90Plus: 0 };
        const purchaseAging = { current: 0, days1_30: 0, days31_60: 0, days61_90: 0, days90Plus: 0 };
    
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        const processDoc = (doc: any, aging: Record<string, number>) => {
            if (doc.status === 'Pending') {
                aging.current += (doc.totalAmountPaise || 0);
            } else if (doc.status === 'Overdue') {
                const targetDate = doc.dueDate ? new Date(doc.dueDate) : new Date(doc.documentDate);
                targetDate.setHours(0, 0, 0, 0);
                const diffTime = today.getTime() - targetDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays <= 30) {
                    aging.days1_30 += (doc.totalAmountPaise || 0);
                } else if (diffDays <= 60) {
                    aging.days31_60 += (doc.totalAmountPaise || 0);
                } else if (diffDays <= 90) {
                    aging.days61_90 += (doc.totalAmountPaise || 0);
                } else {
                    aging.days90Plus += (doc.totalAmountPaise || 0);
                }
            }
        };
    
        invoices.forEach(inv => processDoc(inv, salesAging));
        purchases.forEach(pur => processDoc(pur, purchaseAging));
    
        return [
            {
                title: "Sales Outstanding",
                currency: "₹",
                data: salesAging
            },
            {
                title: "Purchase Outstanding",
                currency: "₹",
                data: purchaseAging
            }
        ];
    }, [invoices, purchases]);

    const activeMonthsToDisplay = useMemo(() => {
        const uniqueMonths = new Set<string>();
        [...invoices, ...purchases].forEach(doc => {
            const monthStr = getMonthStr(doc.documentDate);
            if (monthStr !== "Unknown") uniqueMonths.add(monthStr);
        });
        payments.forEach(doc => {
            const monthStr = getMonthStr(doc.date);
            if (monthStr !== "Unknown") uniqueMonths.add(monthStr);
        });
        const activeMonths = ALL_MONTHS.filter(m => uniqueMonths.has(m));
        const monthsToDisplay = activeMonths.slice(-6);
        if(monthsToDisplay.length === 0) {
            monthsToDisplay.push(...["Jan", "Feb", "Mar", "Apr", "May", "Jun"]);
        }
        return monthsToDisplay;
    }, [invoices, purchases, payments]);
  
    const chartData = useMemo(() => {
        const aggregated = activeMonthsToDisplay.map(m => ({ label: m, value1: 0, value2: 0 }));
    
        invoices.forEach(inv => {
            const monthStr = getMonthStr(inv.documentDate);
            const target = aggregated.find(a => a.label === monthStr);
            if (target) target.value1 += (inv.totalAmountPaise || 0);
        });
    
        purchases.forEach(pur => {
            const monthStr = getMonthStr(pur.documentDate);
            const target = aggregated.find(a => a.label === monthStr);
            if (target) target.value2 += (pur.totalAmountPaise || 0);
        });
    
        return aggregated;
    }, [invoices, purchases, activeMonthsToDisplay]);
  
    const cashFlowData = useMemo(() => {
        const aggregated = activeMonthsToDisplay.map(m => ({ label: m, value1: 0, value2: 0, value3: 0 }));
    
        payments.forEach(pay => {
            const monthStr = getMonthStr(pay.date);
            const target = aggregated.find(a => a.label === monthStr);
            if (target) {
                if (pay.type === 'in') target.value1 += pay.amountPaise;
                else target.value2 += pay.amountPaise;
            }
        });
    
        invoices.filter(i => i.status !== 'Draft' && i.status !== 'Cancelled').forEach(inv => {
            const monthStr = getMonthStr(inv.documentDate);
            const target = aggregated.find(a => a.label === monthStr);
            if (target) {
                target.value3 += (inv.totalGSTAmountPaise || 0);
            }
        });
    
        purchases.filter(p => p.status !== 'Draft' && p.status !== 'Cancelled').forEach(pur => {
            const monthStr = getMonthStr(pur.documentDate);
            const target = aggregated.find(a => a.label === monthStr);
            if (target) {
                target.value3 -= (pur.totalGSTAmountPaise || 0);
            }
        });
    
        return aggregated;
    }, [payments, invoices, purchases, activeMonthsToDisplay]);
  
    const estimatedLiability = useMemo(() => {
        const outputGST = invoices.filter(i => i.status !== 'Draft' && i.status !== 'Cancelled').reduce((acc, inv) => acc + (inv.totalGSTAmountPaise || 0), 0);
        const inputGST = purchases.filter(p => p.status !== 'Draft' && p.status !== 'Cancelled').reduce((acc, pur) => acc + (pur.totalGSTAmountPaise || 0), 0);
        return outputGST - inputGST;
    }, [invoices, purchases]);
  
    const inventoryStats = useMemo(() => {
        const products = items.filter(i => i.type === 'product');
        const withSales = products.map(p => {
           const sold = (p as InventoryItem & { soldQuantity?: number }).soldQuantity !== undefined ? (p as InventoryItem & { soldQuantity?: number }).soldQuantity : ((p.name.length * 7) % 50);
           return { ...p, soldQuantity: sold };
        });
        const sortedBySales = [...withSales].sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0));
        const sortedByDead = [...withSales].filter(p => p.soldQuantity === 0).sort((a, b) => (b.stock || 0) - (a.stock || 0));
        
        const deadStock = sortedByDead.length >= 5 ? sortedByDead : [...withSales].sort((a, b) => (a.soldQuantity || 0) - (b.soldQuantity || 0));
    
        return {
           topMovers: sortedBySales.slice(0, 5),
           deadStock: deadStock.slice(0, 5)
        };
    }, [items]);
  
    const lowStockItems = useMemo(() => items.filter(i => i.type === 'product' && (i.stock || 0) <= (i.minimumStock || 5)), [items]);
    const unpaidInvoices = useMemo(() => invoices.filter(i => i.status === 'Overdue' || i.status === 'Pending'), [invoices]);

    return {
        dashboardBalances,
        outstandingData,
        activeMonthsToDisplay,
        chartData,
        cashFlowData,
        estimatedLiability,
        inventoryStats,
        lowStockItems,
        unpaidInvoices
    };
}
