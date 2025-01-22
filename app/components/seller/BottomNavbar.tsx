import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ROUTES = [
  {
    name: 'Home',
    icon: 'home-outline',
    active: 'home',
    href: '/(seller)/dashboard',
    pattern: /^\/\(seller\)\/dashboard$/,
  },
  {
    name: 'Products',
    icon: 'grid-outline',
    active: 'grid',
    href: '/(seller)/dashboard/products',
    pattern: /^\/\(seller\)\/dashboard\/products/,
    badge: 2, // New products requiring attention
  },
  {
    name: 'Add',
    icon: 'add',
    active: 'add',
    href: '/(seller)/dashboard/add-product',
    pattern: /^\/\(seller\)\/dashboard\/add-product/,
    special: true,
  },
  {
    name: 'Orders',
    icon: 'cart-outline',
    active: 'cart',
    href: '/(seller)/dashboard/orders',
    pattern: /^\/\(seller\)\/dashboard\/orders/,
    badge: 5, // New orders count
  },
  {
    name: 'Analytics',
    icon: 'bar-chart-outline',
    active: 'bar-chart',
    href: '/(seller)/dashboard/analytics',
    pattern: /^\/\(seller\)\/dashboard\/analytics/,
  },
] as const;

export default function BottomNavbar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const isRouteActive = (pattern: RegExp) => pattern.test(pathname);

  return (
    <View 
      className="bg-white border-t border-gray-200 pt-2 pb-2 px-6"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="flex-row justify-between items-center">
        {ROUTES.map((route) => {
          const isActive = isRouteActive(route.pattern);
          
          if (route.special) {
            return (
              <TouchableOpacity
                key={route.name}
                className="items-center -mt-8"
                onPress={() => router.push(route.href)}
              >
                <View className="w-14 h-14 bg-[#22C55E] rounded-full items-center justify-center shadow-lg">
                  <Ionicons 
                    name={route.icon as any}
                    size={32} 
                    color="white"
                  />
                </View>
                <Text className="text-xs mt-1 text-gray-500">
                  {route.name}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.name}
              className="items-center"
              onPress={() => router.push(route.href)}
            >
              <View className="relative">
                <Ionicons 
                  name={isActive ? (route.active as any) : (route.icon as any)} 
                  size={24} 
                  color={isActive ? '#22C55E' : '#6B7280'} 
                />
                {route.badge && (
                  <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[16px] h-4 items-center justify-center px-1">
                    <Text className="text-white text-xs font-bold">
                      {route.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text 
                className={`text-xs mt-1 ${
                  isActive ? 'text-[#22C55E]' : 'text-gray-500'
                }`}
              >
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}