import { Stack } from 'expo-router';
import { View } from 'react-native';
import BottomNavbar from '@/app/components/seller/BottomNavbar';

export default function SellerLayout() {
  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <BottomNavbar />
    </View>
  );
} 