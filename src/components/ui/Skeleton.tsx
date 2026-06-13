import { useEffect } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | `${number}%` | "auto";
  height?: number | `${number}%` | "auto";
  borderRadius?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ 
  width, 
  height = 20, 
  borderRadius = 8, 
  className = '', 
  style 
}: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // infinite
      true // reverse
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      className={`bg-slate-200 dark:bg-slate-800 ${className}`}
      style={[
        { width, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
}
