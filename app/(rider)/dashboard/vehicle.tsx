import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import LottieView from 'lottie-react-native';
import * as Location from 'expo-location';

interface VehicleInfo {
  code: string;
  type: 'motorcycle' | 'bicycle';
  status: 'active' | 'maintenance' | 'returned';
  lastMaintenance: string;
  nextMaintenance: string;
  totalDeliveries: number;
  totalDistance: number;
  location?: string;
  batteryLevel?: number;
  fuelLevel?: number;
  returnLocations: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    radius: number; // meters
  }[];
}

const vehicleInfo: VehicleInfo = {
  code: 'MTR-001',
  type: 'motorcycle',
  status: 'active',
  lastMaintenance: '2024-03-01',
  nextMaintenance: '2024-04-01',
  totalDeliveries: 156,
  totalDistance: 1234,
  location: 'Tamale Technical University',
  batteryLevel: 85,
  fuelLevel: 75,
  returnLocations: [
    {
      name: 'TaTU Main Gate',
      coordinates: {
        latitude: 9.4037,
        longitude: -0.8499
      },
      radius: 10000 // 100 meters radius
    },
    {
      name: 'TaTU Engineering Block',
      coordinates: {
        latitude: 9.4045,
        longitude: -0.8505
      },
      radius: 50000
    },
    {
      name: 'TaTU Student Center',
      coordinates: {
        latitude: 9.4041,
        longitude: -0.8492
      },
      radius: 75000
    }
  ]
};

const VehicleStats = [
  {
    icon: 'bicycle-outline',
    label: 'Vehicle Type',
    value: 'Motorcycle',
    color: '#4F46E5',
  },
  {
    icon: 'speedometer-outline',
    label: 'Campus Coverage',
    value: '100%',
    color: '#22C55E',
  },
  {
    icon: 'cube-outline',
    label: 'Campus Deliveries',
    value: '156',
    color: '#F59E0B',
  },
];

