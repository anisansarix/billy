import { View } from 'react-native';
import Card from '../Card';
import { Skeleton } from '../Skeleton';

export function ListCardSkeleton() {
    return (
        <Card className="mb-4">
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-2">
                    {/* Title */}
                    <Skeleton width="70%" height={18} className="mb-2" />
                    {/* Subtitle */}
                    <Skeleton width="40%" height={14} />
                </View>
                {/* Status Badge */}
                <Skeleton width={60} height={24} borderRadius={6} />
            </View>

            <View className="h-[1px] w-full bg-border mb-3" />

            <View className="flex-row justify-between items-center">
                <View>
                    {/* Label */}
                    <Skeleton width={40} height={10} className="mb-2" />
                    {/* Value */}
                    <Skeleton width={60} height={16} />
                </View>
                <View className="items-end">
                    {/* Label */}
                    <Skeleton width={50} height={10} className="mb-2" />
                    {/* Value */}
                    <Skeleton width={80} height={20} />
                </View>
            </View>
        </Card>
    );
}
