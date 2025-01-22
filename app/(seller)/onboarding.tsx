import { View, Text } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function SellerOnboarding() {
  return (
    <View className="flex-1 bg-white px-4">
      <Animated.View 
        entering={FadeInUp.duration(1000).springify()}
        className="flex-1 justify-center"
      >
        <Text className="text-3xl font-bold text-center">
          Seller Onboarding
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Coming Soon
        </Text>
      </Animated.View>
    </View>
  );
} 