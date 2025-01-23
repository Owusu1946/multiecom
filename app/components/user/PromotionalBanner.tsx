import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { 
  FadeInDown, 
  interpolate, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;
const BANNER_HEIGHT = 180;

interface Promotion {
  id: string;
  title: string;
  description: string;
  image: any;
  backgroundColor: string[];
  buttonText: string;
  discount?: string;
  validUntil?: string;
}

const PROMOTIONS: Promotion[] = [
  {
    id: '1',
    title: 'Get 20% Off Your First Order',
    description: 'New customers get an exclusive discount on their first purchase',
    image: require('@/assets/images/adaptive-icon.png'),
    backgroundColor: ['#4F46E5', '#818CF8'],
    buttonText: 'Claim Now',
    discount: '20% OFF',
    validUntil: 'Valid until March 31'
  },
  {
    id: '2',
    title: 'Free Delivery Weekend',
    description: 'Enjoy free delivery on all orders this weekend',
    image: require('@/assets/images/adaptive-icon.png'),
    backgroundColor: ['#059669', '#34D399'],
    buttonText: 'Order Now',
    validUntil: 'Weekend Only'
  },
  {
    id: '3',
    title: 'Refer & Earn',
    description: 'Get GH₵10 for every friend you refer',
    image: require('@/assets/images/adaptive-icon.png'),
    backgroundColor: ['#DC2626', '#F87171'],
    buttonText: 'Share Now',
    discount: 'GH₵10',
  }
];

export default function PromotionalBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withSpring(activeIndex);
  }, [activeIndex]);

  const renderItem = ({ item, index }: { item: Promotion, index: number }) => {
    return (
      <Animated.View 
        entering={FadeInDown.delay(index * 100)}
        className="overflow-hidden rounded-2xl"
        style={{ width: BANNER_WIDTH, height: BANNER_HEIGHT }}
      >
        <LinearGradient
          colors={item.backgroundColor}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1 p-5"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              {item.discount && (
                <View className="bg-white/20 self-start px-3 py-1 rounded-full mb-3">
                  <Text className="text-white font-bold">{item.discount}</Text>
                </View>
              )}
              <Text className="text-white text-xl font-bold mb-2">
                {item.title}
              </Text>
              <Text className="text-white/80 text-sm mb-4">
                {item.description}
              </Text>
              <View className="flex-row items-center space-x-4">
                <TouchableOpacity 
                  className="bg-white px-4 py-2 rounded-lg"
                >
                  <Text className="font-semibold" style={{ color: item.backgroundColor[0] }}>
                    {item.buttonText}
                  </Text>
                </TouchableOpacity>
                {item.validUntil && (
                  <Text className="text-white/80 text-xs">
                    {item.validUntil}
                  </Text>
                )}
              </View>
            </View>
            <Image 
              source={item.image}
              className="w-32 h-32"
              resizeMode="contain"
            />
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderPagination = () => {
    const dots = PROMOTIONS.map((_, index) => {
      const dotStyle = useAnimatedStyle(() => {
        const width = interpolate(
          progressValue.value,
          [index - 1, index, index + 1],
          [8, 24, 8],
          'clamp'
        );
        
        const opacity = interpolate(
          progressValue.value,
          [index - 1, index, index + 1],
          [0.5, 1, 0.5],
          'clamp'
        );

        return {
          width,
          opacity,
        };
      });

      return (
        <Animated.View
          key={index}
          style={[dotStyle]}
          className="h-2 bg-gray-800 rounded-full mx-1"
        />
      );
    });

    return (
      <View className="flex-row items-center justify-center mt-4">
        {dots}
      </View>
    );
  };

  return (
    <View>
      <Carousel
        loop
        width={BANNER_WIDTH}
        height={BANNER_HEIGHT}
        data={PROMOTIONS}
        renderItem={renderItem}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress;
        }}
        onSnapToItem={(index) => setActiveIndex(index)}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
      />
      {renderPagination()}
    </View>
  );
} 