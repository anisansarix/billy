import { ScrollView, Pressable, Text, View } from 'react-native';

interface FilterPillsProps {
    options: string[];
    activeFilters: string[];
    onToggleFilter: (filter: string) => void;
    className?: string;
}

export function FilterPills({ options, activeFilters, onToggleFilter, className = "" }: FilterPillsProps) {
    if (!options || options.length === 0) return null;

    return (
        <View className={className}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16, gap: 8 }}
            >
                {options.map((option) => {
                    const isActive = activeFilters.includes(option);
                    return (
                        <Pressable
                            key={option}
                            onPress={() => onToggleFilter(option)}
                            className={`px-4 py-2 rounded-full border ${isActive ? 'bg-primary border-primary' : 'bg-white border-gray-200'} shadow-sm`}
                            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                        >
                            <Text className={`font-sans-medium text-sm ${isActive ? 'text-white' : 'text-gray-700'}`}>
                                {option}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}
