import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';

export default function RiderLayout() {
  const [fontsLoaded] = useFonts({
    // Add your custom fonts here
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="profile-setup" />
      <Stack.Screen 
        name="dashboard"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="dashboard/vehicle"
        options={{
          headerShown: true,
          headerTitle: 'My Vehicle'
        }}
      />
      <Stack.Screen 
        name="dashboard/earnings"
        options={{
          headerShown: true,
          headerTitle: 'Earnings'
        }}
      />
      <Stack.Screen 
        name="dashboard/history"
        options={{
          headerShown: true,
          headerTitle: 'Delivery History'
        }}
      />
      <Stack.Screen 
        name="dashboard/ratings"
        options={{
          headerShown: true,
          headerTitle: 'Ratings & Reviews'
        }}
      />
      <Stack.Screen 
        name="dashboard/settings"
        options={{
          headerShown: true,
          headerTitle: 'Settings'
        }}
      />
      <Stack.Screen 
        name="dashboard/support"
        options={{
          headerShown: true,
          headerTitle: 'Support'
        }}
      />
    </Stack>
  );
} 