import { View, Text, TextInput, TextInputProps } from 'react-native';

interface FormFieldProps extends TextInputProps {
  label: string;
  suffix?: string;
}

export default function FormField({ label, suffix, style, ...props }: FormFieldProps) {
  return (
    <View className="mb-4">
      <Text className="font-sans-medium text-sm text-muted-foreground mb-1.5">{label}</Text>
      <View className={`bg-slate-50 border border-border rounded-xl px-4 ${props.multiline ? 'py-3' : 'h-12'} flex-row items-center focus:border-primary/50 focus:bg-white transition-colors`}>
        <TextInput
          className="flex-1 font-sans-medium text-base text-primary"
          placeholderTextColor="#9ca3af"
          style={[props.multiline ? { textAlignVertical: 'top' } : {}, style]}
          {...props}
        />
        {suffix && <Text className="font-sans-medium text-sm text-muted-foreground ml-2">{suffix}</Text>}
      </View>
    </View>
  );
}
