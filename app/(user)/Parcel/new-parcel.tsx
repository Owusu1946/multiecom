import { View, Text, ScrollView, TextInput, TouchableOpacity, StatusBar, Image, Switch, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { PACKAGE_SIZES, GHANA_REGIONS } from '@/app/constants/mart';

// Types for form data
type ParcelData = {
  pickup: {
    name: string;
    phone: string;
    address: string;
    city: string;
    instructions: string;
  };
  delivery: {
    name: string;
    phone: string;
    address: string;
    city: string;
    instructions: string;
  };
  parcel: {
    packageSize: string;
    weight: string;
    description: string;
    value: string;
    isFragile: boolean;
    requireSignature: boolean;
    service: string;
  };
};

export default function NewParcelScreen() {
  const insets = useSafeAreaInsets();
  const { service, destination } = useLocalSearchParams<{ service: string; destination: string }>();
  
  // State for active step
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // State for parcel data
  const [parcelData, setParcelData] = useState<ParcelData>({
    pickup: {
      name: '',
      phone: '',
      address: '',
      city: '',
      instructions: '',
    },
    delivery: {
      name: '',
      phone: '',
      address: '',
      city: destination || '',
      instructions: '',
    },
    parcel: {
      packageSize: 'small',
      weight: '1',
      description: '',
      value: '',
      isFragile: false,
      requireSignature: true,
      service: service || 'standard',
    },
  });
  
  // Price calculation
  const calculatePrice = () => {
    const basePrice = 15; // Base price for standard delivery
    
    // Service type multiplier
    let serviceMultiplier = 1;
    if (parcelData.parcel.service === 'express') serviceMultiplier = 1.5;
    if (parcelData.parcel.service === 'fragile') serviceMultiplier = 1.8;
    
    // Size multiplier
    let sizeMultiplier = 1;
    const packageSize = PACKAGE_SIZES.find(size => size.id === parcelData.parcel.packageSize);
    if (packageSize) sizeMultiplier = packageSize.priceModifier;
    
    // Weight calculation
    const weight = parseFloat(parcelData.parcel.weight) || 1;
    const weightMultiplier = weight <= 1 ? 1 : 1 + (weight - 1) * 0.1;
    
    // Additional options
    const fragileAddition = parcelData.parcel.isFragile ? 5 : 0;
    const signatureAddition = parcelData.parcel.requireSignature ? 2 : 0;
    
    return (basePrice * serviceMultiplier * sizeMultiplier * weightMultiplier + fragileAddition + signatureAddition).toFixed(2);
  };
  
  // Handle form updates
  const updatePickupField = (field: keyof ParcelData['pickup'], value: string | boolean) => {
    setParcelData({
      ...parcelData,
      pickup: {
        ...parcelData.pickup,
        [field]: value,
      },
    });
  };
  
  const updateDeliveryField = (field: keyof ParcelData['delivery'], value: string | boolean) => {
    setParcelData({
      ...parcelData,
      delivery: {
        ...parcelData.delivery,
        [field]: value,
      },
    });
  };
  
  const updateParcelField = (field: keyof ParcelData['parcel'], value: string | boolean) => {
    setParcelData({
      ...parcelData,
      parcel: {
        ...parcelData.parcel,
        [field]: value,
      },
    });
  };
  
  // Steps validation
  const isPickupValid = () => {
    const { name, phone, address, city } = parcelData.pickup;
    return name.trim() !== '' && phone.trim() !== '' && address.trim() !== '' && city.trim() !== '';
  };
  
  const isDeliveryValid = () => {
    const { name, phone, address, city } = parcelData.delivery;
    return name.trim() !== '' && phone.trim() !== '' && address.trim() !== '' && city.trim() !== '';
  };
  
  const isParcelDetailsValid = () => {
    const { description, packageSize } = parcelData.parcel;
    return description.trim() !== '' && packageSize.trim() !== '';
  };
  
  // Step handlers
  const handleNext = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };
  
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    } else {
      router.back();
    }
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // In a real app, you would submit to an API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a tracking number
      const trackingNumber = `GH${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      // Navigate to the confirmation/tracking page
      router.push({
        pathname: '/Parcel/tracking/[id]',
        params: { id: trackingNumber }
      });
    } catch (error) {
      console.error('Error creating parcel:', error);
      setLoading(false);
    }
  };
  
  // Render form steps
  const renderPickupForm = () => (
    <Animated.View 
      entering={FadeIn}
      className="p-4 bg-white rounded-2xl mb-4"
    >
      <Text className="text-lg font-bold text-gray-900 mb-4">Pickup Details</Text>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Sender's Name</Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-900"
          placeholder="Enter full name"
          value={parcelData.pickup.name}
          onChangeText={(text) => updatePickupField('name', text)}
        />
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Phone Number</Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-900"
          placeholder="e.g. 0241234567"
          keyboardType="phone-pad"
          value={parcelData.pickup.phone}
          onChangeText={(text) => updatePickupField('phone', text)}
        />
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Address</Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-900"
          placeholder="Enter street address"
          value={parcelData.pickup.address}
          onChangeText={(text) => updatePickupField('address', text)}
        />
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">City</Text>
        <View className="border border-gray-200 rounded-lg bg-gray-50 p-3">
          <TextInput
            className="text-gray-900"
            placeholder="Enter city name"
            value={parcelData.pickup.city}
            onChangeText={(text) => updatePickupField('city', text)}
          />
        </View>
      </View>
      
      <View className="mb-2">
        <Text className="text-gray-700 mb-1">Additional Instructions (Optional)</Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-900"
          placeholder="Any specific pickup instructions"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={parcelData.pickup.instructions}
          onChangeText={(text) => updatePickupField('instructions', text)}
        />
      </View>
    </Animated.View>
  );
  
  const renderDeliveryForm = () => (
    <Animated.View 
      entering={FadeIn}
      className="p-4 bg-white rounded-2xl mb-4"
    >
      <Text className="text-lg font-bold text-gray-900 mb-4">Delivery Details</Text>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Recipient's Name</Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-900"
          placeholder="Enter full name"
          value={parcelData.delivery.name}
          onChangeText={(text) => updateDeliveryField('name', text)}
        />
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Phone Number</Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-900"
          placeholder="e.g. 0241234567"
          keyboardType="phone-pad"
          value={parcelData.delivery.phone}
          onChangeText={(text) => updateDeliveryField('phone', text)}
        />
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Address</Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-900"
          placeholder="Enter street address"
          value={parcelData.delivery.address}
          onChangeText={(text) => updateDeliveryField('address', text)}
        />
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">City</Text>
        <View className="border border-gray-200 rounded-lg bg-gray-50 p-3">
          <TextInput
            className="text-gray-900"
            placeholder="Enter city name"
            value={parcelData.delivery.city}
            onChangeText={(text) => updateDeliveryField('city', text)}
          />
        </View>
      </View>
      
      <View className="mb-2">
        <Text className="text-gray-700 mb-1">Additional Instructions (Optional)</Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-900"
          placeholder="Any specific delivery instructions"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={parcelData.delivery.instructions}
          onChangeText={(text) => updateDeliveryField('instructions', text)}
        />
      </View>
    </Animated.View>
  );
  
  const renderParcelDetails = () => (
    <Animated.View 
      entering={FadeIn}
      className="p-4 bg-white rounded-2xl mb-4"
    >
      <Text className="text-lg font-bold text-gray-900 mb-4">Parcel Details</Text>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Package Size</Text>
        <View className="flex-row flex-wrap justify-between">
          {PACKAGE_SIZES.map((size) => (
            <TouchableOpacity
              key={size.id}
              className={`w-[48%] p-3 rounded-lg mb-2 border ${
                parcelData.parcel.packageSize === size.id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 bg-gray-50'
              }`}
              onPress={() => updateParcelField('packageSize', size.id)}
            >
              <Text className="text-center text-2xl mb-1">{size.icon}</Text>
              <Text className={`text-center font-medium ${
                parcelData.parcel.packageSize === size.id
                  ? 'text-primary'
                  : 'text-gray-900'
              }`}>
                {size.name}
              </Text>
              <Text className="text-center text-gray-500 text-xs">
                {size.dimensions}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Estimated Weight (kg)</Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-900"
          placeholder="Enter weight in kg"
          keyboardType="numeric"
          value={parcelData.parcel.weight}
          onChangeText={(text) => updateParcelField('weight', text)}
        />
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Parcel Description</Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-900"
          placeholder="Describe the contents of your parcel"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={parcelData.parcel.description}
          onChangeText={(text) => updateParcelField('description', text)}
        />
      </View>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Estimated Value (Optional)</Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-900"
          placeholder="Enter value in ₵"
          keyboardType="numeric"
          value={parcelData.parcel.value}
          onChangeText={(text) => updateParcelField('value', text)}
        />
      </View>
      
      <View className="mb-4">
        <Text className="text-lg font-bold text-gray-900 mb-3">Delivery Options</Text>
        
        <View className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="package-variant" size={24} color="#4F46E5" />
            <Text className="text-gray-900 ml-2">Fragile Handling</Text>
          </View>
          <Switch
            value={parcelData.parcel.isFragile}
            onValueChange={(value) => updateParcelField('isFragile', value)}
            trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
            thumbColor={parcelData.parcel.isFragile ? '#4F46E5' : '#9CA3AF'}
          />
        </View>
        
        <View className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
          <View className="flex-row items-center">
            <MaterialIcons name="verified-user" size={24} color="#4F46E5" />
            <Text className="text-gray-900 ml-2">Require Signature</Text>
          </View>
          <Switch
            value={parcelData.parcel.requireSignature}
            onValueChange={(value) => updateParcelField('requireSignature', value)}
            trackColor={{ false: '#D1D5DB', true: '#C7D2FE' }}
            thumbColor={parcelData.parcel.requireSignature ? '#4F46E5' : '#9CA3AF'}
          />
        </View>
        
        <Text className="text-gray-700 mb-2">Delivery Speed</Text>
        <View className="flex-row flex-wrap justify-between">
          <TouchableOpacity
            className={`w-[48%] p-3 rounded-lg border ${
              parcelData.parcel.service === 'standard'
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-200 bg-gray-50'
            }`}
            onPress={() => updateParcelField('service', 'standard')}
          >
            <View className="flex-row items-center mb-1">
              <FontAwesome5 name="truck" size={16} color="#F59E0B" />
              <Text className={`ml-2 font-medium ${
                parcelData.parcel.service === 'standard'
                  ? 'text-amber-700'
                  : 'text-gray-900'
              }`}>
                Standard
              </Text>
            </View>
            <Text className="text-gray-500 text-xs">2-3 days delivery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`w-[48%] p-3 rounded-lg border ${
              parcelData.parcel.service === 'express'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
            }`}
            onPress={() => updateParcelField('service', 'express')}
          >
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="bolt" size={18} color="#3B82F6" />
              <Text className={`ml-2 font-medium ${
                parcelData.parcel.service === 'express'
                  ? 'text-blue-700'
                  : 'text-gray-900'
              }`}>
                Express
              </Text>
            </View>
            <Text className="text-gray-500 text-xs">Same/next day</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
  
  const renderSummary = () => (
    <Animated.View 
      entering={FadeIn}
      className="bg-white rounded-2xl mb-4"
    >
      <View className="p-4 border-b border-gray-200">
        <Text className="text-lg font-bold text-gray-900 mb-1">Order Summary</Text>
        <Text className="text-gray-500">Review your parcel details before confirming</Text>
      </View>
      
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row items-start mb-4">
          <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
            <Ionicons name="location" size={24} color="#DB2777" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-gray-500 mb-1">Pickup From</Text>
            <Text className="text-gray-900 font-medium">{parcelData.pickup.name}</Text>
            <Text className="text-gray-900">{parcelData.pickup.phone}</Text>
            <Text className="text-gray-700">{parcelData.pickup.address}, {parcelData.pickup.city}</Text>
          </View>
        </View>
        
        <View className="flex-row items-start">
          <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
            <Ionicons name="location" size={24} color="#DB2777" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-gray-500 mb-1">Deliver To</Text>
            <Text className="text-gray-900 font-medium">{parcelData.delivery.name}</Text>
            <Text className="text-gray-900">{parcelData.delivery.phone}</Text>
            <Text className="text-gray-700">{parcelData.delivery.address}, {parcelData.delivery.city}</Text>
          </View>
        </View>
      </View>
      
      <View className="p-4 border-b border-gray-200">
        <Text className="font-medium text-gray-900 mb-3">Parcel Details</Text>
        
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700">Package Size:</Text>
          <Text className="text-gray-900">
            {PACKAGE_SIZES.find(s => s.id === parcelData.parcel.packageSize)?.name || 'Small'}
          </Text>
        </View>
        
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700">Weight:</Text>
          <Text className="text-gray-900">{parcelData.parcel.weight} kg</Text>
        </View>
        
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700">Description:</Text>
          <Text className="text-gray-900 text-right flex-1 ml-4">{parcelData.parcel.description}</Text>
        </View>
        
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700">Service:</Text>
          <Text className={`font-medium ${
            parcelData.parcel.service === 'express' ? 'text-blue-600' : 'text-amber-600'
          }`}>
            {parcelData.parcel.service === 'express' ? 'Express Delivery' : 'Standard Delivery'}
          </Text>
        </View>
        
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700">Fragile Handling:</Text>
          <Text className="text-gray-900">{parcelData.parcel.isFragile ? 'Yes' : 'No'}</Text>
        </View>
        
        <View className="flex-row justify-between">
          <Text className="text-gray-700">Signature Required:</Text>
          <Text className="text-gray-900">{parcelData.parcel.requireSignature ? 'Yes' : 'No'}</Text>
        </View>
      </View>
      
      <View className="p-4">
        <Text className="font-medium text-gray-900 mb-3">Payment Summary</Text>
        
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700">Delivery Fee:</Text>
          <Text className="text-gray-900">₵{calculatePrice()}</Text>
        </View>
        
        {parcelData.parcel.isFragile && (
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-700">Fragile Handling:</Text>
            <Text className="text-gray-900">Included</Text>
          </View>
        )}
        
        {parcelData.parcel.requireSignature && (
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-700">Signature Confirmation:</Text>
            <Text className="text-gray-900">Included</Text>
          </View>
        )}
        
        <View className="flex-row justify-between pt-2 mt-2 border-t border-gray-200">
          <Text className="font-bold text-gray-900">Total:</Text>
          <Text className="font-bold text-gray-900">₵{calculatePrice()}</Text>
        </View>
      </View>
    </Animated.View>
  );
  
  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top }} 
        className="bg-white px-4 pb-4 border-b border-gray-200"
      >
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity 
            onPress={handleBack}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900">
            {activeStep === 0 ? 'Pickup Details' : 
             activeStep === 1 ? 'Delivery Details' :
             activeStep === 2 ? 'Parcel Details' : 'Review Order'}
          </Text>
          <View className="w-10 h-10" />
        </View>
        
        {/* Progress Steps */}
        <View className="flex-row justify-between items-center px-3">
          {Array(4).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <View 
                  className={`flex-1 h-1 ${
                    index <= activeStep ? 'bg-primary' : 'bg-gray-200'
                  }`} 
                />
              )}
              <View 
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  index < activeStep 
                    ? 'bg-primary' 
                    : index === activeStep
                    ? 'bg-primary border-4 border-primary/20'
                    : 'bg-gray-200'
                }`}
              >
                {index < activeStep ? (
                  <Ionicons name="checkmark" size={16} color="white" />
                ) : (
                  <Text className={`text-sm ${
                    index === activeStep ? 'text-white' : 'text-gray-600'
                  }`}>
                    {index + 1}
                  </Text>
                )}
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>
      
      <ScrollView 
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {activeStep === 0 && renderPickupForm()}
        {activeStep === 1 && renderDeliveryForm()}
        {activeStep === 2 && renderParcelDetails()}
        {activeStep === 3 && renderSummary()}
        
        <View className="h-20" />
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View className="px-4 py-4 bg-white border-t border-gray-200">
        <View className="flex-row justify-between">
          {activeStep > 0 ? (
            <TouchableOpacity 
              className="flex-1 mr-2 py-3 bg-gray-100 rounded-xl items-center"
              onPress={handleBack}
            >
              <Text className="text-gray-700 font-medium">Back</Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-1 mr-2" />
          )}
          
          {activeStep < 3 ? (
            <TouchableOpacity 
              className={`flex-1 ml-2 py-3 rounded-xl items-center ${
                (activeStep === 0 && isPickupValid()) ||
                (activeStep === 1 && isDeliveryValid()) ||
                (activeStep === 2 && isParcelDetailsValid())
                  ? 'bg-primary'
                  : 'bg-gray-300'
              }`}
              onPress={handleNext}
              disabled={
                (activeStep === 0 && !isPickupValid()) ||
                (activeStep === 1 && !isDeliveryValid()) ||
                (activeStep === 2 && !isParcelDetailsValid())
              }
            >
              <Text className="text-white font-medium">Continue</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              className="flex-1 ml-2 py-3 bg-primary rounded-xl items-center"
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-medium">Place Order • ₵{calculatePrice()}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
