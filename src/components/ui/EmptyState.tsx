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
      <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-6">
        {icon}
      </View>
      <Text className="text-xl font-sans-bold text-primary mb-2 text-center">{title}</Text>
      <Text className="text-base text-muted-foreground text-center font-sans-regular max-w-xs">{subtitle}</Text>
    </View>
  );
}
