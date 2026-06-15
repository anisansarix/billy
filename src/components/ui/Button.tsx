import React from 'react';
import { Pressable, Text, PressableProps, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import "../../../global.css";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'glass';
  icon?: React.ReactNode;
  className?: string;
  textClassName?: string;
}

export default function Button({
  title,
  variant = 'primary',
  icon,
  className = '',
  textClassName = '',
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = (e: import("react-native").GestureResponderEvent) => {
    scale.value = withSpring(0.94, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: 150 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: import("react-native").GestureResponderEvent) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 150 });
    if (onPressOut) onPressOut(e);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  let baseClass = "h-14 flex-row items-center justify-center rounded-2xl px-4 overflow-hidden ";
  let textClass = "text-base font-sans-semibold ";

  switch (variant) {
    case 'primary':
      baseClass += "bg-primary shadow-lg shadow-primary/30";
      textClass += "text-primary-foreground";
      break;
    case 'secondary':
      baseClass += "bg-muted shadow-sm";
      textClass += "text-foreground font-sans-bold";
      break;
    case 'outline':
      baseClass += "bg-transparent border-2 border-border";
      textClass += "text-foreground";
      break;
    case 'danger':
      baseClass += "bg-destructive/10 border border-transparent";
      textClass += "text-destructive font-sans-bold";
      break;
    case 'glass':
      baseClass += "bg-transparent border border-glass-border";
      textClass += "text-foreground";
      break;
  }

  const InnerContent = () => (
    <>
      {icon && <View className="mr-2">{icon}</View>}
      <Text className={`${textClass} ${textClassName}`}>
        {title}
      </Text>
    </>
  );

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={`${baseClass} ${className}`}
      style={animatedStyle}
      accessibilityRole="button"
      accessibilityLabel={title}
      {...props}
    >
      {variant === 'glass' ? (
        <BlurView intensity={30} tint="light" className="absolute inset-0" />
      ) : null}
      <InnerContent />
    </AnimatedPressable>
  );
}
