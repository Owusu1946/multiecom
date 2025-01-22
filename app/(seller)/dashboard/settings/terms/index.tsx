import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function TermsScreen() {
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
          <Text className="text-2xl font-bold mb-6">Terms of Service</Text>
          
          <View className="space-y-6">
            <View>
              <Text className="text-lg font-semibold mb-2">1. Acceptance of Terms</Text>
              <Text className="text-gray-600 leading-6">
                By accessing and using this platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </Text>
            </View>

            <View>
              <Text className="text-lg font-semibold mb-2">2. Seller Obligations</Text>
              <Text className="text-gray-600 leading-6">
                As a seller, you are responsible for maintaining accurate product information, processing orders promptly, and providing quality customer service.
              </Text>
            </View>

            <View>
              <Text className="text-lg font-semibold mb-2">3. Commission and Fees</Text>
              <Text className="text-gray-600 leading-6">
                We charge a commission on each successful sale. Additional fees may apply for premium features or promotional services.
              </Text>
            </View>

            <View>
              <Text className="text-lg font-semibold mb-2">4. Payment Processing</Text>
              <Text className="text-gray-600 leading-6">
                Payments are processed securely through our platform. Payouts are made according to the schedule specified in your seller agreement.
              </Text>
            </View>

            <View>
              <Text className="text-lg font-semibold mb-2">5. Account Termination</Text>
              <Text className="text-gray-600 leading-6">
                We reserve the right to terminate accounts that violate our terms of service or engage in fraudulent activities.
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