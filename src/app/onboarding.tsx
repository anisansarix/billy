import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dimensions, Pressable, ScrollView, Text, View, NativeSyntheticEvent, NativeScrollEvent, Image, Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import { CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, MousePointer2, Package, PieChart, Sparkles } from "lucide-react-native";
import "../../global.css";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: '1',
    title: 'Smart Invoicing built to get you paid',
    description: 'Create beautiful GST compliant invoices in seconds. Share directly via WhatsApp and track payments instantly.',
    renderGraphic: () => (
      <View className="relative w-full h-full items-center justify-center">
        {/* Background decorative blob */}
        <View className="absolute w-64 h-64 bg-blue-100 rounded-full opacity-50 top-1/2 left-1/2 -translate-x-32 -translate-y-32" />

        {/* Abstract Secondary Card Background */}
        <View className="bg-white/50 p-4 rounded-2xl absolute -top-6 -left-8 -rotate-12 w-48 shadow-sm border border-white">
            <View className="h-2 bg-blue-900/10 rounded w-1/2 mb-3" />
            <View className="h-2 bg-blue-900/5 rounded w-3/4 mb-2" />
            <View className="h-2 bg-blue-900/5 rounded w-2/3" />
        </View>

        {/* Main Floating Invoice Card */}
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-black/5 w-3/4 -rotate-3 z-10">
            <View className="flex-row justify-between items-center mb-3">
                <Text className="font-sans-medium text-xs text-muted-foreground">Invoice #INV-204</Text>
                <Text className="font-sans-bold text-xs text-primary">Today</Text>
            </View>
            <Text className="font-sans-extrabold text-2xl text-primary mb-1">₹45,200</Text>
            <Text className="font-sans-medium text-sm text-muted-foreground">Omnity Industries</Text>
        </View>

        {/* Floating Paid Badge */}
        <View className="bg-green-100 px-4 py-2 rounded-full border border-green-200 flex-row items-center absolute -bottom-6 -right-4 rotate-6 shadow-sm z-20">
            <CheckCircle2 color="#16a34a" size={16} className="mr-1.5" />
            <Text className="font-sans-bold text-sm text-green-700">Paid in full</Text>
        </View>

        {/* Floating Cursor pointing to card */}
        <View className="absolute -bottom-8 right-16 z-30 opacity-80">
            <MousePointer2 color="#081126" size={28} fill="#ffffff" />
        </View>
        
        {/* Sparkle Decoration */}
        <View className="absolute top-4 right-2">
            <Sparkles color="#3b82f6" size={24} opacity={0.4} />
        </View>
      </View>
    )
  },
  {
    id: '2',
    title: 'Automated Inventory & Stock Alerts',
    description: 'Track stock levels in real-time across multiple warehouses. Never miss a sale due to low stock again.',
    renderGraphic: () => (
      <View className="relative w-full h-full items-center justify-center">
        {/* Background decorative blob */}
        <View className="absolute w-64 h-64 bg-purple-100 rounded-full opacity-50 top-1/2 left-1/2 -translate-x-32 -translate-y-32" />

        {/* Abstract Secondary Card Background */}
        <View className="bg-white/50 p-4 rounded-2xl absolute top-12 -right-10 rotate-12 w-48 shadow-sm border border-white z-0">
            <View className="h-10 w-10 bg-purple-900/10 rounded-xl mb-3" />
            <View className="h-2 bg-purple-900/10 rounded w-2/3" />
        </View>
        
        {/* Main Floating Product Card */}
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-black/5 w-3/4 rotate-2 z-10">
            <View className="flex-row justify-between items-center mb-3">
                <Text className="font-sans-medium text-xs text-muted-foreground">SKU: COT-SHIRT-M</Text>
            </View>
            <Text className="font-sans-bold text-lg text-primary mb-1">Premium Cotton Shirt</Text>
            <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-black/5">
                <Text className="font-sans-medium text-sm text-muted-foreground">In Stock</Text>
                <Text className="font-sans-extrabold text-base text-primary">4 Units</Text>
            </View>
        </View>

        {/* Floating Alert Badge */}
        <View className="bg-red-50 px-4 py-2 rounded-xl border border-red-100 flex-row items-center absolute -bottom-4 -left-6 -rotate-6 shadow-sm z-20">
            <AlertTriangle color="#dc2626" size={16} className="mr-2" />
            <Text className="font-sans-bold text-sm text-red-600">Low Stock Alert</Text>
        </View>

        {/* Floating Package Icon */}
        <View className="bg-white p-3 rounded-full absolute -top-10 -left-2 -rotate-12 shadow-sm border border-black/5 z-20">
            <Package color="#9333ea" size={24} />
        </View>
        
        {/* Sparkle Decoration */}
        <View className="absolute bottom-6 right-0">
            <Sparkles color="#a855f7" size={24} opacity={0.4} />
        </View>
      </View>
    )
  },
  {
    id: '3',
    title: 'Financial Insights at your fingertips',
    description: 'Get deep, actionable insights into your cashflow, receivables, and tax liabilities in one beautiful dashboard.',
    renderGraphic: () => (
      <View className="relative w-full h-full items-center justify-center">
        {/* Background decorative blob */}
        <View className="absolute w-64 h-64 bg-emerald-100 rounded-full opacity-50 top-1/2 left-1/2 -translate-x-32 -translate-y-32" />

        {/* Abstract Secondary Card Background */}
        <View className="bg-white/50 p-4 rounded-2xl absolute -bottom-12 -left-8 -rotate-6 w-48 shadow-sm border border-white">
             <View className="flex-row items-end space-x-2 h-10 mb-2">
                 <View className="w-6 h-6 bg-emerald-900/10 rounded-t-sm" />
                 <View className="w-6 h-8 bg-emerald-900/10 rounded-t-sm" />
                 <View className="w-6 h-10 bg-emerald-900/10 rounded-t-sm" />
             </View>
             <View className="h-2 bg-emerald-900/10 rounded w-3/4" />
        </View>
        
        {/* Main Floating Chart Card */}
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-black/5 w-3/4 -rotate-2 z-10">
            <Text className="font-sans-medium text-xs text-muted-foreground mb-1">Total Revenue</Text>
            <Text className="font-sans-extrabold text-3xl text-primary mb-3">₹8,45,000</Text>
            
            <View className="flex-row items-end space-x-2 h-16">
                <View className="w-8 h-8 bg-blue-100 rounded-t-sm" />
                <View className="w-8 h-12 bg-blue-200 rounded-t-sm" />
                <View className="w-8 h-10 bg-blue-300 rounded-t-sm" />
                <View className="w-8 h-16 bg-primary rounded-t-sm" />
            </View>
        </View>

        {/* Floating Growth Badge */}
        <View className="bg-white px-4 py-2 rounded-full border border-black/5 flex-row items-center absolute -bottom-6 -right-2 rotate-6 shadow-sm z-20">
            <View className="bg-green-100 rounded-full p-1 mr-2">
                <TrendingUp color="#16a34a" size={14} />
            </View>
            <Text className="font-sans-bold text-sm text-primary">+24% this month</Text>
        </View>

        {/* Floating Pie Chart Icon */}
        <View className="bg-white p-3 rounded-full absolute -top-12 right-2 rotate-12 shadow-sm border border-black/5 z-20">
            <PieChart color="#10b981" size={24} />
        </View>
        
        {/* Sparkle Decoration */}
        <View className="absolute top-2 -left-4">
            <Sparkles color="#10b981" size={24} opacity={0.4} />
        </View>
      </View>
    )
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const handleNext = () => {
    Vibration.vibrate(10);
    if (activeIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (activeIndex + 1), animated: true });
    } else {
      router.push("/(auth)/sign-in");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: " bg-slate-50".includes("bg-white") ? "white" : "#f8fafc" }} className="flex-1 bg-slate-50">
      <StatusBar style="dark" />

      {/* Skip Button */}
      {activeIndex < SLIDES.length - 1 && (
        <View className="absolute top-14 right-6 z-50">
          <Pressable onPress={() => { Vibration.vibrate(10); router.push("/(auth)/sign-up"); }}>
            <Text className="font-sans-medium text-muted-foreground/60 text-base">Skip</Text>
          </Pressable>
        </View>
      )}

      {/* Main Content Area */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        className="flex-1"
        bounces={false}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={{ width }} className="flex-1">
            
            {/* Top Graphic Half */}
            <View className="flex-[1.2] pt-12 px-8">
                {slide.renderGraphic()}
            </View>

            {/* Bottom Text Half */}
            <View className="flex-1 px-8 items-center justify-start pt-8">
              <Image 
                source={require("../../assets/images/icon-black.png")} 
                className="w-12 h-12 mb-8 rounded-xl"
                resizeMode="contain"
              />
              <Text className="text-[28px] font-sans-extrabold text-[#081126] text-center mb-4 leading-tight">
                {slide.title}
              </Text>
              <Text className="text-base font-sans-medium text-muted-foreground text-center leading-relaxed">
                {slide.description}
              </Text>
            </View>

          </View>
        ))}
      </ScrollView>

      {/* Fixed Bottom Footer */}
      <View className="px-6 pb-6 pt-2 items-center bg-[#FAFAFA]">
        
        {/* Pagination Dots */}
        <View className="flex-row items-center mb-8">
          {SLIDES.map((_, index) => (
            <View 
              key={index}
              className={`h-2 rounded-full mx-1 ${activeIndex === index ? 'w-6 bg-[#081126]' : 'w-2 bg-gray-300'}`}
              style={{ transitionProperty: 'width', transitionDuration: '300ms' }}
            />
          ))}
        </View>

        {/* Primary Action Button */}
        <Pressable 
          onPress={handleNext}
          className="w-full bg-[#081126] py-4 rounded-full flex-row items-center justify-center shadow-sm"
        >
          <Text className="font-sans-bold text-white text-lg mr-2">
            {activeIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
          </Text>
          {activeIndex < SLIDES.length - 1 && (
            <ArrowRight color="white" size={20} />
          )}
        </Pressable>

      </View>
    </SafeAreaView>
  );
}
