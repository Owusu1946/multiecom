import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import RiderDashboardHeader from '@/app/components/rider/RiderDashboardHeader';

const QUICK_ACTIONS = [
  {
    icon: 'bicycle-outline',
    label: 'My Vehicle',
    route: '/dashboard/vehicle',
    color: '#4F46E5',
  },
  {
    icon: 'wallet-outline',
    label: 'Earnings',
    route: '/dashboard/earnings',
    color: '#22C55E',
  },
  {
    icon: 'time-outline',
    label: 'History',
    route: '/dashboard/history',
    color: '#F59E0B',
  },
  {
    icon: 'star-outline',
    label: 'Ratings',
    route: '/dashboard/ratings',
    color: '#8B5CF6',
  },
];

const RECENT_DELIVERIES = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    location: 'East Legon',
    time: '10 mins ago',
    amount: 25.00,
    status: 'completed',
  },
  {
    id: '2',
    customerName: 'Mike Chen',
    location: 'Osu',
    time: '25 mins ago',
    amount: 18.50,
    status: 'completed',
  },
  {
    id: '3',
    customerName: 'Emma Williams',
    location: 'Cantonments',
    time: '45 mins ago',
    amount: 32.00,
    status: 'completed',
  },
];

export default function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [earnings] = useState({
    today: 150.00,
    week: 850.00
  });

  return (
    <View className="flex-1 bg-gray-50">
      <RiderDashboardHeader 
        earnings={earnings}
        isOnline={isOnline}
        onToggleStatus={() => setIsOnline(!isOnline)}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.delay(300)}
          className="bg-white p-6 rounded-2xl mb-6"
        >
          <Text className="text-lg font-semibold mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap -m-2">
            {QUICK_ACTIONS.map((item) => (
              <TouchableOpacity
                key={item.label}
                className="w-1/2 p-2"
                onPress={() => router.push(item.route)}
              >
                <View className="bg-gray-50 p-4 rounded-xl">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Ionicons 
                      name={item.icon as any} 
                      size={24} 
                      color={item.color} 
                    />
                  </View>
                  <Text className="font-medium text-gray-900">
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400)}
          className="bg-white p-6 rounded-2xl"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold">Recent Deliveries</Text>
            <TouchableOpacity onPress={() => router.push('/dashboard/history')}>
              <Text className="text-primary">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            {RECENT_DELIVERIES.map((delivery) => (
              <View 
                key={delivery.id}
                className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">
                    {delivery.customerName}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location-outline" size={14} color="#6B7280" />
                    <Text className="text-gray-500 text-sm ml-1">
                      {delivery.location}
                    </Text>
                    <Text className="text-gray-400 text-sm ml-2">•</Text>
                    <Text className="text-gray-500 text-sm ml-2">
                      {delivery.time}
                    </Text>
                  </View>
                </View>
                <Text className="font-semibold text-gray-900">
                  ₵{delivery.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 