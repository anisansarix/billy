import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, interpolateColor } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import "../../../global.css";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps extends PressableProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'flat' | 'outline';
  className?: string;
  isPressable?: boolean;
}

export default function Card({ children, variant = 'elevated', className = '', isPressable = false, onPressIn, onPressOut, ...props }: CardProps) {
  const scale = useSharedValue(1);
  const pressedState = useSharedValue(0);

  const handlePressIn = (e: import("react-native").GestureResponderEvent) => {
    if (isPressable) {
      scale.value = withTiming(0.97, { duration: 100, easing: Easing.out(Easing.ease) });
      pressedState.value = withTiming(1, { duration: 100 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: import("react-native").GestureResponderEvent) => {
    if (isPressable) {
      scale.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) });
      pressedState.value = withTiming(0, { duration: 150 });
    }
    if (onPressOut) onPressOut(e);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(pressedState.value, [0, 1], ['#ffffff', '#f1f5f9']),
  }));

  let baseClass = "p-4 rounded-xl mb-3 ";

  switch (variant) {
    case 'elevated':
      baseClass += "shadow-sm border border-white/50 ";
      break;
    case 'outline':
      baseClass += "border border-border ";
      break;
    case 'flat':
      baseClass += " ";
      break;
  }

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
      {children}
    </AnimatedPressable>
  );
}
