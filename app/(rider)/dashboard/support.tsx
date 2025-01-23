import { View, Text, ScrollView, TouchableOpacity, Linking, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FAQ {
  question: string;
  answer: string;
}

interface ContactOption {
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
}

const faqs: FAQ[] = [
  {
    question: "How do I start accepting orders?",
    answer: "Once you're online, you'll automatically receive order notifications. Accept the ones that work best for your location and schedule."
  },
  {
    question: "What areas can I deliver to?",
    answer: "You can deliver within your assigned zones. Check the 'My Zone' section in the app for your current delivery boundaries."
  },
  {
    question: "How do I report an issue with a delivery?",
    answer: "Use the 'Report Issue' button in your order details or contact our Support Team directly through the hotline for immediate assistance."
  },
  {
    question: "What are the peak delivery hours?",
    answer: "Peak hours typically include lunch (11 AM - 2 PM) and dinner (6 PM - 9 PM) times. Higher demand means more earning opportunities!"
  },
  {
    question: "How does payment work?",
    answer: "Earnings are calculated per delivery, including base fare, distance, and bonuses. Payments are processed weekly directly to your linked account."
  }
];

export default function SupportScreen() {
  const insets = useSafeAreaInsets();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const contactOptions: ContactOption[] = [
    {
      title: "Rider Support",
      description: "24/7 Delivery Support",
      icon: "call-outline",
      color: "#4F46E5",
      action: () => Linking.openURL('tel:+233559182794')
    },
    {
      title: "WhatsApp Support",
      description: "Chat with Support Team",
      icon: "logo-whatsapp",
      color: "#22C55E",
      action: () => Linking.openURL('https://wa.me/233559182794')
    },
    {
      title: "Email Support",
      description: "support@emart.com",
      icon: "mail-outline",
      color: "#F59E0B",
      action: () => Linking.openURL('mailto:support@emart.com')
    }
  ];

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
        {/* Search Bar */}
        <View className="bg-white p-4 rounded-2xl mb-6">
          <View className="flex-row items-center bg-gray-100 px-4 py-2 rounded-xl">
            <Ionicons name="search-outline" size={20} color="#6B7280" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search FAQs"
              className="flex-1 ml-2 text-gray-900"
            />
          </View>
        </View>

        {/* Contact Options */}
        <Animated.View 
          entering={FadeInDown.delay(200)}
          className="space-y-3 mb-8"
        >
          {contactOptions.map((option, index) => (
            <TouchableOpacity
              key={option.title}
              onPress={option.action}
              className="bg-white p-4 rounded-xl flex-row items-center"
            >
              <View 
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: `${option.color}15` }}
              >
                <Ionicons name={option.icon as any} size={24} color={option.color} />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-medium text-gray-900">{option.title}</Text>
                <Text className="text-gray-500 text-sm">{option.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Emergency Support */}
        <Animated.View
          entering={FadeInDown.delay(300)}
          className="bg-red-50 p-4 rounded-xl mb-8"
        >
          <View className="flex-row items-center mb-2">
            <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center">
              <Ionicons name="warning-outline" size={20} color="#EF4444" />
            </View>
            <Text className="text-red-600 font-medium ml-2">Emergency Assistance</Text>
          </View>
          <Text className="text-red-600 text-sm">
            For urgent safety concerns or accidents during delivery, contact our emergency line:
          </Text>
          <TouchableOpacity 
            onPress={() => Linking.openURL('tel:+233201234567')}
            className="bg-red-100 px-4 py-2 rounded-lg mt-2"
          >
            <Text className="text-red-600 text-center font-medium">Call Emergency Support</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* FAQs */}
        <Animated.View
          entering={FadeInDown.delay(400)}
          className="space-y-4"
        >
          <Text className="text-lg font-semibold text-gray-900">Frequently Asked Questions</Text>
          {filteredFaqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
              className="bg-white p-4 rounded-xl"
            >
              <View className="flex-row justify-between items-center">
                <Text className="font-medium text-gray-900 flex-1 pr-4">{faq.question}</Text>
                <Ionicons 
                  name={expandedFaq === index ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#9CA3AF" 
                />
              </View>
              {expandedFaq === index && (
                <Text className="text-gray-600 mt-2">{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
} 