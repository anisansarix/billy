import React from 'react';
import { View, Text } from 'react-native';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export function SummaryCard({ title, value, subtitle, icon, trend, trendUp }: SummaryCardProps) {
  return (
    <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex-1">
      <View className="flex-row justify-between items-start mb-3">
        <Text className="text-gray-500 font-jakarta-medium uppercase tracking-wider text-xs">{title}</Text>
        {icon && <View className="bg-gray-50 p-2 rounded-xl">{icon}</View>}
      </View>
      <Text className="text-2xl font-jakarta-bold text-gray-900 mb-1">{value}</Text>
      {subtitle && <Text className="text-sm text-gray-500 font-jakarta">{subtitle}</Text>}
      {trend && (
        <View className={`mt-2 py-1 px-2 rounded-lg self-start ${trendUp ? 'bg-green-50' : 'bg-red-50'}`}>
          <Text className={`text-xs font-jakarta-bold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </Text>
        </View>
      )}
    </View>
  );
}
