import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import AuthHeader from '@/app/components/auth/AuthHeader';
import AuthInput from '@/app/components/auth/AuthInput';
import SocialLogin from '@/app/components/auth/SocialLogin';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const USER_TYPES = ['User', 'Seller', 'Rider'] as const;
type UserType = typeof USER_TYPES[number];

export default function Signup() {
  const [userType, setUserType] = useState<UserType>('User');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });

  return (
    <ScrollView className="flex-1 bg-white">
      <Animated.View 
        entering={FadeInUp.duration(1000).springify()}
        className="px-4 pt-12 pb-8"
      >
        <Image 
          source={require('../../assets/images/adaptive-icon.png')}
          className="w-24 h-24 self-center mb-6"
          resizeMode="contain"
        />
        <Text className="text-4xl font-bold text-center mb-2">
          Create Account
        </Text>
        <Text className="text-gray-500 text-center text-lg mb-8">
          Join our community and start shopping
        </Text>
        
        {/* Enhanced User Type Selection */}
        <View className="mb-8">
          <Text className="text-gray-600 text-lg mb-4 font-medium">I want to:</Text>
          <View className="flex-row justify-between">
            {USER_TYPES.map((type, index) => (
              <AnimatedTouchableOpacity
                key={type}
                entering={FadeInDown.delay(index * 100)}
                onPress={() => setUserType(type)}
                className={`w-[31%] py-4 px-2 rounded-2xl items-center justify-center space-y-2 ${
                  userType === type ? 'bg-primary/10' : 'bg-gray-50'
                }`}
                style={{
                  borderWidth: 2,
                  borderColor: userType === type ? '#007AFF' : 'transparent',
                }}
              >
                <Ionicons 
                  name={
                    type === 'User' 
                      ? 'cart-outline' 
                      : type === 'Seller' 
                      ? 'business-outline' 
                      : 'bicycle-outline'
                  }
                  size={24}
                  color={userType === type ? '#007AFF' : '#666'}
                />
                <Text 
                  className={`${
                    userType === type ? 'text-primary font-semibold' : 'text-gray-600'
                  } text-center`}
                >
                  {type}
                </Text>
              </AnimatedTouchableOpacity>
            ))}
          </View>
        </View>

        {/* Enhanced Form Fields */}
        <Animated.View 
          entering={FadeInUp.duration(1000).springify()}
          className="space-y-4"
        >
          <AuthInput
            icon="person-outline"
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
          />

          <AuthInput
            icon="mail-outline"
            placeholder="Email Address"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
          />

          <AuthInput
            icon="call-outline"
            placeholder="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
            keyboardType="phone-pad"
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
          
          <Link 
            href={{
              pathname: '/(auth)/otp',
              params: { userType }
            }} 
            asChild
          >
            <TouchableOpacity 
              className="bg-primary py-4 rounded-2xl mt-6 shadow-sm"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Create Account
              </Text>
            </TouchableOpacity>
          </Link>

          <View className="flex-row items-center my-8">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="mx-4 text-gray-500 font-medium">or continue with</Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          <View className="flex-row justify-center space-x-6">
            <TouchableOpacity className="w-16 h-16 border-2 border-gray-100 rounded-full items-center justify-center bg-gray-50">
              <Ionicons name="logo-google" size={28} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity className="w-16 h-16 border-2 border-gray-100 rounded-full items-center justify-center bg-gray-50">
              <Ionicons name="logo-apple" size={28} color="#666" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600 text-base">Already have an account? </Text>
            <Link href="/login" className="text-primary font-semibold text-base">
              Login
            </Link>
          </View>
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
} 