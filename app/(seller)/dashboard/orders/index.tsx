import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';

type OrderStatus = 'all' | 'pending' | 'processing' | 'completed' | 'cancelled';
type SortBy = 'recent' | 'amount' | 'items';

const ORDERS = [
  {
    id: 'ORD001',
    customer: {
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    items: [
      {
        id: '1',
        name: 'iPhone 13 Pro Max',
        quantity: 1,
        price: 1299.99,
        thumbnail: 'https://picsum.photos/200/200',
      },
      {
        id: '2',
        name: 'AirPods Pro',
        quantity: 2,
        price: 249.99,
        thumbnail: 'https://picsum.photos/200/201',
      }
    ],
    total: 1799.97,
    status: 'pending',
    date: '2024-03-15',
    paymentMethod: 'Mobile Money',
    deliveryAddress: '123 Main St, Accra, Ghana',
  },
  {
    id: 'ORD002',
    customer: {
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    items: [
      {
        id: '3',
        name: 'MacBook Pro M1',
        quantity: 1,
        price: 1999.99,
        thumbnail: 'https://picsum.photos/200/202',
      }
    ],
    total: 1999.99,
    status: 'processing',
    date: '2024-03-14',
    paymentMethod: 'Bank Transfer',
    deliveryAddress: '456 Park Ave, Kumasi, Ghana',
  },
] as const;

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const router = useRouter();

  const stats = useMemo(() => {
    return {
      total: ORDERS.length,
      pending: ORDERS.filter(order => order.status === 'pending').length,
      processing: ORDERS.filter(order => order.status === 'processing').length,
      completed: ORDERS.filter(order => order.status === 'completed').length,
      cancelled: ORDERS.filter(order => order.status === 'cancelled').length,
      revenue: ORDERS.reduce((acc, order) => acc + order.total, 0),
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return ORDERS
      .filter(order => {
        const matchesSearch = 
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'amount':
            return b.total - a.total;
          case 'items':
            return b.items.length - a.items.length;
          default:
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });
  }, [searchQuery, filterStatus, sortBy]);

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200 bg-white">
        <Text className="text-2xl font-bold">Orders</Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mt-4">
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            className="flex-1 py-2 px-2"
            placeholder="Search orders..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mt-4 -mb-2"
        >
          <View className="flex-row space-x-4">
            <TouchableOpacity 
              onPress={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-full border ${
                filterStatus === 'all' ? 'bg-primary border-primary' : 'border-gray-300'
              }`}
            >
              <Text className={filterStatus === 'all' ? 'text-white' : 'text-gray-600'}>
                All ({stats.total})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-full border ${
                filterStatus === 'pending' ? 'bg-primary border-primary' : 'border-gray-300'
              }`}
            >
              <Text className={filterStatus === 'pending' ? 'text-white' : 'text-gray-600'}>
                Pending ({stats.pending})
              </Text>
            </TouchableOpacity>
            {/* Add more status filters */}
          </View>
        </ScrollView>
      </View>

      {/* Order List */}
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-4">
          {filteredOrders.map((order, index) => (
            <Animated.View 
              key={order.id}
              entering={FadeInUp.delay(index * 100)}
            >
              <TouchableOpacity
                onPress={() => router.push(`/dashboard/orders/${order.id}`)}
                className="bg-white p-4 rounded-2xl shadow-sm"
              >
                {/* Order Header */}
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Image 
                      source={{ uri: order.customer.avatar }}
                      className="w-10 h-10 rounded-full"
                    />
                    <View className="ml-3">
                      <Text className="font-semibold">{order.customer.name}</Text>
                      <Text className="text-gray-500 text-sm">{order.id}</Text>
                    </View>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${
                    order.status === 'pending' ? 'bg-yellow-100' :
                    order.status === 'processing' ? 'bg-blue-100' :
                    order.status === 'completed' ? 'bg-green-100' :
                    'bg-red-100'
                  }`}>
                    <Text className={`text-xs font-medium capitalize ${
                      order.status === 'pending' ? 'text-yellow-600' :
                      order.status === 'processing' ? 'text-blue-600' :
                      order.status === 'completed' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                {/* Order Items */}
                <View className="mt-4">
                  {order.items.map((item, idx) => (
                    <View 
                      key={item.id}
                      className={`flex-row items-center ${
                        idx !== order.items.length - 1 ? 'mb-3' : ''
                      }`}
                    >
                      <Image 
                        source={{ uri: item.thumbnail }}
                        className="w-12 h-12 rounded-xl"
                      />
                      <View className="flex-1 ml-3">
                        <Text className="font-medium">{item.name}</Text>
                        <Text className="text-gray-500">
                          Qty: {item.quantity} × ₵{item.price.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Order Footer */}
                <View className="mt-4 pt-4 border-t border-gray-100">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-gray-500 text-sm">Order Date</Text>
                      <Text className="font-medium">
                        {new Date(order.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-gray-500 text-sm">Total Amount</Text>
                      <Text className="text-lg font-semibold text-[#22C55E]">
                        ₵{order.total.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 