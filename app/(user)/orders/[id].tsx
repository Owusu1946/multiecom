import { View, Text, ScrollView, TouchableOpacity, Share, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { OrderTrackingMap } from '@/app/components/order/OrderTrackingMap';
import { TrackingSteps } from '@/app/components/order/TrackingSteps';
import LottieView from 'lottie-react-native';
import { Receipt } from '@/app/components/order/Receipt';

export default function OrderTrackingScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [orderStatus, setOrderStatus] = useState<'preparing' | 'picked-up' | 'on-way' | 'delivered'>('preparing');
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderDetails] = useState({
    items: [
      { name: 'Cinnamon Powder', quantity: 2, price: 9.99 },
      { name: 'Black Pepper', quantity: 1, price: 7.99 },
    ],
    subtotal: 27.97,
    shipping: 5.99,
    total: 33.96,
    date: new Date().toLocaleDateString(),
  });

  const steps = [
    {
      title: 'Order Confirmed',
      description: 'Your order has been received',
      time: '10:00 AM',
      status: 'completed' as const,
    },
    {
      title: 'Preparing',
      description: 'Your items are being prepared',
      time: '10:05 AM',
      status: 'current' as const,
    },
    {
      title: 'On the Way',
      description: 'Rider is picking up your order',
      status: 'pending' as const,
    },
    {
      title: 'Delivered',
      description: 'Enjoy your items!',
      status: 'pending' as const,
    },
  ];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Track my order: Order #${id}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View 
        style={{ paddingTop: insets.top }} 
        className="bg-white px-4 pb-4 border-b border-gray-200"
      >
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-900">Order #{id}</Text>
          <TouchableOpacity 
            onPress={handleShare}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="share-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn}>
          <OrderTrackingMap status={orderStatus} />
          <TrackingSteps steps={steps} />
          
          {/* Order Details */}
          <View className="mt-8 bg-white rounded-2xl p-4 border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Order Details</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Order Number</Text>
                <Text className="text-gray-900">#{id}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Delivery Address</Text>
                <Text className="text-gray-900 text-right flex-1 ml-4">123 Main St, Accra</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Payment Method</Text>
                <Text className="text-gray-900">Mobile Money</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => setShowReceipt(true)}
            className="mt-4 flex-row items-center justify-center py-3 bg-gray-100 rounded-xl"
          >
            <Ionicons name="receipt-outline" size={20} color="#374151" />
            <Text className="text-gray-900 font-medium ml-2">View Receipt</Text>
          </TouchableOpacity>

          <Receipt 
            visible={showReceipt}
            onClose={() => setShowReceipt(false)}
            orderId={id as string}
            items={orderDetails.items}
            subtotal={orderDetails.subtotal}
            shipping={orderDetails.shipping}
            total={orderDetails.total}
            date={orderDetails.date}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
} 