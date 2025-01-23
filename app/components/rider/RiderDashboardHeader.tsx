import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState } from 'react';
import RiderMenuDrawer from './RiderMenuDrawer';

type Props = {
  earnings?: {
    today: number;
    week: number;
  };
  isOnline?: boolean;
  onToggleStatus?: () => void;
  profileImage?: string | null;
};

export default function RiderDashboardHeader({ 
  earnings = { today: 0, week: 0 }, 
  isOnline = false,
  onToggleStatus,
  profileImage
}: Props) {
  const insets = useSafeAreaInsets();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <>
      <View 
        className="bg-primary px-6 pb-6 rounded-b-[32px]"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setIsMenuVisible(true)}
              className="w-10 h-10 rounded-full items-center justify-center"
            >
              {profileImage ? (
                <Image 
                  source={{ uri: profileImage }} 
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
                  <Ionicons name="person" size={20} color="white" />
                </View>
              )}
            </TouchableOpacity>
            <View className="ml-3">
              <Text className="text-white/80 text-sm">Welcome back</Text>
              <Text className="text-white font-semibold">O'Kenneth</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onToggleStatus}
            className={`py-2 px-4 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-white/10'
            }`}
          >
            <Text className="text-white font-medium">
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 flex-row justify-between">
          <Animated.View 
            entering={FadeInDown.delay(100)}
            className="bg-white/10 p-4 rounded-2xl flex-1 mr-4"
          >
            <Text className="text-white/80 text-sm">Today's Earnings</Text>
            <Text className="text-white text-xl font-semibold mt-1">
              ₵{earnings.today.toFixed(2)}
            </Text>
            <View className="flex-row items-center mt-2">
              <Ionicons name="bicycle-outline" size={16} color="white" />
              <Text className="text-white/80 text-sm ml-1">
                8 Deliveries
              </Text>
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(200)}
            className="bg-white/10 p-4 rounded-2xl flex-1"
          >
            <Text className="text-white/80 text-sm">This Week</Text>
            <Text className="text-white text-xl font-semibold mt-1">
              ₵{earnings.week.toFixed(2)}
            </Text>
            <View className="flex-row items-center mt-2">
              <Ionicons name="star-outline" size={16} color="white" />
              <Text className="text-white/80 text-sm ml-1">
                4.8 Rating
              </Text>
            </View>
          </Animated.View>
        </View>
      </View>

      <RiderMenuDrawer 
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
      />
    </>
  );
} 