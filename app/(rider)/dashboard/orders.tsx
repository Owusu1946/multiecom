import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Linking } from 'react-native';

interface Order {
  id: string;
  customerName: string;
  storeName: string;
  pickupLocation: string;
  dropoffLocation: string;
  amount: number;
  distance: string;
  estimatedTime: string;
  items: {
    name: string;
    quantity: number;
  }[];
  status: 'active' | 'available';
  timestamp: string;
}

interface AcceptedOrder extends Order {
  storePhone: string;
  customerPhone: string;
  storeLocation: {
    latitude: number;
    longitude: number;
  };
}

const ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    storeName: 'Tasty Foods',
    pickupLocation: 'Osu Food Court',
    dropoffLocation: 'East Legon',
    amount: 25.00,
    distance: '3.2 km',
    estimatedTime: '15 mins',
    items: [
      { name: 'Jollof Rice', quantity: 1 },
      { name: 'Chicken Wings', quantity: 2 }
    ],
    status: 'active',
    timestamp: '2 mins ago'
  },
  {
    id: 'ORD-002',
    customerName: 'Sarah Smith',
    storeName: 'Quick Mart',
    pickupLocation: 'Madina Market',
    dropoffLocation: 'Adenta',
    amount: 30.00,
    distance: '4.5 km',
    estimatedTime: '20 mins',
    items: [
      { name: 'Groceries Pack', quantity: 1 }
    ],
    status: 'available',
    timestamp: 'Just now'
  }
];

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'active' | 'available'>('active');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AcceptedOrder | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const filteredOrders = ORDERS.filter(order => order.status === activeTab);

  const handleAcceptOrder = (orderId: string) => {
    const order = ORDERS.find(o => o.id === orderId) as AcceptedOrder;
    // Add mock data for demo
    order.storePhone = '+233559182794';
    order.customerPhone = '+233559182795';
    order.storeLocation = {
      latitude: 5.6037,
      longitude: -0.1870
    };
    setSelectedOrder(order);
    setShowAcceptModal(true);
  };

  const handleGetDirections = () => {
    if (selectedOrder?.storeLocation) {
      const { latitude, longitude } = selectedOrder.storeLocation;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  const handleCallStore = () => {
    if (selectedOrder?.storePhone) {
      Linking.openURL(`tel:${selectedOrder.storePhone}`);
    }
  };

  const handleCallCustomer = () => {
    if (selectedOrder?.customerPhone) {
      Linking.openURL(`tel:${selectedOrder.customerPhone}`);
    }
  };

  const handleConfirmPickup = () => {
    setShowAcceptModal(false);
    // Add pickup confirmation logic here
  };

  return (
    <View 
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Orders</Text>
      </View>

      {/* Tab Buttons */}
      <View className="flex-row bg-white">
        {(['active', 'available'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-3 ${
              activeTab === tab ? 'border-b-2 border-primary' : ''
            }`}
          >
            <Text className={`text-center font-medium ${
              activeTab === tab ? 'text-primary' : 'text-gray-500'
            }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredOrders.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Feather name="package" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-4">
              No {activeTab} orders at the moment
            </Text>
          </View>
        ) : (
          <Animated.View entering={FadeInDown} className="space-y-4">
            {filteredOrders.map((order, index) => (
              <Animated.View
                key={order.id}
                entering={FadeInDown.delay(index * 100)}
                className="bg-white p-4 rounded-xl"
              >
                {/* Order Header */}
                <View className="flex-row justify-between items-center mb-4">
                  <View>
                    <Text className="font-medium text-gray-900">{order.id}</Text>
                    <Text className="text-gray-500 text-sm">{order.timestamp}</Text>
                  </View>
                  <Text className="font-bold text-primary">
                    GH₵ {order.amount.toFixed(2)}
                  </Text>
                </View>

                {/* Store Info */}
                <View className="flex-row items-center mb-4">
                  <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                    <Feather name="shopping-bag" size={20} color="#4F46E5" />
                  </View>
                  <View className="ml-3">
                    <Text className="font-medium text-gray-900">{order.storeName}</Text>
                    <Text className="text-gray-500 text-sm">{order.customerName}</Text>
                  </View>
                </View>

                {/* Order Items */}
                <View className="bg-gray-50 p-3 rounded-lg mb-4">
                  {order.items.map((item, idx) => (
                    <Text key={idx} className="text-gray-600">
                      {item.quantity}x {item.name}
                    </Text>
                  ))}
                </View>

                {/* Locations */}
                <View className="space-y-3 mb-4">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center">
                      <Ionicons name="location" size={16} color="#4F46E5" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-sm text-gray-500">Pickup</Text>
                      <Text className="text-gray-900">{order.pickupLocation}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                      <Ionicons name="location" size={16} color="#22C55E" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-sm text-gray-500">Dropoff</Text>
                      <Text className="text-gray-900">{order.dropoffLocation}</Text>
                    </View>
                  </View>
                </View>

                {/* Order Stats */}
                <View className="flex-row justify-between items-center py-3 border-t border-gray-100">
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-500 ml-1">{order.estimatedTime}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="map-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-500 ml-1">{order.distance}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Feather name="package" size={16} color="#6B7280" />
                    <Text className="text-gray-500 ml-1">{order.items.length} items</Text>
                  </View>
                </View>

                {/* Action Button */}
                {order.status === 'available' && (
                  <TouchableOpacity
                    onPress={() => handleAcceptOrder(order.id)}
                    className="bg-primary mt-4 py-3 rounded-lg"
                  >
                    <Text className="text-white text-center font-medium">
                      Accept Order
                    </Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            ))}
          </Animated.View>
        )}
      </ScrollView>

      {/* Accept Order Modal */}
      <Modal
        visible={showAcceptModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl">
            <View className="p-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-gray-900">Order Details</Text>
                <TouchableOpacity 
                  onPress={() => setShowAcceptModal(false)}
                  className="p-2"
                >
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {selectedOrder && (
                <ScrollView className="space-y-6" showsVerticalScrollIndicator={false}>
                  {/* Store Info */}
                  <View className="bg-gray-50 p-4 rounded-xl">
                    <View className="flex-row items-center mb-4">
                      <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                        <Feather name="shopping-bag" size={24} color="#4F46E5" />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="font-medium text-gray-900">{selectedOrder.storeName}</Text>
                        <Text className="text-gray-500">{selectedOrder.pickupLocation}</Text>
                      </View>
                      <TouchableOpacity 
                        onPress={handleCallStore}
                        className="p-3 bg-primary/10 rounded-full"
                      >
                        <Feather name="phone" size={20} color="#4F46E5" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={handleGetDirections}
                      className="flex-row items-center justify-center bg-primary p-3 rounded-lg"
                    >
                      <Feather name="map-pin" size={20} color="#FFFFFF" />
                      <Text className="text-white font-medium ml-2">Get Directions</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Order Items */}
                  <View>
                    <Text className="font-medium text-gray-900 mb-3">Order Items</Text>
                    <View className="bg-gray-50 p-4 rounded-xl space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <View key={idx} className="flex-row justify-between">
                          <Text className="text-gray-600">{item.quantity}x {item.name}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Customer Info */}
                  <View>
                    <Text className="font-medium text-gray-900 mb-3">Delivery Details</Text>
                    <View className="bg-gray-50 p-4 rounded-xl space-y-4">
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center flex-1">
                          <Feather name="user" size={20} color="#6B7280" />
                          <Text className="text-gray-600 ml-2">{selectedOrder.customerName}</Text>
                        </View>
                        <TouchableOpacity 
                          onPress={handleCallCustomer}
                          className="p-2 bg-gray-200 rounded-full"
                        >
                          <Feather name="phone" size={16} color="#4B5563" />
                        </TouchableOpacity>
                      </View>
                      <View className="flex-row items-center">
                        <Feather name="map-pin" size={20} color="#6B7280" />
                        <Text className="text-gray-600 ml-2">{selectedOrder.dropoffLocation}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Order Summary */}
                  <View className="bg-gray-50 p-4 rounded-xl">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-gray-500">Delivery Fee</Text>
                      <Text className="font-medium">GH₵ {selectedOrder.amount.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-gray-500">Distance</Text>
                      <Text className="font-medium">{selectedOrder.distance}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-500">Estimated Time</Text>
                      <Text className="font-medium">{selectedOrder.estimatedTime}</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row space-x-4">
                    <TouchableOpacity
                      onPress={() => setShowAcceptModal(false)}
                      className="flex-1 py-3 bg-gray-100 rounded-xl"
                    >
                      <Text className="text-gray-600 text-center font-medium">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleConfirmPickup}
                      className="flex-1 py-3 bg-primary rounded-xl"
                    >
                      <Text className="text-white text-center font-medium">Start Pickup</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
} 