import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import AuthHeader from '@/app/components/auth/AuthHeader';
import OtpInput from '@/app/components/auth/OtpInput';
import SuccessModal from '@/app/components/auth/SuccessModal';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function OTP() {
  const { userType } = useLocalSearchParams<{ userType: string }>();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter a valid OTP');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(true);
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Route to appropriate profile setup based on user type
      switch (userType) {
        case 'Seller':
          router.push('/(seller)/profile-setup');
          break;
        case 'Rider':
          router.push('/(rider)/profile-setup');
          break;
        default:
          router.push('/(user)/profile-setup');
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      startTimer();
      setOtp(['', '', '', '']);
      setError('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-4">
      <SuccessModal 
        visible={showSuccess} 
        message="OTP Verified Successfully!"
      />
      
      <AnimatedTouchableOpacity 
        className="mt-12" 
        onPress={() => router.back()}
        entering={FadeInDown.delay(100)}
      >
        <Ionicons name="arrow-back" size={24} color="#666" />
      </AnimatedTouchableOpacity>

      <Animated.View 
        className="flex-1 justify-start pt-20"
        entering={FadeInUp.duration(1000).springify()}
      >
        <AuthHeader 
          title="Verify OTP"
          subtitle="Enter the 4-digit code we sent to your email"
        />

        <Animated.View 
          entering={FadeInDown.duration(1000).springify()}
          className="space-y-8 mt-8"
        >
          <OtpInput 
            otp={otp}
            setOtp={setOtp}
            error={!!error}
          />

          {error && (
            <Animated.Text 
              entering={FadeInDown}
              className="text-red-500 text-center"
            >
              {error}
            </Animated.Text>
          )}

          <TouchableOpacity 
            className={`bg-primary py-4 rounded-xl shadow-sm ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Verify & Continue
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center space-x-1">
            <Text className="text-gray-600">Didn't receive code?</Text>
            {timeLeft > 0 ? (
              <Text className="text-primary font-semibold">
                Wait {timeLeft}s
              </Text>
            ) : (
              <TouchableOpacity 
                onPress={handleResend}
                disabled={isLoading}
              >
                <Text className="text-primary font-semibold">
                  Resend
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
} 