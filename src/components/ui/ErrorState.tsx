import { View, Text, Pressable } from 'react-native';
import { AlertCircle, RefreshCcw } from 'lucide-react-native';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    retryLabel?: string;
}

export default function ErrorState({ 
    title = "Something went wrong", 
    message = "We encountered an unexpected error. Please try again.", 
    onRetry,
    retryLabel = "Retry"
}: ErrorStateProps) {
    return (
        <View className="flex-1 items-center justify-center p-6 min-h-[300px]">
            <View className="h-20 w-20 bg-red-50 rounded-full items-center justify-center mb-6">
                <AlertCircle color="#ef4444" size={36} />
            </View>
            <Text className="font-sans-bold text-xl text-primary mb-2 text-center">{title}</Text>
            <Text className="font-sans-medium text-sm text-muted-foreground text-center mb-8">{message}</Text>
            
            {onRetry && (
                <Pressable 
                    onPress={onRetry}
                    className="bg-primary flex-row items-center justify-center px-6 py-3 rounded-xl min-h-[44px]"
                    style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                >
                    <RefreshCcw color="white" size={18} className="mr-2" />
                    <Text className="font-sans-bold text-white text-base">{retryLabel}</Text>
                </Pressable>
            )}
        </View>
    );
}
