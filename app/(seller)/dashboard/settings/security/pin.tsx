import { View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeOut, 
  SlideInRight, 
  SlideOutLeft,
  withSpring,
  useAnimatedStyle,
  withSequence,
  withTiming,
  useSharedValue
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PINSetupScreen() {
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const shake = useSharedValue(0);

  const handleNumberPress = (number: string) => {
    if (step === 'create' && pin.length < 4) {
      setPin(prev => prev + number);
    } else if (step === 'confirm' && confirmPin.length < 4) {
      setConfirmPin(prev => prev + number);
    }
  };

  const handleDelete = () => {
    if (step === 'create') {
      setPin(prev => prev.slice(0, -1));
    } else {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  };

  const shakeAnimation = () => {
    shake.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(shake.value) }],
  }));

  const handlePinComplete = () => {
    if (step === 'create' && pin.length === 4) {
      setStep('confirm');
    } else if (step === 'confirm' && confirmPin.length === 4) {
      if (pin === confirmPin) {
        Alert.alert('Success', 'PIN has been set successfully');
        router.back();
      } else {
        shakeAnimation();
        Alert.alert('Error', 'PINs do not match. Please try again.');
        setPin('');
        setConfirmPin('');
        setStep('create');
      }
    }
  };

  useEffect(() => {
    if (pin.length === 4 || confirmPin.length === 4) {
      handlePinComplete();
    }
  }, [pin, confirmPin]);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <TouchableOpacity 
        onPress={() => router.back()}
        className="absolute left-6 top-6 z-10"
      >
        <Ionicons name="arrow-back" size={24} color="#374151" />
      </TouchableOpacity>

      <Animated.View 
        entering={FadeInDown}
        className="flex-1 justify-center px-6"
      >
        <Animated.Text 
          entering={SlideInRight}
          exiting={SlideOutLeft}
          className="text-2xl font-bold text-center mb-2"
        >
          {step === 'create' ? 'Create PIN' : 'Confirm PIN'}
        </Animated.Text>
        <Text className="text-gray-500 text-center mb-8">
          {step === 'create' 
            ? 'Enter a 4-digit PIN to secure your app'
            : 'Re-enter your PIN to confirm'
          }
        </Text>

        <Animated.View 
          style={animatedStyle}
          className="flex-row justify-center mb-8"
        >
          {Array(4).fill(0).map((_, i) => (
            <View
              key={i}
              className={`w-4 h-4 mx-2 rounded-full ${
                (step === 'create' ? pin.length : confirmPin.length) > i
                  ? 'bg-[#22C55E]'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </Animated.View>

        <View className="px-6">
          <View className="flex-row flex-wrap justify-between">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'delete'].map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (item === 'delete') {
                    handleDelete();
                  } else if (item !== '') {
                    handleNumberPress(item.toString());
                  }
                }}
                className={`w-${SCREEN_WIDTH / 5} h-${SCREEN_WIDTH / 5} items-center justify-center mb-4`}
              >
                {item === 'delete' ? (
                  <Ionicons name="backspace-outline" size={24} color="#EF4444" />
                ) : item !== '' ? (
                  <Text className="text-2xl font-semibold">{item}</Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
    </View>
  );
} 