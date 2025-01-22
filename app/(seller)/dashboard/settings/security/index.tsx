import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SecurityOption = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  type: 'toggle' | 'button';
  value?: boolean;
  onPress?: () => void;
};

export default function SecurityScreen() {
  const insets = useSafeAreaInsets();
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
  const [securityOptions, setSecurityOptions] = useState<SecurityOption[]>([
    {
      id: 'pin',
      title: 'App PIN',
      description: 'Secure your app with a 4-digit PIN',
      icon: 'keypad-outline',
      color: '#4F46E5',
      type: 'button',
      onPress: () => router.push('/dashboard/settings/security/pin'),
    },
    {
      id: 'biometrics',
      title: 'Biometric Authentication',
      description: 'Use fingerprint or face recognition',
      icon: 'finger-print-outline',
      color: '#22C55E',
      type: 'toggle',
      value: isBiometricsEnabled,
    },
    {
      id: 'twoFactor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security',
      icon: 'shield-checkmark-outline',
      color: '#F59E0B',
      type: 'toggle',
      value: false,
    },
    {
      id: 'sessions',
      title: 'Active Sessions',
      description: 'Manage your logged-in devices',
      icon: 'phone-portrait-outline',
      color: '#8B5CF6',
      type: 'button',
      onPress: () => router.push('/dashboard/settings/security/sessions'),
    },
    {
      id: 'password',
      title: 'Change Password',
      description: 'Update your account password',
      icon: 'lock-closed-outline',
      color: '#EF4444',
      type: 'button',
      onPress: () => router.push('/dashboard/settings/security/password'),
    },
  ]);

  useEffect(() => {
    checkBiometrics();
    loadBiometricsState();
  }, []);

  const checkBiometrics = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setHasBiometrics(compatible && enrolled);
    } catch (error) {
      console.error('Error checking biometrics:', error);
      setHasBiometrics(false);
    }
  };

  const loadBiometricsState = async () => {
    try {
      const enabled = await AsyncStorage.getItem('biometricsEnabled');
      setIsBiometricsEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error loading biometrics state:', error);
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (!hasBiometrics) {
      Alert.alert(
        'Not Available',
        'Biometric authentication is not available on your device or no biometrics are enrolled.'
      );
      return;
    }

    if (value) {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable biometric login',
          fallbackLabel: 'Use PIN',
        });

        if (result.success) {
          await AsyncStorage.setItem('biometricsEnabled', 'true');
          setIsBiometricsEnabled(true);
          Alert.alert('Success', 'Biometric authentication has been enabled');
        }
      } catch (error) {
        console.error('Error enabling biometrics:', error);
        Alert.alert('Error', 'Failed to enable biometric authentication');
      }
    } else {
      await AsyncStorage.setItem('biometricsEnabled', 'false');
      setIsBiometricsEnabled(false);
      Alert.alert('Success', 'Biometric authentication has been disabled');
    }
  };

  const updateSecurityOption = async (optionId: string, value: boolean) => {
    setSecurityOptions(prev => 
      prev.map(option => 
        option.id === optionId 
          ? { ...option, value }
          : option
      )
    );

    // Handle specific option updates
    switch (optionId) {
      case 'twoFactor':
        if (value) {
          router.push('/dashboard/settings/security/two-factor');
        }
        break;
      // Add other cases as needed
    }
  };

  const handleOptionPress = (option: SecurityOption) => {
    if (option.type === 'toggle') {
      if (option.id === 'biometrics') {
        handleBiometricToggle(!option.value);
      } else {
        updateSecurityOption(option.id, !option.value);
      }
    } else if (option.onPress) {
      option.onPress();
    }
  };

  useEffect(() => {
    setSecurityOptions(prev => 
      prev.map(option => 
        option.id === 'biometrics' 
          ? { ...option, value: isBiometricsEnabled }
          : option
      )
    );
  }, [isBiometricsEnabled]);

  return (
    <View 
      className="flex-1 bg-gray-50"
      style={{ 
        paddingTop: insets.top,
        paddingBottom: insets.bottom 
      }}
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-6">
          {securityOptions.map((option, index) => (
            <Animated.View
              key={option.id}
              entering={FadeInUp.delay(index * 100)}
              className="bg-white p-4 rounded-2xl"
            >
              <TouchableOpacity
                onPress={() => handleOptionPress(option)}
                className="flex-row items-center"
              >
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${option.color}15` }}
                >
                  <Ionicons 
                    name={option.icon as any}
                    size={24}
                    color={option.color}
                  />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="font-semibold text-gray-900">
                    {option.title}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    {option.description}
                  </Text>
                </View>
                {option.type === 'toggle' ? (
                  <Switch
                    value={option.value}
                    onValueChange={(value) => handleOptionPress({...option, value})}
                    disabled={option.id === 'biometrics' && !hasBiometrics}
                    trackColor={{ false: '#D1D5DB', true: '#22C55E' }}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={option.onPress}
                    className="bg-gray-100 p-2 rounded-full"
                  >
                    <Ionicons 
                      name="chevron-forward" 
                      size={20} 
                      color="#374151" 
                    />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 