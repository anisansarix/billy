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
    <View className="bg-white rounded-3xl p-5 shadow-sm border border-border flex-1">
      <View className="flex-row justify-between items-start mb-3">
        <Text className="text-muted-foreground font-sans-medium uppercase tracking-wider text-xs">{title}</Text>
        {icon && <View className="bg-muted p-2 rounded-xl">{icon}</View>}
      </View>
      <Text className="text-2xl font-sans-bold text-primary mb-1">{value}</Text>
      {subtitle && <Text className="text-sm text-muted-foreground font-sans-regular">{subtitle}</Text>}
      {trend && (
        <View className={`mt-2 py-1 px-2 rounded-lg self-start ${trendUp ? 'bg-green-50' : 'bg-destructive/10'}`}>
          <Text className={`text-xs font-sans-bold ${trendUp ? 'text-green-600' : 'text-destructive'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </Text>
        </View>
      )}
    </View>
  );
}
