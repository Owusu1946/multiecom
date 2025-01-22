import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import SkeletonLoader from '../ui/SkeletonLoader';

export default function PaymentMethodSkeleton() {
  return (
    <View className="space-y-6">
      {[1, 2].map((_, index) => (
        <Animated.View
          key={index}
          entering={FadeInUp.delay(index * 100)}
          className="bg-white p-4 rounded-2xl"
        >
          <View className="flex-row items-center">
            <SkeletonLoader 
              width={48} 
              height={48} 
              borderRadius={24} 
            />
            <View className="flex-1 ml-3">
              <SkeletonLoader 
                width={120} 
                height={20} 
                className="mb-2"
              />
              <SkeletonLoader 
                width={100} 
                height={16} 
              />
            </View>
            <SkeletonLoader 
              width={32} 
              height={32} 
              borderRadius={16} 
            />
          </View>
        </Animated.View>
      ))}
    </View>
  );
} 