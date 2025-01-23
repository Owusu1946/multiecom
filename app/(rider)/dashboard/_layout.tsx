import { View } from 'react-native';
import { Stack } from 'expo-router';
import RiderBottomTabs from '../../components/rider/RiderBottomTabs';

export default function DashboardLayout() {
  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="earnings" />
        <Stack.Screen name="history" />
        <Stack.Screen name="support" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="vehicle" />
        <Stack.Screen name="ratings" />
      </Stack>
      <RiderBottomTabs />
    </View>
  );
} 