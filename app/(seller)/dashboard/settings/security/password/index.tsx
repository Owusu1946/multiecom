import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import { router } from 'expo-router';

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChangePassword = () => {
    // Validate and update password
    router.back();
  };

  return (
    <View 
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInUp}
          className="bg-white p-6 rounded-2xl"
        >
          <View className="space-y-6">
            <View>
              <Text className="text-gray-500 text-sm mb-2">Current Password</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
                <TextInput
                  value={formData.currentPassword}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, currentPassword: text }))}
                  secureTextEntry={!showPasswords.current}
                  className="flex-1 py-4"
                />
                <TouchableOpacity
                  onPress={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                >
                  <Ionicons 
                    name={showPasswords.current ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-gray-500 text-sm mb-2">New Password</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
                <TextInput
                  value={formData.newPassword}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
                  secureTextEntry={!showPasswords.new}
                  className="flex-1 py-4"
                />
                <TouchableOpacity
                  onPress={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  <Ionicons 
                    name={showPasswords.new ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-gray-500 text-sm mb-2">Confirm New Password</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
                <TextInput
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                  secureTextEntry={!showPasswords.confirm}
                  className="flex-1 py-4"
                />
                <TouchableOpacity
                  onPress={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  <Ionicons 
                    name={showPasswords.confirm ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleChangePassword}
            className="bg-primary mt-8 py-4 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              Update Password
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 