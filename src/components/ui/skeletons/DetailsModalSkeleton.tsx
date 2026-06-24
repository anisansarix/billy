import { View } from 'react-native';
import { Skeleton } from '../Skeleton';

export function DetailsModalSkeleton() {
    return (
        <View className="w-full bg-white rounded-t-3xl p-6 min-h-[400px]">
            <View className="flex-row justify-between items-start mb-6">
                <View className="flex-1 mr-4">
                    <Skeleton width="60%" height={28} className="mb-2" />
                    <Skeleton width="40%" height={20} />
                </View>
                <Skeleton width={44} height={44} borderRadius={22} />
            </View>

            <View className="p-4 rounded-2xl bg-slate-50 border border-border flex-row justify-between items-center mb-6">
                <View>
                    <Skeleton width={80} height={14} className="mb-2" />
                    <Skeleton width={120} height={28} />
                </View>
                <Skeleton width={70} height={24} borderRadius={6} />
            </View>

            <View className="mb-8 space-y-4">
                <View className="flex-row items-center">
                    <Skeleton width={40} height={40} borderRadius={20} className="mr-4" />
                    <View className="flex-1">
                        <Skeleton width={100} height={14} className="mb-2" />
                        <Skeleton width="80%" height={20} />
                    </View>
                </View>
                <View className="flex-row items-center mt-4">
                    <Skeleton width={40} height={40} borderRadius={20} className="mr-4" />
                    <View className="flex-1">
                        <Skeleton width={60} height={14} className="mb-2" />
                        <Skeleton width="50%" height={20} />
                    </View>
                </View>
            </View>

            <View className="flex-row space-x-4 mb-4">
                <Skeleton className="flex-1 mr-2" height={56} borderRadius={12} />
                <Skeleton className="flex-1 ml-2" height={56} borderRadius={12} />
            </View>
            <Skeleton width="100%" height={56} borderRadius={12} />
        </View>
    );
}
