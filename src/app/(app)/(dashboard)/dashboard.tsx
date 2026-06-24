import { LinearGradient } from "expo-linear-gradient";
import { useShallow } from 'zustand/react/shallow';
import { Bell, Boxes, TrendingDown, TrendingUp } from "lucide-react-native";
import { useState, useRef } from "react";
import { Image, Pressable, ScrollView, Text, View, Dimensions, Vibration } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store";
import { useEffect } from "react";
import images from "../../../../constants/images";

import AreaChart from "@/components/charts/AreaChart";
import FloatingMenu from "@/components/ui/FloatingMenu";
import OutstandingList from "@/components/domain/OutstandingList";
import StatCard from "@/components/ui/StatCard";
import "../../../../global.css";
import { useDeferredRender } from "@/hooks/useDeferredRender";
import { StatCardSkeleton } from "@/components/ui/skeletons/StatCardSkeleton";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { useTabTransition } from "@/hooks/useTabTransition";
import { useDashboardData } from "@/hooks/useDashboardData";

import GstLiabilityWidget from "@/components/domain/dashboard/GstLiabilityWidget";
import QuickActionsWidget from "@/components/domain/dashboard/QuickActionsWidget";
import NeedsAttentionWidget from "@/components/domain/dashboard/NeedsAttentionWidget";
import InventoryInsightsWidget from "@/components/domain/dashboard/InventoryInsightsWidget";



export default function App() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [chartMode, setChartMode] = useState<"Performance" | "Cash Flow">("Performance");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const isReady = useDeferredRender();
  const { isTabReady, startTransition } = useTabTransition();
  const isFullyReady = isReady && isTabReady;
  
  const { invoices, purchases, payments, items, currentBusiness } = useAppStore(useShallow(state => ({ 
    invoices: state.invoices, 
    purchases: state.purchases, 
    payments: state.payments, 
    items: state.items,
    currentBusiness: state.currentBusiness
  })));

  const {
      dashboardBalances,
      outstandingData,
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
            <View className="flex-1 justify-center min-h-[70px]">
              {showGreeting ? (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <Text className="text-3xl font-sans-bold text-primary leading-tight">{getGreeting()}</Text>
                  <Text className="text-3xl font-sans-bold text-primary leading-tight">{currentBusiness?.tradeName || "Guest"}!</Text>
                </Animated.View>
              ) : (
                <Animated.View entering={FadeIn} className="justify-center">
                  <Image 
                    source={require("../../../../assets/images/icon-black.png")} 
                    style={{ width: 44, height: 44, borderRadius: 12 }} 
                    resizeMode="contain" 
                  />
                </Animated.View>
              )}
            </View>
            <View className="flex-row items-center gap-4">
              <View className="relative">
                <Bell color="#081126" fill="#081126" size={22} />
                <View className="absolute right-0 top-0 size-2.5 rounded-full bg-red-600 border border-white" />
              </View>
          <Pressable style={({pressed})=>({opacity:pressed?0.7:1})} onPress={() => {
            Vibration.vibrate(10);
            router.push("/(app)/(settings)/settings");
          }}>
              <Image source={images.avatar} className="size-12 rounded-full" />
          </Pressable>
            </View>
          </View>

          <ScrollView ref={scrollViewRef} className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
            {/* GST Liability Widget */}
            <GstLiabilityWidget estimatedLiability={estimatedLiability} />

            {/* Quick Actions */}
            <QuickActionsWidget />

            <View className="flex-row gap-4 mb-6">
              {!isReady ? (
                <>
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </>
              ) : (
                dashboardBalances.map((balance: any, index: number) => (
                  <StatCard 
                    key={index} 
                    {...balance} 
                    icon={balance.title === 'Sales' ? <TrendingDown color="#16a34a" size={16} /> : <TrendingUp color="#ef4444" size={16} />}
                    iconBgClass={balance.title === 'Sales' ? 'bg-green-100' : 'bg-red-100'}
                  />
                ))
              )}
            </View>

            {/* Pending Actions / Alerts */}
            <NeedsAttentionWidget lowStockItems={lowStockItems} unpaidInvoices={unpaidInvoices} />

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
                  legend3="GST Liability"
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
            <InventoryInsightsWidget inventoryStats={inventoryStats} />

            <View className="items-center py-6 mt-2">
              <Text className="font-sans-medium text-xs text-muted-foreground/60 text-center">
                © 2026 Omnity Industries. All rights reserved.
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

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
