import React from 'react';
import { Pressable, Text, PressableProps, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import "../../../global.css";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  title,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  className = '',
  textClassName = '',
  loading = false,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = (e: import("react-native").GestureResponderEvent) => {
    if (disabled || loading) return;
    scale.value = withTiming(0.96, { duration: 100, easing: Easing.out(Easing.ease) });
    opacity.value = withTiming(0.8, { duration: 100 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: import("react-native").GestureResponderEvent) => {
    if (disabled || loading) return;
    scale.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) });
    opacity.value = withTiming(1, { duration: 150 });
    if (onPressOut) onPressOut(e);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  let baseClass = "h-14 flex-row items-center justify-center rounded-xl px-4 ";
  let textClass = "text-base font-sans-medium ";

  switch (variant) {
    case 'primary':
      baseClass += "bg-primary border border-transparent";
      textClass += "text-white";
      break;
    case 'secondary':
      baseClass += "bg-primary/10 border border-transparent";
      textClass += "text-primary font-sans-bold";
      break;
    case 'outline':
      baseClass += "bg-transparent border border-border";
      textClass += "text-primary";
      break;
    case 'danger':
      baseClass += "bg-destructive/10 border border-transparent";
      textClass += "text-destructive font-sans-bold";
      break;
  }

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={`${baseClass} ${className}`}
      style={[animatedStyle, { opacity: disabled || loading ? 0.6 : opacity.value }]}
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? 'white' : '#208AEF'} />
      ) : (
        <>
          {icon && iconPosition === 'left' && <React.Fragment>{icon}</React.Fragment>}
          <Text className={`${textClass} ${icon && iconPosition === 'left' ? 'ml-2' : ''} ${icon && iconPosition === 'right' ? 'mr-2' : ''} ${textClassName}`}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && <React.Fragment>{icon}</React.Fragment>}
        </>
      )}
    </AnimatedPressable>
  );
}
