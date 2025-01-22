import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    question: 'How do I process orders?',
    answer: 'To process orders, go to the Orders tab, select the order you want to process, and follow the steps to confirm, prepare, and mark it as ready for delivery.',
  },
  {
    id: '2',
    question: 'How do I add products?',
    answer: 'Click the "+" button on the dashboard, fill in the product details including name, price, description, and images, then save to add it to your inventory.',
  },
  {
    id: '3',
    question: 'How do payouts work?',
    answer: 'Payouts are processed weekly to your registered payment method. You can view your payout history and upcoming payments in the Payment Methods section.',
  },
];

export default function SupportScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });

  const filteredFAQs = FAQ_ITEMS.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    // Handle support ticket submission
    setContactForm({ subject: '', message: '' });
    setShowContactForm(false);
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

        <View className="space-y-4">
          {filteredFAQs.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.delay(index * 100)}
              className="bg-white p-4 rounded-2xl"
            >
              <TouchableOpacity
                onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="flex-row items-center justify-between"
              >
                <Text className="flex-1 font-semibold text-gray-900">{item.question}</Text>
                <Ionicons 
                  name={expandedId === item.id ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
              {expandedId === item.id && (
                <Text className="text-gray-600 mt-2">{item.answer}</Text>
              )}
            </Animated.View>
          ))}
        </View>

        {!showContactForm ? (
          <TouchableOpacity
            onPress={() => setShowContactForm(true)}
            className="mt-8 bg-primary py-4 rounded-xl flex-row items-center justify-center"
          >
            <Ionicons name="mail-outline" size={24} color="white" />
            <Text className="text-white font-semibold ml-2">
              Contact Support
            </Text>
          </TouchableOpacity>
        ) : (
          <Animated.View 
            entering={FadeInUp}
            className="mt-8 space-y-4"
          >
            <TextInput
              value={contactForm.subject}
              onChangeText={(text) => setContactForm(prev => ({ ...prev, subject: text }))}
              placeholder="Subject"
              className="bg-white p-4 rounded-xl"
            />
            <TextInput
              value={contactForm.message}
              onChangeText={(text) => setContactForm(prev => ({ ...prev, message: text }))}
              placeholder="How can we help?"
              multiline
              numberOfLines={4}
              className="bg-white p-4 rounded-xl"
              textAlignVertical="top"
            />
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-primary py-4 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                Submit Ticket
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
} 