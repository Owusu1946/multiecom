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

// Define types
type Pharmacy = {
  id: string;
  name: string;
  address: string;
  image: any;
  rating: number;
  distance: string;
  deliveryTime: string;
  isOpen: boolean;
  tags: string[];
};

// Sample pharmacy data
const NEARBY_PHARMACIES: Pharmacy[] = [
  {
    id: '1',
    name: 'HealthPlus Pharmacy',
    address: '123 Medical Lane, Accra',
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.8,
    distance: '1.2 km',
    deliveryTime: '20-30 min',
    isOpen: true,
    tags: ['24/7', 'Prescription'],
  },
  {
    id: '2',
    name: 'MediCare Drugstore',
    address: '45 Wellness Street, Kumasi',
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.6,
    distance: '2.5 km',
    deliveryTime: '25-40 min',
    isOpen: true,
    tags: ['OTC', 'Vitamins'],
  },
  {
    id: '3',
    name: 'PharmLife',
    address: '78 Health Avenue, Tamale',
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.9,
    distance: '3.0 km',
    deliveryTime: '30-45 min',
    isOpen: true,
    tags: ['Baby Care', 'Health Foods'],
  },
  {
    id: '4',
    name: 'QuickMeds Pharmacy',
    address: '22 Relief Road, Accra',
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.4,
    distance: '1.8 km',
    deliveryTime: '15-25 min',
    isOpen: false,
    tags: ['Diabetes Care', 'Medical Equipment'],
  },
];

export default function PharmacyDashboard() {
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
              <View className="w-10 h-10 bg-indigo-500/10 rounded-full items-center justify-center">
                <MaterialCommunityIcons name="medical-bag" size={24} color="#4F46E5" />
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
                <View className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full items-center justify-center">
                  <Text className="text-white text-xs">2</Text>
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
                placeholder="Search medications..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity className="w-11 h-11 bg-indigo-600 rounded-xl items-center justify-center">
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
          {/* Prescription Upload Banner */}
          <TouchableOpacity 
            className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100"
            onPress={() => router.push('/(user)/pharmacy/prescription' as any)}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-indigo-500/20 rounded-full items-center justify-center mr-4">
                <Ionicons name="document-text" size={24} color="#4F46E5" />
              </View>
              <View className="flex-1">
                <Text className="text-indigo-900 font-semibold text-lg mb-1">Upload Prescription</Text>
                <Text className="text-indigo-700 text-sm">
                  Upload your prescription and get medications delivered
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#4F46E5" />
            </View>
          </TouchableOpacity>

          {/* Pharmacies Nearby Section */}
          <Animated.View 
            entering={FadeInDown.delay(400)}
            className="mt-8"
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-semibold text-gray-900">Pharmacies Nearby</Text>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-indigo-600 mr-1">View All</Text>
                <Ionicons name="arrow-forward" size={16} color="#4F46E5" />
              </TouchableOpacity>
            </View>

            {NEARBY_PHARMACIES.map((pharmacy, index) => (
              <Animated.View
                key={pharmacy.id}
                entering={FadeIn.delay(index * 100)}
                className="mb-4"
              >
                <TouchableOpacity 
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm"
                  onPress={() => router.push(`/(user)/pharmacy/store/${pharmacy.id}` as any)}
                >
                  <View className="p-3 flex-row">
                    <Image 
                      source={pharmacy.image}
                      className="w-20 h-20 rounded-lg"
                      resizeMode="cover"
                    />
                    <View className="flex-1 ml-3 justify-center">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-gray-900 font-semibold">{pharmacy.name}</Text>
                        {pharmacy.isOpen ? (
                          <View className="bg-green-100 px-2 py-0.5 rounded">
                            <Text className="text-green-700 text-xs font-medium">Open</Text>
                          </View>
                        ) : (
                          <View className="bg-gray-100 px-2 py-0.5 rounded">
                            <Text className="text-gray-500 text-xs font-medium">Closed</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-gray-500 text-sm mt-1">{pharmacy.address}</Text>
                      
                      <View className="flex-row items-center mt-2">
                        <View className="flex-row items-center">
                          <Ionicons name="star" size={14} color="#FBBF24" />
                          <Text className="text-gray-700 text-xs ml-1">{pharmacy.rating}</Text>
                        </View>
                        <Text className="text-gray-400 mx-1.5">•</Text>
                        <Text className="text-gray-500 text-xs">{pharmacy.distance}</Text>
                        <Text className="text-gray-400 mx-1.5">•</Text>
                        <Text className="text-gray-500 text-xs">{pharmacy.deliveryTime}</Text>
                      </View>
                      
                      <View className="flex-row mt-2">
                        {pharmacy.tags.map((tag, tagIndex) => (
                          <View key={tagIndex} className="bg-indigo-50 rounded-full px-2 py-0.5 mr-2">
                            <Text className="text-indigo-700 text-xs">{tag}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
          
          {/* Health Tips Section */}
          <Animated.View 
            entering={FadeInDown.delay(800)}
            className="mt-8"
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-semibold text-gray-900">Health Tips</Text>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-indigo-600 mr-1">View All</Text>
                <Ionicons name="arrow-forward" size={16} color="#4F46E5" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity className="bg-gray-50 rounded-2xl overflow-hidden mb-4">
              <Image 
                source={require('@/assets/images/adaptive-icon.png')}
                className="w-full h-40"
                resizeMode="cover"
              />
              <View className="p-3">
                <Text className="text-gray-900 font-semibold text-lg">5 Tips for Better Sleep</Text>
                <Text className="text-gray-600 text-sm mt-1" numberOfLines={2}>
                  Discover natural ways to improve your sleep quality and wake up refreshed.
                </Text>
                <View className="flex-row items-center mt-2">
                  <Text className="text-indigo-600 text-sm">Read More</Text>
                  <Ionicons name="chevron-forward" size={14} color="#4F46E5" />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
      
      {/* Use BottomNavbar without currentTab prop since it doesn't exist on the IntrinsicAttributes */}
      <BottomNavbar />
    </View>
  );
} 