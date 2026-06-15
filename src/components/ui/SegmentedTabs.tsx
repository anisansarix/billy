import { Text, TouchableOpacity, View, Vibration, ScrollView } from 'react-native';

interface SegmentedTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export function SegmentedTabs({ tabs, activeTab, onTabChange, className = "" }: SegmentedTabsProps) {
  return (
    <View className={`mx-5 bg-gray-200/80 p-1 rounded-xl ${className}`}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              if (activeTab !== tab) Vibration.vibrate(10);
              onTabChange(tab);
            }}
            className={`px-4 py-2 rounded-lg items-center justify-center min-w-[80px] ${
              activeTab === tab ? "bg-white" : ""
            } ${tabs.length <= 3 ? "flex-1" : ""}`}
            style={activeTab === tab ? { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2 } : {}}
          >
            <Text className={`font-sans-medium text-sm ${activeTab === tab ? "text-primary" : "text-muted-foreground"}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
