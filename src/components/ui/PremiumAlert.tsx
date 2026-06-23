import { View, Text, Pressable } from "react-native";
import AnimatedModal from "./AnimatedModal";
import { useAlertStore } from "@/store/alertStore";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react-native";

export default function PremiumAlert() {
  const { visible, title, message, type, buttons, hideAlert } = useAlertStore();

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 color="#16a34a" size={40} />;
      case 'error': return <AlertCircle color="#dc2626" size={40} />;
      case 'warning': return <AlertTriangle color="#f59e0b" size={40} />;
      case 'info':
      default: return <Info color="#208AEF" size={40} />;
    }
  };

  return (
    <AnimatedModal visible={visible} onClose={hideAlert} placement="center">
      <View className="bg-white rounded-[32px] p-6 m-6 w-80 shadow-2xl items-center border border-border">
        <View className="mb-4">
          {getIcon()}
        </View>
        <Text className="text-xl font-sans-bold text-primary mb-2 text-center">{title}</Text>
        <Text className="text-sm font-sans-regular text-muted-foreground text-center mb-8">{message}</Text>
        
        <View className={`w-full ${buttons.length > 2 ? 'flex-col gap-3' : 'flex-row gap-3 justify-center'}`}>
          {buttons.map((btn, index) => {
            const isDestructive = btn.style === 'destructive';
            const isCancel = btn.style === 'cancel';
            
            return (
              <Pressable
                key={index}
                onPress={() => {
                  hideAlert();
                  if (btn.onPress) btn.onPress();
                }}
                className={`flex-1 py-3.5 px-4 rounded-2xl items-center justify-center ${
                  isDestructive ? 'bg-red-50 border border-red-100' : isCancel ? 'bg-slate-100 border border-transparent' : 'bg-[#081126] border border-[#081126]'
                }`}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Text className={`font-sans-medium text-base ${
                  isDestructive ? 'text-red-600' : isCancel ? 'text-primary' : 'text-white'
                }`}>
                  {btn.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </AnimatedModal>
  );
}
