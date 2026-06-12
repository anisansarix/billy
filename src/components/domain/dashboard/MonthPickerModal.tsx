import React from "react";
import { View, Text, Pressable } from "react-native";
import AnimatedModal from "@/components/ui/AnimatedModal";

interface MonthPickerModalProps {
    visible: boolean;
    onClose: () => void;
    options: string[];
    selectedMonth: string;
    onSelect: (month: string) => void;
}

export default function MonthPickerModal({ visible, onClose, options, selectedMonth, onSelect }: MonthPickerModalProps) {
    return (
        <AnimatedModal visible={visible} onClose={onClose} placement="center">
            <View className="bg-white rounded-3xl w-[85%] max-w-sm p-6 shadow-xl">
                <Text className="font-sans-bold text-xl text-primary mb-4 text-center">Select Month</Text>
                {options.map((month, index) => (
                    <Pressable 
                        key={month} 
                        className={`py-4 ${index !== options.length - 1 ? 'border-b border-border' : ''}`} 
                        onPress={() => { onSelect(month); onClose(); }}
                        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                    >
                        <Text className={`text-center text-lg ${selectedMonth === month ? 'text-primary font-sans-bold' : 'text-muted-foreground font-sans-medium'}`}>
                            {month}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </AnimatedModal>
    );
}
