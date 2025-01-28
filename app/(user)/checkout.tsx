import { View, Text, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { PaymentMethodCard } from '@/app/components/checkout/PaymentMethodCard';
import { AddressCard } from '@/app/components/checkout/AddressCard';
import { Toast } from '@/app/components/ui/Toast';

// Reference cart data from previous screen
const PAYMENT_METHODS = [
  {
    id: 'paystack',
    name: 'Pay with Card',
    icon: 'https://website-v3-assets.s3.amazonaws.com/assets/img/hero/Paystack-mark-white-twitter.png',
  },
  {
    id: 'momo',
    name: 'Mobile Money',
    icon: 'https://website-v3-assets.s3.amazonaws.com/assets/img/hero/Paystack-mark-white-twitter.png',
  },
];

const ADDRESSES = [
  {
    id: '1',
    name: 'Home',
    address: '123 Main Street, Accra, Ghana',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Office',
    address: '456 Business Ave, Accra, Ghana',
  },
];

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);
  const [selectedAddress, setSelectedAddress] = useState(ADDRESSES[0].id);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Get these values from route params or global store
  const subtotal = parseFloat(params.subtotal as string) || 0;
  const shipping = 5.99;
  const total = subtotal + shipping;

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate Paystack payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setToast({ message: 'Payment successful!', type: 'success' });
      setTimeout(() => {
        // Generate a random order ID
        const orderId = Math.random().toString(36).substring(7).toUpperCase();
        router.push(`/(user)/orders/${orderId}` as any);
      }, 1000);
    } catch (error) {
      setToast({ message: 'Payment failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onHide={() => setToast(null)} 
        />
      )}

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
          <Text className="text-xl font-semibold text-gray-900">Checkout</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</Text>
          {ADDRESSES.map(address => (
            <AddressCard 
              key={address.id}
              address={address}
              selected={selectedAddress === address.id}
              onSelect={() => setSelectedAddress(address.id)}
            />
          ))}
          <TouchableOpacity className="flex-row items-center mt-2">
            <Ionicons name="add-circle-outline" size={24} color="#666" />
            <Text className="text-gray-600 ml-2">Add New Address</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View className="mt-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Payment Method</Text>
          {PAYMENT_METHODS.map(method => (
            <PaymentMethodCard 
              key={method.id}
              method={method}
              selected={selectedPayment === method.id}
              onSelect={() => setSelectedPayment(method.id)}
            />
          ))}
        </View>

        {/* Order Summary */}
        <View className="mt-8 bg-white rounded-2xl p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Order Summary</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Subtotal</Text>
              <Text className="text-gray-900">₵{subtotal.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Shipping</Text>
              <Text className="text-gray-900">₵{shipping.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between pt-2 border-t border-gray-100">
              <Text className="font-semibold text-gray-900">Total</Text>
              <Text className="font-semibold text-gray-900">₵{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <Animated.View 
        entering={SlideInDown.delay(200)}
        className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100"
      >
        <TouchableOpacity 
          className="w-full bg-primary py-4 rounded-2xl items-center"
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Pay • ₵{total.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
} 