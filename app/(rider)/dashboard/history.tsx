import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DeliveryHistory {
  id: string;
  date: string;
  time: string;
  from: string;
  to: string;
  amount: number;
  status: 'completed' | 'cancelled';
  type: 'document' | 'package' | 'food';
}

const deliveryHistory: DeliveryHistory[] = [
  {
    id: 'DEL-001',
    date: '2024-03-15',
    time: '10:30 AM',
    from: 'TaTU Main Gate',
    to: 'Engineering Block',
    amount: 15.00,
    status: 'completed',
    type: 'document'
  },
  {
    id: 'DEL-002',
    date: '2024-03-15',
    time: '2:15 PM',
    from: 'Student Center',
    to: 'Administration Block',
    amount: 20.00,
    status: 'completed',
    type: 'package'
  },
  // Add more history items...
];

const FILTERS = ['All', 'Today', 'This Week', 'This Month'];

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const insets = useSafeAreaInsets();

  const getStatusColor = (status: DeliveryHistory['status']) => {
    return status === 'completed' ? '#22C55E' : '#EF4444';
  };

  const getTypeIcon = (type: DeliveryHistory['type']) => {
    switch (type) {
      case 'document':
        return 'document-text';
      case 'package':
        return 'cube';
      case 'food':
        return 'fast-food';
      default:
        return 'cube';
    }
  };

  return (
    <View 
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">History</Text>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Filters */}
        <Animated.View 
          entering={FadeInDown.delay(200)}
          className="flex-row flex-wrap -m-1 mb-6"
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className={`m-1 px-4 py-2 rounded-full ${
                activeFilter === filter ? 'bg-primary' : 'bg-gray-100'
              }`}
            >
              <Text className={
                activeFilter === filter ? 'text-white' : 'text-gray-600'
              }>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* History List */}
        <Animated.View 
          entering={FadeInDown.delay(300)}
          className="space-y-4"
        >
          {deliveryHistory.map((delivery, index) => (
            <Animated.View
              key={delivery.id}
              entering={FadeInDown.delay(400 + (index * 100))}
              className="bg-white p-4 rounded-xl"
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                    <Ionicons 
                      name={getTypeIcon(delivery.type) as any} 
                      size={20} 
                      color="#4F46E5" 
                    />
                  </View>
                  <View className="ml-3">
                    <Text className="font-medium">{delivery.id}</Text>
                    <Text className="text-sm text-gray-500">
                      {delivery.date} • {delivery.time}
                    </Text>
                  </View>
                </View>
                <View className={`px-3 py-1 rounded-full ${
                  delivery.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Text style={{ color: getStatusColor(delivery.status) }} className="text-sm">
                    {delivery.status}
                  </Text>
                </View>
              </View>

              <View className="space-y-2">
                <View className="flex-row items-center">
                  <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center">
                    <Ionicons name="location" size={14} color="#4F46E5" />
                  </View>
                  <Text className="ml-2 text-gray-600">From: {delivery.from}</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center">
                    <Ionicons name="location" size={14} color="#22C55E" />
                  </View>
                  <Text className="ml-2 text-gray-600">To: {delivery.to}</Text>
                </View>
              </View>

              <View className="mt-3 pt-3 border-t border-gray-100 flex-row justify-between items-center">
                <Text className="text-gray-500">Amount</Text>
                <Text className="font-semibold">GH₵ {delivery.amount.toFixed(2)}</Text>
              </View>
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
} 