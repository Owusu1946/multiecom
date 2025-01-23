import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LineChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

interface EarningStats {
  today: number;
  week: number;
  month: number;
  totalDeliveries: number;
  averagePerDelivery: number;
}

const earningStats: EarningStats = {
  today: 150.00,
  week: 850.00,
  month: 3200.00,
  totalDeliveries: 156,
  averagePerDelivery: 20.51
};

const weeklyData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    data: [120, 150, 180, 90, 140, 100, 70],
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
  }]
};

export default function EarningsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Earnings</Text>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Earnings Overview */}
        <Animated.View 
          entering={FadeInDown.delay(200)}
          className="bg-primary p-6 rounded-2xl mb-6"
        >
          <Text className="text-white text-lg mb-2">Total Earnings (TaTU)</Text>
          <Text className="text-white text-3xl font-bold">GH₵ {earningStats.month.toFixed(2)}</Text>
          <Text className="text-white/80 mt-1">This Month</Text>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View 
          entering={FadeInDown.delay(300)}
          className="flex-row flex-wrap -m-2 mb-6"
        >
          {[
            {
              label: 'Today',
              value: `GH₵ ${earningStats.today.toFixed(2)}`,
              icon: 'today-outline',
              color: '#22C55E'
            },
            {
              label: 'This Week',
              value: `GH₵ ${earningStats.week.toFixed(2)}`,
              icon: 'calendar-outline',
              color: '#F59E0B'
            }
          ].map((stat) => (
            <View key={stat.label} className="w-1/2 p-2">
              <View className="bg-white p-4 rounded-xl">
                <View className="flex-row items-center justify-between mb-2">
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                  </View>
                  <Text className="text-lg font-bold">{stat.value}</Text>
                </View>
                <Text className="text-gray-500">{stat.label}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Weekly Chart */}
        <Animated.View 
          entering={FadeInDown.delay(400)}
          className="bg-white p-6 rounded-2xl mb-6"
        >
          <Text className="text-lg font-semibold mb-4">Weekly Overview</Text>
          <LineChart
            data={weeklyData}
            width={screenWidth - 64}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </Animated.View>

        {/* Delivery Stats */}
        <Animated.View 
          entering={FadeInDown.delay(500)}
          className="bg-white p-6 rounded-2xl"
        >
          <Text className="text-lg font-semibold mb-4">Delivery Statistics</Text>
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                  <Ionicons name="cube-outline" size={20} color="#4F46E5" />
                </View>
                <Text className="ml-3 text-gray-600">Total Deliveries</Text>
              </View>
              <Text className="font-semibold">{earningStats.totalDeliveries}</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                  <Ionicons name="cash-outline" size={20} color="#22C55E" />
                </View>
                <Text className="ml-3 text-gray-600">Average per Delivery</Text>
              </View>
              <Text className="font-semibold">GH₵ {earningStats.averagePerDelivery.toFixed(2)}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 