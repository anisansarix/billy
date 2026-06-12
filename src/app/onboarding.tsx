import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRight, BarChart3, Receipt, PackageSearch } from "lucide-react-native";
import { Dimensions, Pressable, ScrollView, Text, View, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import "../../global.css";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: '1',
    title: 'Smart Invoicing',
    description: 'Create GST compliant invoices in seconds. Share directly via WhatsApp and get paid faster.',
    icon: Receipt,
    color: '#3b82f6',
    bgColor: '#eff6ff'
  },
  {
    id: '2',
    title: 'Inventory Control',
    description: 'Track stock levels in real-time. Receive low stock alerts and never miss a sale again.',
    icon: PackageSearch,
    color: '#8b5cf6',
    bgColor: '#f5f3ff'
  },
  {
    id: '3',
    title: 'Financial Insights',
    description: 'Get deep insights into your cashflow, receivables, and payables right from your dashboard.',
    icon: BarChart3,
    color: '#10b981',
    bgColor: '#ecfdf5'
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
    if (activeIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (activeIndex + 1), animated: true });
    } else {
      router.push("/(auth)/sign-in");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      
      {/* Skip Button */}
      <View className="flex-row justify-end px-6 pt-4">
        <Pressable onPress={() => router.push("/(auth)/sign-in")}>
          <Text className="font-sans-bold text-muted-foreground text-base">Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        className="flex-1 mt-10"
      >
        {SLIDES.map((slide) => {
          const Icon = slide.icon;
          return (
            <View key={slide.id} style={{ width }} className="items-center px-8">
              <View 
                className="w-64 h-64 rounded-full items-center justify-center mb-12 border border-black/5"
                style={{ backgroundColor: slide.bgColor }}
              >
                <Icon color={slide.color} size={100} strokeWidth={1.5} />
              </View>
              
              <Text className="text-3xl font-sans-extrabold text-primary text-center mb-4 leading-tight">
                {slide.title}
              </Text>
              
              <Text className="text-base font-sans-medium text-muted-foreground text-center leading-relaxed">
                {slide.description}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Controls */}
      <View className="px-8 pb-12 pt-4 flex-row items-center justify-between">
        {/* Pagination Dots */}
        <View className="flex-row items-center">
          {SLIDES.map((_, index) => (
            <View 
              key={index}
              className={`h-2.5 rounded-full mr-2 ${activeIndex === index ? 'w-8 bg-primary' : 'w-2.5 bg-gray-200'}`}
              style={{ transitionProperty: 'all', transitionDuration: '300ms' }}
            />
          ))}
        </View>

        {/* Next/Start Button */}
        <Pressable 
          onPress={handleNext}
          className="bg-primary px-6 py-4 rounded-full flex-row items-center shadow-sm"
        >
          <Text className="font-sans-bold text-white mr-2 text-base">
            {activeIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
          </Text>
          <ArrowRight color="white" size={20} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
