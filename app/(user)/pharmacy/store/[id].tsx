import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Alert, Linking } from 'react-native';
import { useState } from 'react';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

// Define types
type Pharmacy = {
  id: string;
  name: string;
  description: string;
  address: string;
  image: any;
  coverImage: any;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: string;
  isOpen: boolean;
  discount: string;
  featured: boolean;
  tags: string[];
  services: string[];
  phone: string;
  email: string;
};

// Sample data for pharmacies
const PHARMACIES: Record<string, Pharmacy> = {
  '1': {
    id: '1',
    name: 'HealthPlus Pharmacy',
    description: 'Premium healthcare products and medications',
    address: '123 Medical Lane, Accra',
    image: require('@/assets/images/adaptive-icon.png'),
    coverImage: require('@/assets/images/adaptive-icon.png'),
    rating: 4.8,
    reviews: 128,
    deliveryTime: '20-30 min',
    deliveryFee: '₵3.99',
    isOpen: true,
    discount: '10% OFF',
    featured: true,
    tags: ['24/7 Service', 'Prescription'],
    services: ['Prescription Filling', 'Health Consultations', 'Delivery Service', 'Blood Pressure Check'],
    phone: '+233 20 123 4567',
    email: 'info@healthplus.com'
  },
  '2': {
    id: '2',
    name: 'MediCare Drugstore',
    description: 'Quality medications and health essentials',
    address: '45 Wellness Street, Kumasi',
    image: require('@/assets/images/adaptive-icon.png'),
    coverImage: require('@/assets/images/adaptive-icon.png'),
    rating: 4.6,
    reviews: 95,
    deliveryTime: '25-40 min',
    deliveryFee: '₵2.50',
    isOpen: true,
    discount: '',
    featured: false,
    tags: ['OTC', 'Vitamins'],
    services: ['Prescription Filling', 'Baby Care Products', 'Health Screening', 'Immunizations'],
    phone: '+233 20 987 6543',
    email: 'care@medicare.com'
  },
  '3': {
    id: '3',
    name: 'PharmLife',
    description: 'Complete wellness and pharmaceutical solutions',
    address: '78 Health Avenue, Tamale',
    image: require('@/assets/images/adaptive-icon.png'),
    coverImage: require('@/assets/images/adaptive-icon.png'),
    rating: 4.9,
    reviews: 156,
    deliveryTime: '30-45 min',
    deliveryFee: '₵4.50',
    isOpen: true,
    discount: '15% OFF',
    featured: true,
    tags: ['Baby Care', 'Health Foods'],
    services: ['Medication Counseling', 'Health Products', 'Nutrition Advice', 'First Aid Supplies'],
    phone: '+233 20 555 7890',
    email: 'help@pharmlife.com'
  },
  '4': {
    id: '4',
    name: 'QuickMeds Pharmacy',
    description: 'Fast delivery of all your medication needs',
    address: '22 Relief Road, Accra',
    image: require('@/assets/images/adaptive-icon.png'),
    coverImage: require('@/assets/images/adaptive-icon.png'),
    rating: 4.4,
    reviews: 89,
    deliveryTime: '15-25 min',
    deliveryFee: '₵3.50',
    isOpen: false,
    discount: '',
    featured: false,
    tags: ['Diabetes Care', 'Medical Equipment'],
    services: ['Express Delivery', 'Diabetic Supplies', 'Medical Equipment', 'Prescription Refills'],
    phone: '+233 20 333 1122',
    email: 'service@quickmeds.com'
  }
};

// Featured medications
const FEATURED_MEDICATIONS = [
  {
    id: '1',
    name: 'Vitamin C 1000mg',
    description: 'Immune support supplement',
    price: 25.99,
    image: require('@/assets/images/adaptive-icon.png'),
    prescription: false,
  },
  {
    id: '2',
    name: 'Pain Relief Tablet',
    description: 'Fast acting pain relief',
    price: 12.50,
    image: require('@/assets/images/adaptive-icon.png'),
    prescription: false,
  },
  {
    id: '3',
    name: 'Allergy Relief',
    description: 'Non-drowsy formula',
    price: 18.75,
    image: require('@/assets/images/adaptive-icon.png'),
    prescription: false,
  },
  {
    id: '4',
    name: 'Antibiotics',
    description: 'Broad spectrum antibiotic',
    price: 32.99,
    image: require('@/assets/images/adaptive-icon.png'),
    prescription: true,
  }
];

