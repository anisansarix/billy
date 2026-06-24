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
    <View className="bg-white rounded-2xl p-5 shadow-sm border border-border flex-1">
      <View className="flex-row items-center mb-4">
        {icon && (
            <View className="h-10 w-10 bg-primary/10 rounded-full items-center justify-center mr-3">
                {icon}
            </View>
        )}
        <Text className="text-muted-foreground font-sans-medium uppercase tracking-wider text-xs flex-1" numberOfLines={1}>{title}</Text>
      </View>
      <Text className="text-[22px] font-sans-bold text-primary mb-1">{value}</Text>
      {subtitle && <Text className="text-sm text-muted-foreground font-sans-medium">{subtitle}</Text>}
      {trend && (
        <View className={`mt-3 py-1 px-2 rounded-lg self-start ${trendUp ? 'bg-green-50' : 'bg-red-50'}`}>
          <Text className={`text-xs font-sans-bold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </Text>
        </View>
      )}
    </View>
  );
}
