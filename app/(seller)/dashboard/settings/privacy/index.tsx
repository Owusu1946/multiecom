import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();

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
          <Text className="text-2xl font-bold mb-6">Privacy Policy</Text>
          
          <View className="space-y-6">
            <View>
              <Text className="text-lg font-semibold mb-2">1. Information We Collect</Text>
              <Text className="text-gray-600 leading-6">
                We collect information that you provide directly, including business details, contact information, and payment information. We also collect usage data to improve our services.
              </Text>
            </View>

            <View>
              <Text className="text-lg font-semibold mb-2">2. How We Use Your Information</Text>
              <Text className="text-gray-600 leading-6">
                We use your information to process orders, provide customer support, improve our services, and send important updates about your account.
              </Text>
            </View>

            <View>
              <Text className="text-lg font-semibold mb-2">3. Data Security</Text>
              <Text className="text-gray-600 leading-6">
                We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.
              </Text>
            </View>

            <View>
              <Text className="text-lg font-semibold mb-2">4. Information Sharing</Text>
              <Text className="text-gray-600 leading-6">
                We do not sell your personal information. We may share your information with service providers who assist in our operations.
              </Text>
            </View>

            <View>
              <Text className="text-lg font-semibold mb-2">5. Your Rights</Text>
              <Text className="text-gray-600 leading-6">
                You have the right to access, correct, or delete your personal information. Contact our support team to exercise these rights.
              </Text>
            </View>
          </View>

          <Text className="text-gray-500 text-sm mt-8">
            Last updated: March 2024
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 