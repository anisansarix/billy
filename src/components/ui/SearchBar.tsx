
import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChangeText, placeholder = "Search...", className = "" }: SearchBarProps) {
  return (
    <View className={`px-4 mb-4 ${className}`}>
      <View className="flex-row items-center bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm">
        <Search size={20} color="#64748b" />
        <TextInput
          placeholder={placeholder}
          className="flex-1 ml-3 font-jakarta text-base text-gray-900"
          placeholderTextColor="#94a3b8"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}
