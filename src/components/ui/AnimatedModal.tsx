import { BlurView } from "expo-blur";
import { useState, useEffect } from "react";
import { Pressable, View, Modal, Dimensions, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS } from "react-native-reanimated";
import "../../../global.css";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AnimatedModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    avoidKeyboard?: boolean;
    placement?: 'bottom' | 'center';
}

export default function AnimatedModal({ visible, onClose, children, avoidKeyboard, placement = 'bottom' }: AnimatedModalProps) {
    const [show, setShow] = useState(visible);

    if (visible && !show) {
        setShow(true);
    }

    const slideAnim = useSharedValue(SCREEN_HEIGHT);
    const scaleAnim = useSharedValue(0.9);
    const fadeAnim = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            fadeAnim.value = withTiming(1, { duration: 150 });
            if (placement === 'bottom') {
                slideAnim.value = withSpring(0, { damping: 22, stiffness: 280, mass: 0.9 });
            } else {
                scaleAnim.value = withSpring(1, { damping: 22, stiffness: 280, mass: 0.9 });
            }
        } else {
            fadeAnim.value = withTiming(0, { duration: 100 });
            if (placement === 'bottom') {
                slideAnim.value = withTiming(SCREEN_HEIGHT, { duration: 150 }, () => {
                    runOnJS(setShow)(false);
                });
            } else {
                scaleAnim.value = withTiming(0.9, { duration: 150 }, () => {
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
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
                </Animated.View>
            </Pressable>
            <Animated.View style={contentStyle} className={placement === 'center' ? 'w-full items-center' : ''}>
                {children}
            </Animated.View>
        </View>
    );

    return (
        <Modal visible={show} transparent={true} animationType="none" onRequestClose={onClose} statusBarTranslucent>
            {avoidKeyboard && Platform.OS === 'ios' ? (
                <KeyboardAvoidingView behavior="padding" className="flex-1 m-0 p-0">
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