export default function PharmacyDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  
  // Get pharmacy data
  const pharmacy = PHARMACIES[id as string] || null;
  
  if (!pharmacy) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Pharmacy not found</Text>
      </View>
    );
  }

  // Handle contact pharmacy
  const handleContactPharmacy = () => {
    if (!pharmacy) return;
    
    Alert.alert(
      `Contact ${pharmacy.name}`,
      'How would you like to reach out?',
      [
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${pharmacy.phone}`);
          },
        },
        {
          text: 'Email',
          onPress: () => {
            Linking.openURL(`mailto:${pharmacy.email}?subject=Customer%20Inquiry`);
          },
        },
        {
          text: 'Chat',
          onPress: () => {
            router.push({
              pathname: '/(user)/pharmacy/chat',
              params: { 
                pharmacyId: pharmacy.id,
                pharmacyName: pharmacy.name
              }
            } as any);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      {/* Pharmacy Header - Overlaid on top of the cover image */}
      <View className="absolute top-0 left-0 right-0 z-50" style={{ paddingTop: insets.top }}>
        <View className="px-4 py-2 flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-black/20 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View className="flex-row space-x-3">
            <TouchableOpacity className="w-10 h-10 bg-black/20 rounded-full items-center justify-center">
              <Ionicons name="heart-outline" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-black/20 rounded-full items-center justify-center">
              <Ionicons name="share-social-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Pharmacy Cover */}
        <View className="h-64 w-full">
          <Image 
            source={pharmacy.coverImage}
            className="w-full h-full"
            resizeMode="cover"
          />
          
          {/* Overlay for closed pharmacies */}
          {!pharmacy.isOpen && (
            <BlurView intensity={70} className="absolute inset-0 items-center justify-center">
              <View className="bg-black/60 px-6 py-3 rounded-lg">
                <Text className="text-white font-semibold text-lg">Currently Closed</Text>
              </View>
            </BlurView>
          )}
          
          {/* Discount Badge */}
          {pharmacy.discount && (
            <View className="absolute bottom-4 left-4 bg-red-500 px-3 py-1 rounded-full">
              <Text className="text-white text-sm font-semibold">{pharmacy.discount}</Text>
            </View>
          )}
        </View>
        
        {/* Pharmacy Info Card */}
        <View className="bg-white rounded-t-3xl -mt-6 pt-6 px-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">{pharmacy.name}</Text>
              <Text className="text-gray-500 mt-1">{pharmacy.description}</Text>
              
              <View className="flex-row flex-wrap mt-2">
                {pharmacy.tags.map(tag => (
                  <View key={tag} className="bg-indigo-50 rounded-full px-3 py-1 mr-2 mb-2">
                    <Text className="text-indigo-700 text-xs font-medium">{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View className="bg-indigo-50 p-3 rounded-xl items-center justify-center">
              <Text className="text-indigo-700 text-lg font-bold">{pharmacy.rating}</Text>
              <View className="flex-row">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <Ionicons 
                    key={index}
                    name={index < Math.floor(pharmacy.rating) ? "star" : "star-outline"} 
                    size={12} 
                    color="#4F46E5" 
                  />
                ))}
              </View>
              <Text className="text-gray-500 text-xs mt-1">{pharmacy.reviews} reviews</Text>
            </View>
          </View>
          
          {/* Pharmacy Details */}
          <View className="flex-row justify-between mt-6 pb-6 border-b border-gray-100">
            <View className="items-center">
              <View className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center mb-1">
                <MaterialCommunityIcons name="clock-outline" size={20} color="#4F46E5" />
              </View>
              <Text className="text-gray-900 font-medium">{pharmacy.deliveryTime}</Text>
              <Text className="text-gray-500 text-xs">Delivery Time</Text>
            </View>
            
            <View className="items-center">
              <View className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center mb-1">
                <MaterialCommunityIcons name="bike" size={20} color="#4F46E5" />
              </View>
              <Text className="text-gray-900 font-medium">{pharmacy.deliveryFee}</Text>
              <Text className="text-gray-500 text-xs">Delivery Fee</Text>
            </View>
            
            <View className="items-center">
              <View className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center mb-1">
                <MaterialCommunityIcons name="star" size={20} color="#4F46E5" />
              </View>
              <Text className="text-gray-900 font-medium">{pharmacy.rating}</Text>
              <Text className="text-gray-500 text-xs">Rating</Text>
            </View>
          </View>
          
          {/* Prescription Upload Section */}
          <TouchableOpacity 
            className="mt-6 bg-indigo-50 p-4 rounded-xl flex-row items-center"
            onPress={() => router.push({
              pathname: '/(user)/pharmacy/prescription',
              params: { selectedPharmacyId: pharmacy.id, selectedPharmacyName: pharmacy.name }
            } as any)}
          >
            <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center">
              <Ionicons name="document-text-outline" size={24} color="#4F46E5" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-indigo-900 font-semibold text-lg">Upload Prescription</Text>
              <Text className="text-indigo-700 text-sm">Get your medications delivered from {pharmacy.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#4F46E5" />
          </TouchableOpacity>
          
          {/* Services Offered */}
          <View className="mt-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">Services Offered</Text>
            <View className="flex-row flex-wrap">
              {pharmacy.services.map((service, index) => (
                <View key={index} className="w-1/2 mb-4 pr-2">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-2">
                      <Ionicons name="checkmark" size={16} color="#059669" />
                    </View>
                    <Text className="text-gray-700 flex-1">{service}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          
          {/* Location */}
          <View className="mt-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">Location</Text>
            <View className="flex-row items-center bg-gray-50 p-3 rounded-xl">
              <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center">
                <Ionicons name="location-outline" size={20} color="#4B5563" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-900 font-medium" numberOfLines={1}>{pharmacy.address}</Text>
                <Text className="text-gray-500 text-xs">Get directions</Text>
              </View>
              <TouchableOpacity className="bg-gray-200 p-2 rounded-lg">
                <Feather name="map-pin" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Featured Medications */}
          <View className="mt-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">Featured Medications</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="overflow-visible -mx-4 px-4"
            >
              {FEATURED_MEDICATIONS.map((medication, index) => (
                <TouchableOpacity 
                  key={medication.id}
                  className="bg-white border border-gray-100 rounded-xl shadow-sm mr-4 w-48 overflow-hidden"
                  onPress={() => {
                    if (medication.prescription) {
                      router.push({
                        pathname: '/(user)/pharmacy/prescription',
                        params: { selectedPharmacyId: pharmacy.id, selectedPharmacyName: pharmacy.name }
                      } as any);
                    } else {
                      // Navigate to medication detail
                      router.push(`/(user)/pharmacy/product/${medication.id}` as any);
                    }
                  }}
                >
                  <View className="p-2 relative">
                    {medication.prescription && (
                      <View className="absolute top-2 left-2 z-10 bg-blue-500 px-2 py-1 rounded-full">
                        <Text className="text-white text-xs">Rx</Text>
                      </View>
                    )}
                    <Image 
                      source={medication.image}
                      className="w-full h-32 rounded-lg"
                      resizeMode="cover"
                    />
                  </View>
                  <View className="p-3">
                    <Text className="text-gray-900 font-medium" numberOfLines={1}>{medication.name}</Text>
                    <Text className="text-gray-500 text-xs" numberOfLines={1}>{medication.description}</Text>
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-gray-900 font-semibold">₵{medication.price.toFixed(2)}</Text>
                      <TouchableOpacity 
                        className="w-7 h-7 bg-indigo-600 rounded-full items-center justify-center"
                      >
                        <Ionicons name="add" size={18} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Disclaimer */}
          <View className="mt-6 mb-10">
            <Text className="text-xs text-gray-500 italic">
              Medications may require a valid prescription from a licensed healthcare provider. 
              Prices may vary and are subject to change without notice.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Action Bar */}
      <View className="bg-white p-4 border-t border-gray-100 flex-row">
        <TouchableOpacity 
          className="flex-1 bg-white border border-indigo-600 rounded-xl py-3 mr-3 items-center"
          onPress={handleContactPharmacy}
        >
          <Text className="text-indigo-600 font-semibold">Contact Pharmacy</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-1 bg-indigo-600 rounded-xl py-3 items-center"
          onPress={() => router.push({
            pathname: '/(user)/pharmacy/prescription',
            params: { selectedPharmacyId: pharmacy.id, selectedPharmacyName: pharmacy.name }
          } as any)}
        >
          <Text className="text-white font-semibold">Upload Prescription</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 