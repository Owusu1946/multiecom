import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthInput from '@/app/components/auth/AuthInput';
import StepIndicator from '@/app/components/auth/StepIndicator';
import SetupCompletion from '@/app/components/auth/SetupCompletion';

const STEPS = [
  'Business Information',
  'Contact Details',
  'Additional Info'
];

const BUSINESS_TYPES = [
  'Restaurant',
  'Retail Store',
  'Grocery Store',
  'Electronics',
  'Fashion',
  'Other'
] as const;

type BusinessType = typeof BUSINESS_TYPES[number];

export default function SellerProfileSetup() {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    businessType: '' as BusinessType,
    phone: '',
    email: '',
    description: '',
    website: ''
  });
  const [isCompleting, setIsCompleting] = useState(false);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <View className="items-center mb-8">
              <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="camera-outline" size={32} color="#666" />
              </View>
              <Text className="text-gray-500">Add Business Logo</Text>
            </View>

            <AuthInput
              icon="business-outline"
              placeholder="Business Name"
              value={formData.businessName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, businessName: text }))}
            />

            <View className="space-y-2 mt-4">
              <Text className="text-gray-600 text-base ml-1">Business Type</Text>
              <View className="flex-row flex-wrap gap-2">
                {BUSINESS_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setFormData(prev => ({ ...prev, businessType: type }))}
                    className={`px-4 py-2 rounded-full border ${
                      formData.businessType === type 
                        ? 'bg-primary border-primary' 
                        : 'border-gray-300'
                    }`}
                  >
                    <Text className={formData.businessType === type ? 'text-white' : 'text-gray-600'}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        );
      case 2:
        return (
          <>
            <AuthInput
              icon="call-outline"
              placeholder="Business Phone"
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
            />

            <AuthInput
              icon="mail-outline"
              placeholder="Business Email"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              style={{ marginTop: 16 }}
            />

            <AuthInput
              icon="location-outline"
              placeholder="Business Address"
              value={formData.businessAddress}
              onChangeText={(text) => setFormData(prev => ({ ...prev, businessAddress: text }))}
              style={{ marginTop: 16 }}
              numberOfLines={3}
              textAlignVertical="top"
            />
          </>
        );
      case 3:
        return (
          <>
            <AuthInput
              icon="globe-outline"
              placeholder="Website (Optional)"
              value={formData.website}
              onChangeText={(text) => setFormData(prev => ({ ...prev, website: text }))}
              keyboardType="email-address"
            />

            <AuthInput
              icon="document-text-outline"
              placeholder="Business Description"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              style={{ marginTop: 16, height: 120 }}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </>
        );
    }
  };

  const handleComplete = () => {
    setIsCompleting(true);
  };

  if (isCompleting) {
    return (
      <SetupCompletion 
        onComplete={() => {
          router.push({
            pathname: '/(seller)/dashboard',
            params: { setup: 'complete' }
          });
        }}
      />
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        <Animated.View 
          entering={FadeInUp.duration(1000).springify()}
          className="px-4 pt-8"
        >
          <StepIndicator currentStep={currentStep} steps={STEPS} />

          <Animated.View 
            entering={FadeInDown.duration(1000).springify()}
            className="space-y-4"
          >
            {renderStep()}
          </Animated.View>

          <View className="flex-row justify-between mt-8">
            {currentStep > 1 && (
              <TouchableOpacity 
                className="bg-gray-100 py-4 px-8 rounded-xl"
                onPress={() => setCurrentStep(prev => prev - 1)}
              >
                <Text className="font-semibold text-gray-600">Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              className={`bg-primary py-4 rounded-xl ${
                currentStep > 1 ? 'px-8 ml-auto' : 'w-full'
              }`}
              onPress={() => {
                if (currentStep < STEPS.length) {
                  setCurrentStep(prev => prev + 1);
                } else {
                  handleComplete();
                }
              }}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {currentStep === STEPS.length ? 'Complete Setup' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 