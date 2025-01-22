import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import DashboardHeader from '@/app/components/seller/DashboardHeader';
import { LineChart } from 'react-native-chart-kit';
import { useState } from 'react';

const NOTIFICATIONS = [
  { 
    type: 'order',
    title: 'New Order',
    message: 'Order #1234 needs confirmation',
    time: '2 mins ago',
    icon: 'cart-outline',
    color: '#4F46E5'
  },
  {
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'iPhone 13 Pro Max is running low',
    time: '1 hour ago',
    icon: 'alert-circle-outline',
    color: '#EF4444'
  },
  {
    type: 'review',
    title: 'New Review',
    message: 'You received a 5-star review',
    time: '3 hours ago',
    icon: 'star-outline',
    color: '#F59E0B'
  },
] as const;

const TOP_PRODUCTS = [
  {
    id: 1,
    name: 'iPhone 13 Pro Max',
    sales: 124,
    revenue: 154999,
    image: require('@/assets/images/adaptive-icon.png'),
  },
  {
    id: 2,
    name: 'MacBook Pro M1',
    sales: 89,
    revenue: 234999,
    image: require('@/assets/images/adaptive-icon.png'),
  },
] as const;

export default function DashboardHome() {
  const insets = useSafeAreaInsets();
  const [showFilter, setShowFilter] = useState(false);

  return (
    <View className="flex-1 bg-gray-50">
      <DashboardHeader />
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Sales Summary */}
        <View className="px-6 mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold">Sales Summary</Text>
            <TouchableOpacity 
              onPress={() => setShowFilter(true)}
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="filter" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-4 mb-6">
            <Animated.View 
              entering={FadeInUp.delay(200)}
              className="flex-1 bg-white p-4 rounded-2xl shadow-sm"
            >
              <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mb-2">
                <Ionicons name="cash-outline" size={20} color="#22C55E" />
              </View>
              <Text className="text-gray-500 text-sm">Revenue</Text>
              <Text className="text-xl font-bold mt-1">$12,450</Text>
              <Text className="text-green-500 text-xs">+12.5%</Text>
            </Animated.View>

            <Animated.View 
              entering={FadeInUp.delay(400)}
              className="flex-1 bg-white p-4 rounded-2xl shadow-sm"
            >
              <View className="w-10 h-10 bg-blue-500/10 rounded-full items-center justify-center mb-2">
                <Ionicons name="bag-handle-outline" size={20} color="#3B82F6" />
              </View>
              <Text className="text-gray-500 text-sm">Orders</Text>
              <Text className="text-xl font-bold mt-1">245</Text>
              <Text className="text-green-500 text-xs">+8.3%</Text>
            </Animated.View>
          </View>

          <Animated.View 
            entering={FadeInDown.duration(1000).springify()}
            className="bg-white rounded-2xl shadow-sm p-4"
          >
            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                  data: [20, 45, 28, 80, 99, 43, 50]
                }]
              }}
              width={320}
              height={180}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </Animated.View>
        </View>

        {/* Top Selling Products */}
        <View className="p-6">
          <Text className="text-lg font-semibold mb-4">Top Selling Products</Text>
          <View className="space-y-4">
            {TOP_PRODUCTS.map((product, index) => (
              <Animated.View 
                key={product.id}
                entering={FadeInUp.delay(600 + (index * 100))}
                className="bg-white p-4 rounded-2xl shadow-sm flex-row items-center"
              >
                <Image 
                  source={product.image}
                  className="w-16 h-16 rounded-xl mr-4"
                />
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">{product.name}</Text>
                  <Text className="text-gray-500 text-sm mt-1">{product.sales} sales</Text>
                  <Text className="text-primary font-medium mt-1">
                    ${product.revenue.toLocaleString()}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View className="px-6 pb-8">
          <Text className="text-lg font-semibold mb-4">Recent Notifications</Text>
          <View className="space-y-4">
            {NOTIFICATIONS.map((notification, index) => (
              <Animated.View 
                key={notification.title}
                entering={FadeInUp.delay(800 + (index * 100))}
                className="bg-white p-4 rounded-2xl shadow-sm flex-row items-center"
              >
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: `${notification.color}15` }}
                >
                  <Ionicons name={notification.icon as any} size={24} color={notification.color} />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">{notification.title}</Text>
                  <Text className="text-gray-500 text-sm mt-1">{notification.message}</Text>
                  <Text className="text-gray-400 text-xs mt-1">{notification.time}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}