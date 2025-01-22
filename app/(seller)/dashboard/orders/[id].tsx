import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Platform, ActivityIndicator, Modal } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';

// Update the ORDERS constant to remove delivery info
const ORDERS = [
  {
    id: 'ORD001',
    customer: {
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
      phone: '+233 20 123 4567',
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
    status: 'processing',
    date: '2024-03-15',
    paymentMethod: 'Mobile Money',
    deliveryAddress: '123 Main St, Accra, Ghana',
  },
  // ... other orders
] as const;

// Update the status types
type OrderStatus = 'pending' | 'received' | 'processing' | 'rider-assigned' | 'picked-up';

const ORDER_STATUS_FLOW: OrderStatus[] = [
  'pending',
  'received',
  'processing',
  'rider-assigned',
  'picked-up'
];

// Add these types at the top
type Rider = {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  totalDeliveries: number;
  status: 'available' | 'busy';
  currentLocation: string;
};

// Add sample riders data
const AVAILABLE_RIDERS: Rider[] = [
  {
    id: 'R001',
    name: 'Samuel Mensah',
    phone: '+233 24 555 7890',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 4.8,
    totalDeliveries: 156,
    status: 'available',
    currentLocation: 'East Legon',
  },
  {
    id: 'R002',
    name: 'Kwame Owusu',
    phone: '+233 20 444 1234',
    avatar: 'https://i.pravatar.cc/150?img=4',
    rating: 4.9,
    totalDeliveries: 203,
    status: 'available',
    currentLocation: 'Osu',
  },
];

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [order, setOrder] = useState(ORDERS.find(o => o.id === id));
  const [loading, setLoading] = useState(false);
  const [showRiderModal, setShowRiderModal] = useState(false);

  if (!order) return null;

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrder(prev => prev ? {
        ...prev,
        status: newStatus
      } : prev);
      
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const getNextStatus = (currentStatus: string): OrderStatus | null => {
    const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus as OrderStatus);
    if (currentIndex === -1 || currentIndex === ORDER_STATUS_FLOW.length - 1) return null;
    return ORDER_STATUS_FLOW[currentIndex + 1];
  };

  const nextStatus = getNextStatus(order.status);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'received': return 'bg-blue-100 text-blue-600';
      case 'processing': return 'bg-indigo-100 text-indigo-600';
      case 'rider-assigned': return 'bg-purple-100 text-purple-600';
      case 'picked-up': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'time';
      case 'received': return 'checkmark';
      case 'processing': return 'construct';
      case 'rider-assigned': return 'bicycle';
      case 'picked-up': return 'checkmark-done';
      default: return 'ellipse-outline';
    }
  };

  const handleAssignRider = async (rider: Rider) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrder(prev => prev ? {
        ...prev,
        status: 'rider-assigned',
        assignedRider: {
          id: rider.id,
          name: rider.name,
        }
      } : prev);
      
      setShowRiderModal(false);
    } catch (error) {
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  // Add this component within OrderDetailsScreen
  const RiderSelectionModal = () => (
    <Modal
      visible={showRiderModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowRiderModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl">
          <View className="p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-semibold">Available Riders</Text>
              <TouchableOpacity onPress={() => setShowRiderModal(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <ScrollView className="max-h-[70vh]">
              {AVAILABLE_RIDERS.map((rider) => (
                <TouchableOpacity
                  key={rider.id}
                  className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-4"
                  onPress={() => handleAssignRider(rider)}
                >
                  <Image
                    source={{ uri: rider.avatar }}
                    className="w-16 h-16 rounded-full"
                  />
                  <View className="flex-1 ml-4">
                    <Text className="font-semibold text-lg">{rider.name}</Text>
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color="#F59E0B" />
                      <Text className="text-gray-600 ml-1">{rider.rating}</Text>
                    </View>
                    <Text className="text-gray-500">
                      {rider.totalDeliveries} deliveries
                    </Text>
                  </View>
                  <View>
                    <Text className="text-gray-500 text-sm">Location</Text>
                    <Text className="font-medium">{rider.currentLocation}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Update the action button logic
  const renderActionButton = () => {
    if (order.status === 'processing') {
      return (
        <TouchableOpacity
          onPress={() => setShowRiderModal(true)}
          className="py-4 px-6 bg-primary rounded-xl"
        >
          <Text className="text-white text-center font-semibold">
            Assign Rider
          </Text>
        </TouchableOpacity>
      );
    }
    
    if (nextStatus) {
      return (
        <TouchableOpacity
          onPress={() => handleStatusUpdate(nextStatus)}
          disabled={loading}
          className={`py-4 px-6 rounded-xl ${loading ? 'bg-gray-300' : 'bg-primary'}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold">
              Mark as {nextStatus.replace('-', ' ')}
            </Text>
          )}
        </TouchableOpacity>
      );
    }
    
    return null;
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-semibold">Order Details</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Order Status */}
          <View className="bg-white p-4 rounded-2xl shadow-sm">
            <Text className="text-lg font-semibold mb-4">Order Status</Text>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-500">Order ID</Text>
                <Text className="text-lg font-semibold">{order.id}</Text>
              </View>
              <View className={`px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
                <Text className="font-medium capitalize">{order.status.replace('-', ' ')}</Text>
              </View>
            </View>

            {/* Status Progress */}
            <View className="flex-row items-center justify-between mt-4">
              {ORDER_STATUS_FLOW.map((status, index) => (
                <View key={status} className="items-center flex-1">
                  <View className={`w-6 h-6 rounded-full items-center justify-center ${
                    ORDER_STATUS_FLOW.indexOf(order.status as OrderStatus) >= index
                      ? 'bg-primary'
                      : 'bg-gray-200'
                  }`}>
                    <Ionicons 
                      name={getStatusIcon(status as OrderStatus)} 
                      size={16} 
                      color={ORDER_STATUS_FLOW.indexOf(order.status as OrderStatus) >= index ? 'white' : '#9CA3AF'} 
                    />
                  </View>
                  <Text className="text-xs text-gray-500 mt-1 capitalize text-center">
                    {status.replace('-', ' ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Customer Info */}
          <Animated.View 
            entering={FadeInUp.delay(200)}
            className="bg-white p-4 rounded-2xl shadow-sm mt-4"
          >
            <Text className="text-lg font-semibold mb-4">Customer</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image 
                  source={{ uri: order.customer.avatar }}
                  className="w-12 h-12 rounded-full"
                />
                <View className="ml-3">
                  <Text className="font-semibold">{order.customer.name}</Text>
                  <Text className="text-gray-500">{order.customer.phone}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleCall(order.customer.phone)}
                className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center"
              >
                <Ionicons name="call-outline" size={20} color="#22C55E" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Order Items */}
          <Animated.View 
            entering={FadeInUp.delay(300)}
            className="bg-white p-4 rounded-2xl shadow-sm mt-4"
          >
            <Text className="text-lg font-semibold mb-4">Order Items</Text>
            {order.items.map((item, idx) => (
              <View 
                key={item.id}
                className={`flex-row items-center ${
                  idx !== order.items.length - 1 ? 'mb-4' : ''
                }`}
              >
                <Image 
                  source={{ uri: item.thumbnail }}
                  className="w-16 h-16 rounded-xl"
                />
                <View className="flex-1 ml-3">
                  <Text className="font-medium">{item.name}</Text>
                  <Text className="text-gray-500">
                    Qty: {item.quantity} × ₵{item.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
            <View className="mt-4 pt-4 border-t border-gray-100">
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Subtotal</Text>
                <Text className="font-medium">₵{order.total.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-500">Delivery Fee</Text>
                <Text className="font-medium">₵10.00</Text>
              </View>
              <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-100">
                <Text className="text-lg font-semibold">Total</Text>
                <Text className="text-lg font-semibold text-primary">
                  ₵{(order.total + 10).toFixed(2)}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View className="p-6 bg-white border-t border-gray-200">
        {renderActionButton()}
      </View>

      {/* Rider Selection Modal */}
      <RiderSelectionModal />
    </View>
  );
} 