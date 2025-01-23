import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  SlideInRight,
  FadeIn,
  withSpring,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = 220;

const MART_SECTIONS = [
  {
    id: 'Grocerries',
    title: 'Grocery',
    description: 'Fresh produce, pantry essentials, and more',
    image: require('@/assets/images/adaptive-icon.png'),
    colors: ['#059669', '#34D399'],
    icon: '🥬',
    stats: {
      stores: '234+',
      delivery: '25-40 min',
      rating: '4.8'
    }
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy',
    description: 'Medicines, health & wellness products',
    image: require('@/assets/images/adaptive-icon.png'),
    colors: ['#4F46E5', '#818CF8'],
    icon: '💊',
    stats: {
      stores: '89+',
      delivery: '30-45 min',
      rating: '4.9'
    }
  },
  {
    id: 'electronics',
    title: 'Electronics',
    description: 'Gadgets, accessories & smart devices',
    image: require('@/assets/images/adaptive-icon.png'),
    colors: ['#DC2626', '#F87171'],
    icon: '📱',
    stats: {
      stores: '156+',
      delivery: '40-60 min',
      rating: '4.7'
    }
  },
  {
    id: 'fashion',
    title: 'Fashion',
    description: 'Clothing, accessories & footwear',
    image: require('@/assets/images/adaptive-icon.png'),
    colors: ['#7C3AED', '#A78BFA'],
    icon: '👕',
    stats: {
      stores: '312+',
      delivery: '35-50 min',
      rating: '4.6'
    }
  }
];

export default function MartScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(scrollY.value > 50 ? -50 : 0) }],
    };
  });

  return (
    <View className="flex-1 bg-gray-50">
      <Animated.View 
        style={[headerStyle, { paddingTop: insets.top }]} 
        className="bg-white px-6 pb-4 z-10"
      >
        <View className="flex-row items-center justify-between py-4">
          <View>
            <Text className="text-2xl font-bold text-gray-900">eMart</Text>
            <Text className="text-gray-500">Choose your shopping category</Text>
          </View>
          <TouchableOpacity 
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#374151" />
            <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {MART_SECTIONS.map((section, index) => (
          <Animated.View
            key={section.id}
            entering={FadeInDown.delay(index * 200).springify()}
            className="mb-6"
          >
            <TouchableOpacity
              onPress={() => router.push(`/${section.id}`)}
              className="relative overflow-hidden"
            >
              <LinearGradient
                colors={section.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-3xl p-6"
                style={{ height: CARD_HEIGHT }}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <View className="flex-row items-center space-x-2 mb-2">
                      <Text className="text-4xl">{section.icon}</Text>
                      <BlurView intensity={20} className="px-3 py-1 rounded-full">
                        <Text className="text-white font-semibold">{section.stats.stores} Stores</Text>
                      </BlurView>
                    </View>
                    <Text className="text-white text-2xl font-bold mb-2">
                      {section.title}
                    </Text>
                    <Text className="text-white/80 text-base mb-6">
                      {section.description}
                    </Text>
                    <View className="flex-row justify-between items-center">
                      <View className="items-center">
                        <Text className="text-white/60 text-sm">Delivery</Text>
                        <Text className="text-white font-semibold">{section.stats.delivery}</Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-white/60 text-sm">Rating</Text>
                        <View className="flex-row items-center">
                          <Ionicons name="star" size={16} color="white" />
                          <Text className="text-white font-semibold ml-1">{section.stats.rating}</Text>
                        </View>
                      </View>
                      <TouchableOpacity 
                        className="bg-white/20 px-4 py-2 rounded-xl"
                        onPress={() => router.push(`/${section.id}`)}
                      >
                        <Text className="text-white font-semibold">Shop Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Image 
                    source={section.image}
                    className="w-32 h-32 absolute top-4 right-4"
                    resizeMode="contain"
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}
