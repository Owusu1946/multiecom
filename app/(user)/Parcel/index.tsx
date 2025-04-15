import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GHANA_REGIONS } from '@/app/constants/mart';

export default function ParcelScreen() {
  const insets = useSafeAreaInsets();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isError, setIsError] = useState(false);
  
  const renderPopularCities = () => {
    // Show most populous cities from Ghana for quick selection
    const popularCities = ['Accra', 'Kumasi', 'Tamale', 'Sekondi-Takoradi', 'Cape Coast'];
    
    return (
      <View className="mt-4 flex-row flex-wrap">
        {popularCities.map((city, index) => (
          <TouchableOpacity 
            key={city} 
            className="mr-2 mb-2 bg-gray-100 px-3 py-2 rounded-lg"
            onPress={() => router.push({
              pathname: "/Parcel/new-parcel",
              params: { destination: city }
            })}
          >
            <Text className="text-gray-800">{city}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleTrackParcel = () => {
    if (!trackingNumber.trim()) {
      setIsError(true);
      return;
    }
    
    setIsError(false);
    router.push({
      pathname: "/Parcel/tracking/[id]",
      params: { id: trackingNumber.trim() }
    });
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top }} 
        className="bg-primary px-4 pt-2 pb-4"
      >
        <View className="flex-row items-center mb-2">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="flex-1 text-white text-xl font-semibold text-center pr-10">
            Parcel Delivery
          </Text>
        </View>
        
        <View className="flex-row items-center bg-white/10 rounded-xl p-2">
          <Ionicons name="search" size={20} color="white" />
          <TextInput
            className="flex-1 text-white ml-2"
            placeholder="Track your parcel"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={trackingNumber}
            onChangeText={(text) => {
              setTrackingNumber(text);
              setIsError(false);
            }}
          />
          <TouchableOpacity 
            className="bg-white px-3 py-1.5 rounded-lg"
            onPress={handleTrackParcel}
          >
            <Text className="text-primary font-medium">Track</Text>
          </TouchableOpacity>
        </View>
        {isError && (
          <Text className="text-red-200 text-xs ml-1 mt-1">Please enter a tracking number</Text>
        )}
      </View>
      
      <ScrollView className="flex-1">
        {/* Hero Section */}
        <View className="px-4 py-6 bg-primary">
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex-row">
              <View className="flex-1 pr-2">
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  Send Parcels Nationwide
                </Text>
                <Text className="text-gray-600 mb-4">
                  Fast, reliable, and secure delivery throughout Ghana
                </Text>
                <TouchableOpacity 
                  className="bg-primary py-3 rounded-xl w-40 items-center"
                  onPress={() => router.push("/Parcel/new-parcel")}
                >
                  <Text className="text-white font-semibold">Send a Parcel</Text>
                </TouchableOpacity>
              </View>
              <View className="w-24 h-24 justify-center items-center">
                <FontAwesome5 name="shipping-fast" size={60} color="#DB2777" />
              </View>
            </View>
          </View>
        </View>
        
        {/* Featured Services */}
        <View className="px-4 pt-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Our Services</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            <Animated.View 
              entering={FadeInDown.delay(100).duration(400)}
              className="mr-3 bg-white rounded-xl border border-gray-100 overflow-hidden w-64"
            >
              <View className="h-32 bg-amber-100 items-center justify-center">
                <FontAwesome5 name="truck" size={40} color="#F59E0B" />
              </View>
              <View className="p-3">
                <Text className="text-gray-900 font-bold mb-1">Standard Delivery</Text>
                <Text className="text-gray-600 text-sm mb-2">Delivery within 2-3 days at affordable rates</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-amber-600 font-medium">From ₵15</Text>
                  <TouchableOpacity 
                    className="bg-amber-100 px-3 py-1 rounded-lg"
                    onPress={() => router.push({
                      pathname: "/Parcel/new-parcel",
                      params: { service: 'standard' }
                    })}
                  >
                    <Text className="text-amber-800">Select</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
            
            <Animated.View 
              entering={FadeInDown.delay(200).duration(400)}
              className="mr-3 bg-white rounded-xl border border-gray-100 overflow-hidden w-64"
            >
              <View className="h-32 bg-blue-100 items-center justify-center">
                <MaterialIcons name="bolt" size={50} color="#3B82F6" />
              </View>
              <View className="p-3">
                <Text className="text-gray-900 font-bold mb-1">Express Delivery</Text>
                <Text className="text-gray-600 text-sm mb-2">Same-day or next-day delivery for urgent parcels</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-blue-600 font-medium">From ₵25</Text>
                  <TouchableOpacity 
                    className="bg-blue-100 px-3 py-1 rounded-lg"
                    onPress={() => router.push({
                      pathname: "/Parcel/new-parcel",
                      params: { service: 'express' }
                    })}
                  >
                    <Text className="text-blue-800">Select</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
            
            <Animated.View 
              entering={FadeInDown.delay(300).duration(400)}
              className="mr-3 bg-white rounded-xl border border-gray-100 overflow-hidden w-64"
            >
              <View className="h-32 bg-green-100 items-center justify-center">
                <MaterialIcons name="local-shipping" size={50} color="#10B981" />
              </View>
              <View className="p-3">
                <Text className="text-gray-900 font-bold mb-1">Fragile Items</Text>
                <Text className="text-gray-600 text-sm mb-2">Special handling for delicate packages</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-green-600 font-medium">From ₵30</Text>
                  <TouchableOpacity 
                    className="bg-green-100 px-3 py-1 rounded-lg"
                    onPress={() => router.push({
                      pathname: "/Parcel/new-parcel",
                      params: { service: 'fragile' }
                    })}
                  >
                    <Text className="text-green-800">Select</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </View>
        
        {/* Popular Destinations */}
        <View className="px-4 pt-8">
          <Text className="text-lg font-bold text-gray-900 mb-2">Popular Destinations</Text>
          <Text className="text-gray-600 mb-2">Select a destination to start sending a parcel</Text>
          {renderPopularCities()}
        </View>
        
        {/* How It Works */}
        <View className="px-4 pt-8 pb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">How It Works</Text>
          
          <View className="bg-white p-4 rounded-xl border border-gray-100 mb-3">
            <View className="flex-row">
              <View className="w-8 h-8 bg-primary/20 rounded-full items-center justify-center mr-3">
                <Text className="text-primary font-bold">1</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Enter Delivery Details</Text>
                <Text className="text-gray-600 text-sm">Provide pickup and delivery information</Text>
              </View>
            </View>
          </View>
          
          <View className="bg-white p-4 rounded-xl border border-gray-100 mb-3">
            <View className="flex-row">
              <View className="w-8 h-8 bg-primary/20 rounded-full items-center justify-center mr-3">
                <Text className="text-primary font-bold">2</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Package Collection</Text>
                <Text className="text-gray-600 text-sm">Our driver picks up your parcel</Text>
              </View>
            </View>
          </View>
          
          <View className="bg-white p-4 rounded-xl border border-gray-100 mb-3">
            <View className="flex-row">
              <View className="w-8 h-8 bg-primary/20 rounded-full items-center justify-center mr-3">
                <Text className="text-primary font-bold">3</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Track Your Parcel</Text>
                <Text className="text-gray-600 text-sm">Monitor your delivery in real-time</Text>
              </View>
            </View>
          </View>
          
          <View className="bg-white p-4 rounded-xl border border-gray-100">
            <View className="flex-row">
              <View className="w-8 h-8 bg-primary/20 rounded-full items-center justify-center mr-3">
                <Text className="text-primary font-bold">4</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Secure Delivery</Text>
                <Text className="text-gray-600 text-sm">Parcel is delivered to the recipient</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom CTA */}
      <View className="bg-white px-4 py-4 border-t border-gray-200">
        <TouchableOpacity 
          className="bg-primary py-3 rounded-xl items-center"
          onPress={() => router.push("/Parcel/new-parcel")}
        >
          <Text className="text-white font-semibold">Send a Parcel Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 