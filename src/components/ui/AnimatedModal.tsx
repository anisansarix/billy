import { BlurView } from "expo-blur";
import { useState, useEffect } from "react";
import { Pressable, View, Modal, Dimensions, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS, Easing } from "react-native-reanimated";
import "../../../global.css";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AnimatedModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    avoidKeyboard?: boolean;
    placement?: 'bottom' | 'center';
    blurTint?: 'light' | 'dark' | 'default';
    blurIntensity?: number;
}

export default function AnimatedModal({ 
    visible, 
    onClose, 
    children, 
    avoidKeyboard, 
    placement = 'bottom',
    blurTint = 'dark',
    blurIntensity = 30
}: AnimatedModalProps) {
    const [show, setShow] = useState(visible);

    if (visible && !show) {
        setShow(true);
    }

    const slideAnim = useSharedValue(SCREEN_HEIGHT);
    const scaleAnim = useSharedValue(0.95);
    const fadeAnim = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            fadeAnim.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
            if (placement === 'bottom') {
                slideAnim.value = withSpring(0, { damping: 24, stiffness: 260, mass: 0.8 });
            } else {
                scaleAnim.value = withSpring(1, { damping: 24, stiffness: 260, mass: 0.8 });
            }
        } else {
            fadeAnim.value = withTiming(0, { duration: 250, easing: Easing.in(Easing.cubic) });
            if (placement === 'bottom') {
                slideAnim.value = withTiming(SCREEN_HEIGHT, { duration: 250, easing: Easing.in(Easing.cubic) }, () => {
                    runOnJS(setShow)(false);
                });
            } else {
                scaleAnim.value = withTiming(0.95, { duration: 200, easing: Easing.in(Easing.cubic) }, () => {
                    runOnJS(setShow)(false);
                });
            }
        }
    }, [visible, placement, fadeAnim, scaleAnim, slideAnim]);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0
    }));

    const contentStyle = useAnimatedStyle(() => {
        if (placement === 'bottom') {
            return {
                transform: [{ translateY: slideAnim.value }]
            };
        }
        return {
            transform: [{ scale: scaleAnim.value }],
            opacity: fadeAnim.value
        };
    });

    if (!show) return null;

    const content = (
        <View className={`flex-1 ${placement === 'bottom' ? 'justify-end' : 'justify-center items-center'}`}>
            <Pressable className="absolute inset-0" onPress={onClose}>
                <Animated.View style={backdropStyle}>
                    <BlurView intensity={blurIntensity} tint={blurTint} style={StyleSheet.absoluteFill} />
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(15,23,42,0.4)' }]} />
                </Animated.View>
            </Pressable>
            <Animated.View style={contentStyle} className={placement === 'center' ? 'w-full items-center p-4' : 'w-full'}>
                {children}
            </Animated.View>
        </View>
    );

    return (
        <Modal visible={show} transparent={true} animationType="none" onRequestClose={onClose} statusBarTranslucent>
            {avoidKeyboard ? (
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 m-0 p-0">
                    {content}
                </KeyboardAvoidingView>
            ) : (
                <View className="flex-1 m-0 p-0">
                    {content}
                </View>
            )}
        </Modal>
    );
}
