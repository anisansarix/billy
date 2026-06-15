import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}

export function EmptyState({ icon, title, subtitle, className = "" }: EmptyStateProps) {
  return (
    <View className={`items-center justify-center py-12 px-4 ${className}`}>
      <View className="w-20 h-20 rounded-full bg-blue-50 items-center justify-center mb-6">
        {icon}
      </View>
      <Text className="text-xl font-jakarta-bold text-gray-900 mb-2 text-center">{title}</Text>
      <Text className="text-base text-gray-500 text-center font-jakarta max-w-xs">{subtitle}</Text>
    </View>
  );
}
