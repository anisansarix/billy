import { LinearGradient } from "expo-linear-gradient";
import { useShallow } from 'zustand/react/shallow';
import { Bell, Boxes, ChevronDown, RefreshCcw, AlertCircle, FileText, ArrowUpRight, Receipt, Truck } from "lucide-react-native";
import { useState, useMemo, useRef } from "react";
import { Image, Pressable, ScrollView, Text, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAppStore } from "../../store";
import images from "../../../constants/images";

import AreaChart from "../../components/AreaChart";
import FloatingMenu from "../../components/FloatingMenu";
import OutstandingList from "../../components/OutstandingList";
import StatCard from "../../components/StatCard";
import AnimatedModal from "../../components/AnimatedModal";
import "../../../global.css";

const QUICK_ACTIONS = [
    { label: "Invoice", icon: Receipt, route: "/(app)/sales" },
    { label: "Products", icon: Boxes, route: "/(app)/products-services" },
    { label: "GST", icon: FileText, route: "/(app)/gst-returns" },
    { label: "E-Way", icon: Truck, route: "/(app)/eway-bills" },
];

export default function App() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("June 2026");
  const [chartMode, setChartMode] = useState<"Performance" | "Cash Flow">("Performance");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const monthOptions = [
    "June 2026",
    "May 2026",
    "April 2026",
    "March 2026",
    "February 2026",
    "January 2026",
  ];

  const {  invoices, purchases, payments, items  } = useAppStore(useShallow(state => ({ invoices: state.invoices, purchases: state.purchases, payments: state.payments, items: state.items })));

  const dashboardBalances = useMemo(() => {
    const totalSales = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
    const totalSalesGST = invoices.reduce((acc, inv) => acc + ((inv.cgstAmount || 0) + (inv.sgstAmount || 0) + (inv.igstAmount || 0)), 0);

    const totalPurchases = purchases.reduce((acc, pur) => acc + (pur.total || 0), 0);
    const totalPurchasesGST = purchases.reduce((acc, pur) => acc + ((pur.cgstAmount || 0) + (pur.sgstAmount || 0) + (pur.igstAmount || 0)), 0);

    return [
      {
        title: "Sales",
        amount: totalSales,
        gstAmount: totalSalesGST,
        currency: "₹",
      },
      {
        title: "Purchase",
        amount: totalPurchases,
        gstAmount: totalPurchasesGST,
        currency: "₹",
      }
    ];
  }, [invoices, purchases]);

  const outstandingData = useMemo(() => {
    const salesAging = { current: 0, days1_30: 0, days31_60: 0, days90Plus: 0 };
    const purchaseAging = { current: 0, days1_30: 0, days31_60: 0, days90Plus: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const processDoc = (doc: Invoice, aging: Record<string, number>) => {
        if (doc.status === 'Pending') {
            aging.current += (doc.total || 0);
        } else if (doc.status === 'Overdue') {
            const docDate = new Date(doc.date);
            docDate.setHours(0, 0, 0, 0);
            const diffTime = today.getTime() - docDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 30) {
                aging.days1_30 += (doc.total || 0);
            } else if (diffDays <= 60) {
                aging.days31_60 += (doc.total || 0);
            } else {
                aging.days90Plus += (doc.total || 0);
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
      [...invoices, ...purchases, ...payments].forEach(doc => {
          const parts = doc.date?.split(" ") || [];
          if(parts.length > 1) uniqueMonths.add(parts[1].substring(0, 3));
      });
      const ALL_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
        const parts = inv.date?.split(" ") || [];
        const monthStr = parts.length > 1 ? parts[1].substring(0, 3) : "Unknown";
        const target = aggregated.find(a => a.label === monthStr);
        if (target) target.value1 += (inv.total || 0);
    });

    purchases.forEach(pur => {
        const parts = pur.date?.split(" ") || [];
        const monthStr = parts.length > 1 ? parts[1].substring(0, 3) : "Unknown";
        const target = aggregated.find(a => a.label === monthStr);
        if (target) target.value2 += (pur.total || 0);
    });

    return aggregated;
  }, [invoices, purchases, activeMonthsToDisplay]);

  const cashFlowData = useMemo(() => {
    const aggregated = activeMonthsToDisplay.map(m => ({ label: m, value1: 0, value2: 0, value3: 0 }));

    payments.forEach(pay => {
        const parts = pay.date?.split(" ") || [];
        const monthStr = parts.length > 1 ? parts[1].substring(0, 3) : "Unknown";
        const target = aggregated.find(a => a.label === monthStr);
        if (target) {
            if (pay.type === 'in') target.value1 += pay.amount;
            else target.value2 += pay.amount;
        }
    });

    // Add GST liability
    invoices.filter(i => i.status !== 'Draft' && i.status !== 'Cancelled').forEach(inv => {
        const parts = inv.date?.split(" ") || [];
        const monthStr = parts.length > 1 ? parts[1].substring(0, 3) : "Unknown";
        const target = aggregated.find(a => a.label === monthStr);
        if (target) {
            target.value3 += ((inv.cgstAmount || 0) + (inv.sgstAmount || 0) + (inv.igstAmount || 0));
        }
    });

    purchases.filter(p => p.status !== 'Draft' && p.status !== 'Cancelled').forEach(pur => {
        const parts = pur.date?.split(" ") || [];
        const monthStr = parts.length > 1 ? parts[1].substring(0, 3) : "Unknown";
        const target = aggregated.find(a => a.label === monthStr);
        if (target) {
            target.value3 -= ((pur.cgstAmount || 0) + (pur.sgstAmount || 0) + (pur.igstAmount || 0));
        }
    });

    return aggregated;
  }, [payments, invoices, purchases, activeMonthsToDisplay]);

  // GST Liability Calculation
  const estimatedLiability = useMemo(() => {
    const outputGST = invoices.filter(i => i.status !== 'Draft' && i.status !== 'Cancelled').reduce((acc, inv) => acc + ((inv.cgstAmount || 0) + (inv.sgstAmount || 0) + (inv.igstAmount || 0)), 0);
    const inputGST = purchases.filter(p => p.status !== 'Draft' && p.status !== 'Cancelled').reduce((acc, pur) => acc + ((pur.cgstAmount || 0) + (pur.sgstAmount || 0) + (pur.igstAmount || 0)), 0);
    return outputGST - inputGST;
  }, [invoices, purchases]);

  // Inventory logic for Top Movers / Dead Stock
  const inventoryStats = useMemo(() => {
    const products = items.filter(i => i.type === 'product');
    // Map products to include soldQuantity if available, or generate deterministic fake value for demo
    const withSales = products.map(p => {
       const sold = (p as Item & { soldQuantity?: number }).soldQuantity !== undefined ? (p as Item & { soldQuantity?: number }).soldQuantity : ((p.name.length * 7) % 50);
       return { ...p, soldQuantity: sold };
    });
    const sortedBySales = [...withSales].sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0));
    const sortedByDead = [...withSales].filter(p => p.soldQuantity === 0).sort((a, b) => (b.stock || 0) - (a.stock || 0));
    
    // If we don't have true dead stock, just take the bottom items
    const deadStock = sortedByDead.length >= 5 ? sortedByDead : [...withSales].sort((a, b) => (a.soldQuantity || 0) - (b.soldQuantity || 0));

    return {
       topMovers: sortedBySales.slice(0, 5),
       deadStock: deadStock.slice(0, 5)
    };
  }, [items]);

  // Pending Actions
  const lowStockItems = useMemo(() => items.filter(i => i.type === 'product' && (i.stock || 0) <= (i.minimumStock || 5)), [items]);
  const unpaidInvoices = useMemo(() => invoices.filter(i => i.status === 'Overdue' || i.status === 'Pending'), [invoices]);

  return (
    <LinearGradient
      colors={['#e3e8fc', '#f1f1f1']}
      className="flex-1"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 p-5 pb-0">
          <View className="mb-2.5 flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-3xl font-sans-bold text-primary leading-tight">{getGreeting()}</Text>
              <Text className="text-3xl font-sans-bold text-primary leading-tight">Axanees!</Text>
            </View>
            <View className="flex-row items-center gap-4">
              <View className="relative">
                <Bell color="#081126" fill="#081126" size={22} />
                <View className="absolute right-0 top-0 size-2.5 rounded-full bg-red-600 border border-white" />
              </View>
              <Image source={images.avatar} className="size-12 rounded-full" />
            </View>
          </View>

          <ScrollView ref={scrollViewRef} className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <RefreshCcw color="#16a34a" size={16} />
                <Text className="font-sans-medium text-sm text-green-600">Synced</Text>
              </View>
              <Pressable 
                className="flex-row items-center bg-white rounded-xl px-4 py-2 min-h-[44px] border border-white/50 shadow-sm"
                onPress={() => setMonthModalVisible(true)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <ChevronDown color="#000" size={16} className="mr-2" />
                <Text className="font-sans-medium text-base text-primary">{selectedMonth}</Text>
              </Pressable>
            </View>

            {/* GST Liability Widget */}
            <Pressable 
                onPress={() => router.push('/(app)/gst-returns')} 
                className="bg-white rounded-2xl p-4 mb-6 border border-border shadow-sm flex-row items-center justify-between min-h-[44px]"
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
                <View>
                    <Text className="font-sans-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">Est. GST Liability</Text>
                    <Text className={`font-sans-bold text-2xl ${estimatedLiability > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {estimatedLiability > 0 ? `Payable ₹ ${estimatedLiability.toLocaleString('en-IN')}` : `Refund ₹ ${Math.abs(estimatedLiability).toLocaleString('en-IN')}`}
                    </Text>
                </View>
                <View className="h-10 w-10 bg-primary/10 rounded-full items-center justify-center">
                    <ArrowUpRight color="#208AEF" size={20} />
                </View>
            </Pressable>

            {/* Quick Actions */}
            <View className="flex-row justify-between mb-6">
                {QUICK_ACTIONS.map((action, i) => (
                    <Pressable 
                        key={i} 
                        onPress={() => router.push(action.route as never)} 
                        className="items-center"
                        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                    >
                        <View className="bg-white size-14 rounded-2xl items-center justify-center shadow-sm border border-border mb-2">
                            <action.icon color="#081126" size={24} />
                        </View>
                        <Text className="font-sans-medium text-xs text-primary">{action.label}</Text>
                    </Pressable>
                ))}
            </View>

            <View className="flex-row gap-4 mb-6">
              {dashboardBalances.map((balance: BalanceCardData, index: number) => (
                <StatCard key={index} {...balance} />
              ))}
            </View>

            {/* Pending Actions / Alerts */}
            <View className="mb-6">
                <Text className="font-sans-bold text-lg text-primary mb-3">Needs Attention</Text>
                
                {lowStockItems.length > 0 && (
                    <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3">
                        <View className="flex-row items-center gap-2 mb-3">
                            <AlertCircle color="#d97706" size={20} />
                            <Text className="font-sans-bold text-amber-800 text-base">Low Stock Alert</Text>
                        </View>
                        {lowStockItems.slice(0, 3).map((item, idx) => (
                            <View key={item.id} className={`flex-row justify-between items-center py-2 ${idx !== Math.min(lowStockItems.length, 3) - 1 ? 'border-b border-amber-200/50' : ''}`}>
                                <Text className="font-sans-medium text-amber-900 flex-1 mr-2" numberOfLines={1}>{item.name}</Text>
                                <Text className="font-sans-bold text-amber-700">{item.stock || 0} left</Text>
                            </View>
                        ))}
                        {lowStockItems.length > 3 && (
                            <Pressable onPress={() => router.push('/(app)/products-services')} className="mt-2 pt-2 border-t border-amber-200/50 min-h-[44px] justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                                <Text className="font-sans-medium text-amber-700 text-center text-xs">+ {lowStockItems.length - 3} more items need restocking</Text>
                            </Pressable>
                        )}
                        {lowStockItems.length <= 3 && (
                            <Pressable onPress={() => router.push('/(app)/products-services')} className="mt-2 pt-2 border-t border-amber-200/50 min-h-[44px] justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                                <Text className="font-sans-medium text-amber-700 text-center text-xs">View all products</Text>
                            </Pressable>
                        )}
                    </View>
                )}

                {unpaidInvoices.length > 0 && (
                    <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-3">
                        <View className="flex-row items-center gap-2 mb-3">
                            <AlertCircle color="#ef4444" size={20} />
                            <Text className="font-sans-bold text-red-800 text-base">Overdue Payments</Text>
                        </View>
                        {unpaidInvoices.slice(0, 3).map((inv, idx) => (
                            <View key={inv.id} className={`flex-row justify-between items-center py-2 ${idx !== Math.min(unpaidInvoices.length, 3) - 1 ? 'border-b border-red-200/50' : ''}`}>
                                <Text className="font-sans-medium text-red-900 flex-1 mr-2" numberOfLines={1}>{inv.customerName}</Text>
                                <Text className="font-sans-bold text-red-700">₹ {(inv.total || 0).toLocaleString('en-IN')}</Text>
                            </View>
                        ))}
                        {unpaidInvoices.length > 3 && (
                            <Pressable onPress={() => router.push('/(app)/sales')} className="mt-2 pt-2 border-t border-red-200/50 min-h-[44px] justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                                <Text className="font-sans-medium text-red-700 text-center text-xs">+ {unpaidInvoices.length - 3} more overdue invoices</Text>
                            </Pressable>
                        )}
                        {unpaidInvoices.length <= 3 && (
                            <Pressable onPress={() => router.push('/(app)/sales')} className="mt-2 pt-2 border-t border-red-200/50 min-h-[44px] justify-center" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                                <Text className="font-sans-medium text-red-700 text-center text-xs">View all invoices</Text>
                            </Pressable>
                        )}
                    </View>
                )}
                
                {lowStockItems.length === 0 && unpaidInvoices.length === 0 && (
                    <View className="bg-white border border-border rounded-xl p-4 items-center justify-center">
                        <Text className="font-sans-medium text-muted-foreground">All caught up! 🎉</Text>
                    </View>
                )}
            </View>

            {/* Segmented Control */}
            <View className="bg-white/60 p-1 rounded-xl flex-row mb-4 border border-border">
              <Pressable
                onPress={() => setChartMode("Performance")}
                className={`flex-1 py-2 rounded-lg items-center justify-center min-h-[44px] ${chartMode === "Performance" ? "bg-white shadow-sm" : ""}`}
              >
                <Text className={`font-sans-medium ${chartMode === "Performance" ? "text-primary" : "text-muted-foreground"}`}>Performance</Text>
              </Pressable>
              <Pressable
                onPress={() => setChartMode("Cash Flow")}
                className={`flex-1 py-2 rounded-lg items-center justify-center min-h-[44px] ${chartMode === "Cash Flow" ? "bg-white shadow-sm" : ""}`}
              >
                <Text className={`font-sans-medium ${chartMode === "Cash Flow" ? "text-primary" : "text-muted-foreground"}`}>Cash Flow</Text>
              </Pressable>
            </View>

            <View style={{ width: Dimensions.get('window').width - 40 }}>
              {chartMode === "Performance" ? (
                <AreaChart 
                  title="Revenue vs Purchases" 
                  data={chartData} 
                  legend1="Sales"
                  legend2="Purchases"
                  color1="#122a2f"
                  color2="#98e29a"
                  height={260} 
                />
              ) : (
                <AreaChart 
                  title="Cash Flow (In vs Out)" 
                  data={cashFlowData} 
                  legend1="Money In"
                  legend2="Money Out"
                  legend3="GST Liab."
                  color1="#16a34a"
                  color2="#ef4444"
                  color3="#f59e0b"
                  height={260} 
                />
              )}
            </View>

            <View className="mt-4">
              {outstandingData.map((data: { title: string, currency: string, data: { current: number, days1_30: number, days31_60: number, days90Plus: number } }, index: number) => (
                <OutstandingList key={index} data={data} />
              ))}
            </View>

            {/* Top Movers vs Dead Stock */}
            <View className="mt-6 flex-row gap-4 mb-4">
               {/* Top Movers */}
               <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-border">
                 <Text className="font-sans-bold text-sm text-primary mb-3">Top Movers</Text>
                 {inventoryStats.topMovers.map((item, idx) => (
                   <View key={`top-${idx}`} className={`flex-row justify-between py-2 ${idx !== inventoryStats.topMovers.length - 1 ? 'border-b border-border' : ''}`}>
                     <Text className="font-sans-medium text-xs text-primary flex-1 mr-2" numberOfLines={1}>{item.name}</Text>
                     <Text className="font-sans-bold text-xs text-green-600">{(item as Item & { soldQuantity?: number }).soldQuantity} sold</Text>
                   </View>
                 ))}
               </View>

               {/* Dead Stock */}
               <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-border">
                 <Text className="font-sans-bold text-sm text-primary mb-3">Dead Stock</Text>
                 {inventoryStats.deadStock.map((item, idx) => (
                   <View key={`dead-${idx}`} className={`flex-row justify-between py-2 ${idx !== inventoryStats.deadStock.length - 1 ? 'border-b border-border' : ''}`}>
                     <Text className="font-sans-medium text-xs text-primary flex-1 mr-2" numberOfLines={1}>{item.name}</Text>
                     <Text className="font-sans-bold text-xs text-red-600">{item.stock} left</Text>
                   </View>
                 ))}
               </View>
            </View>

            <View className="items-center py-6 mt-2">
              <Text className="font-sans-medium text-xs text-muted-foreground/60 text-center">
                Billy ERP Copyrights reserved by Omnity Industries
              </Text>
            </View>
          </ScrollView>

          <FloatingMenu
            visible={menuVisible}
            onClose={() => setMenuVisible(false)}
            onScrollToTop={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
          />

          <Pressable
            onPress={() =>
              setMenuVisible(true)
            }
            className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-[#081126]"
            style={({ pressed }) => ({
              elevation: 16,
              shadowColor: '#081126',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Boxes
              color="#ffffff"
              size={32}
              strokeWidth={2.5}
            />
          </Pressable>

          <AnimatedModal visible={monthModalVisible} onClose={() => setMonthModalVisible(false)} placement="center">
            <View className="bg-white rounded-3xl w-[85%] max-w-sm p-6 shadow-xl">
              <Text className="font-sans-bold text-xl text-primary mb-4 text-center">Select Month</Text>
              {monthOptions.map((month, index) => (
                <Pressable 
                  key={month} 
                  className={`py-4 ${index !== monthOptions.length - 1 ? 'border-b border-border' : ''}`} 
                  onPress={() => { setSelectedMonth(month); setMonthModalVisible(false); }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Text className={`text-center text-lg ${selectedMonth === month ? 'text-primary font-sans-bold' : 'text-muted-foreground font-sans-medium'}`}>
                    {month}
                  </Text>
                </Pressable>
              ))}
            </View>
          </AnimatedModal>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
