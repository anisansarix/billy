
import { Text, TouchableOpacity, View } from 'react-native';

interface SegmentedTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export function SegmentedTabs({ tabs, activeTab, onTabChange, className = "" }: SegmentedTabsProps) {
  return (
    <View className={`mx-5 bg-gray-200/80 p-1 rounded-xl flex-row ${className}`}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabChange(tab)}
          className={`flex-1 py-2 rounded-lg items-center justify-center ${
            activeTab === tab ? "bg-white" : ""
          }`}
          style={activeTab === tab ? { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2 } : {}}
        >
          <Text className={`font-sans-medium text-sm ${activeTab === tab ? "text-primary" : "text-muted-foreground"}`}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
