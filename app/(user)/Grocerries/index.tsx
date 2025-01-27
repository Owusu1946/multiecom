import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, StatusBar } from 'react-native';
import { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  SlideInRight,
  FadeIn,
  withSpring,
  withTiming,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import BottomNavbar from '@/app/components/user/BottomNavbar';
import PromotionalBanner from '@/app/components/user/PromotionalBanner';
import React from 'react';

const CATEGORIES = [
  {
    id: '1',
    name: 'Spices',
    icon: '🌶️',
    count: 128,
    color: '#FEE2E2'
  },
  {
    id: '2',
    name: 'Cooking',
    icon: '🍳',
    count: 89,
    color: '#E0E7FF'
  },
  {
    id: '3',
    name: 'Household',
    icon: '🧹',
    count: 254,
    color: '#DBEAFE'
  },
  {
    id: '4',
    name: 'Fresh Produce',
    icon: '🥬',
    count: 167,
    color: '#DCFCE7'
  },
];

const SPECIAL_OFFERS = [
  {
    id: '1',
    name: 'Barilla Orzo Pasta',
    image: require('@/assets/images/adaptive-icon.png'),
    price: 24.99,
    discount: 15,
    isAvailable: false,
  },
  {
    id: '2',
    name: 'Barilla Protein Pasta',
    image: require('@/assets/images/adaptive-icon.png'),
    price: 29.99,
    discount: 25,
    isAvailable: true,
  },
];

export default function UserDashboard() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(0);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  // Trigger animations on mount
  React.useEffect(() => {
    translateY.value = withSpring(0);
    opacity.value = withTiming(1, { duration: 1000 });
  }, []);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Fixed Header */}
      <BlurView intensity={70} className="absolute top-0 left-0 right-0 z-50">
        <View style={{ paddingTop: insets.top }} className="px-4 bg-white/90">
          {/* Location and Cart Row */}
          <View className="flex-row items-center justify-between py-4">
            <TouchableOpacity className="flex-row items-center space-x-2">
              <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                <MaterialCommunityIcons name="store" size={24} color="#4F46E5" />
              </View>
              <View>
                <Text className="text-xs text-gray-500">Deliver to</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-900 font-semibold">Home</Text>
                  <Ionicons name="chevron-down" size={16} color="#374151" />
                </View>
              </View>
            </TouchableOpacity>

            <View className="flex-row items-center space-x-4">
              <TouchableOpacity className="relative">
                <Ionicons name="cart-outline" size={24} color="#374151" />
                <View className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full items-center justify-center">
                  <Text className="text-white text-xs">3</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image 
                  source={require('@/assets/images/adaptive-icon.png')}
                  className="w-8 h-8 rounded-full"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center space-x-2 pb-4">
            <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4 py-2.5">
              <Ionicons name="search" size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-900"
                placeholder="Search products..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity className="w-11 h-11 bg-primary rounded-xl items-center justify-center">
              <Ionicons name="options-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>

      {/* Scrollable Content */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ 
          paddingTop: insets.top + 120, // Adjust based on header height
          paddingBottom: 20 
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4">
          <PromotionalBanner />

          <Animated.View 
            entering={FadeInDown.delay(400)}
            className="mt-8"
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-semibold text-gray-900">Categories</Text>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-primary mr-1">View All</Text>
                <Ionicons name="arrow-forward" size={16} color="#4F46E5" />
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap justify-between">
              {CATEGORIES.map((category, index) => (
                <Animated.View
                  key={category.id}
                  entering={FadeIn.delay(index * 100)}
                  className="w-[48%] mb-4"
                >
                  <TouchableOpacity 
                    style={{ backgroundColor: category.color }}
                    className="p-4 rounded-2xl"
                    onPress={() => {
                      if (category.name === 'Spices') {
                        router.push('/Grocerries/spices');
                      } else {
                        router.push(`/Grocerries/${category.name.toLowerCase()}`);
                      }
                    }}
                  >
                    <View className="flex-row items-center justify-between mb-8">
                      <Text className="text-3xl">{category.icon}</Text>
                      <View className="bg-white/30 px-2 py-1 rounded-full">
                        <Text className="text-xs">{category.count} items</Text>
                      </View>
                    </View>
                    <Text className="text-gray-900 font-medium">{category.name}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          <Animated.View 
            entering={SlideInRight.delay(600)}
            className="mt-8"
          >
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center space-x-2">
                <Text className="text-lg font-semibold text-gray-900">
                  Special Offer
                </Text>
                <View className="bg-green-100 px-2 py-1 rounded-full">
                  <Text className="text-xs text-green-600">24</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => router.push('/special-offers')}>
                <Text className="text-green-600">See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              className="space-x-4"
            >
              {SPECIAL_OFFERS.map((product) => (
                <TouchableOpacity 
                  key={product.id}
                  className="w-36"
                  onPress={() => router.push(`/product/${product.id}`)}
                >
                  <View className="bg-gray-100 rounded-xl p-2 relative">
                    {product.discount && (
                      <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-full z-10">
                        <Text className="text-white text-xs">-{product.discount}%</Text>
                      </View>
                    )}
                    <TouchableOpacity 
                      className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full items-center justify-center"
                      onPress={() => {/* Add to favorites */}}
                    >
                      <Ionicons name="heart-outline" size={20} color="#666" />
                    </TouchableOpacity>
                    {!product.isAvailable && (
                      <View className="absolute inset-0 bg-white/80 rounded-xl items-center justify-center z-20">
                        <Text className="text-gray-900 font-medium text-sm">Not Available Now</Text>
                      </View>
                    )}
                    <Image 
                      source={product.image}
                      className="w-full h-32"
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="text-gray-900 mt-2 text-sm">{product.name}</Text>
                  <Text className="text-green-600 font-semibold">₵{product.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </ScrollView>
      <BottomNavbar />
    </View>
  );
} 