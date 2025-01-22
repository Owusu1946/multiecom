import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SocialLogin() {
  return (
    <>
      <View className="flex-row items-center my-6">
        <View className="flex-1 h-[1px] bg-gray-200" />
        <Text className="mx-4 text-gray-500">or continue with</Text>
        <View className="flex-1 h-[1px] bg-gray-200" />
      </View>

      <View className="flex-row justify-center space-x-4">
        <TouchableOpacity className="w-14 h-14 border border-gray-200 rounded-full items-center justify-center">
          <Ionicons name="logo-google" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity className="w-14 h-14 border border-gray-200 rounded-full items-center justify-center">
          <Ionicons name="logo-apple" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </>
  );
} 