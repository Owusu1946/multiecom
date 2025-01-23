import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const MENU_ITEMS = [
  {
    icon: 'bicycle-outline',
    label: 'My Vehicle',
    route: '/dashboard/vehicle',
  },
  {
    icon: 'wallet-outline',
    label: 'Earnings',
    route: '/dashboard/earnings',
  },
  {
    icon: 'time-outline',
    label: 'History',
    route: '/dashboard/history',
  },
  {
    icon: 'star-outline',
    label: 'Ratings & Reviews',
    route: '/dashboard/ratings',
  },
  {
    icon: 'settings-outline',
    label: 'Settings',
    route: '/dashboard/settings',
  },
  {
    icon: 'help-circle-outline',
    label: 'Support',
    route: '/(rider)/dashboard/support',
  },
  {
    icon: 'wallet-outline',
    label: 'Payments',
    route: '/dashboard/payments',
  }
];

export default function RiderMenuDrawer({ isVisible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route);
  };

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 z-50">
      <BlurView 
        intensity={20}
        className="absolute inset-0"
        onTouchStart={onClose}
      />
      
      <Animated.View
        className="absolute top-0 left-0 bottom-0 w-[280px] bg-white"
        style={{
          transform: [{ translateX: slideAnim }],
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <View className="flex-1 px-6">
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-gray-100 rounded-full mb-3" />
            <Text className="text-lg font-semibold">John Doe</Text>
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text className="text-gray-500 text-sm ml-1">4.8 Rating</Text>
            </View>
          </View>

          <View className="space-y-1">
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.label}
                className="flex-row items-center p-4 rounded-xl active:bg-gray-50"
                onPress={() => handleNavigation(item.route)}
              >
                <Ionicons name={item.icon as any} size={24} color="#374151" />
                <Text className="ml-3 text-gray-700">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          className="flex-row items-center p-4 mx-6 mb-4"
          onPress={() => router.push('/(auth)/login')}
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text className="ml-3 text-red-500">Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
} 