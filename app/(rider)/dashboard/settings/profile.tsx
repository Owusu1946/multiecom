import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SettingsHeader from '../../../components/rider/SettingsHeader';

export default function ProfileSettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SettingsHeader title="Profile" />
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{
          padding: 24,
          paddingBottom: insets.bottom
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.delay(200)}
          className="items-center mb-8"
        >
          <View className="w-24 h-24 bg-gray-200 rounded-full mb-4" />
          <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg">
            <Text className="text-white">Change Photo</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(300)}
          className="space-y-4"
        >
          {[
            { label: 'Full Name', value: 'John Doe' },
            { label: 'Student ID', value: 'TaTU/2024/001' },
            { label: 'Email', value: 'john.doe@tatu.edu.gh' },
            { label: 'Phone', value: '+233 20 123 4567' },
            { label: 'Department', value: 'Computer Science' }
          ].map((item, index) => (
            <View key={item.label} className="bg-white p-4 rounded-xl">
              <Text className="text-gray-500 text-sm">{item.label}</Text>
              <Text className="text-gray-900 font-medium mt-1">{item.value}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
} 