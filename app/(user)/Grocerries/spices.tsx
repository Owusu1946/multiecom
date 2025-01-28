import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

const SPICES = [
  {
    id: '1',
    name: 'Black Pepper',
    description: 'Freshly Ground Black Pepper',
    price: 12.99,
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.8,
    reviews: 128,
    weight: '250g',
    isAvailable: true,
    discount: 10,
  },
  {
    id: '2',
    name: 'Cinnamon Powder',
    description: 'Pure Ceylon Cinnamon',
    price: 15.99,
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.9,
    reviews: 95,
    weight: '200g',
    isAvailable: true,
    discount: 0,
  },
  {
    id: '3',
    name: 'Turmeric',
    description: 'Organic Ground Turmeric',
    price: 9.99,
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.7,
    reviews: 156,
    weight: '300g',
    isAvailable: true,
    discount: 15,
  },
  {
    id: '4',
    name: 'Chili Powder',
    description: 'Hot & Spicy Blend',
    price: 8.99,
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.6,
    reviews: 89,
    weight: '200g',
    isAvailable: false,
    discount: 0,
  }
];

const FILTERS = ['All', 'Popular', 'Trending', 'New Arrivals', 'Best Deals'];

export default function SpicesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState('All');

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <BlurView intensity={70} className="absolute top-0 left-0 right-0 z-50">
        <View style={{ paddingTop: insets.top }} className="px-4 pb-4 bg-white/90">
          <View className="flex-row items-center justify-between py-4">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-semibold text-gray-900">Spices</Text>
            <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
              <Ionicons name="options-outline" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Filter Pills */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mt-2"
          >
            {FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                className={`mr-2 px-4 py-2 rounded-full ${
                  selectedFilter === filter ? 'bg-primary' : 'bg-gray-100'
                }`}
              >
                <Text 
                  className={`text-sm font-medium ${
                    selectedFilter === filter ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </BlurView>

      {/* Product Grid */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ 
          paddingTop: insets.top + 120,
          paddingHorizontal: 16,
          paddingBottom: 20
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap justify-between">
          {SPICES.map((spice, index) => (
            <Animated.View
              key={spice.id}
              entering={FadeIn.delay(index * 100)}
              className="w-[48%] mb-4"
            >
              <TouchableOpacity
                onPress={() => router.push(`/Grocerries/product/${spice.id}`)}
                className="bg-gray-50 rounded-2xl p-3"
              >
                <View className="relative">
                  {spice.discount > 0 && (
                    <BlurView intensity={30} className="absolute top-2 left-2 overflow-hidden rounded-full z-10">
                      <View className="px-2 py-1 bg-red-500/90">
                        <Text className="text-white text-xs">-{spice.discount}%</Text>
                      </View>
                    </BlurView>
                  )}
                  <TouchableOpacity 
                    className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full items-center justify-center"
                    onPress={() => {/* Add to favorites */}}
                  >
                    <Ionicons name="heart-outline" size={18} color="#666" />
                  </TouchableOpacity>
                  {!spice.isAvailable && (
                    <BlurView intensity={30} className="absolute inset-0 rounded-xl items-center justify-center z-20">
                      <Text className="text-gray-900 font-medium text-sm">Out of Stock</Text>
                    </BlurView>
                  )}
                  <Image 
                    source={spice.image}
                    className="w-full h-32"
                    resizeMode="contain"
                  />
                </View>
                <View className="mt-2">
                  <Text className="text-gray-900 font-medium" numberOfLines={1}>
                    {spice.name}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={1}>
                    {spice.description}
                  </Text>
                  <View className="flex-row items-center mt-1.5">
                    <Ionicons name="star" size={12} color="#FBBF24" />
                    <Text className="text-gray-600 text-xs ml-1">
                      {spice.rating} ({spice.reviews})
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-primary font-semibold">₵{spice.price}</Text>
                    <TouchableOpacity 
                      className={`w-8 h-8 rounded-full items-center justify-center ${
                        spice.isAvailable ? 'bg-primary' : 'bg-gray-200'
                      }`}
                      disabled={!spice.isAvailable}
                      onPress={() => router.push(`/Grocerries/product/${spice.id}`)}
                    >
                      <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 