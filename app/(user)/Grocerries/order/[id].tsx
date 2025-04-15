import { View, Text, ScrollView, TouchableOpacity, Share, StatusBar, ActivityIndicator, Image, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Toast } from '@/app/components/ui/Toast';
import LottieView from 'lottie-react-native';

// Define possible order states
type OrderStatus = 'pending-confirmation' | 'confirmed' | 'declined' | 'ready-for-payment' | 'paid' | 'preparing' | 'on-way' | 'delivered';

// Modify the item type definition
type OrderItem = {
  name: string;
  quantity: number;
  note?: string;
  price: number | null;
};

// Define coupon type to match checkout page
interface Coupon {
  code: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed' | 'shipping';
  minOrder?: number;
}

// Add a type for order details
type OrderDetails = {
  store: {
    id: string;
    name: string;
    image: any;
  };
  items: OrderItem[];
  deliveryAddress: string;
  deliveryFee: number;
  serviceFee: number;
  submittedAt: Date;
  estimatedConfirmation: Date;
  paymentMethod?: string;
  paymentDate?: Date;
  transactionId?: string;
};

export default function SpiceOrderConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const { id, cartItems: cartItemsParam, storeId, storeName, deliveryAddress, initialStatus, appliedCoupon: appliedCouponParam } = useLocalSearchParams();
  
  // Use initialStatus from params if provided, otherwise default to pending-confirmation
  const [orderStatus, setOrderStatus] = useState<OrderStatus>((initialStatus as OrderStatus) || 'pending-confirmation');
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [couponCode, setCouponCode] = useState('');
  
  // Parse applied coupon from URL parameters if present
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    if (appliedCouponParam) {
      try {
        return JSON.parse(decodeURIComponent(appliedCouponParam as string));
      } catch (error) {
        console.error('Error parsing applied coupon:', error);
        return null;
      }
    }
    return null;
  });
  
  // Update useState type annotation
  const [orderDetails, setOrderDetails] = useState<OrderDetails>(() => {
    try {
      let parsedItems: OrderItem[] = [];
      
      // Try to parse cart items from URL parameters
      if (cartItemsParam) {
        parsedItems = JSON.parse(decodeURIComponent(cartItemsParam as string)) as OrderItem[];
      } 
      
      // If parsing fails or no items, use fallback items
      if (!parsedItems || parsedItems.length === 0) {
        parsedItems = [
          { name: 'Premium Organic Turmeric', quantity: 2, note: 'Ground, 250g', price: null } as OrderItem,
          { name: 'Black Peppercorns', quantity: 1, note: 'Whole, premium grade', price: null } as OrderItem,
          { name: 'Cardamom Pods', quantity: 3, note: 'Green, fresh', price: null } as OrderItem,
        ];
      }
      
      return {
        store: {
          id: storeId as string || '1',
          name: storeName ? decodeURIComponent(storeName as string) : 'Fresh Market',
          image: require('@/assets/images/adaptive-icon.png'),
        },
        items: parsedItems,
        deliveryAddress: deliveryAddress ? decodeURIComponent(deliveryAddress as string) : '123 Main St, Accra',
        deliveryFee: 5.99,
        serviceFee: 2.50,
        submittedAt: new Date(),
        estimatedConfirmation: new Date(Date.now() + 1000 * 60 * 90), // 90 minutes from now
        // If initialStatus is 'paid', add payment details
        ...(initialStatus === 'paid' && {
          paymentMethod: 'Mobile Money',
          paymentDate: new Date(),
          transactionId: `TXN${Math.floor(Math.random() * 10000000)}`
        })
      };
    } catch (error) {
      console.error('Error parsing order details:', error);
      
      // Fallback to default values if parsing fails
      return {
        store: {
          id: '1',
          name: 'Fresh Market',
          image: require('@/assets/images/adaptive-icon.png'),
        },
        items: [
          { name: 'Fresh Tomatoes', quantity: 2, note: 'Ripe, organic', price: null } as OrderItem,
          { name: 'Whole Grain Bread', quantity: 1, note: 'Freshly baked', price: null } as OrderItem,
          { name: 'Organic Milk', quantity: 3, note: '1L carton', price: null } as OrderItem,
        ],
        deliveryAddress: '123 Main St, Accra',
        deliveryFee: 5.99,
        serviceFee: 2.50,
        submittedAt: new Date(),
        estimatedConfirmation: new Date(Date.now() + 1000 * 60 * 90), // 90 minutes from now
      };
    }
  });

  // Simulate receiving order updates over time (only if not already paid or in a later state)
  useEffect(() => {
    // Skip the simulation if order is already paid or in a later state
    if (['paid', 'preparing', 'on-way', 'delivered'].includes(orderStatus)) {
      return;
    }
    
    // If initialStatus is 'paid', update status to preparing
    if (initialStatus === 'paid') {
      setTimeout(() => {
        setOrderStatus('preparing');
      }, 3000);
      return;
    }
    
    // For pending confirmation status, simulate confirmation
    if (orderStatus === 'pending-confirmation') {
      // Simulating an order confirmation after 5 seconds for demo purposes
      const timer = setTimeout(() => {
        setOrderStatus('ready-for-payment');
        
        // Simulate prices being added (only for items without prices)
        setOrderDetails(prevState => {
          // Create a new copy of the items array with updated prices
          const updatedItems = prevState.items.map(item => {
            // Skip items that already have prices
            if (item.price !== null) {
              return item;
            }
            
            // Generate a reasonable price based on the item name and quantity
            let basePrice = 0;
            
            // Different items have different price ranges
            if (item.name.toLowerCase().includes('organic')) {
              basePrice = 15.99; // Organic items cost more
            } else if (item.name.toLowerCase().includes('fresh')) {
              basePrice = 12.99;
            } else if (item.name.toLowerCase().includes('bread')) {
              basePrice = 9.99;
            } else if (item.name.toLowerCase().includes('milk')) {
              basePrice = 9.49;
            } else {
              // Default price for other items
              basePrice = 7.99 + parseFloat((Math.random() * 5).toFixed(2));
            }
            
            // If it's premium, increase the price
            if (item.name.toLowerCase().includes('premium') || 
                (item.note && item.note.toLowerCase().includes('premium'))) {
              basePrice *= 1.3; // 30% more expensive
            }
            
            return {
              ...item,
              price: parseFloat(basePrice.toFixed(2))
            };
          });
          
          return {
            ...prevState,
            items: updatedItems
          };
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [orderStatus, initialStatus]);

  // Get the order steps based on the current status
  const getOrderSteps = () => {
    const steps = [
      {
        title: 'Order Submitted',
        description: 'Your order request has been received',
        time: orderDetails.submittedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'completed' as const,
      },
      {
        title: 'Store Confirmation',
        description: orderStatus === 'pending-confirmation' 
          ? 'Store is reviewing your request' 
          : orderStatus === 'declined'
          ? 'Store declined your request'
          : 'Store has confirmed your items',
        time: orderStatus !== 'pending-confirmation' 
          ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : undefined,
        status: orderStatus === 'pending-confirmation' 
          ? 'current' as const 
          : orderStatus === 'declined'
          ? 'error' as const
          : 'completed' as const,
      },
      {
        title: 'Payment',
        description: 'Complete payment for your order',
        status: orderStatus === 'ready-for-payment' 
          ? 'current' as const 
          : orderStatus === 'paid' || ['preparing', 'on-way', 'delivered'].includes(orderStatus)
          ? 'completed' as const
          : 'pending' as const,
      },
      {
        title: 'Preparing',
        description: 'Your spices are being prepared',
        status: orderStatus === 'preparing' 
          ? 'current' as const 
          : ['on-way', 'delivered'].includes(orderStatus)
          ? 'completed' as const
          : 'pending' as const,
      },
      {
        title: 'On the Way',
        description: 'Your order is on the way',
        status: orderStatus === 'on-way' 
          ? 'current' as const 
          : orderStatus === 'delivered'
          ? 'completed' as const
          : 'pending' as const,
      },
      {
        title: 'Delivered',
        description: 'Enjoy your spices!',
        status: orderStatus === 'delivered' ? 'completed' as const : 'pending' as const,
      },
    ];
    
    return steps;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check my spice order: Order #${id}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePayment = async () => {
    if (orderStatus !== 'ready-for-payment') return;
    
    setLoading(true);
    try {
      // Simulate payment API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOrderStatus('paid');
      // Set payment method (in a real app this would be selected by user)
      setOrderDetails(prev => ({
        ...prev,
        paymentMethod: 'Mobile Money',
        paymentDate: new Date(),
        transactionId: `TXN${Math.floor(Math.random() * 10000000)}`
      }));
      setToast({ message: 'Payment successful!', type: 'success' });
      
      // Update to preparing status after payment
      setTimeout(() => {
        setOrderStatus('preparing');
      }, 3000);
      
    } catch (error) {
      setToast({ message: 'Payment failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate order total
  const calculateSubtotal = () => {
    if (orderStatus !== 'ready-for-payment' && orderStatus !== 'paid' && 
        orderStatus !== 'preparing' && orderStatus !== 'on-way' && orderStatus !== 'delivered') {
      return null;
    }
    
    return orderDetails.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  };
  
  const subtotal = calculateSubtotal();
  
  // Calculate discount if coupon is applied
  const discountAmount = subtotal !== null && appliedCoupon 
    ? appliedCoupon.type === 'percentage'
      ? (subtotal * appliedCoupon.discount / 100)
      : appliedCoupon.type === 'shipping'
      ? orderDetails.deliveryFee
      : appliedCoupon.discount
    : 0;
    
  // Apply maximum discount limit
  const finalDiscountAmount = Math.min(discountAmount, appliedCoupon?.type === 'shipping' ? orderDetails.deliveryFee : (subtotal || 0));
  
  const total = subtotal !== null 
    ? subtotal + orderDetails.deliveryFee + orderDetails.serviceFee - finalDiscountAmount
    : null;

  // Add the coupon validation function
  const validateCoupon = (code: string) => {
    // In a real app, this would validate with a server call
    // For this demo, we'll use some hardcoded valid coupons
    const validCoupons = [
      { code: 'SPICY10', discount: 10, type: 'percentage' as const, description: '10% off your order' },
      { code: 'WELCOME5', discount: 5, type: 'fixed' as const, description: '₵5 off your order' },
      { code: 'FREESHIP', discount: orderDetails.deliveryFee, type: 'shipping' as const, description: 'Free shipping on your order' },
    ];
    
    return validCoupons.find(
      coupon => coupon.code.toLowerCase() === code.toLowerCase()
    );
  };
  
  // Add the handleApplyCoupon function
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setToast({ message: 'Please enter a coupon code', type: 'error' });
      return;
    }
    
    const validCoupon = validateCoupon(couponCode.trim());
    
    if (!validCoupon) {
      setToast({ message: 'Invalid coupon code. Try SPICY10, WELCOME5, or FREESHIP', type: 'error' });
      return;
    }
    
    setAppliedCoupon(validCoupon);
    setShowCouponModal(false);
    
    // Show success toast with more descriptive message
    let discountText = '';
    switch (validCoupon.type) {
      case 'percentage':
        discountText = `${validCoupon.discount}% off`;
        break;
      case 'fixed':
        discountText = `₵${validCoupon.discount} off`;
        break;
      case 'shipping':
        discountText = 'Free shipping';
        break;
    }
    
    setToast({ 
      message: `✅ COUPON APPLIED: ${validCoupon.code} - ${discountText}`, 
      type: 'success' 
    });
  };
  
  // Add removeCoupon function
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setToast({ message: '✅ Coupon removed successfully', type: 'success' });
  };

  // Enhanced receipt download/share function
  const handleSaveReceipt = async () => {
    try {
      // Create a receipt summary
      const receiptContent = `
${orderDetails.store.name} - Receipt
------------------------------
Receipt #: REC-${id}
Order Date: ${orderDetails.submittedAt.toLocaleDateString()}
${orderDetails.paymentDate ? `Payment Date: ${orderDetails.paymentDate.toLocaleDateString()}` : ''}
${orderDetails.transactionId ? `Transaction ID: ${orderDetails.transactionId}` : ''}
Payment Status: ${(orderStatus === 'paid' || orderStatus === 'preparing' || 
                   orderStatus === 'on-way' || orderStatus === 'delivered') 
                  ? 'Paid' : 'Pending'}
${orderDetails.paymentMethod ? `Payment Method: ${orderDetails.paymentMethod}` : ''}

ITEMS
------------------------------
${orderDetails.items.map(item => 
  `${item.name} x${item.quantity} ${item.note ? `(${item.note})` : ''} - ${item.price !== null ? `₵${(item.price * item.quantity).toFixed(2)}` : 'Pending'}`
).join('\n')}

PRICE SUMMARY
------------------------------
Subtotal: ₵${subtotal?.toFixed(2) || '—'}
${appliedCoupon ? `Discount (${appliedCoupon.code}): -₵${finalDiscountAmount.toFixed(2)}` : ''}
Delivery Fee: ₵${orderDetails.deliveryFee.toFixed(2)}
Service Fee: ₵${orderDetails.serviceFee.toFixed(2)}
TOTAL: ₵${total?.toFixed(2) || '—'}

DELIVERY
------------------------------
Delivery Address: ${orderDetails.deliveryAddress}

Thank you for your order!
For any issues, please contact support with your order number #${id}.
      `;
      
      // Share the receipt
      await Share.share({
        message: receiptContent,
        title: `eMart Receipt - Order #${id}`
      });
      
      setToast({ message: 'Receipt saved to your device', type: 'success' });
    } catch (error) {
      console.error('Error sharing receipt:', error);
      setToast({ message: 'Could not save receipt. Please try again.', type: 'error' });
    }
  };

  // Add contact support handler
  const handleContactSupport = () => {
    setShowSupportModal(true);
  };
  
  const handleSubmitSupport = () => {
    if (!supportMessage.trim()) {
      setToast({ message: 'Please enter a message', type: 'error' });
      return;
    }
    
    // In a real app, this would send the message to a backend
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowSupportModal(false);
      setSupportMessage('');
      setToast({ 
        message: 'Support request submitted! We\'ll get back to you shortly.', 
        type: 'success' 
      });
    }, 1500);
  };

  return (
    <View className="flex-1 bg-white">
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
            onPress={() => router.push('/Grocerries')}
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
          {/* Order Status Card */}
          <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            {orderStatus === 'pending-confirmation' && (
              <View className="items-center">
                <View className="w-16 h-16 bg-amber-100 rounded-full items-center justify-center mb-3">
                  <LottieView
                    source={require('@/assets/animations/loading.json')}
                    autoPlay
                    loop
                    style={{ width: 40, height: 40 }}
                  />
                </View>
                <Text className="text-lg font-bold text-gray-900 mb-1">Awaiting Store Confirmation</Text>
                <Text className="text-gray-500 text-center mb-4">
                  The store is reviewing your order request. This usually takes 1-2 hours.
                </Text>
                <View className="w-full bg-gray-100 h-1.5 rounded-full">
                  <View className="bg-amber-500 h-1.5 rounded-full w-1/4" />
                </View>
              </View>
            )}
            
            {orderStatus === 'ready-for-payment' && (
              <View className="items-center">
                <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-3">
                  <Ionicons name="checkmark-circle" size={32} color="#059669" />
                </View>
                <Text className="text-lg font-bold text-gray-900 mb-1">Store Confirmed Your Order!</Text>
                <Text className="text-gray-500 text-center mb-4">
                  Good news! The store has all your requested spices. Please review and complete payment.
                </Text>
                <TouchableOpacity 
                  className="w-full bg-primary py-3 rounded-xl items-center"
                  onPress={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-semibold text-base">
                      Pay Now • ₵{total?.toFixed(2)}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
            
            {['paid', 'preparing', 'on-way', 'delivered'].includes(orderStatus) && (
              <View className="items-center">
                <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-3">
                  <Ionicons name="checkmark-circle" size={32} color="#059669" />
                </View>
                <Text className="text-lg font-bold text-gray-900 mb-1">Order Confirmed & Paid</Text>
                <Text className="text-gray-500 text-center">
                  Your payment was successful. Your order is now being processed.
                </Text>
              </View>
            )}
          </View>
          
          {/* Tracking Steps */}
          <View className="mt-6 bg-white rounded-2xl p-4 border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Order Status</Text>
            
            {getOrderSteps().map((step, index) => (
              <View 
                key={index} 
                className={`flex-row mb-5 ${index === getOrderSteps().length - 1 ? '' : 'relative'}`}
              >
                {/* Status line */}
                {index !== getOrderSteps().length - 1 && (
                  <View 
                    className={`absolute left-4 top-5 w-0.5 h-full ${
                      step.status === 'completed' ? 'bg-primary' : 
                      step.status === 'error' ? 'bg-red-500' : 'bg-gray-200'
                    }`} 
                    style={{ transform: [{ translateX: 0.5 }] }}
                  />
                )}
                
                {/* Status circle */}
                <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                  step.status === 'completed' ? 'bg-primary' : 
                  step.status === 'current' ? 'bg-primary/20 border-2 border-primary' :
                  step.status === 'error' ? 'bg-red-500' : 'bg-gray-200'
                }`}>
                  {step.status === 'completed' ? (
                    <Ionicons name="checkmark" size={18} color="white" />
                  ) : step.status === 'error' ? (
                    <Ionicons name="close" size={18} color="white" />
                  ) : step.status === 'current' ? (
                    <View className="w-2 h-2 bg-primary rounded-full" />
                  ) : null}
                </View>
                
                {/* Step details */}
                <View className="flex-1">
                  <View className="flex-row justify-between items-center">
                    <Text className={`font-semibold ${
                      step.status === 'current' ? 'text-primary' : 
                      step.status === 'completed' ? 'text-gray-900' :
                      step.status === 'error' ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </Text>
                    {step.time && (
                      <Text className="text-xs text-gray-500">{step.time}</Text>
                    )}
                  </View>
                  <Text className={`text-sm ${
                    step.status === 'current' ? 'text-gray-700' : 
                    step.status === 'completed' ? 'text-gray-700' :
                    step.status === 'error' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          
          {/* Store Info */}
          <View className="mt-6 bg-white rounded-2xl p-4 border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Store</Text>
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden mr-3">
                <Image 
                  source={orderDetails.store.image}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View>
                <Text className="text-gray-900 font-medium">{orderDetails.store.name}</Text>
                <TouchableOpacity 
                  className="flex-row items-center mt-1"
                  onPress={() => router.push(`/Grocerries/store/${orderDetails.store.id}` as any)}
                >
                  <Text className="text-primary text-sm mr-1">View Store</Text>
                  <Ionicons name="chevron-forward" size={14} color="#4F46E5" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Items */}
          <View className="mt-6 bg-white rounded-2xl p-4 border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Your Items</Text>
            
            {orderDetails.items.map((item, index) => (
              <Animated.View 
                key={index}
                entering={FadeInDown.delay(index * 100)}
                className={`flex-row justify-between items-center py-3 ${
                  index !== orderDetails.items.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-primary/10 w-8 h-8 rounded-full items-center justify-center mr-3">
                    <Text className="text-primary font-semibold">{item.quantity}x</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-medium" numberOfLines={1}>{item.name}</Text>
                    {item.note && <Text className="text-gray-500 text-xs">{item.note}</Text>}
                  </View>
                </View>
                
                <View>
                  {item.price !== null ? (
                    <Text className="text-gray-900 font-medium">₵{(item.price * item.quantity).toFixed(2)}</Text>
                  ) : (
                    <View className="bg-amber-50 px-2.5 py-1 rounded-lg">
                      <Text className="text-amber-600 text-xs font-medium">Pending</Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            ))}
          </View>
          
          {/* Order Details */}
          <View className="mt-6 bg-white rounded-2xl p-4 border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Order Details</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Order Number</Text>
                <Text className="text-gray-900">#{id}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Delivery Address</Text>
                <Text className="text-gray-900 text-right flex-1 ml-4">{orderDetails.deliveryAddress}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Order Date</Text>
                <Text className="text-gray-900">{orderDetails.submittedAt.toLocaleDateString()}</Text>
              </View>
              
              {/* Receipt Button - only show after payment */}
              {(orderStatus === 'paid' || orderStatus === 'preparing' || 
                orderStatus === 'on-way' || orderStatus === 'delivered') && (
                <TouchableOpacity 
                  className="mt-3 flex-row items-center justify-center py-2.5 bg-gray-100 rounded-xl"
                  onPress={() => setShowReceiptModal(true)}
                >
                  <Ionicons name="receipt-outline" size={20} color="#4F46E5" />
                  <Text className="text-primary font-medium ml-2">View Receipt</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* Price Summary - Only show confirmed prices */}
          {subtotal !== null && (
            <View className="mt-6 bg-white rounded-2xl p-4 border border-gray-100">
              <Text className="text-lg font-semibold text-gray-900 mb-4">Price Summary</Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Subtotal</Text>
                  <Text className="text-gray-900">₵{subtotal.toFixed(2)}</Text>
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
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Delivery Fee</Text>
                  <Text className="text-gray-900">₵{orderDetails.deliveryFee.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Service Fee</Text>
                  <Text className="text-gray-900">₵{orderDetails.serviceFee.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between pt-2 border-t border-gray-100">
                  <Text className="font-semibold text-gray-900">Total</Text>
                  <Text className="font-semibold text-gray-900">₵{total?.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          )}
          
          {/* Support */}
          <View className="mt-6 bg-white rounded-2xl p-4 border border-gray-100 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-2">Need Help?</Text>
            <Text className="text-gray-500 mb-3">If you have any questions about your order</Text>
            <TouchableOpacity 
              className="flex-row items-center py-3 px-4 bg-gray-100 rounded-xl"
              onPress={handleContactSupport}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#374151" />
              <Text className="text-gray-900 font-medium ml-2">Contact Support</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
              onPress={handleApplyCoupon}
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
      
      {/* Receipt Modal */}
      {showReceiptModal && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center px-4 z-50">
          <Animated.View 
            entering={FadeIn.duration(200)}
            className="bg-white rounded-2xl w-full p-4 max-h-[80%]"
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Receipt Header */}
              <View className="items-center border-b border-gray-200 pb-4 mb-4">
                <View className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <Image 
                    source={orderDetails.store.image}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <Text className="text-xl font-bold text-gray-900">{orderDetails.store.name}</Text>
                <Text className="text-gray-500 text-sm">Official Receipt</Text>
              </View>
              
              {/* Receipt Details */}
              <View className="mb-4">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-500 text-sm">Receipt #:</Text>
                  <Text className="text-gray-900 font-medium text-sm">REC-{id}</Text>
                </View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-500 text-sm">Order Date:</Text>
                  <Text className="text-gray-900 text-sm">
                    {orderDetails.submittedAt.toLocaleDateString()} {orderDetails.submittedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </View>
                {orderDetails.paymentDate && (
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-gray-500 text-sm">Payment Date:</Text>
                    <Text className="text-gray-900 text-sm">
                      {orderDetails.paymentDate.toLocaleDateString()} {orderDetails.paymentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Text>
                  </View>
                )}
                {orderDetails.transactionId && (
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-gray-500 text-sm">Transaction ID:</Text>
                    <Text className="text-gray-900 text-sm">{orderDetails.transactionId}</Text>
                  </View>
                )}
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-500 text-sm">Payment Status:</Text>
                  <View className="bg-green-100 px-2 py-0.5 rounded-full">
                    <Text className="text-green-700 text-xs font-medium">
                      {orderStatus === 'paid' || orderStatus === 'preparing' || 
                       orderStatus === 'on-way' || orderStatus === 'delivered' 
                        ? 'Paid' : 'Pending'}
                    </Text>
                  </View>
                </View>
                {orderDetails.paymentMethod && (
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-gray-500 text-sm">Payment Method:</Text>
                    <Text className="text-gray-900 text-sm">{orderDetails.paymentMethod}</Text>
                  </View>
                )}
              </View>
              
              {/* Items */}
              <View className="mb-4">
                <Text className="text-gray-800 font-semibold mb-2">Items</Text>
                <View className="bg-gray-50 rounded-lg p-3">
                  {orderDetails.items.map((item, index) => (
                    <View 
                      key={index}
                      className={`flex-row justify-between py-2 ${
                        index !== orderDetails.items.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <View className="flex-1">
                        <Text className="text-gray-800 text-sm">{item.name}</Text>
                        {item.note && <Text className="text-gray-500 text-xs">{item.note}</Text>}
                        <Text className="text-gray-600 text-xs">Qty: {item.quantity}</Text>
                      </View>
                      <Text className="text-gray-800 text-sm">
                        ₵{item.price !== null ? (item.price * item.quantity).toFixed(2) : '—'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              
              {/* Pricing */}
              <View className="mb-4">
                <Text className="text-gray-800 font-semibold mb-2">Price Summary</Text>
                <View className="bg-gray-50 rounded-lg p-3">
                  <View className="flex-row justify-between py-1">
                    <Text className="text-gray-600 text-sm">Subtotal</Text>
                    <Text className="text-gray-800 text-sm">₵{subtotal?.toFixed(2) || '—'}</Text>
                  </View>
                  
                  {appliedCoupon && (
                    <View className="flex-row justify-between py-1">
                      <View className="flex-row items-center">
                        <Text className="text-gray-600 text-sm">Discount</Text>
                        <View className="bg-blue-100 rounded-full px-2 ml-2">
                          <Text className="text-blue-700 text-xs">{appliedCoupon.code}</Text>
                        </View>
                      </View>
                      <Text className="text-green-600 text-sm">-₵{finalDiscountAmount.toFixed(2)}</Text>
                    </View>
                  )}
                  
                  <View className="flex-row justify-between py-1">
                    <Text className="text-gray-600 text-sm">Delivery Fee</Text>
                    <Text className="text-gray-800 text-sm">₵{orderDetails.deliveryFee.toFixed(2)}</Text>
                  </View>
                  
                  <View className="flex-row justify-between py-1">
                    <Text className="text-gray-600 text-sm">Service Fee</Text>
                    <Text className="text-gray-800 text-sm">₵{orderDetails.serviceFee.toFixed(2)}</Text>
                  </View>
                  
                  <View className="flex-row justify-between pt-2 mt-1 border-t border-gray-200">
                    <Text className="text-gray-800 font-semibold">Total</Text>
                    <Text className="text-gray-800 font-semibold">₵{total?.toFixed(2) || '—'}</Text>
                  </View>
                </View>
              </View>
              
              {/* Delivery */}
              <View className="mb-4">
                <Text className="text-gray-800 font-semibold mb-2">Delivery Details</Text>
                <View className="bg-gray-50 rounded-lg p-3">
                  <Text className="text-gray-800 text-sm">{orderDetails.deliveryAddress}</Text>
                </View>
              </View>
              
              {/* Receipt Footer */}
              <View className="items-center mt-3 mb-2">
                <Text className="text-gray-500 text-xs mb-1">Thank you for your order!</Text>
                <View className="w-32 h-32 my-2">
                  {/* This would be a QR code in a real app */}
                  <View className="w-full h-full bg-gray-200 rounded-lg items-center justify-center">
                    <Ionicons name="qr-code" size={80} color="#374151" />
                  </View>
                </View>
                <Text className="text-gray-500 text-xs text-center">
                  This is your official receipt for Order #{id}. 
                  For any issues, please contact support with your order number.
                </Text>
              </View>
            </ScrollView>
            
            {/* Action Buttons */}
            <View className="flex-row mt-4 pt-3 border-t border-gray-200">
              <TouchableOpacity 
                className="flex-1 flex-row items-center justify-center py-2.5 mr-2 bg-primary rounded-xl"
                onPress={handleSaveReceipt}
              >
                <Ionicons name="download-outline" size={18} color="white" />
                <Text className="text-white font-medium ml-1">Save</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 flex-row items-center justify-center py-2.5 ml-2 bg-white border border-gray-200 rounded-xl"
                onPress={() => setShowReceiptModal(false)}
              >
                <Text className="text-gray-700 font-medium">Close</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
      
      {/* Support Modal */}
      {showSupportModal && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center px-6 z-50">
          <Animated.View 
            entering={FadeIn.duration(200)}
            className="bg-white rounded-2xl w-full p-5"
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">Contact Support</Text>
              <TouchableOpacity onPress={() => setShowSupportModal(false)} className="p-1">
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-1">Order Reference</Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2.5">
                <Text className="text-gray-800">#{id}</Text>
              </View>
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-1">Your Message</Text>
              <View className="bg-gray-50 rounded-lg border border-gray-200 px-3 py-2">
                <TextInput
                  className="text-gray-800 min-h-[100]"
                  placeholder="Describe your issue or question..."
                  placeholderTextColor="#9CA3AF"
                  value={supportMessage}
                  onChangeText={setSupportMessage}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>
            
            <TouchableOpacity 
              className="bg-primary py-3 rounded-xl mb-2"
              onPress={handleSubmitSupport}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold">Submit</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
} 