import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withDelay } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
  actionButton?: React.ReactNode;
}

export function EmptyState({ icon, title, subtitle, className = "", actionButton }: EmptyStateProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(100, withSpring(1));
    translateY.value = withDelay(100, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View className={`items-center justify-center py-16 px-6 ${className}`} style={animatedStyle}>
      <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-6 overflow-hidden">
        <BlurView intensity={20} tint="light" className="absolute inset-0" />
        <View className="z-10">{icon}</View>
      </View>
      <Text className="text-2xl font-sans-bold text-foreground mb-3 text-center">{title}</Text>
      <Text className="text-base text-muted-foreground text-center font-sans-regular max-w-[280px] mb-8 leading-relaxed">
        {subtitle}
      </Text>
      {actionButton && <View className="w-full max-w-[200px]">{actionButton}</View>}
    </Animated.View>
  );
}
