import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

type ToastProps = {
  message: string;
  type?: 'success' | 'error';
  onHide: () => void;
  duration?: number;
};

export function Toast({ message, type = 'success', onHide, duration = 4000 }: ToastProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // First animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Then set timeout to animate out
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }, duration);

    return () => clearTimeout(timer);
  }, [fadeAnim, translateYAnim, onHide, duration]);

  return (
    <Animated.View 
      style={{ 
        opacity: fadeAnim,
        transform: [{ translateY: translateYAnim }],
        zIndex: 9999,
      }}
      className="absolute top-16 left-4 right-4 bg-white rounded-2xl p-4 shadow-lg"
    >
      <TouchableOpacity 
        onPress={onHide}
        activeOpacity={0.9}
        className="flex-row items-center"
      >
        <View className={`w-10 h-10 rounded-full items-center justify-center ${
          type === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <Ionicons 
            name={type === 'success' ? 'checkmark-circle' : 'alert-circle'} 
            size={24} 
            color={type === 'success' ? '#22C55E' : '#EF4444'} 
          />
        </View>
        <Text className="ml-3 text-gray-900 font-medium flex-1">{message}</Text>
        <Ionicons name="close" size={20} color="#6B7280" />
      </TouchableOpacity>
    </Animated.View>
  );
} 