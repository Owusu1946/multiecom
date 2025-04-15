import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions, TextInput, StyleSheet, Platform, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function LocationPicker() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Location.LocationGeocodedAddress[]>([]);
  const [error, setError] = useState<string>('');
  const [locationType, setLocationType] = useState<'auto' | 'manual'>('auto');
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  // Animation for marker
  const markerScale = useSharedValue(1);
  const animatedMarkerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: markerScale.value }]
    };
  });

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
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      setLocation(location);
      
      // Update map region to center on user's location
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      setMapRegion(newRegion);
      
      // Animate map to new region
      mapRef.current?.animateToRegion(newRegion, 1000);
      
      // Animate marker
      markerScale.value = withSpring(1.2, {}, () => {
        markerScale.value = withSpring(1);
      });
      
      // Get address from coordinates
      await fetchAddressFromCoords(location.coords.latitude, location.coords.longitude);
    } catch (err) {
      setError('Error getting current location');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
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
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleMapPress = async (event: any) => {
    const { coordinate } = event.nativeEvent;
    
    // Update marker position
    setMapRegion({
      ...mapRegion,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
    
    // Animate marker
    markerScale.value = withSpring(1.2, {}, () => {
      markerScale.value = withSpring(1);
    });
    
    // Get address from new coordinates
    await fetchAddressFromCoords(coordinate.latitude, coordinate.longitude);
  };

  const handleSearchAddress = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await Location.geocodeAsync(searchQuery);
      
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        
        // Update map region to center on search result
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        
        setMapRegion(newRegion);
        
        // Animate map to new region
        mapRef.current?.animateToRegion(newRegion, 1000);
        
        // Animate marker
        markerScale.value = withSpring(1.2, {}, () => {
          markerScale.value = withSpring(1);
        });
        
        // Get address from coordinates
        await fetchAddressFromCoords(latitude, longitude);
      } else {
        setError('No results found for this address');
      }
    } catch (error) {
      console.error('Error searching address:', error);
      setError('Error searching for address');
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirmLocation = async () => {
    try {
      // Save location data in AsyncStorage
      const locationData = {
        address,
        coordinates: {
          latitude: mapRegion.latitude,
          longitude: mapRegion.longitude,
        }
      };
      
      await AsyncStorage.setItem('user_location', JSON.stringify(locationData));
      
      // Proceed to user dashboard
      router.push('/(user)/Mart');
    } catch (error) {
      console.error('Error saving location data:', error);
      // Proceed to dashboard anyway
      router.push('/(user)/Mart');
    }
  };

  const handleManualSelect = () => {
    setLocationType('manual');
    // Focus on search input
    setSearchQuery('');
  };

  return (
    <View className="flex-1">
      <StatusBar barStyle="dark-content" />
      
      {/* Full Screen Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        region={mapRegion}
        onPress={handleMapPress}
        showsUserLocation
        showsCompass={true}
        showsScale={true}
      >
        <Marker
          coordinate={{
            latitude: mapRegion.latitude,
            longitude: mapRegion.longitude,
          }}
        >
          <Animated.View style={animatedMarkerStyle}>
            <View className="items-center">
              <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                <View className="w-3 h-3 rounded-full bg-white" />
              </View>
              <View className="w-4 h-4 bg-primary rotate-45 -mt-2" />
            </View>
          </Animated.View>
        </Marker>
      </MapView>
      
      {/* UI Overlay */}
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        {/* Header Bar */}
        <View className="px-4 flex-row items-center justify-between pt-2">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-md"
            style={styles.shadow}
          >
            <Ionicons name="arrow-back" size={22} color="#666" />
          </TouchableOpacity>
          
          <BlurView intensity={80} tint="light" className="flex-1 mx-2 rounded-full overflow-hidden">
            <View className="flex-row items-center bg-white/80 px-4 py-2.5 rounded-full">
              <Ionicons name="search" size={18} color="#6B7280" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-900"
                placeholder="Search for an address..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearchAddress}
                returnKeyType="search"
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#6B7280" />
                </TouchableOpacity>
              ) : null}
            </View>
          </BlurView>
          
          {isSearching ? (
            <View className="w-10 h-10 items-center justify-center">
              <ActivityIndicator size="small" color="#4F46E5" />
            </View>
          ) : (
            <TouchableOpacity 
              onPress={handleSearchAddress}
              className="w-10 h-10 bg-primary rounded-full items-center justify-center shadow-md"
              style={styles.shadow}
            >
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Map Controls */}
        <View className="absolute bottom-32 right-4">
          <TouchableOpacity 
            onPress={getCurrentLocation}
            className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-md mb-3"
            style={styles.shadow}
          >
            <Ionicons name="locate" size={24} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error ? (
          <BlurView intensity={80} tint="light" className="mx-4 mt-4 p-3 rounded-xl">
            <Text className="text-red-500 text-center">{error}</Text>
          </BlurView>
        ) : null}
        
        {/* Bottom Card */}
        <View className="absolute bottom-0 left-0 right-0">
          <BlurView intensity={80} tint="light" className="m-4 p-4 rounded-xl">
            {isLoading ? (
              <View className="items-center py-2">
                <ActivityIndicator size="small" color="#4F46E5" />
                <Text className="text-gray-500 mt-2">Getting your location...</Text>
              </View>
            ) : address ? (
              <View>
                <View className="flex-row items-center mb-3">
                  <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                    <Ionicons name="location" size={20} color="#4F46E5" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-xs text-gray-500">Delivery Address</Text>
                    <Text className="text-gray-900 font-medium">{address}</Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  onPress={handleConfirmLocation}
                  className="bg-primary py-3 rounded-xl"
                >
                  <Text className="text-white text-center font-semibold">
                    Confirm Location
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center py-2">
                <Text className="text-gray-500">Tap on the map to select a location</Text>
              </View>
            )}
          </BlurView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  }
});