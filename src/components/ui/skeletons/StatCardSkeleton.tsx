import { View } from 'react-native';
import { Skeleton } from '../Skeleton';

export function StatCardSkeleton() {
    return (
        <View className="flex-1 bg-white p-4 rounded-3xl border border-border mr-3">
            <View className="flex-row items-center justify-between mb-3">
                {/* Icon Circle */}
                <Skeleton width={40} height={40} borderRadius={20} />
                {/* Trend Badge */}
                <Skeleton width={50} height={24} borderRadius={12} />
            </View>
            {/* Title */}
            <Skeleton width="60%" height={12} className="mb-2" />
            {/* Amount */}
            <Skeleton width="80%" height={24} />
        </View>
    );
}
