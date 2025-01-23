import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import Animated from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { FadeIn } from 'react-native-reanimated';

type MethodType = 'momo' | 'bank';
type Provider = 'MTN MoMo' | 'Airtel Tigo Money' | 'Telecel Cash' | 'GCB Bank' | 'Ecobank';

interface MethodDetails {
  type: MethodType;
  provider: Provider;
  accountNumber: string;
  accountName: string;
  ghanaCardFront?: string;
  ghanaCardBack?: string;
}

export default function AddPaymentMethodScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<'type' | 'details' | 'verify'>('type');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [methodDetails, setMethodDetails] = useState<MethodDetails>({
    type: 'momo',
    provider: 'MTN MoMo',
    accountNumber: '',
    accountName: '',
  });

  const PROVIDERS = {
    momo: ['MTN MoMo', 'Airtel Tigo Money', 'Telecel Cash'],
    bank: ['GCB Bank', 'Ecobank']
  };

  const handleTakePhoto = async (side: 'front' | 'back') => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to verify your ID.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setMethodDetails(prev => ({
        ...prev,
        [side === 'front' ? 'ghanaCardFront' : 'ghanaCardBack']: result.assets[0].uri
      }));
    }
  };

  const handleSubmit = () => {
    setShowReviewModal(true);
    // After 3 seconds, navigate back
    setTimeout(() => {
      router.back();
    }, 3000);
  };

  const ReviewModal = () => (
    <Modal
      visible={showReviewModal}
      transparent
      animationType="fade"
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <Animated.View 
          entering={FadeIn}
          className="bg-white w-[90%] rounded-2xl p-6"
        >
          <View className="items-center py-6">
            <LottieView
              autoPlay
              style={{ width: 120, height: 120 }}
              source={require('@/assets/Onboarding/fast delivery.json')}
            />
            <Text className="text-xl font-semibold text-gray-900 mt-4">Under Review</Text>
            <Text className="text-gray-500 text-center mt-2">
              Your payment method is being reviewed. We'll notify you once it's approved.
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View 
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top }}
    >
      <ReviewModal />
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Add Payment Method</Text>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Steps */}
        <View className="flex-row justify-between mb-8">
          {['type', 'details', 'verify'].map((s, index) => (
            <View key={s} className="flex-1 flex-row items-center">
              <View className={`w-8 h-8 rounded-full items-center justify-center ${
                step === s ? 'bg-primary' : 
                index < ['type', 'details', 'verify'].indexOf(step) ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                <Text className="text-white font-medium">{index + 1}</Text>
              </View>
              {index < 2 && (
                <View className={`flex-1 h-1 ${
                  index < ['type', 'details', 'verify'].indexOf(step) ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </View>
          ))}
        </View>

        {step === 'type' && (
          <View className="space-y-4">
            <Text className="text-lg font-semibold mb-4">Select Payment Method Type</Text>
            <TouchableOpacity
              onPress={() => {
                setMethodDetails(prev => ({ ...prev, type: 'momo' }));
                setStep('details');
              }}
              className="bg-white p-4 rounded-xl flex-row items-center"
            >
              <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                <Ionicons name="phone-portrait-outline" size={24} color="#4F46E5" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-medium text-gray-900">Mobile Money</Text>
                <Text className="text-gray-500">MTN, Airtel Tigo, Telecel</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMethodDetails(prev => ({ ...prev, type: 'bank' }));
                setStep('details');
              }}
              className="bg-white p-4 rounded-xl flex-row items-center"
            >
              <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                <Ionicons name="card-outline" size={24} color="#4F46E5" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-medium text-gray-900">Bank Account</Text>
                <Text className="text-gray-500">GCB Bank, Ecobank</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}

        {step === 'details' && (
          <View className="space-y-6">
            <Text className="text-lg font-semibold">Enter Account Details</Text>
            
            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 mb-2">Select Provider</Text>
                <View className="space-y-2">
                  {PROVIDERS[methodDetails.type].map((provider) => (
                    <TouchableOpacity
                      key={provider}
                      onPress={() => setMethodDetails(prev => ({ ...prev, provider: provider as Provider }))}
                      className={`p-4 rounded-xl border ${
                        methodDetails.provider === provider ? 'border-primary bg-primary/5' : 'border-gray-200'
                      }`}
                    >
                      <Text className="font-medium">{provider}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text className="text-gray-700 mb-2">Account Number</Text>
                <TextInput
                  value={methodDetails.accountNumber}
                  onChangeText={(text) => setMethodDetails(prev => ({ ...prev, accountNumber: text }))}
                  className="bg-white p-4 rounded-xl border border-gray-200"
                  keyboardType="numeric"
                  placeholder={methodDetails.type === 'momo' ? "Enter phone number" : "Enter account number"}
                />
              </View>

              <View>
                <Text className="text-gray-700 mb-2">Account Name</Text>
                <TextInput
                  value={methodDetails.accountName}
                  onChangeText={(text) => setMethodDetails(prev => ({ ...prev, accountName: text }))}
                  className="bg-white p-4 rounded-xl border border-gray-200"
                  placeholder="Enter account name"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setStep('verify')}
              disabled={!methodDetails.provider || !methodDetails.accountNumber || !methodDetails.accountName}
              className={`py-3 rounded-xl ${
                !methodDetails.provider || !methodDetails.accountNumber || !methodDetails.accountName
                  ? 'bg-gray-200'
                  : 'bg-primary'
              }`}
            >
              <Text className="text-white text-center font-medium">Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'verify' && (
          <View className="space-y-6">
            <Text className="text-lg font-semibold">Verify Identity</Text>
            
            <View className="bg-yellow-50 p-4 rounded-xl">
              <Text className="text-yellow-800">
                Please ensure the name on your Ghana Card matches the account name provided: {methodDetails.accountName}
              </Text>
            </View>

            <View className="space-y-4">
              {/* Front of Ghana Card */}
              <View>
                <Text className="text-gray-700 mb-2">Front of Ghana Card</Text>
                {methodDetails.ghanaCardFront ? (
                  <View className="relative">
                    <Image
                      source={{ uri: methodDetails.ghanaCardFront }}
                      className="w-full aspect-[1.586] rounded-xl"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => handleTakePhoto('front')}
                      className="absolute bottom-2 right-2 bg-black/50 px-3 py-1 rounded-lg"
                    >
                      <Text className="text-white">Retake</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleTakePhoto('front')}
                    className="w-full aspect-[1.586] bg-gray-100 rounded-xl items-center justify-center"
                  >
                    <Ionicons name="camera" size={32} color="#6B7280" />
                    <Text className="text-gray-500 mt-2">Take photo of front</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Back of Ghana Card */}
              <View>
                <Text className="text-gray-700 mb-2">Back of Ghana Card</Text>
                {methodDetails.ghanaCardBack ? (
                  <View className="relative">
                    <Image
                      source={{ uri: methodDetails.ghanaCardBack }}
                      className="w-full aspect-[1.586] rounded-xl"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => handleTakePhoto('back')}
                      className="absolute bottom-2 right-2 bg-black/50 px-3 py-1 rounded-lg"
                    >
                      <Text className="text-white">Retake</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleTakePhoto('back')}
                    className="w-full aspect-[1.586] bg-gray-100 rounded-xl items-center justify-center"
                  >
                    <Ionicons name="camera" size={32} color="#6B7280" />
                    <Text className="text-gray-500 mt-2">Take photo of back</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!methodDetails.ghanaCardFront || !methodDetails.ghanaCardBack}
              className={`py-3 rounded-xl ${
                !methodDetails.ghanaCardFront || !methodDetails.ghanaCardBack
                  ? 'bg-gray-200'
                  : 'bg-primary'
              }`}
            >
              <Text className="text-white text-center font-medium">Submit for Review</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
} 