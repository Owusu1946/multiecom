import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { CartItem } from '@/app/components/cart/CartItem';
import { Toast } from '@/app/components/ui/Toast';
import { SPICES } from '@/app/data/spices';

// This should come from a global cart store
const INITIAL_CART = [
  { productId: '1', quantity: 2 },
  { productId: '3', quantity: 1 },
];

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const [cart, setCart] = useState(INITIAL_CART);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const cartItems = cart.map(item => ({
    ...SPICES.find(p => p.id === item.productId)!,
    quantity: item.quantity
  }));

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const total = subtotal + shipping;

  const handleQuantityChange = (productId: string, change: number) => {
    setCart(prev => prev.map(item => 
      item.productId === productId 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    setToast({ message: 'Item removed from cart', type: 'success' });
  };

  const handleCheckout = () => {
    router.push({
      pathname: '/(user)/checkout',
      params: { subtotal: subtotal.toString() }
    });
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
          <Text className="text-xl font-semibold text-gray-900">Cart</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="py-4">
          {cartItems.map(item => (
            <Animated.View 
              key={item.id}
              entering={FadeIn}
            >
              <CartItem 
                item={item}
                quantity={item.quantity}
                onIncrease={() => handleQuantityChange(item.id, 1)}
                onDecrease={() => handleQuantityChange(item.id, -1)}
                onRemove={() => handleRemoveItem(item.id)}
              />
            </Animated.View>
          ))}
        </View>

        {/* Order Summary */}
        <View className="bg-white rounded-2xl p-4 mb-24">
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

      {/* Checkout Button */}
      <Animated.View 
        entering={SlideInDown.delay(200)}
        className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100"
      >
        <TouchableOpacity 
          className="w-full bg-primary py-4 rounded-2xl items-center"
          onPress={handleCheckout}
        >
          <Text className="text-white font-semibold text-lg">
            Checkout • ₵{total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
} 