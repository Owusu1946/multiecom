import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MenuDrawer } from './MenuDrawer';
import { router } from 'expo-router';

export default function DashboardHeader() {
  const insets = useSafeAreaInsets();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  const handleNotificationsPress = () => {
    router.push('/dashboard/notifications');
  };

  return (
    <>
      <View 
        className="bg-[#22C55E] pb-6 px-6 rounded-b-3xl"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between mb-6 mt-4">
          <TouchableOpacity
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            onPress={() => setIsMenuVisible(true)}
          >
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            onPress={handleNotificationsPress}
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
            <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="bg-white/20 p-4 rounded-xl">
          <Text className="text-white/80 text-sm mb-1">Total Earnings</Text>
          <Text className="text-white text-2xl font-bold">GH₵ 2,450.00</Text>
          <Text className="text-white/60 text-xs mt-1">This month</Text>
        </View>
      </View>

      <MenuDrawer 
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
      />
    </>
  );
}
