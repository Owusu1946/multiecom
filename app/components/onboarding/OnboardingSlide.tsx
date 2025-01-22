import { View, Text, Image } from 'react-native';
import { memo } from 'react';
import type { OnboardingSlide as OnboardingSlideType } from '@/app/constants/onboarding';

interface Props {
  slide: OnboardingSlideType;
}

function OnboardingSlide({ slide }: Props) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Image 
        source={slide.image}
        className="w-72 h-72 mb-8"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-primary text-center mb-4">
        {slide.title}
      </Text>
      <Text className="text-gray-600 text-center text-lg">
        {slide.description}
      </Text>
    </View>
  );
}

export default memo(OnboardingSlide); 