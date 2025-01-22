import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const MENU_ITEMS = [
  {
    icon: 'ticket-outline',
    label: 'Coupons',
    route: '/dashboard/coupons',
  },
  {
    icon: 'people-outline',
    label: 'Customers',
    route: '/dashboard/customers',
  },
  {
    icon: 'pricetags-outline',
    label: 'Promotions',
    route: '/dashboard/promotions',
  },
  {
    icon: 'wallet-outline',
    label: 'Finances',
    route: '/dashboard/transactions',
  },
  {
    icon: 'settings-outline',
    label: 'Settings',
    route: '/dashboard/settings',
  },
  {
    icon: 'help-circle-outline',
    label: 'Support',
    route: '/dashboard/support',
  },
] as const;

export function MenuDrawer({ isVisible, onClose }: Props) {
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
      <TouchableOpacity 
        className="absolute inset-0 bg-black/50" 
        onPress={onClose}
        activeOpacity={0.7}
      />
      <Animated.View 
        className="absolute left-0 top-0 bottom-0 w-72 bg-white"
        style={{ 
          transform: [{ translateX: slideAnim }],
          paddingTop: insets.top,
          paddingBottom: insets.bottom
        }}
      >
        <View className="flex-1 px-6">
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-gray-100 rounded-full mb-3" />
            <Text className="text-lg font-semibold">Store Name</Text>
            <Text className="text-gray-500 text-sm">store@email.com</Text>
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