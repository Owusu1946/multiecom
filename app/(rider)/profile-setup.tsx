import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AuthInput from '@/app/components/auth/AuthInput';
import StepIndicator from '@/app/components/auth/StepIndicator';
import SetupCompletion from '@/app/components/auth/SetupCompletion';
import BikeAssignmentFlow from '@/app/components/rider/BikeAssignmentFlow';

const STEPS = [
  'Personal Information',
  'Vehicle Details',
  'Documents'
] as const;

type BikeType = 'company' | 'personal';

type VehicleType = {
  id: string;
  name: string;
  description: string;
  icon: any;
};

const VEHICLE_TYPES: VehicleType[] = [
  {
    id: 'motorcycle',
    name: 'Motorcycle',
    description: 'Ideal for quick deliveries',
    icon: 'bicycle-outline',
  },
  {
    id: 'bicycle',
    name: 'Bicycle',
    description: 'Eco-friendly option',
    icon: 'bicycle',
  },
];

export default function RiderProfileSetup() {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bikeType, setBikeType] = useState<BikeType | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    licenseNumber: '',
    vehicleRegistration: '',
    insuranceNumber: '',
  });
  const [documents, setDocuments] = useState({
    license: null as string | null,
    insurance: null as string | null,
    registration: null as string | null,
  });
  const [isCompleting, setIsCompleting] = useState(false);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleDocumentPick = async (type: keyof typeof documents) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setDocuments(prev => ({ ...prev, [type]: result.assets[0].uri }));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Animated.View 
            entering={FadeInDown}
            className="space-y-6"
          >
            <View className="items-center">
              <TouchableOpacity 
                onPress={handleImagePick}
                className="relative"
              >
                <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center">
                  {profileImage ? (
                    <Image 
                      source={{ uri: profileImage }}
                      className="w-24 h-24 rounded-full"
                    />
                  ) : (
                    <Ionicons name="person-outline" size={40} color="#9CA3AF" />
                  )}
                </View>
                <View className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center">
                  <Ionicons name="camera" size={18} color="white" />
                </View>
              </TouchableOpacity>
            </View>

            <AuthInput
              icon="person-outline"
              placeholder="Full Name"
              value={formData.fullName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
            />

            <AuthInput
              icon="call-outline"
              placeholder="Phone Number"
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
            />

            <AuthInput
              icon="location-outline"
              placeholder="Address"
              value={formData.address}
              onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
            />
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View 
            entering={FadeInDown}
            className="space-y-6"
          >
            <Text className="text-lg font-semibold mb-2">Choose Bike Type</Text>
            
            <View className="space-y-4">
              <TouchableOpacity
                onPress={() => setBikeType('company')}
                className={`p-4 rounded-xl border-2 ${
                  bikeType === 'company' ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                    <Ionicons name="business-outline" size={24} color="#4F46E5" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-semibold text-gray-900">Company Bike</Text>
                    <Text className="text-gray-500 text-sm">Use our company's bike for deliveries</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setBikeType('personal')}
                className={`p-4 rounded-xl border-2 ${
                  bikeType === 'personal' ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                    <Ionicons name="bicycle" size={24} color="#4F46E5" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-semibold text-gray-900">Personal Bike</Text>
                    <Text className="text-gray-500 text-sm">Use your own bike for deliveries</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {bikeType === 'personal' && (
              <View className="space-y-4 mt-6">
                <Text className="text-lg font-semibold">Vehicle Type</Text>
                {VEHICLE_TYPES.map((vehicle) => (
                  <TouchableOpacity
                    key={vehicle.id}
                    onPress={() => setSelectedVehicle(vehicle.id)}
                    className={`p-4 rounded-xl border-2 ${
                      selectedVehicle === vehicle.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                        <Ionicons name={vehicle.icon} size={24} color="#4F46E5" />
                      </View>
                      <View className="ml-3">
                        <Text className="font-semibold text-gray-900">{vehicle.name}</Text>
                        <Text className="text-gray-500 text-sm">{vehicle.description}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View 
            entering={FadeInDown}
            className="space-y-6"
          >
            <Text className="text-lg font-semibold mb-2">Required Documents</Text>

            <View className="space-y-4">
              <TouchableOpacity
                onPress={() => handleDocumentPick('license')}
                className="p-4 rounded-xl border-2 border-gray-200"
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                    <Ionicons name="card-outline" size={24} color="#4F46E5" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-semibold text-gray-900">Driver's License</Text>
                    <Text className="text-gray-500 text-sm">Upload your valid driver's license</Text>
                  </View>
                  {documents.license && (
                    <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                  )}
                </View>
              </TouchableOpacity>

              {bikeType === 'personal' && (
                <>
                  <TouchableOpacity
                    onPress={() => handleDocumentPick('registration')}
                    className="p-4 rounded-xl border-2 border-gray-200"
                  >
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                        <Ionicons name="document-text-outline" size={24} color="#4F46E5" />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="font-semibold text-gray-900">Vehicle Registration</Text>
                        <Text className="text-gray-500 text-sm">Upload vehicle registration document</Text>
                      </View>
                      {documents.registration && (
                        <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                      )}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDocumentPick('insurance')}
                    className="p-4 rounded-xl border-2 border-gray-200"
                  >
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                        <Ionicons name="shield-checkmark-outline" size={24} color="#4F46E5" />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="font-semibold text-gray-900">Insurance</Text>
                        <Text className="text-gray-500 text-sm">Upload vehicle insurance document</Text>
                      </View>
                      {documents.insurance && (
                        <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                      )}
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  if (isCompleting) {
    return (
      <SetupCompletion 
        type="rider"
        onComplete={() => {
          router.push({
            pathname: '/(rider)/dashboard',
            params: { setup: 'complete' }
          });
        }}
      />
    );
  }

  if (bikeType === 'company' && currentStep === STEPS.length) {
    return (
      <BikeAssignmentFlow 
        onComplete={() => {
          setIsCompleting(true);
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
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <StepIndicator currentStep={currentStep} steps={STEPS} />
        
        {renderStep()}

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
                setIsCompleting(true);
              }
            }}
          >
            <Text className="text-white text-center font-semibold">
              {currentStep === STEPS.length ? 'Complete Setup' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 