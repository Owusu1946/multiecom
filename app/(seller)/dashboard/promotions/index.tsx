import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState, useMemo } from 'react';
import AddPromotionModal from '@/app/components/seller/AddPromotionModal';

const PROMOTIONS = [
  {
    id: '1',
    title: 'Weekend Special',
    description: 'Get 20% off on all items this weekend',
    type: 'discount',
    value: 20,
    startDate: '2024-03-20',
    endDate: '2024-03-22',
    status: 'active',
    redemptions: 45,
    thumbnail: 'https://picsum.photos/200/200',
  },
  {
    id: '2',
    title: 'Buy One Get One',
    description: 'Buy any item and get another free',
    type: 'bogo',
    startDate: '2024-03-25',
    endDate: '2024-03-28',
    status: 'scheduled',
    redemptions: 0,
    thumbnail: 'https://picsum.photos/200/201',
  },
] as const;

type PromotionStatus = 'all' | 'active' | 'scheduled' | 'ended';

export default function PromotionsScreen() {
  const insets = useSafeAreaInsets();
  const [filterStatus, setFilterStatus] = useState<PromotionStatus>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const stats = useMemo(() => {
    const total = PROMOTIONS.length;
    const active = PROMOTIONS.filter(p => p.status === 'active').length;
    const scheduled = PROMOTIONS.filter(p => p.status === 'scheduled').length;
    return { total, active, scheduled };
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View 
        className="bg-white px-6 border-b border-gray-200"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between py-4">
          <Text className="text-xl font-semibold">Promotions</Text>
          <TouchableOpacity 
            className="bg-[#22C55E] px-4 py-2 rounded-full flex-row items-center"
            onPress={() => setIsModalVisible(true)}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white ml-1 font-medium">New Promotion</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="py-2"
        >
          {(['all', 'active', 'scheduled', 'ended'] as const).map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilterStatus(status)}
              className={`mr-2 px-4 py-2 rounded-full ${
                filterStatus === status ? 'bg-green-100' : 'bg-gray-100'
              }`}
            >
              <Text className={`capitalize ${
                filterStatus === status ? 'text-[#22C55E]' : 'text-gray-600'
              }`}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats */}
      <View className="flex-row justify-between px-6 py-4 bg-white mt-2">
        <View className="items-center">
          <Text className="text-2xl font-semibold text-[#22C55E]">{stats.total}</Text>
          <Text className="text-gray-500 text-sm">Total</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-semibold text-blue-500">{stats.active}</Text>
          <Text className="text-gray-500 text-sm">Active</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-semibold text-orange-400">{stats.scheduled}</Text>
          <Text className="text-gray-500 text-sm">Scheduled</Text>
        </View>
      </View>

      {/* Promotions List */}
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-4">
          {PROMOTIONS.map((promo, index) => (
            <Animated.View 
              key={promo.id}
              entering={FadeInUp.delay(index * 100)}
              className="bg-white rounded-2xl overflow-hidden"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3
              }}
            >
              <Image 
                source={{ uri: promo.thumbnail }}
                className="w-full h-32"
                style={{ resizeMode: 'cover' }}
              />
              
              <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold">{promo.title}</Text>
                    <Text className="text-gray-500 text-sm">{promo.description}</Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${
                    promo.status === 'active' 
                      ? 'bg-green-100' 
                      : 'bg-orange-100'
                  }`}>
                    <Text className={`text-xs font-medium capitalize ${
                      promo.status === 'active' 
                        ? 'text-green-600' 
                        : 'text-orange-600'
                    }`}>
                      {promo.status}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <View>
                    <Text className="text-gray-500 text-sm">Duration</Text>
                    <Text className="font-medium">
                      {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-500 text-sm">Redemptions</Text>
                    <Text className="text-lg font-medium text-[#22C55E]">
                      {promo.redemptions}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <AddPromotionModal 
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={(promotion) => {
          console.log('New Promotion:', promotion);
          // Add your promotion creation logic here
          setIsModalVisible(false);
        }}
      />
    </View>
  );
} 