export default function VehicleScreen() {
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [vehicleState, setVehicleState] = useState<VehicleInfo>(vehicleInfo);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [selectedReturnLocation, setSelectedReturnLocation] = useState<typeof vehicleInfo.returnLocations[0] | null>(null);

  const handlePickupVehicle = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setVehicleState(prev => ({ ...prev, status: 'active' }));
    setIsProcessing(false);
    setShowPickupModal(false);
  };

  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Location permission is required to verify vehicle return location.'
      );
      return false;
    }
    return true;
  };

  const verifyReturnLocation = async () => {
    setIsCheckingLocation(true);
    try {
      const hasPermission = await checkLocationPermission();
      if (!hasPermission) {
        setIsCheckingLocation(false);
        return false;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      // Calculate distance between current location and selected return point
      const distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        selectedReturnLocation!.coordinates.latitude,
        selectedReturnLocation!.coordinates.longitude
      );

      if (distance <= selectedReturnLocation!.radius) {
        setCurrentLocation(location);
        setIsCheckingLocation(false);
        return true;
      } else {
        Alert.alert(
          'Invalid Return Location',
          `Please ensure you are at ${selectedReturnLocation!.name} before returning the vehicle.`
        );
        setIsCheckingLocation(false);
        return false;
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to verify location. Please try again.');
      setIsCheckingLocation(false);
      return false;
    }
  };

  const handleReturnVehicle = async () => {
    if (!selectedReturnLocation) {
      Alert.alert('Error', 'Please select a return location');
      return;
    }

    const isLocationValid = await verifyReturnLocation();
    if (!isLocationValid) return;

    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setVehicleState(prev => ({ ...prev, status: 'returned' }));
    setIsProcessing(false);
    setShowReturnModal(false);
  };

  // Helper function to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const renderPickupModal = () => (
    <Modal
      visible={showPickupModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowPickupModal(false)}
    >
      <BlurView intensity={20} className="flex-1 justify-center items-center p-6">
        <Animated.View 
          entering={ZoomIn}
          className="bg-white w-full rounded-3xl p-6"
        >
          <View className="items-center mb-6">
            <LottieView
              source={require('@/assets/Onboarding/fast delivery.json')}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
            <Text className="text-xl font-bold mt-4">Ready for Pickup</Text>
            <Text className="text-gray-500 text-center mt-2">
              Please verify the vehicle condition before starting your shift
            </Text>
          </View>

          <View className="space-y-4 mb-6">
            <View className="flex-row items-center bg-gray-50 p-4 rounded-xl">
              <Ionicons name="location-outline" size={24} color="#4F46E5" />
              <View className="ml-3">
                <Text className="text-sm text-gray-500">Pickup Location</Text>
                <Text className="font-medium">{vehicleState.location}</Text>
              </View>
            </View>

            <View className="flex-row space-x-4">
              <View className="flex-1 bg-gray-50 p-4 rounded-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-500">Battery</Text>
                  <Text className="font-semibold text-green-600">
                    {vehicleState.batteryLevel}%
                  </Text>
                </View>
                <View className="h-2 bg-gray-200 rounded-full mt-2">
                  <View 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${vehicleState.batteryLevel}%` }}
                  />
                </View>
              </View>

              <View className="flex-1 bg-gray-50 p-4 rounded-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-500">Fuel</Text>
                  <Text className="font-semibold text-blue-600">
                    {vehicleState.fuelLevel}%
                  </Text>
                </View>
                <View className="h-2 bg-gray-200 rounded-full mt-2">
                  <View 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${vehicleState.fuelLevel}%` }}
                  />
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handlePickupVehicle}
            disabled={isProcessing}
            className="bg-primary p-4 rounded-xl items-center"
          >
            {isProcessing ? (
              <View className="flex-row items-center">
                <LottieView
                  source={require('@/assets/Onboarding/fast delivery.json')}
                  autoPlay
                  loop
                  style={{ width: 24, height: 24 }}
                />
                <Text className="text-white font-semibold ml-2">Processing...</Text>
              </View>
            ) : (
              <Text className="text-white font-semibold">Confirm Pickup</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </BlurView>
    </Modal>
  );

  const renderReturnModal = () => (
    <Modal
      visible={showReturnModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowReturnModal(false)}
    >
      <BlurView intensity={20} className="flex-1 justify-center items-center p-6">
        <Animated.View 
          entering={ZoomIn}
          className="bg-white w-full rounded-3xl p-6"
        >
          <View className="items-center mb-6">
            <LottieView
              source={require('@/assets/Onboarding/fast delivery.json')}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
            <Text className="text-xl font-bold mt-4">Return Vehicle</Text>
            <Text className="text-gray-500 text-center mt-2">
              Please ensure the vehicle is in good condition before returning
            </Text>
          </View>

          <View className="space-y-4 mb-6">
            {/* Return Location Selection */}
            <View className="space-y-3">
              <Text className="font-medium text-gray-900">Select Return Location</Text>
              {vehicleInfo.returnLocations.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedReturnLocation(location)}
                  className={`flex-row items-center bg-gray-50 p-4 rounded-xl ${
                    selectedReturnLocation?.name === location.name ? 'border-2 border-primary' : ''
                  }`}
                >
                  <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                    <Ionicons name="location" size={20} color="#4F46E5" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-medium">{location.name}</Text>
                    <Text className="text-sm text-gray-500">Designated Return Point</Text>
                  </View>
                  {selectedReturnLocation?.name === location.name && (
                    <Ionicons name="checkmark-circle" size={24} color="#4F46E5" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Return Checklist */}
            <View className="space-y-3">
              <Text className="font-medium text-gray-900">Return Checklist</Text>
              {[
                'Vehicle is parked at designated TaTU parking spot',
                'Keys submitted to campus security post',
                'Fuel/Battery level above 30%',
                'No damages from campus usage',
                'Logged all campus delivery details'
              ].map((item, index) => (
                <View key={index} className="flex-row items-center bg-gray-50 p-3 rounded-xl">
                  <View className="w-6 h-6 rounded-full bg-green-100 items-center justify-center">
                    <Ionicons name="checkmark" size={16} color="#22C55E" />
                  </View>
                  <Text className="ml-3 text-gray-600">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleReturnVehicle}
            disabled={isProcessing || isCheckingLocation || !selectedReturnLocation}
            className={`p-4 rounded-xl items-center ${
              isProcessing || isCheckingLocation || !selectedReturnLocation 
                ? 'bg-gray-300' 
                : 'bg-red-500'
            }`}
          >
            {isProcessing || isCheckingLocation ? (
              <View className="flex-row items-center">
                <LottieView
                  source={require('@/assets/Onboarding/fast delivery.json')}
                  autoPlay
                  loop
                  style={{ width: 24, height: 24 }}
                />
                <Text className="text-white font-semibold ml-2">
                  {isCheckingLocation ? 'Verifying Location...' : 'Processing...'}
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold">Confirm Return</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </BlurView>
    </Modal>
  );

  return (
    <>
      <ScrollView 
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Vehicle Status Card */}
        <Animated.View 
          entering={FadeInDown.delay(200)}
          className="bg-white p-6 rounded-2xl mb-6"
        >
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-900">{vehicleInfo.code}</Text>
              <Text className="text-gray-500 capitalize">{vehicleInfo.type}</Text>
            </View>
            <View className={`px-4 py-2 rounded-full ${
              vehicleInfo.status === 'active' ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <Text className={`font-medium capitalize ${
                vehicleInfo.status === 'active' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {vehicleInfo.status}
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap -m-2">
            {VehicleStats.map((stat) => (
              <View key={stat.label} className="w-1/3 p-2">
                <View className="items-center">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                  </View>
                  <Text className="text-gray-500 text-sm mb-1">{stat.label}</Text>
                  <Text className="font-semibold">{stat.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Maintenance Info */}
        <Animated.View 
          entering={FadeInDown.delay(300)}
          className="bg-white p-6 rounded-2xl mb-6"
        >
          <Text className="text-lg font-semibold mb-4">Maintenance Schedule</Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center bg-gray-50 p-4 rounded-xl">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                <Ionicons name="calendar-outline" size={20} color="#4F46E5" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-sm text-gray-500">Last Maintenance</Text>
                <Text className="text-gray-900 font-medium">{vehicleInfo.lastMaintenance}</Text>
              </View>
            </View>

            <View className="flex-row items-center bg-gray-50 p-4 rounded-xl">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                <Ionicons name="calendar" size={20} color="#22C55E" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-sm text-gray-500">Next Maintenance</Text>
                <Text className="text-gray-900 font-medium">{vehicleInfo.nextMaintenance}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Vehicle Guidelines */}
        <Animated.View 
          entering={FadeInDown.delay(400)}
          className="bg-white p-6 rounded-2xl"
        >
          <Text className="text-lg font-semibold mb-4">Vehicle Guidelines</Text>
          
          <View className="space-y-4">
            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mt-1">
                <Text className="text-primary font-semibold">1</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-900 font-medium">Regular Inspections</Text>
                <Text className="text-gray-500 mt-1">
                  Perform daily checks on brakes, tires, and lights before starting your shift
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mt-1">
                <Text className="text-primary font-semibold">2</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-900 font-medium">Report Issues</Text>
                <Text className="text-gray-500 mt-1">
                  Immediately report any mechanical issues or concerns to support
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mt-1">
                <Text className="text-primary font-semibold">3</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-900 font-medium">Keep it Clean</Text>
                <Text className="text-gray-500 mt-1">
                  Maintain vehicle cleanliness for professional appearance and longevity
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Button */}
        <Animated.View 
          entering={FadeInDown.delay(500)}
          className="mt-6"
        >
          {vehicleState.status === 'returned' ? (
            <TouchableOpacity
              onPress={() => setShowPickupModal(true)}
              className="bg-primary p-4 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="key" size={24} color="white" />
              <Text className="text-white font-semibold ml-2">Pickup Vehicle</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setShowReturnModal(true)}
              className="bg-red-500 p-4 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="log-out" size={24} color="white" />
              <Text className="text-white font-semibold ml-2">Return Vehicle</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>

      {renderPickupModal()}
      {renderReturnModal()}
    </>
  );
} 