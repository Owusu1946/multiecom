import { View, Text, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

type ToastProps = {
  message: string;
  type?: 'success' | 'error';
  onHide: () => void;
};

export function Toast({ message, type = 'success', onHide }: ToastProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  }, []);

  return (
    <Animated.View 
      style={{ opacity: fadeAnim }}
      className="absolute top-10 left-4 right-4 bg-white rounded-2xl p-4 shadow-lg flex-row items-center"
    >
      <Ionicons 
        name={type === 'success' ? 'checkmark-circle' : 'alert-circle'} 
        size={24} 
        color={type === 'success' ? '#22C55E' : '#EF4444'} 
      />
      <Text className="ml-3 text-gray-900 font-medium flex-1">{message}</Text>
    </Animated.View>
  );
} 