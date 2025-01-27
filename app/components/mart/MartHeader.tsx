import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import Animated, { 
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutUp
} from 'react-native-reanimated';

export default function MartHeader() {
  const insets = useSafeAreaInsets();
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);

  return (
    <BlurView intensity={70} className="absolute top-0 left-0 right-0 z-50">
      <View style={{ paddingTop: insets.top }} className="px-4 pb-2">
        {/* Location and Cart Row */}
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity 
            onPress={() => setIsLocationExpanded(!isLocationExpanded)}
            className="flex-row items-center"
          >
            <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-2">
              <MaterialCommunityIcons name="map-marker-outline" size={20} color="#4F46E5" />
            </View>
            <View>
              <Text className="text-xs text-gray-500">Delivery to</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-900 font-semibold">Current Location</Text>
                <Ionicons 
                  name={isLocationExpanded ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color="#374151" 
                />
              </View>
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center space-x-3">
            <TouchableOpacity 
              className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
              onPress={() => router.push('/notifications')}
            >
              <View className="relative">
                <Feather name="bell" size={18} color="#374151" />
                <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
              onPress={() => router.push('/cart')}
            >
              <View className="relative">
                <Feather name="shopping-bag" size={18} color="#374151" />
                <View className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full items-center justify-center">
                  <Text className="text-white text-[10px]">2</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar Row */}
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.push('/search')}
            className="flex-1"
          >
            <BlurView intensity={20} className="rounded-2xl overflow-hidden">
              <View className="flex-1 flex-row items-center bg-gray-100/90 px-4 py-3">
                <Ionicons name="search" size={20} color="#6B7280" />
                <Text className="ml-2 text-gray-500">Search in marketplace...</Text>
              </View>
            </BlurView>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center"
            onPress={() => router.push('/filters')}
          >
            <Feather name="sliders" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Expanded Location Panel */}
        {isLocationExpanded && (
          <Animated.View
            entering={SlideInDown.duration(300)}
            exiting={SlideOutUp.duration(200)}
            className="mt-3 bg-white/80 rounded-2xl p-3"
          >
            <TouchableOpacity 
              className="flex-row items-center py-2"
              onPress={() => {
                // Handle location selection
                setIsLocationExpanded(false);
              }}
            >
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="location" size={18} color="#4F46E5" />
              </View>
              <View>
                <Text className="text-gray-900 font-medium">Current Location</Text>
                <Text className="text-gray-500 text-sm">Using GPS</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center py-2"
              onPress={() => {
                // Handle adding new address
                router.push('/add-address');
              }}
            >
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="add" size={18} color="#374151" />
              </View>
              <Text className="text-primary font-medium">Add New Address</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </BlurView>
  );
} 