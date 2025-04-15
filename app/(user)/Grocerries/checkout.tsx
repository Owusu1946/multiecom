import { View, Text, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, TextInput } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, SlideInDown, FadeInDown } from 'react-native-reanimated';
import { AddressCard } from '@/app/components/checkout/AddressCard';
import { Toast } from '@/app/components/ui/Toast';

// Sample data for addresses
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

// Sample data for delivery times
const DELIVERY_TIMES = [
  {
    id: 'asap',
    label: 'As soon as possible',
    estimate: '30-45 min',
  },
  {
    id: 'scheduled',
    label: 'Schedule for later',
    estimate: 'Select time',
  }
];

// Define coupon type at the top level
interface Coupon {
  code: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed' | 'shipping';
  minOrder?: number;
}

// Available coupons for the application
const availableCoupons: Coupon[] = [
  {
    code: 'SPICY10',
    description: '10% off your order',
    discount: 10,
    type: 'percentage',
    minOrder: 20
  },
  {
    code: 'WELCOME5',
    description: '₵5 off your first order',
    discount: 5,
    type: 'fixed'
  },
  {
    code: 'FREESHIP',
    description: 'Free shipping on your order',
    discount: 100,
    type: 'shipping',
    minOrder: 30
  }
];

export default function SpiceCheckoutScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [selectedAddress, setSelectedAddress] = useState(ADDRESSES[0].id);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(DELIVERY_TIMES[0].id);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Coupon related state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [finalDiscountAmount, setFinalDiscountAmount] = useState(0);
  
  // Get store ID and cart items from params
  const storeId = params.storeId as string;
  
  // Get cart items from URL params
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Derived state to check if all items have prices
  const { 
    allItemsHavePrices, 
    totalPrice, 
    itemsTotal,
    hasItemsWithPrices 
  } = useMemo(() => {
    // Check if all items have prices defined by user
    const hasDefinedPrices = cartItems.every(item => item.price !== undefined && item.price !== null);
    
    // Calculate total price for items with prices
    let total = 0;
    let itemsWithPriceTotal = 0;
    cartItems.forEach(item => {
      if (item.price !== undefined && item.price !== null) {
        total += item.price * item.quantity;
        itemsWithPriceTotal += item.price * item.quantity;
      }
    });
    
    return { 
      allItemsHavePrices: hasDefinedPrices && cartItems.length > 0,
      totalPrice: total,
      itemsTotal: itemsWithPriceTotal,
      hasItemsWithPrices: itemsWithPriceTotal > 0
    };
  }, [cartItems]);
  
  useEffect(() => {
    try {
      // Decode cart data from URL params if available
      if (params.cartItems) {
        const decodedItems = JSON.parse(decodeURIComponent(params.cartItems as string));
        setCartItems(decodedItems);
      } else {
        // Fallback to getting items from storage (like AsyncStorage)
        // In a real app, you would retrieve from a state management solution
        // For now, we'll use some default items based on the store
        if (storeId === '1') { // Spice Emporium
          setCartItems([
            { name: 'Premium Organic Turmeric', quantity: 2, note: 'Ground, 250g' },
            { name: 'Black Peppercorns', quantity: 1, note: 'Whole, premium grade' },
          ]);
        } else if (storeId === '2') { // Flavor Haven
          setCartItems([
            { name: 'Ceylon Cinnamon', quantity: 1, note: 'True Ceylon, not Cassia' },
            { name: 'Star Anise', quantity: 2, note: 'Whole pods' },
            { name: 'Cardamom Pods', quantity: 1, note: 'Green, organic' },
          ]);
        } else if (storeId === '3') { // Spice Bazaar
          setCartItems([
            { name: 'Saffron Threads', quantity: 1, note: 'Premium Spanish, 1g' },
            { name: 'Cumin Seeds', quantity: 2, note: 'Whole, organic' },
          ]);
        } else if (storeId === '4') { // The Spice Box
          setCartItems([
            { name: 'Fresh Ground Nutmeg', quantity: 1, note: '100g jar' },
            { name: 'Mixed Peppercorns', quantity: 1, note: 'Red, white, black, green' },
            { name: 'Bay Leaves', quantity: 1, note: 'Dried, organic' },
          ]);
        } else {
          // Generic fallback
          setCartItems([
            { name: 'Custom Spice Blend', quantity: 1, note: 'Per your request' },
          ]);
        }
      }
    } catch (error) {
      console.error('Error parsing cart items:', error);
      setCartItems([{ name: 'Custom Spice Order', quantity: 1 }]);
    }
  }, [params.cartItems, storeId]);
  
  // Calculate totals based on the actual cart items
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedMinTotal = itemCount * 15; // Rough minimum estimate
  const estimatedMaxTotal = itemCount * 25; // Rough maximum estimate
  const deliveryFee = 5.99;
  const serviceFee = 2.50;
  
  // Calculate the subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate the discount based on the applied coupon
  useEffect(() => {
    if (!appliedCoupon) {
      setFinalDiscountAmount(0);
      return;
    }

    let discountAmount = 0;
    
    switch (appliedCoupon.type) {
      case 'percentage':
        discountAmount = subtotal * (appliedCoupon.discount / 100);
        break;
      case 'fixed':
        discountAmount = appliedCoupon.discount;
        break;
      case 'shipping':
        discountAmount = deliveryFee;
        break;
    }
    
    setFinalDiscountAmount(discountAmount);
  }, [appliedCoupon, subtotal, deliveryFee]);
  
  // Calculate the final total
  const finalTotal = subtotal + deliveryFee + serviceFee - finalDiscountAmount;
  
  // Apply coupon function
  const onPressApplyCoupon = (code: string) => {
    if (!code.trim()) {
      setToast({
        message: "Please enter a coupon code",
        type: "error"
      });
      return;
    }
    
    const coupon = availableCoupons.find(
      (coupon) => coupon.code.toUpperCase() === code.toUpperCase()
    );

    if (coupon) {
      // Check minimum order requirement if there is one
      if (coupon.minOrder && subtotal < coupon.minOrder) {
        setToast({
          message: `This coupon requires a minimum order of ₵${coupon.minOrder}`,
          type: "error"
        });
        return;
      }
      
      setAppliedCoupon(coupon);
      setCouponCode("");
      setShowCouponModal(false);
      
      // Show success toast with more descriptive message
      let discountText = '';
      switch (coupon.type) {
        case 'percentage':
          discountText = `${coupon.discount}% off`;
          break;
        case 'fixed':
          discountText = `₵${coupon.discount} off`;
          break;
        case 'shipping':
          discountText = 'Free shipping';
          break;
      }
      
      setToast({
        message: `✅ COUPON APPLIED: ${coupon.code} - ${discountText}`,
        type: "success"
      });
    } else {
      setToast({
        message: "Invalid coupon code. Try SPICY10, WELCOME5, or FREESHIP",
        type: "error"
      });
    }
  };
  
  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setToast({ 
      message: '✅ Coupon removed successfully',
      type: 'success' 
    });
  };
  
  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Simulate API call to place order
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setToast({ message: 'Order placed successfully!', type: 'success' });
      setTimeout(() => {
        // Generate a random order ID
        const orderId = Math.random().toString(36).substring(7).toUpperCase();
        
        // Pass cart items to the order page
        const cartItemsParam = encodeURIComponent(JSON.stringify(cartItems));
        
        const storeNameParam = encodeURIComponent(
          storeId === '1' ? 'Fresh Market' : 
          storeId === '2' ? 'Global Foods' : 
          storeId === '3' ? 'Family Mart' : 
          storeId === '4' ? 'Green Basket' : 'Grocery Store'
        );

        // Set initial order status based on whether all items have prices
        const initialStatus = allItemsHavePrices ? 'paid' : 'pending-confirmation';

        // Pass the applied coupon if any
        const appliedCouponParam = appliedCoupon ? 
          encodeURIComponent(JSON.stringify(appliedCoupon)) : undefined;

        router.push({
          pathname: `/Grocerries/order/${orderId}`,
          params: {
            cartItems: cartItemsParam,
            storeId,
            storeName: storeNameParam,
            deliveryAddress: encodeURIComponent(ADDRESSES.find(a => a.id === selectedAddress)?.address || ''),
            initialStatus,
            appliedCoupon: appliedCouponParam
          }
        } as any);
      }, 1000);
    } catch (error) {
      setToast({ message: 'Failed to place order. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onHide={() => setToast(null)}
          duration={5000} 
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
        {/* Store information */}
        <View className="mt-6 bg-white rounded-2xl p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-2">Your Order From</Text>
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <MaterialCommunityIcons name="store" size={20} color="#4F46E5" />
            </View>
            <View>
              <Text className="text-base font-medium text-gray-900">
                {storeId === '1' ? 'Spice Emporium' : 
                 storeId === '2' ? 'Flavor Haven' : 
                 storeId === '3' ? 'Spice Bazaar' : 
                 storeId === '4' ? 'The Spice Box' : 'Spice Store'}
              </Text>
              <Text className="text-xs text-gray-500">Spices & Herbs • 25-40 min</Text>
            </View>
          </View>
        </View>

        {/* Items */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Your Items</Text>
          <View className="bg-white rounded-2xl p-4">
            {cartItems.map((item, index) => (
              <Animated.View 
                key={index}
                entering={FadeInDown.delay(index * 100)}
                className={`flex-row justify-between items-center py-3 ${
                  index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="flex-row items-center">
                  <View className="bg-primary/10 w-8 h-8 rounded-full items-center justify-center mr-3">
                    <Text className="text-primary font-semibold">{item.quantity}x</Text>
                  </View>
                  <View>
                    <Text className="text-gray-900 font-medium">{item.name}</Text>
                    {item.note && <Text className="text-gray-500 text-xs">{item.note}</Text>}
                  </View>
                </View>
                
                {item.price !== undefined && item.price !== null ? (
                  <View className="bg-green-50 px-2.5 py-1 rounded-lg">
                    <Text className="text-green-600 text-xs font-medium">₵{item.price.toFixed(2)}</Text>
                  </View>
                ) : (
                  <View className="bg-amber-50 px-2.5 py-1 rounded-lg">
                    <Text className="text-amber-600 text-xs font-medium">TBD</Text>
                  </View>
                )}
              </Animated.View>
            ))}
            
            <TouchableOpacity 
              className="flex-row items-center justify-center mt-3 pt-3 border-t border-gray-100"
              onPress={() => router.back()}
            >
              <Ionicons name="add-circle-outline" size={18} color="#4F46E5" />
              <Text className="text-primary ml-1 font-medium">Add More Items</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Notice - Only show if some items don't have prices */}
        {!allItemsHavePrices && (
          <View className="mt-6 bg-amber-50 rounded-2xl p-4">
            <View className="flex-row">
              <View className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="information-circle" size={22} color="#D97706" />
              </View>
              <View className="flex-1">
                <Text className="text-amber-800 font-medium">Some prices to be confirmed</Text>
                <Text className="text-amber-600 text-sm mt-1">
                  The store will confirm availability and price of your requested items that don't have prices. You'll be notified once your order is accepted, at which point you can proceed to payment.
                </Text>
              </View>
            </View>
          </View>
        )}

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

        {/* Delivery Time */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Delivery Time</Text>
          {DELIVERY_TIMES.map(time => (
            <TouchableOpacity
              key={time.id}
              className={`flex-row items-center p-4 rounded-xl mb-3 border ${
                selectedDeliveryTime === time.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 bg-white'
              }`}
              onPress={() => setSelectedDeliveryTime(time.id)}
            >
              <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                selectedDeliveryTime === time.id 
                  ? 'border-primary' 
                  : 'border-gray-300'
              }`}>
                {selectedDeliveryTime === time.id && (
                  <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </View>
              <View className="flex-1">
                <Text className={`font-medium ${
                  selectedDeliveryTime === time.id ? 'text-primary' : 'text-gray-900'
                }`}>{time.label}</Text>
                <Text className="text-gray-500 text-xs">{time.estimate}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View className="mt-6 bg-white rounded-2xl p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Order Summary</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Item Total</Text>
              <View className="flex-row items-center">
                {allItemsHavePrices ? (
                  <Text className="text-gray-900">₵{itemsTotal.toFixed(2)}</Text>
                ) : hasItemsWithPrices ? (
                  <View className="flex-row">
                    <Text className="text-gray-900">₵{itemsTotal.toFixed(2)}</Text>
                    <Text className="text-gray-500"> + TBD</Text>
                  </View>
                ) : (
                  <Text className="text-gray-900">~₵{estimatedMinTotal}-{estimatedMaxTotal}</Text>
                )}
                <TouchableOpacity className="ml-1">
                  <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Delivery Fee</Text>
              <Text className="text-gray-900">₵{deliveryFee.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Service Fee</Text>
              <Text className="text-gray-900">₵{serviceFee.toFixed(2)}</Text>
            </View>
            
            {/* Coupon Section */}
            <View className="flex-row justify-between py-2">
              <View className="flex-row items-center">
                <Text className="text-gray-500">Promo Code</Text>
                {appliedCoupon && (
                  <View className="bg-blue-100 rounded-full px-2 py-0.5 ml-2">
                    <Text className="text-blue-700 text-xs">{appliedCoupon.code}</Text>
                  </View>
                )}
              </View>
              
              {appliedCoupon ? (
                <View className="flex-row items-center">
                  <Text className="text-green-600 font-medium">-₵{finalDiscountAmount.toFixed(2)}</Text>
                  <TouchableOpacity 
                    className="ml-2"
                    onPress={removeCoupon}
                  >
                    <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  className="flex-row items-center"
                  onPress={() => setShowCouponModal(true)}
                >
                  <Text className="text-primary text-sm">Add Code</Text>
                  <Ionicons name="add-circle-outline" size={16} color="#4F46E5" className="ml-1" />
                </TouchableOpacity>
              )}
            </View>
            
            <View className="flex-row justify-between pt-2 border-t border-gray-100">
              <Text className="font-semibold text-gray-900">Total</Text>
              
              {allItemsHavePrices ? (
                <Text className="font-semibold text-gray-900">₵{finalTotal.toFixed(2)}</Text>
              ) : hasItemsWithPrices ? (
                <View className="flex-row">
                  <Text className="font-semibold text-gray-900">₵{(itemsTotal + deliveryFee + serviceFee).toFixed(2)}</Text>
                  <Text className="text-gray-500"> + TBD</Text>
                </View>
              ) : (
                <Text className="font-semibold text-gray-900">
                  ~₵{(estimatedMinTotal + deliveryFee + serviceFee).toFixed(2)}-
                  {(estimatedMaxTotal + deliveryFee + serviceFee).toFixed(2)}
                </Text>
              )}
            </View>
          </View>
        </View>
        
        {/* Note - Only show if some items don't have prices */}
        {!allItemsHavePrices && (
          <View className="mt-6 bg-blue-50 rounded-2xl p-4 mb-24">
            <View className="flex-row">
              <Ionicons name="alert-circle" size={22} color="#3B82F6" />
              <Text className="text-blue-600 ml-2 flex-1">
                Final pricing will be confirmed by the store for items without prices. You'll only be charged once you approve the final order details.
              </Text>
            </View>
          </View>
        )}
        
        {/* Payment note for items with prices */}
        {allItemsHavePrices && (
          <View className="mt-6 bg-green-50 rounded-2xl p-4 mb-24">
            <View className="flex-row">
              <Ionicons name="checkmark-circle" size={22} color="#059669" />
              <Text className="text-green-600 ml-2 flex-1">
                All items have prices. Your payment will be processed immediately after placing the order.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Coupon Modal */}
      {showCouponModal && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center px-6 z-50">
          <Animated.View 
            entering={FadeIn.duration(200)}
            className="bg-white rounded-2xl w-full p-5"
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">Apply Coupon</Text>
              <TouchableOpacity onPress={() => setShowCouponModal(false)} className="p-1">
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <View className="bg-gray-50 rounded-xl p-4 mb-4">
              <Text className="text-gray-700 mb-2">Enter your coupon code</Text>
              <View className="flex-row items-center bg-white rounded-lg border border-gray-200 px-3 py-2.5">
                <Ionicons name="pricetag" size={18} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-2 text-gray-900"
                  placeholder="Enter promo code"
                  placeholderTextColor="#9CA3AF"
                  value={couponCode}
                  onChangeText={setCouponCode}
                  autoCapitalize="characters"
                />
              </View>
            </View>
            
            <Text className="text-gray-500 text-sm mb-4">
              Available coupons: SPICY10, WELCOME5, FREESHIP
            </Text>
            
            <TouchableOpacity 
              className="bg-primary py-3 rounded-xl mb-2"
              onPress={() => onPressApplyCoupon(couponCode)}
            >
              <Text className="text-white text-center font-semibold">Apply</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="py-2"
              onPress={() => setShowCouponModal(false)}
            >
              <Text className="text-gray-500 text-center">Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* Place Order Button */}
      <Animated.View 
        entering={SlideInDown.delay(200)}
        className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100"
      >
        <TouchableOpacity 
          className="w-full bg-primary py-4 rounded-2xl items-center"
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              {allItemsHavePrices ? 'Pay & Place Order' : 'Place Order'} • {itemCount} items
            </Text>
          )}
        </TouchableOpacity>
        <Text className="text-xs text-gray-500 text-center mt-2">
          {allItemsHavePrices ? 
            `Total: ₵${finalTotal.toFixed(2)}` : 
            "You won't be charged until prices are confirmed"}
        </Text>
      </Animated.View>
    </View>
  );
} 