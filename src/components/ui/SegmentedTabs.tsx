
import { Text, TouchableOpacity, ScrollView } from 'react-native';

interface SegmentedTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export function SegmentedTabs({ tabs, activeTab, onTabChange, className = "" }: SegmentedTabsProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className={`mb-4 ${className}`}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-full ${
            activeTab === tab ? "bg-primary" : "bg-white border border-gray-200"
          }`}
          style={activeTab === tab ? {} : { elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } }}
        >
          <Text className={`font-medium ${activeTab === tab ? "text-white" : "text-gray-600"}`}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
