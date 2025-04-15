import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

// Sample data for grocery stores
const GROCERY_STORES = [
  {
    id: '1',
    name: 'Fresh Market',
    description: 'Premium organic groceries',
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.8,
    reviews: 128,
    deliveryTime: '20-30 min',
    deliveryFee: '₵3.99',
    isOpen: true,
    discount: '10% OFF',
    featured: true,
    tags: ['Organic', 'Fresh Produce']
  },
  {
    id: '2',
    name: 'Global Foods',
    description: 'International grocery selection',
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.9,
    reviews: 95,
    deliveryTime: '25-40 min',
    deliveryFee: '₵2.50',
    isOpen: true,
    discount: '',
    featured: false,
    tags: ['International', 'Bulk Items']
  },
  {
    id: '3',
    name: 'Family Mart',
    description: 'Everyday essentials & fresh food',
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.7,
    reviews: 156,
    deliveryTime: '30-45 min',
    deliveryFee: '₵4.50',
    isOpen: true,
    discount: '15% OFF',
    featured: true,
    tags: ['Local Produce', 'Bakery']
  },
  {
    id: '4',
    name: 'Green Basket',
    description: 'Farm-to-table groceries',
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.6,
    reviews: 89,
    deliveryTime: '15-25 min',
    deliveryFee: '₵3.50',
    isOpen: false,
    discount: '',
    featured: false,
    tags: ['Sustainable', 'Local']
  }
];

const FILTERS = ['All', 'Popular', 'Nearby', 'Fast Delivery', 'Offers'];

export default function GroceryStoresScreen() {
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
            <Text className="text-xl font-semibold text-gray-900">Grocery Stores</Text>
            <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
              <Ionicons name="search" size={24} color="#374151" />
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

      {/* Stores List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ 
          paddingTop: insets.top + 120,
          paddingHorizontal: 16,
          paddingBottom: 20
        }}
        showsVerticalScrollIndicator={false}
      >
        {GROCERY_STORES.map((store, index) => (
          <Animated.View
            key={store.id}
            entering={FadeInDown.delay(index * 100)}
            className="mb-4"
          >
            <TouchableOpacity
              onPress={() => router.push(`/Grocerries/store/${store.id}?category=groceries` as any)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
            >
              {/* Store Image Banner */}
              <View className="relative h-32">
                <Image 
                  source={store.image}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                
                {/* Overlay for closed stores */}
                {!store.isOpen && (
                  <BlurView intensity={30} className="absolute inset-0 items-center justify-center">
                    <View className="bg-black/60 px-4 py-2 rounded-lg">
                      <Text className="text-white font-medium">Currently Closed</Text>
                    </View>
                  </BlurView>
                )}
                
                {/* Discount Badge */}
                {store.discount && (
                  <View className="absolute top-3 left-3 bg-red-500 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-semibold">{store.discount}</Text>
                  </View>
                )}
                
                {/* Featured Badge */}
                {store.featured && (
                  <View className="absolute top-3 right-3 bg-primary px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-semibold">Featured</Text>
                  </View>
                )}
              </View>
              
              {/* Store Info */}
              <View className="p-4">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 mr-3">
                    <Text className="text-lg font-semibold text-gray-900">{store.name}</Text>
                    <Text className="text-gray-500 text-sm">{store.description}</Text>
                  </View>
                  <View className="bg-green-50 px-2 py-1 rounded-md">
                    <Text className="text-green-700 text-xs font-semibold">{store.rating}</Text>
                  </View>
                </View>
                
                {/* Tags */}
                <View className="flex-row mt-2 space-x-2">
                  {store.tags.map((tag) => (
                    <View key={tag} className="bg-gray-100 px-2 py-1 rounded-md">
                      <Text className="text-gray-700 text-xs">{tag}</Text>
                    </View>
                  ))}
                </View>
                
                {/* Bottom Info */}
                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={14} color="#FBBF24" />
                    <Text className="text-gray-600 text-xs ml-1">
                      {store.rating} ({store.reviews})
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#6B7280" />
                    <Text className="text-gray-600 text-xs ml-1">
                      {store.deliveryTime}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="bike" size={14} color="#6B7280" />
                    <Text className="text-gray-600 text-xs ml-1">
                      {store.deliveryFee}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
} 