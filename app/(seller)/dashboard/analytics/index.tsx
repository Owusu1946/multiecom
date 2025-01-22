import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

type TimeRange = 'today' | 'week' | 'month' | 'year';

const CHART_CONFIG = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
};

const ANALYTICS_DATA = {
  revenue: {
    today: 1250,
    week: 8450,
    month: 32500,
    year: 385000,
    trend: '+12.5%',
  },
  orders: {
    today: 25,
    week: 168,
    month: 720,
    year: 8640,
    trend: '+8.3%',
  },
  customers: {
    today: 18,
    week: 125,
    month: 540,
    year: 6480,
    trend: '+15.2%',
  }
};

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const screenWidth = Dimensions.get('window').width;

  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [65, 59, 80, 81, 56, 55, 70],
      color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
      strokeWidth: 2
    }]
  };

  const topProducts = {
    labels: ['iPhone', 'MacBook', 'AirPods', 'iPad', 'Watch'],
    datasets: [{
      data: [300, 250, 200, 180, 150]
    }]
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200 bg-white">
        <Text className="text-2xl font-bold">Analytics</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Time Range Selector */}
        <View className="flex-row p-6 gap-2">
          {(['today', 'week', 'month', 'year'] as TimeRange[]).map((range) => (
            <TouchableOpacity
              key={range}
              onPress={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-full ${
                timeRange === range ? 'bg-primary' : 'bg-gray-100'
              }`}
            >
              <Text className={`capitalize ${
                timeRange === range ? 'text-white' : 'text-gray-600'
              }`}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-4">
            <Animated.View 
              entering={FadeInUp.delay(200)}
              className="flex-1 bg-white p-4 rounded-2xl shadow-sm"
            >
              <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mb-2">
                <Ionicons name="cash-outline" size={20} color="#22C55E" />
              </View>
              <Text className="text-gray-500 text-sm">Revenue</Text>
              <Text className="text-xl font-bold mt-1">
                ₵{ANALYTICS_DATA.revenue[timeRange].toLocaleString()}
              </Text>
              <Text className="text-green-500 text-xs">{ANALYTICS_DATA.revenue.trend}</Text>
            </Animated.View>

            <Animated.View 
              entering={FadeInUp.delay(400)}
              className="flex-1 bg-white p-4 rounded-2xl shadow-sm"
            >
              <View className="w-10 h-10 bg-blue-500/10 rounded-full items-center justify-center mb-2">
                <Ionicons name="bag-handle-outline" size={20} color="#3B82F6" />
              </View>
              <Text className="text-gray-500 text-sm">Orders</Text>
              <Text className="text-xl font-bold mt-1">
                {ANALYTICS_DATA.orders[timeRange].toLocaleString()}
              </Text>
              <Text className="text-green-500 text-xs">{ANALYTICS_DATA.orders.trend}</Text>
            </Animated.View>
          </View>
        </View>

        {/* Sales Chart */}
        <Animated.View 
          entering={FadeInUp.delay(600)}
          className="bg-white p-6 mb-6"
        >
          <Text className="text-lg font-semibold mb-4">Sales Overview</Text>
          <LineChart
            data={salesData}
            width={screenWidth - 48}
            height={220}
            chartConfig={CHART_CONFIG}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </Animated.View>

        {/* Top Products */}
        <Animated.View 
          entering={FadeInUp.delay(800)}
          className="bg-white p-6 mb-6"
        >
          <Text className="text-lg font-semibold mb-4">Top Products</Text>
          <BarChart
            data={topProducts}
            width={screenWidth - 48}
            height={220}
            chartConfig={CHART_CONFIG}
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
            showValuesOnTopOfBars
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
} 