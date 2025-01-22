import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="add-product" 
        options={{
          headerShown: true,
          headerTitle: 'Add Product',
          presentation: 'modal'
        }}
      />
      <Stack.Screen 
        name="analytics"
        options={{
          headerShown: true,
          headerTitle: 'Analytics'
        }}
      />
      <Stack.Screen 
        name="settings"
        options={{
          headerShown: true,
          headerTitle: 'Settings'
        }}
      />
      <Stack.Screen 
        name="support"
        options={{
          headerShown: true,
          headerTitle: 'Support'
        }}
      />
      <Stack.Screen 
        name="orders/[id]"
        options={{
          headerShown: false,
          presentation: 'card'
        }}
      />
      <Stack.Screen 
        name="notifications"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="settings/profile"
        options={{
          headerShown: true,
          headerTitle: 'Business Profile'
        }}
      />
      <Stack.Screen 
        name="settings/payment"
        options={{
          headerShown: true,
          headerTitle: 'Payment Methods'
        }}
      />
      <Stack.Screen 
        name="settings/security"
        options={{
          headerShown: true,
          headerTitle: 'Security'
        }}
      />
      <Stack.Screen 
        name="settings/terms"
        options={{
          headerShown: true,
          headerTitle: 'Terms of Service'
        }}
      />
      <Stack.Screen 
        name="settings/privacy"
        options={{
          headerShown: true,
          headerTitle: 'Privacy Policy'
        }}
      />
      <Stack.Screen 
        name="settings/security/pin"
        options={{
          headerShown: true,
          headerTitle: 'Set PIN',
          presentation: 'modal'
        }}
      />
      <Stack.Screen 
        name="settings/security/sessions"
        options={{
          headerShown: true,
          headerTitle: 'Active Sessions'
        }}
      />
      <Stack.Screen 
        name="settings/security/password"
        options={{
          headerShown: true,
          headerTitle: 'Change Password'
        }}
      />
      <Stack.Screen 
        name="settings/security/two-factor"
        options={{
          headerShown: true,
          headerTitle: 'Two-Factor Authentication'
        }}
      />
    </Stack>
  );
} 