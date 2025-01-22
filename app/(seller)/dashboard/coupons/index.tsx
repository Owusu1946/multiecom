import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AddCouponModal from '@/app/components/seller/AddCouponModal';
import { useState } from 'react';

const COUPONS = [
  {
    code: 'SUMMER23',
    discount: '20%',
    usageCount: 45,
    expiryDate: '2024-08-31',
    status: 'active',
  },
  {
    code: 'WELCOME10',
    discount: '10%',
    usageCount: 120,
    expiryDate: '2024-12-31',
    status: 'active',
  },
  {
    code: 'FLASH50',
    discount: '50%',
    usageCount: 0,
    expiryDate: '2024-06-30',
    status: 'scheduled',
  },
  {
    code: 'WINTER22',
    discount: '15%',
    usageCount: 89,
    expiryDate: '2023-12-31',
    status: 'expired',
  },
] as const;

function DashedLine() {
  return (
    <View className="flex-row items-center absolute -left-3">
      <View className="w-6 h-6 rounded-full bg-gray-50" />
    </View>
  );
}

export default function CouponsScreen() {
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View className="flex-1 bg-gray-50">
      <View 
        className="bg-white px-6 flex-row items-center justify-between border-b border-gray-200"
        style={{ paddingTop: insets.top + 12, paddingBottom: 12 }}
      >
        <Text className="text-xl font-semibold">Coupons</Text>
        <TouchableOpacity 
          className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center"
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#22C55E" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-6">
          {COUPONS.map((coupon, index) => (
            <Animated.View 
              key={coupon.code}
              entering={FadeInUp.delay(index * 100)}
              className="bg-white rounded-2xl overflow-hidden"
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 8
              }}
            >
              {/* Top Section */}
              <View className="p-6 border-b border-dashed border-gray-300">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-lg font-semibold">{coupon.code}</Text>
                  <View 
                    className={`px-3 py-1 rounded-full ${
                      coupon.status === 'active' 
                        ? 'bg-green-100' 
                        : coupon.status === 'scheduled'
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Text 
                      className={`text-xs font-medium capitalize ${
                        coupon.status === 'active' 
                          ? 'text-green-600' 
                          : coupon.status === 'scheduled'
                          ? 'text-blue-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {coupon.status}
                    </Text>
                  </View>
                </View>

                <Text className="text-4xl font-bold text-[#22C55E]">
                  {coupon.discount}
                </Text>
              </View>

              {/* Circular Cutouts */}
              <View className="absolute -left-4 top-[76px]">
                <View 
                  className="w-8 h-8 rounded-full bg-gray-50"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 2, height: 0 },
                    shadowOpacity: 0.15,
                    shadowRadius: 3,
                    elevation: 3
                  }}
                />
              </View>
              <View className="absolute -right-4 top-[76px]">
                <View 
                  className="w-8 h-8 rounded-full bg-gray-50"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: -2, height: 0 },
                    shadowOpacity: 0.15,
                    shadowRadius: 3,
                    elevation: 3
                  }}
                />
              </View>

              {/* Bottom Section */}
              <View className="p-6 bg-gray-50/80">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-gray-500 text-sm">Total Uses</Text>
                    <Text className="text-gray-700 font-medium text-lg">
                      {coupon.usageCount}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-gray-500 text-sm">Expires</Text>
                    <Text className="text-gray-700 font-medium">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <AddCouponModal 
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={(coupon) => {
          console.log('New Coupon:', coupon);
          // Add your coupon creation logic here
        }}
      />
    </View>
  );
} 