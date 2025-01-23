import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LocationPicker() {
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [locationType, setLocationType] = useState<'auto' | 'manual'>('auto');

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      if (locationType === 'auto') {
        await getCurrentLocation();
      }
    } catch (err) {
      setError('Error requesting location permission');
    }
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      // Get address from coordinates
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address) {
        const formattedAddress = [
          address.street,
          address.district,
          address.city,
          address.region,
        ].filter(Boolean).join(', ');
        
        setAddress(formattedAddress);
      }
    } catch (err) {
      setError('Error getting current location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmLocation = () => {
    // Save location data and proceed to dashboard
    router.push('/(user)/dashboard');
  };

  const handleManualSelect = () => {
    setLocationType('manual');
    // You can implement a manual address input UI here
    // For now, we'll just show a message
    setAddress('Enter your address manually');
  };

  return (
    <View 
      className="flex-1 bg-white" 
      style={{ paddingTop: insets.top }}
    >
      <View className="px-6">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-2"
        >
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>

        <Animated.View 
          entering={FadeInDown.delay(200)}
          className="mt-8"
        >
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Set Your Location
          </Text>
          <Text className="text-gray-500">
            We need your location to show relevant products and delivery options
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400)}
          className="mt-8 space-y-4"
        >
          <TouchableOpacity
            onPress={() => {
              setLocationType('auto');
              getCurrentLocation();
            }}
            className={`p-4 rounded-xl border-2 ${
              locationType === 'auto' ? 'border-primary bg-primary/5' : 'border-gray-200'
            }`}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                <Ionicons name="locate" size={24} color="#4F46E5" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-gray-900">Use Current Location</Text>
                <Text className="text-gray-500 text-sm">
                  Automatically detect my location
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleManualSelect}
            className={`p-4 rounded-xl border-2 ${
              locationType === 'manual' ? 'border-primary bg-primary/5' : 'border-gray-200'
            }`}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                <Ionicons name="pencil" size={24} color="#4F46E5" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-gray-900">Enter Manually</Text>
                <Text className="text-gray-500 text-sm">
                  Type in your delivery address
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {isLoading ? (
          <View className="mt-8 items-center">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-gray-500 mt-4">Getting your location...</Text>
          </View>
        ) : address ? (
          <Animated.View 
            entering={FadeInDown.delay(600)}
            className="mt-8 p-4 bg-gray-50 rounded-xl"
          >
            <Text className="text-gray-500 mb-2">Delivery Address</Text>
            <Text className="text-gray-900 font-medium">{address}</Text>
          </Animated.View>
        ) : null}

        {error ? (
          <Text className="mt-4 text-red-500 text-center">{error}</Text>
        ) : null}

        <Animated.View 
          entering={FadeInDown.delay(800)}
          className="mt-auto pt-8"
        >
          <TouchableOpacity
            onPress={handleConfirmLocation}
            disabled={!address || isLoading}
            className={`bg-primary py-4 rounded-xl ${
              (!address || isLoading) ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Confirm Location
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
} 