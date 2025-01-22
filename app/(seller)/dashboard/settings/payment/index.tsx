import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import PaymentMethodSkeleton from '@/app/components/seller/PaymentMethodSkeleton';

type PaymentMethod = {
  id: string;
  type: 'momo' | 'bank';
  name: string;
  number: string;
  provider?: string;
  icon: string;
  color: string;
};

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPaymentMethods([
        {
          id: '1',
          type: 'momo',
          name: 'MTN Mobile Money',
          number: '233201234567',
          provider: 'MTN',
          icon: 'phone-portrait-outline',
          color: '#FCD34D',
        },
        {
          id: '2',
          type: 'bank',
          name: 'Bank Account',
          number: '**** **** **** 4567',
          icon: 'card-outline',
          color: '#4F46E5',
        },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  const handleAddPayment = () => {
    router.push('/dashboard/settings/payment/add');
  };

  const handleDeleteMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  return (
    <View 
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <PaymentMethodSkeleton />
        ) : (
          <View className="space-y-6">
            {paymentMethods.map((method, index) => (
              <Animated.View
                key={method.id}
                entering={FadeInUp.delay(index * 100)}
                className="bg-white p-4 rounded-2xl"
              >
                <View className="flex-row items-center">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${method.color}15` }}
                  >
                    <Ionicons 
                      name={method.icon as any}
                      size={24}
                      color={method.color}
                    />
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="font-semibold text-gray-900">{method.name}</Text>
                    <Text className="text-gray-500 mt-1">{method.number}</Text>
                    {method.provider && (
                      <Text className="text-gray-400 text-sm">{method.provider}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteMethod(method.id)}
                    className="p-2"
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={handleAddPayment}
          className="mt-8 bg-primary py-4 rounded-xl flex-row items-center justify-center"
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text className="text-white font-semibold ml-2">
            Add Payment Method
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 