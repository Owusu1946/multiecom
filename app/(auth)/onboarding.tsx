import { View, Text, Dimensions, FlatList, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { useState, useRef, useCallback } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { 
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft 
} from 'react-native-reanimated';
import { ImageSourcePropType } from 'react-native';
import LottieView from 'lottie-react-native';

import PaginationDot from '../components/onboarding/PaginationDot';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  animation: any; // Lottie animation source
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to eMart',
    description: 'Your one-stop marketplace for all your daily needs',
    animation: require('@/assets/Onboarding/onboarding1.json'),
  },
  {
    id: '2',
    title: 'Multi-Category Shopping',
    description: 'From groceries to electronics, find everything in one place',
    animation: require('@/assets/Onboarding/onboarding1.json'),
  },
  {
    id: '3',
    title: 'Fast Delivery',
    description: 'Get your orders delivered quickly and safely to your doorstep',
    animation: require('@/assets/Onboarding/fast delivery.json'),
  },
  {
    id: '4',
    title: 'Safe & Secure',
    description: 'Shop with confidence with verified sellers and secure payments',
    animation: require('@/assets/Onboarding/onboarding1.json'),
  },
];

const OnboardingSlide = ({ slide }: { slide: OnboardingSlide }) => {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-full aspect-square mb-8">
        <LottieView
          source={slide.animation}
          autoPlay
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <Text className="text-2xl font-bold text-center text-gray-900 mb-4">
        {slide.title}
      </Text>
      <Text className="text-base text-center text-gray-500">
        {slide.description}
      </Text>
    </View>
  );
};

export default function Onboarding() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (activeIndex < onboardingSlides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      router.push('/login');
    }
  }, [activeIndex]);

  const handleSkip = useCallback(() => {
    flatListRef.current?.scrollToIndex({
      index: onboardingSlides.length - 1,
      animated: true,
    });
  }, []);

  const handleBack = useCallback(() => {
    if (activeIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex - 1,
        animated: true,
      });
    }
  }, [activeIndex]);

  const renderItem = useCallback(({ item }: { item: OnboardingSlide }) => (
    <View style={{ width: SCREEN_WIDTH }}>
      <OnboardingSlide slide={item} />
    </View>
  ), []);

  const getButtonText = useCallback(() => {
    if (activeIndex === onboardingSlides.length - 1) {
      return "Start Shopping";
    }
    return "Next";
  }, [activeIndex]);

  return (
    <View className="flex-1 bg-white">
      {/* Header with Skip button */}
      <View className="flex-row justify-between items-center px-6 pt-12 pb-4">
        {activeIndex > 0 ? (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Pressable onPress={handleBack}>
              <Text className="text-primary font-semibold text-base">Back</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <View style={{ width: 40 }} />
        )}
        
        {activeIndex < onboardingSlides.length - 1 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Pressable onPress={handleSkip}>
              <Text className="text-gray-500 font-semibold text-base">Skip</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>

      {/* Content */}
      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={onboardingSlides}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          scrollEnabled={true}
        />
      </View>

      {/* Bottom Section */}
      <View className="px-8 pb-12 mt-auto">
        {/* Pagination Dots */}
        <View className="flex-row justify-center mb-8">
          {onboardingSlides.map((_, index) => (
            <PaginationDot key={index} isActive={index === activeIndex} />
          ))}
        </View>

        {/* Buttons */}
        {activeIndex === onboardingSlides.length - 1 ? (
          <View className="space-y-4">
            <Link href="/login" asChild>
              <TouchableOpacity 
                className="bg-primary py-4 rounded-full shadow-sm"
              >
                <Text className="text-white text-center font-semibold text-lg">
                </Text>
              </TouchableOpacity>
            </Link>

            <Link href="/signup" asChild>
              <TouchableOpacity 
                className="border-2 border-primary py-4 rounded-full shadow-sm"
                entering={FadeIn.delay(100)}
                exiting={FadeOut}
              >
                <Text className="text-primary text-center font-semibold text-lg">
                  Create Account
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          <Animated.View 
            entering={SlideInRight} 
            exiting={SlideOutLeft}
            key={activeIndex}
          >
            <AnimatedTouchableOpacity 
              onPress={handleNext}
              className="bg-primary py-4 rounded-full shadow-sm"
            >
              <Text className="text-white text-center font-semibold text-lg">
                {getButtonText()}
              </Text>
            </AnimatedTouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
} 