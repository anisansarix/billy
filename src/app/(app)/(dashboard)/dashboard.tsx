// @ts-nocheck
import { LinearGradient } from "expo-linear-gradient";
import { useShallow } from 'zustand/react/shallow';
import { Bell, Boxes, ChevronDown, RefreshCcw, AlertCircle, FileText, ArrowUpRight, Receipt, Truck } from "lucide-react-native";
import { useState, useMemo, useRef } from "react";
import { Image, Pressable, ScrollView, Text, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store";
import images from "../../../../constants/images";

import AreaChart from "@/components/charts/AreaChart";
import FloatingMenu from "@/components/ui/FloatingMenu";
import OutstandingList from "@/components/domain/OutstandingList";
import StatCard from "@/components/ui/StatCard";
import AnimatedModal from "@/components/ui/AnimatedModal";
import "../../../../global.css";
import { InventoryItem } from "@/types/entities";
import { formatINR } from "@/utils/money";
import { useDeferredRender } from "@/hooks/useDeferredRender";
import { StatCardSkeleton } from "@/components/ui/skeletons/StatCardSkeleton";
import MonthPickerModal from "@/components/domain/dashboard/MonthPickerModal";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { useTabTransition } from "@/hooks/useTabTransition";
import { useDashboardData } from "@/hooks/useDashboardData";

interface BalanceCardData {
  title: string;
  amountPaise: number;
  gstAmountPaise: number;
}

const QUICK_ACTIONS = [
    { label: "SalesInvoice", icon: Receipt, route: "/(app)/sales" },
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

  const isReady = useDeferredRender();
  const { isTabReady, startTransition } = useTabTransition();
  const isFullyReady = isReady && isTabReady;
  
  const {  invoices, purchases, payments, items  } = useAppStore(useShallow(state => ({ invoices: state.invoices, purchases: state.purchases, payments: state.payments, items: state.items })));

  const {
      dashboardBalances,
      outstandingData,
      activeMonthsToDisplay,
      chartData,
      cashFlowData,
      estimatedLiability,
      inventoryStats,
      lowStockItems,
      unpaidInvoices
  } = useDashboardData(invoices, purchases, payments, items, isReady);

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
                accessibilityRole="button"
                accessibilityLabel="Select Month"
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
                        {estimatedLiability > 0 ? `Payable ${formatINR(estimatedLiability)}` : `Refund ${formatINR(Math.abs(estimatedLiability))}`}
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
                        accessibilityRole="button"
                        accessibilityLabel={`Go to ${action.label}`}
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
              {!isReady ? (
                <>
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </>
              ) : (
                dashboardBalances.map((balance: BalanceCardData, index: number) => (
                  <StatCard key={index} {...balance} />
                ))
              )}
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
                                <Text className="font-sans-medium text-red-900 flex-1 mr-2" numberOfLines={1}>{inv.partyName}</Text>
                                <Text className="font-sans-bold text-red-700">{formatINR(inv.totalAmountPaise || 0)}</Text>
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
            <View className="mb-4">
              <SegmentedTabs 
                  tabs={["Performance", "Cash Flow"]} 
                  activeTab={chartMode} 
                  onTabChange={(t) => startTransition(() => setChartMode(t as "Performance" | "Cash Flow"))} 
              />
            </View>

            <View style={{ width: Dimensions.get('window').width - 40 }}>
              {!isFullyReady ? (
                  <View className="h-[260px] bg-slate-100 rounded-3xl animate-pulse border border-border" />
              ) : chartMode === "Performance" ? (
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
                  color2="#dc2626"
                  color3="#f59e0b"
                  height={260} 
                />
              )}
            </View>

            <View className="mt-4">
              {outstandingData.map((data: { title: string, currency: string, data: { current: number, days1_30: number, days31_60: number, days61_90: number, days90Plus: number } }, index: number) => (
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
                     <Text className="font-sans-bold text-xs text-green-600">{(item as InventoryItem & { soldQuantity?: number }).soldQuantity} sold</Text>
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
            accessibilityRole="button"
            accessibilityLabel="Open Menu"
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

          <MonthPickerModal
            visible={monthModalVisible}
            onClose={() => setMonthModalVisible(false)}
            options={monthOptions}
            selectedMonth={selectedMonth}
            onSelect={setSelectedMonth}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
