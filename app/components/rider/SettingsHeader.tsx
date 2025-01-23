import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  title: string;
  showBackButton?: boolean;
}

export default function SettingsHeader({ title, showBackButton = true }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View 
      style={{ paddingTop: insets.top }}
      className="bg-white border-b border-gray-100"
    >
      <View className="flex-row items-center justify-between h-16 px-4">
        {showBackButton ? (
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-50"
          >
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
        
        <Text className="text-xl font-semibold text-gray-900">
          {title}
        </Text>
        
        <View style={{ width: 40 }} />
      </View>
    </View>
  );
} 