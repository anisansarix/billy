import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import "../../../global.css";

interface AuthInputProps extends TextInputProps {
  label: string;
  required?: boolean;
  isPassword?: boolean;
  error?: string;
  icon?: React.ReactNode;
}

export default function AuthInput({ label, required, isPassword, error, icon, ...props }: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isFocused = useSharedValue(0);

  const handleFocus = (e: any) => {
    isFocused.value = withTiming(1, { duration: 200 });
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: any) => {
    isFocused.value = withTiming(0, { duration: 200 });
    if (props.onBlur) props.onBlur(e);
  };

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: error
        ? '#EF4444' // destructive
        : isFocused.value
          ? '#4F46E5' // primary
          : 'rgba(15, 23, 42, 0.1)' // border
    };
  });

  return (
    <View className="mb-5">
      <Text className="text-sm font-sans-medium text-foreground mb-1.5 ml-1">
        {label}
        {required && <Text className="text-destructive">*</Text>}
      </Text>

      <Animated.View 
        className={`flex-row items-center rounded-2xl border-2 bg-card px-4 h-14 ${error ? 'bg-destructive/5' : ''}`}
        style={animatedBorderStyle}
      >
        {icon && <View className="mr-3 opacity-60">{icon}</View>}
        <TextInput
          className="flex-1 h-full text-base font-sans-regular text-foreground"
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword && !showPassword}
          accessibilityLabel={label}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="p-2 -mr-2"
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={22} color="#94A3B8" />
            ) : (
              <Eye size={22} color="#94A3B8" />
            )}
          </Pressable>
        )}
      </Animated.View>
      
      {error && (
        <Text className="text-destructive text-sm font-sans-medium mt-1.5 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
}
