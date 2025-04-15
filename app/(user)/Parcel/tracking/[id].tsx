import { View, Text, ScrollView, TouchableOpacity, StatusBar, Share, Image, Linking, ActivityIndicator } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import MapView, { Marker } from 'react-native-maps';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

// Define parcel status types
type ParcelStatus = 
  | 'processing' 
  | 'confirmed' 
  | 'picked-up' 
  | 'in-transit' 
  | 'out-for-delivery' 
  | 'delivered';

// Define location type for mapping
type Location = {
  latitude: number;
  longitude: number;
  description: string;
  time?: string;
};

export default function ParcelTrackingScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const mapRef = useRef<MapView>(null);
  
  // State for parcel details
  const [parcelStatus, setParcelStatus] = useState<ParcelStatus>('processing');
  const [estimatedDelivery, setEstimatedDelivery] = useState(new Date());
  const [currentLocation, setCurrentLocation] = useState<Location>({
    latitude: 5.6037,
    longitude: -0.1870,
    description: 'Accra Central Post Office',
  });
  
  // Demo data for parcel route
  const [route, setRoute] = useState<Location[]>([
    {
      latitude: 5.6037,
      longitude: -0.1870,
      description: 'Pickup Location',
      time: '10:30 AM',
    },
    {
      latitude: 5.6298,
      longitude: -0.1769,
      description: 'Accra Sorting Center',
      time: '12:45 PM',
    },
    {
      latitude: 5.5765,
      longitude: -0.2478,
      description: 'Delivery Destination',
      time: '4:15 PM',
    },
  ]);
  
  // Parcel details (would normally come from API)
  const [parcelDetails, setParcelDetails] = useState({
    trackingNumber: id || 'GH123456',
    sender: {
      name: 'John Doe',
      phone: '0241234567',
      address: '123 Independence Ave, Accra',
    },
    recipient: {
      name: 'Jane Smith',
      phone: '0201234567',
      address: '456 Liberation Rd, Accra',
    },
    package: {
      description: 'Documents and small electronics',
      weight: '2.5 kg',
      dimensions: '30cm x 20cm x 10cm',
      service: 'Express Delivery',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    },
  });
  
  // Simulate parcel status updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (parcelStatus === 'processing') {
        setParcelStatus('confirmed');
      } else if (parcelStatus === 'confirmed') {
        setParcelStatus('picked-up');
        setCurrentLocation(route[0]);
      } else if (parcelStatus === 'picked-up') {
        setParcelStatus('in-transit');
        setCurrentLocation(route[1]);
      } else if (parcelStatus === 'in-transit') {
        setParcelStatus('out-for-delivery');
        setCurrentLocation({
          ...route[2],
          latitude: route[2].latitude - 0.01,
          longitude: route[2].longitude + 0.01,
        });
      } else if (parcelStatus === 'out-for-delivery') {
        setParcelStatus('delivered');
        setCurrentLocation(route[2]);
      }
    }, 7000); // Update every 7 seconds for demo
    
    return () => clearTimeout(timer);
  }, [parcelStatus]);
  
  // Update map when location changes
  useEffect(() => {
    if (mapRef.current && currentLocation) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  }, [currentLocation]);
  
  // Get order steps based on status
  const getParcelSteps = () => {
    const steps = [
      {
        title: 'Order Created',
        description: 'Your parcel request has been received',
        time: parcelDetails.package.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'completed' as const,
      },
      {
        title: 'Order Confirmed',
        description: 'Your parcel has been confirmed',
        time: parcelStatus !== 'processing' 
          ? new Date(parcelDetails.package.createdAt.getTime() + 30 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : undefined,
        status: parcelStatus === 'processing' 
          ? 'current' as const 
          : 'completed' as const,
      },
      {
        title: 'Pickup',
        description: 'Parcel picked up from sender',
        time: parcelStatus !== 'processing' && parcelStatus !== 'confirmed'
          ? new Date(parcelDetails.package.createdAt.getTime() + 120 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : undefined,
        status: parcelStatus === 'confirmed' 
          ? 'current' as const 
          : parcelStatus === 'processing'
          ? 'pending' as const
          : 'completed' as const,
      },
      {
        title: 'In Transit',
        description: 'Parcel is on the way',
        status: parcelStatus === 'picked-up' 
          ? 'current' as const 
          : ['processing', 'confirmed'].includes(parcelStatus)
          ? 'pending' as const
          : 'completed' as const,
      },
      {
        title: 'Out for Delivery',
        description: 'Parcel is out for final delivery',
        status: parcelStatus === 'in-transit' 
          ? 'current' as const 
          : ['processing', 'confirmed', 'picked-up'].includes(parcelStatus)
          ? 'pending' as const
          : 'completed' as const,
      },
      {
        title: 'Delivered',
        description: 'Parcel has been delivered',
        time: parcelStatus === 'delivered' 
          ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : undefined,
        status: parcelStatus === 'out-for-delivery' 
          ? 'current' as const 
          : parcelStatus === 'delivered'
          ? 'completed' as const
          : 'pending' as const,
      },
    ];
    
    return steps;
  };
  
  // Share tracking information
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Track my parcel with tracking number: ${parcelDetails.trackingNumber}. Current status: ${parcelStatus.replace('-', ' ')}.`,
        title: 'Track My Parcel',
      });
    } catch (error) {
      console.error('Error sharing tracking info:', error);
    }
  };
  
  // Call customer service
  const handleCallSupport = () => {
    Linking.openURL('tel:0800123456');
  };

  // Render Map component with fallback UI
  const renderMap = () => {
    try {
      return (
        <View className="h-52 rounded-xl overflow-hidden">
          <MapView
            ref={mapRef}
            className="w-full h-full"
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {/* Origin Marker */}
            <Marker
              coordinate={{
                latitude: route[0].latitude,
                longitude: route[0].longitude,
              }}
              title="Pickup Location"
              pinColor="red"
            />
            
            {/* Destination Marker */}
            <Marker
              coordinate={{
                latitude: route[2].latitude,
                longitude: route[2].longitude,
              }}
              title="Delivery Destination"
              pinColor="green"
            />
            
            {/* Current Location Marker */}
            {['picked-up', 'in-transit', 'out-for-delivery'].includes(parcelStatus) && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="Current Location"
                pinColor="blue"
              />
            )}
          </MapView>
        </View>
      );
    } catch (error) {
      // Fallback UI if map fails to render
      return (
        <View className="h-52 rounded-xl overflow-hidden bg-gray-100 items-center justify-center">
          <MaterialIcons name="map" size={48} color="#9CA3AF" />
          <Text className="text-gray-500 mt-2">Map view unavailable</Text>
        </View>
      );
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top }} 
        className="bg-white px-4 pb-4 border-b border-gray-200"
      >
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900">Parcel Tracking</Text>
          <TouchableOpacity 
            onPress={handleShare}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="share-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View className="p-4 bg-primary">
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-500">Tracking Number</Text>
              <Text className="font-semibold text-gray-900">{parcelDetails.trackingNumber}</Text>
            </View>
            
            <View className="py-3 border-y border-gray-100">
              {parcelStatus === 'processing' && (
                <View className="flex-row items-center">
                  <View className="w-10 h-10 items-center justify-center">
                    <ActivityIndicator color="#DB2777" />
                  </View>
                  <View className="ml-2">
                    <Text className="text-lg font-bold text-gray-900">Processing your order</Text>
                    <Text className="text-gray-500">We're confirming your parcel request</Text>
                  </View>
                </View>
              )}
              
              {parcelStatus === 'confirmed' && (
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                    <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
                  </View>
                  <View className="ml-2">
                    <Text className="text-lg font-bold text-gray-900">Order Confirmed</Text>
                    <Text className="text-gray-500">Our driver is on the way to pick up your parcel</Text>
                  </View>
                </View>
              )}
              
              {parcelStatus === 'picked-up' && (
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center">
                    <MaterialIcons name="directions-car" size={24} color="#F59E0B" />
                  </View>
                  <View className="ml-2">
                    <Text className="text-lg font-bold text-gray-900">Parcel Picked Up</Text>
                    <Text className="text-gray-500">Your parcel has been collected from the sender</Text>
                  </View>
                </View>
              )}
              
              {parcelStatus === 'in-transit' && (
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                    <FontAwesome5 name="shipping-fast" size={20} color="#3B82F6" />
                  </View>
                  <View className="ml-2">
                    <Text className="text-lg font-bold text-gray-900">In Transit</Text>
                    <Text className="text-gray-500">Your parcel is on its way to the destination</Text>
                  </View>
                </View>
              )}
              
              {parcelStatus === 'out-for-delivery' && (
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center">
                    <MaterialIcons name="delivery-dining" size={24} color="#F59E0B" />
                  </View>
                  <View className="ml-2">
                    <Text className="text-lg font-bold text-gray-900">Out for Delivery</Text>
                    <Text className="text-gray-500">Your parcel will be delivered soon</Text>
                  </View>
                </View>
              )}
              
              {parcelStatus === 'delivered' && (
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                    <Ionicons name="checkmark-done-circle" size={24} color="#10B981" />
                  </View>
                  <View className="ml-2">
                    <Text className="text-lg font-bold text-gray-900">Delivered</Text>
                    <Text className="text-gray-500">Your parcel has been delivered successfully</Text>
                  </View>
                </View>
              )}
            </View>
            
            <View className="pt-3">
              <Text className="text-gray-500 mb-1">Estimated Delivery</Text>
              <Text className="text-xl font-bold text-gray-900">
                {parcelStatus === 'delivered' ? 'Delivered' : 'Today, by 4:30 PM'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Live Map */}
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-900 mb-2">Live Tracking</Text>
          {renderMap()}
          
          <View className="flex-row items-center mt-2">
            <MaterialIcons name="location-on" size={20} color="#4F46E5" />
            <Text className="text-gray-700 ml-1 flex-1">
              {currentLocation.description}
            </Text>
          </View>
        </View>
        
        {/* Tracking Steps */}
        <View className="px-4 mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">Tracking History</Text>
          
          {getParcelSteps().map((step, index) => (
            <View 
              key={index} 
              className={`flex-row mb-5 ${index === getParcelSteps().length - 1 ? '' : 'relative'}`}
            >
              {/* Status line */}
              {index !== getParcelSteps().length - 1 && (
                <View 
                  className={`absolute left-4 top-5 w-0.5 h-full ${
                    step.status === 'completed' ? 'bg-primary' : 
                    step.status === 'current' ? 'bg-gray-300' : 'bg-gray-200'
                  }`} 
                  style={{ transform: [{ translateX: 0.5 }] }}
                />
              )}
              
              {/* Status circle */}
              <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                step.status === 'completed' ? 'bg-primary' : 
                step.status === 'current' ? 'bg-primary/20 border-2 border-primary' :
                'bg-gray-200'
              }`}>
                {step.status === 'completed' ? (
                  <Ionicons name="checkmark" size={18} color="white" />
                ) : step.status === 'current' ? (
                  <View className="w-2 h-2 bg-primary rounded-full" />
                ) : null}
              </View>
              
              {/* Step details */}
              <View className="flex-1">
                <View className="flex-row justify-between items-center">
                  <Text className={`font-medium ${
                    step.status === 'current' ? 'text-primary' : 
                    step.status === 'completed' ? 'text-gray-900' :
                    'text-gray-400'
                  }`}>
                    {step.title}
                  </Text>
                  {step.time && (
                    <Text className="text-xs text-gray-500">{step.time}</Text>
                  )}
                </View>
                <Text className="text-sm text-gray-500">{step.description}</Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Parcel Details */}
        <View className="px-4 mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">Parcel Details</Text>
          
          <Animated.View entering={FadeIn} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Package Info */}
            <View className="p-3 border-b border-gray-100">
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons name="package-variant" size={20} color="#4F46E5" />
                <Text className="font-medium text-gray-900 ml-2">Package Information</Text>
              </View>
              
              <View className="ml-7 space-y-1">
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Description</Text>
                  <Text className="text-gray-900">{parcelDetails.package.description}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Weight</Text>
                  <Text className="text-gray-900">{parcelDetails.package.weight}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Dimensions</Text>
                  <Text className="text-gray-900">{parcelDetails.package.dimensions}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Service</Text>
                  <Text className="text-gray-900">{parcelDetails.package.service}</Text>
                </View>
              </View>
            </View>
            
            {/* Sender Info */}
            <View className="p-3 border-b border-gray-100">
              <View className="flex-row items-center mb-2">
                <Ionicons name="person-outline" size={20} color="#4F46E5" />
                <Text className="font-medium text-gray-900 ml-2">Sender</Text>
              </View>
              
              <View className="ml-7 space-y-1">
                <Text className="text-gray-900">{parcelDetails.sender.name}</Text>
                <Text className="text-gray-500">{parcelDetails.sender.phone}</Text>
                <Text className="text-gray-500">{parcelDetails.sender.address}</Text>
              </View>
            </View>
            
            {/* Recipient Info */}
            <View className="p-3">
              <View className="flex-row items-center mb-2">
                <Ionicons name="person-outline" size={20} color="#4F46E5" />
                <Text className="font-medium text-gray-900 ml-2">Recipient</Text>
              </View>
              
              <View className="ml-7 space-y-1">
                <Text className="text-gray-900">{parcelDetails.recipient.name}</Text>
                <Text className="text-gray-500">{parcelDetails.recipient.phone}</Text>
                <Text className="text-gray-500">{parcelDetails.recipient.address}</Text>
              </View>
            </View>
          </Animated.View>
        </View>
        
        {/* Support Section */}
        <View className="px-4 pb-8">
          <Text className="text-lg font-bold text-gray-900 mb-3">Need Help?</Text>
          
          <TouchableOpacity 
            className="bg-white rounded-xl border border-gray-100 p-4 flex-row items-center"
            onPress={handleCallSupport}
          >
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Ionicons name="call-outline" size={20} color="#4F46E5" />
            </View>
            <View>
              <Text className="font-medium text-gray-900">Contact Support</Text>
              <Text className="text-gray-500">Call our 24/7 customer service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-auto" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
