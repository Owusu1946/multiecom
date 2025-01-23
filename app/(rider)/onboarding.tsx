import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ONBOARDING_STEPS = [
  {
    title: 'Deliver with Speed',
    description: 'Join our network of riders and start earning by delivering packages across the city.',
    animation: require('@/assets/Onboarding/onboarding1.json'),
  },
  {
    title: 'Flexible Schedule',
    description: 'Work when you want. Set your own hours and be your own boss.',
    animation: require('@/assets/Onboarding/onboarding1.json'),
  },
  {
    title: 'Earn More',
    description: 'Make competitive earnings with bonuses and incentives.',
    animation: require('@/assets/Onboarding/onboarding1.json'),
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  
  return (
    <View 
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 px-6">
        <Animated.View 
          entering={FadeInDown.delay(300)}
          className="flex-1 items-center justify-center"
        >
          <LottieView
            source={ONBOARDING_STEPS[0].animation}
            autoPlay
            loop
            style={{ width: width * 0.8, height: width * 0.8 }}
          />
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400)}
          className="mb-8"
        >
          <Text className="text-2xl font-semibold text-center text-gray-900 mb-3">
            {ONBOARDING_STEPS[0].title}
          </Text>
          <Text className="text-gray-500 text-center text-base">
            {ONBOARDING_STEPS[0].description}
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(500)}
          className="space-y-4"
        >
          <TouchableOpacity
            className="bg-primary py-4 rounded-xl"
            onPress={() => router.push('/signup')}
          >
            <Text className="text-white text-center font-semibold">
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-4"
            onPress={() => router.push('/login')}
          >
            <Text className="text-gray-600 text-center">
              Already have an account? <Text className="text-primary font-medium">Login</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
} 