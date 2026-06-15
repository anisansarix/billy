import React from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import "../../../global.css";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps extends PressableProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'flat' | 'outline' | 'glass';
  className?: string;
  isPressable?: boolean;
}

export default function Card({ children, variant = 'elevated', className = '', isPressable = false, onPressIn, onPressOut, ...props }: CardProps) {
  const scale = useSharedValue(1);

  const handlePressIn = (e: import("react-native").GestureResponderEvent) => {
    if (isPressable) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: import("react-native").GestureResponderEvent) => {
    if (isPressable) scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    if (onPressOut) onPressOut(e);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  let baseClass = "p-4 rounded-3xl mb-4 overflow-hidden ";

  switch (variant) {
    case 'elevated':
      baseClass += "bg-card shadow-lg shadow-black/5 border border-white/20 ";
      break;
    case 'outline':
      baseClass += "bg-card border-2 border-border ";
      break;
    case 'flat':
      baseClass += "bg-muted ";
      break;
    case 'glass':
      baseClass += "bg-glass border border-glass-border ";
      break;
  }

  const isGlass = variant === 'glass';

  return (
    <AnimatedPressable
      className={`${baseClass} ${className}`}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      disabled={!isPressable && !props.onPress}
      accessibilityRole={isPressable || props.onPress ? 'button' : 'none'}
      {...props}
    >
      {isGlass ? (
        <BlurView intensity={20} tint="default" className="absolute inset-0" />
      ) : null}
      <View className="z-10">{children}</View>
    </AnimatedPressable>
  );
}
