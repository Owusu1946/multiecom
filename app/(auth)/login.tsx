import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

import AuthHeader from '@/app/components/auth/AuthHeader';
import AuthInput from '@/app/components/auth/AuthInput';
import SocialLogin from '@/app/components/auth/SocialLogin';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  return (
    <View className="flex-1 bg-white px-4">
      <Animated.View className="flex-1 justify-center">
        <AuthHeader 
          title="Welcome Back"
          subtitle="Sign in to continue shopping"
        />

        <Animated.View 
          entering={FadeInDown.duration(1000).springify()}
          className="space-y-4"
        >
          <AuthInput
            icon="mail-outline"
            placeholder="Email Address"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
          />

          <AuthInput
            icon="lock-closed-outline"
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            secureTextEntry={!showPassword}
            showPasswordToggle
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <Link href="/forgot-password" asChild>
            <Text className="text-primary text-right">Forgot Password?</Text>
          </Link>

          <TouchableOpacity className="bg-primary py-4 rounded-xl mt-6">
            <Text className="text-white text-center font-semibold text-lg">
              Login
            </Text>
          </TouchableOpacity>

          <SocialLogin />

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Don't have an account? </Text>
            <Link href="/signup" className="text-primary font-semibold">
              Sign Up
            </Link>
            <Link href="/onboarding" className="text-primary font-semibold">
              See Onboarding
            </Link>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
} 