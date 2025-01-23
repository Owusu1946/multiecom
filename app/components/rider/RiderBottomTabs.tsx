import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

const TABS = [
  {
    name: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
    path: '/dashboard'
  },
  {
    name: 'Earnings',
    icon: 'wallet-outline',
    activeIcon: 'wallet',
    path: '/dashboard/earnings'
  },
  {
    name: 'Orders',
    icon: 'package',
    activeIcon: 'package',
    path: '/dashboard/orders',
    primary: true
  },
  {
    name: 'History',
    icon: 'time-outline',
    activeIcon: 'time',
    path: '/dashboard/history'
  },
  {
    name: 'Support',
    icon: 'headset',
    activeIcon: 'headset',
    path: '/dashboard/support'
  }
];

export default function RiderBottomTabs() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="bg-white border-t border-gray-200"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="flex-row justify-around items-center">
        {TABS.map((tab) => {
          const isActive = pathname === tab.path;
          
          if (tab.primary) {
            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => router.push(tab.path)}
                className="bg-primary -mt-5 p-4 rounded-full shadow-lg"
              >
                <Feather
                  name={isActive ? tab.activeIcon as any : tab.icon as any}
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => router.push(tab.path)}
              className="py-2 px-4 items-center"
            >
              <Ionicons
                name={isActive ? tab.activeIcon as any : tab.icon as any}
                size={24}
                color={isActive ? '#4F46E5' : '#6B7280'}
              />
              <Text 
                className={`text-xs mt-1 ${
                  isActive ? 'text-primary font-medium' : 'text-gray-500'
                }`}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
} 