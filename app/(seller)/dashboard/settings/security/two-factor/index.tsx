import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import { router } from 'expo-router';

export default function TwoFactorScreen() {
  const insets = useSafeAreaInsets();
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [qrCode] = useState('ABCDEF123456'); // This would come from your backend

  const handleVerify = () => {
    if (verificationCode.length === 6) {
      // Verify code with backend
      setStep('verify');
      router.back();
    }
  };

  return (
    <View 
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInUp}
          className="bg-white p-6 rounded-2xl"
        >
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-4">
              <Ionicons name="shield-checkmark-outline" size={32} color="#22C55E" />
            </View>
            <Text className="text-2xl font-bold text-center">
              Two-Factor Authentication
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Enhance your account security
            </Text>
          </View>

          <View className="space-y-6">
            <View>
              <Text className="font-semibold mb-2">1. Install an authenticator app</Text>
              <Text className="text-gray-600">
                Download Google Authenticator or any other 2FA app from your app store.
              </Text>
            </View>

            <View>
              <Text className="font-semibold mb-2">2. Scan QR code or enter key</Text>
              <View className="bg-gray-100 p-4 rounded-xl items-center">
                <Text className="font-mono text-lg mb-2">{qrCode}</Text>
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons name="copy-outline" size={20} color="#22C55E" />
                  <Text className="text-primary ml-2">Copy Code</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="font-semibold mb-2">3. Enter verification code</Text>
              <TextInput
                value={verificationCode}
                onChangeText={setVerificationCode}
                placeholder="Enter 6-digit code"
                keyboardType="number-pad"
                maxLength={6}
                className="bg-gray-100 p-4 rounded-xl text-center text-lg font-mono"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleVerify}
            className="bg-primary mt-8 py-4 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              Verify & Enable
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 