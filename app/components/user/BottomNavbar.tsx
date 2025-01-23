import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, router } from 'expo-router';

const TABS = [
  {
    name: 'Home',
    icon: 'home',
    activeIcon: 'home',
    path: '/(user)/dashboard',
  },
  {
    name: 'Favourite',
    icon: 'heart-outline',
    activeIcon: 'heart',
    path: '/(user)/favourites',
  },
  {
    name: 'Orders',
    icon: 'cart-outline',
    activeIcon: 'cart',
    path: '/(user)/orders',
  },
  {
    name: 'Menu',
    icon: 'menu-outline',
    activeIcon: 'menu',
    path: '/(user)/menu',
  },
];

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <View className="flex-row items-center justify-between bg-white px-6 py-2 border-t border-gray-100">
      {TABS.map((tab) => {
        const isActive = pathname.includes(tab.path);
        const isCart = tab.name === 'Orders';

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(tab.path)}
            className="items-center"
          >
            {isCart ? (
              <View className="relative">
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={24}
                  color={isActive ? '#22C55E' : '#6B7280'}
                />
                <View className="absolute -top-2 -right-2 w-5 h-5 bg-[#22C55E] rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">2</Text>
                </View>
              </View>
            ) : (
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={24}
                color={isActive ? '#22C55E' : '#6B7280'}
              />
            )}
            <Text className={`text-xs mt-1 ${isActive ? 'text-[#22C55E]' : 'text-gray-500'}`}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
} 