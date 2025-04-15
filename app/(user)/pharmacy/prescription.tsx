import { View, Text, TouchableOpacity, Image, ScrollView, StatusBar, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
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
};

export default function PrescriptionUploadScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  // Sample pharmacy data
  const PHARMACIES: Pharmacy[] = [
    {
      id: '1',
      name: 'HealthPlus Pharmacy',
      address: '123 Medical Lane, Accra',
      image: require('@/assets/images/adaptive-icon.png'),
      rating: 4.8,
      distance: '1.2 km',
      deliveryTime: '20-30 min',
    },
    {
      id: '2',
      name: 'MediCare Drugstore',
      address: '45 Wellness Street, Kumasi',
      image: require('@/assets/images/adaptive-icon.png'),
      rating: 4.6,
      distance: '2.5 km',
      deliveryTime: '25-40 min',
    },
    {
      id: '3',
      name: 'PharmLife',
      address: '78 Health Avenue, Tamale',
      image: require('@/assets/images/adaptive-icon.png'),
      rating: 4.9,
      distance: '3.0 km',
      deliveryTime: '30-45 min',
    },
  ];

  // Set selected pharmacy from URL params if available
  useEffect(() => {
    const pharmacyId = params.selectedPharmacyId as string;
    
    if (pharmacyId && (!selectedPharmacy || selectedPharmacy.id !== pharmacyId)) {
      const preSelectedPharmacy = PHARMACIES.find(
        pharmacy => pharmacy.id === pharmacyId
      );
      
      if (preSelectedPharmacy) {
        setSelectedPharmacy(preSelectedPharmacy);
      }
    }
  }, [params.selectedPharmacyId]);

  // Handle camera access
  const takePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });
      
      if (!result.canceled) {
        setPrescriptionImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take a picture');
    }
  };

  // Handle gallery access
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });
      
      if (!result.canceled) {
        setPrescriptionImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select an image');
    }
  };

  // Handle submission
  const handleSubmit = () => {
    if (!selectedPharmacy) {
      Alert.alert('Select Pharmacy', 'Please select a pharmacy for processing');
      return;
    }

    if (!prescriptionImage && symptoms.trim().length < 10) {
      Alert.alert('Missing Information', 'Please either upload a prescription image or describe your symptoms in detail');
      return;
    }

    // Determine request type
    const requestType = prescriptionImage ? 'prescription' : 'consultation';
    
    // In a real app, this would upload the prescription to a server
    // and create an order in the database
    Alert.alert(
      requestType === 'prescription' ? 'Prescription Submitted' : 'Consultation Requested',
      requestType === 'prescription'
        ? 'Your prescription has been sent for verification. We will notify you once it\'s processed.'
        : 'Your symptom description has been sent to the pharmacy. A pharmacist will review your case and contact you with recommendations.',
      [
        {
          text: 'OK',
          onPress: () => router.push('/(user)/pharmacy' as any),
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <BlurView intensity={70} className="absolute top-0 left-0 right-0 z-50">
        <View style={{ paddingTop: insets.top }} className="px-4 bg-white/90">
          <View className="flex-row items-center justify-between py-4">
            <TouchableOpacity 
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color="#374151" />
            </TouchableOpacity>
            <Text className="text-gray-900 font-semibold text-lg">Upload Prescription</Text>
            <View className="w-10" />
          </View>
        </View>
      </BlurView>
      
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ 
          paddingTop: insets.top + 60,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <Animated.View 
          entering={FadeIn.delay(100)}
          className="mx-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6"
        >
          <View className="flex-row">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="information-circle" size={24} color="#1E40AF" />
            </View>
            <View className="flex-1">
              <Text className="text-blue-900 font-medium mb-1">Prescription Requirements</Text>
              <Text className="text-blue-800 text-sm">
                Please upload a clear image of your prescription. Make sure all details including doctor's signature, date, and medication details are visible.
              </Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Upload Section */}
        <Animated.View 
          entering={FadeInDown.delay(300)}
          className="mb-6"
        >
          {prescriptionImage ? (
            <View className="relative">
              <Image 
                source={{ uri: prescriptionImage }}
                className="w-full h-64 rounded-xl"
                resizeMode="cover"
              />
              <View className="absolute top-2 right-2 flex-row">
                <TouchableOpacity 
                  className="w-10 h-10 bg-white/80 rounded-full items-center justify-center mr-2"
                  onPress={() => setPrescriptionImage(null)}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
                <TouchableOpacity 
                  className="w-10 h-10 bg-white/80 rounded-full items-center justify-center"
                  onPress={takePicture}
                >
                  <Ionicons name="camera" size={20} color="#374151" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="bg-gray-50 rounded-xl p-8 items-center border border-dashed border-gray-300">
              <View className="w-16 h-16 bg-indigo-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="document-text-outline" size={32} color="#4F46E5" />
              </View>
              <Text className="text-gray-900 font-medium text-lg mb-2">Upload Prescription</Text>
              <Text className="text-gray-600 text-center mb-6">
                Take a clear photo of your prescription or upload from your gallery
              </Text>
              <View className="flex-row">
                <TouchableOpacity 
                  className="bg-indigo-600 px-4 py-3 rounded-xl flex-row items-center mr-3"
                  onPress={takePicture}
                >
                  <Ionicons name="camera-outline" size={20} color="white" />
                  <Text className="text-white font-medium ml-2">Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="bg-white border border-gray-300 px-4 py-3 rounded-xl flex-row items-center"
                  onPress={pickImage}
                >
                  <Ionicons name="image-outline" size={20} color="#374151" />
                  <Text className="text-gray-900 font-medium ml-2">Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>
        
        {/* Describe Symptoms */}
        <Animated.View 
          entering={FadeInDown.delay(350)}
          className="mx-4 mb-6"
        >
          <Text className="text-gray-900 font-semibold text-lg mb-3">Describe Your Symptoms</Text>
          <View className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle" size={20} color="#B45309" />
              <Text className="text-amber-800 font-medium ml-2">No Prescription?</Text>
            </View>
            <Text className="text-amber-700 text-sm">
              If you don't have a prescription, you can describe your symptoms here. 
              A pharmacist will review your symptoms and recommend appropriate over-the-counter medications.
            </Text>
          </View>
          <TextInput
            className="bg-gray-50 rounded-xl p-4 text-gray-900 min-h-[120px]"
            placeholder="Describe your symptoms in detail (when they started, severity, any medications you've tried, etc.)"
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            value={symptoms}
            onChangeText={setSymptoms}
          />
        </Animated.View>
        
        {/* Select Pharmacy */}
        <Animated.View 
          entering={FadeInDown.delay(400)}
          className="mx-4 mb-6"
        >
          <Text className="text-gray-900 font-semibold text-lg mb-3">
            {params.selectedPharmacyId ? 'Pharmacy Selected' : 'Select Pharmacy'}
          </Text>
          
          {PHARMACIES.map((pharmacy) => (
            <TouchableOpacity 
              key={pharmacy.id}
              className={`flex-row items-center p-3 mb-2 rounded-xl border ${
                selectedPharmacy?.id === pharmacy.id 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200'
              }`}
              onPress={() => setSelectedPharmacy(pharmacy)}
            >
              <Image 
                source={pharmacy.image}
                className="w-14 h-14 rounded-full"
              />
              <View className="flex-1 ml-3">
                <Text className="text-gray-900 font-medium">{pharmacy.name}</Text>
                <Text className="text-gray-500 text-sm">{pharmacy.address}</Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="star" size={14} color="#FBBF24" />
                  <Text className="text-gray-700 text-xs ml-1">{pharmacy.rating}</Text>
                  <Text className="text-gray-500 text-xs ml-3">{pharmacy.distance}</Text>
                </View>
              </View>
              {selectedPharmacy?.id === pharmacy.id && (
                <View className="bg-indigo-600 rounded-full p-2">
                  <Ionicons name="checkmark" size={18} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity className="flex-row items-center justify-center mt-2">
            <Ionicons name="location-outline" size={18} color="#4F46E5" />
            <Text className="text-indigo-600 font-medium ml-1">See more pharmacies nearby</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Additional Notes */}
        <Animated.View 
          entering={FadeInDown.delay(500)}
          className="mx-4 mb-10"
        >
          <Text className="text-gray-900 font-semibold text-lg mb-3">Additional Notes (Optional)</Text>
          <TextInput
            className="bg-gray-50 rounded-xl p-4 text-gray-900 min-h-[100px]"
            placeholder="Add any notes for the pharmacist (e.g., allergies, preferences)"
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </Animated.View>
      </ScrollView>
      
      {/* Submit Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4" style={{ paddingBottom: insets.bottom || 16 }}>
        <TouchableOpacity 
          className={`py-4 rounded-xl items-center justify-center ${
            (prescriptionImage || symptoms.trim().length > 10) && selectedPharmacy 
              ? 'bg-indigo-600' 
              : 'bg-gray-300'
          }`}
          onPress={handleSubmit}
          disabled={!((prescriptionImage || symptoms.trim().length > 10) && selectedPharmacy)}
        >
          <Text className="text-white font-semibold text-center">
            {prescriptionImage ? 'Submit Prescription' : symptoms ? 'Request Consultation' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}