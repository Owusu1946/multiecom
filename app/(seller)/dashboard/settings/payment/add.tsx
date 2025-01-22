import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PAYMENT_METHODS = [
  {
    id: 'momo',
    name: 'Mobile Money',
    icon: 'phone-portrait-outline',
    color: '#FCD34D',
    providers: [
      { id: 'mtn', name: 'MTN Mobile Money', color: '#FDB913' },
      { id: 'telecel', name: 'Telecel Cash', color: '#E40520' },
    ]
  },
  {
    id: 'bank',
    name: 'Bank Account',
    icon: 'card-outline',
    color: '#4F46E5',
    providers: [
      { id: 'ecobank', name: 'Ecobank', color: '#0066B3' },
      { id: 'gcb', name: 'GCB Bank', color: '#E31B23' },
    ]
  }
];

export default function AddPaymentScreen() {
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState<'momo' | 'bank' | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const handleSubmit = () => {
    if (!selectedType || !selectedProvider || !accountNumber || !accountName) return;

    // Add your logic here to save the payment method
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-6 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-semibold text-center mr-6">
          Add Payment Method
        </Text>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown} className="space-y-6">
          {/* Payment Type Selection */}
          <View>
            <Text className="text-gray-600 font-medium mb-3">Select Payment Type</Text>
            <View className="space-y-3">
              {PAYMENT_METHODS.map(method => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => {
                    setSelectedType(method.id as 'momo' | 'bank');
                    setSelectedProvider(null);
                  }}
                  className={`flex-row items-center p-4 rounded-xl border ${
                    selectedType === method.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${method.color}15` }}
                  >
                    <Ionicons name={method.icon as any} size={24} color={method.color} />
                  </View>
                  <Text className={`flex-1 ml-3 font-medium ${
                    selectedType === method.id ? 'text-primary' : 'text-gray-900'
                  }`}>
                    {method.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Provider Selection */}
          {selectedType && (
            <Animated.View entering={FadeInDown.delay(100)} className="space-y-3">
              <Text className="text-gray-600 font-medium mb-3">Select Provider</Text>
              <View className="space-y-3">
                {PAYMENT_METHODS.find(m => m.id === selectedType)?.providers.map(provider => (
                  <TouchableOpacity
                    key={provider.id}
                    onPress={() => setSelectedProvider(provider.id)}
                    className={`p-4 rounded-xl border ${
                      selectedProvider === provider.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <Text className={`font-medium ${
                      selectedProvider === provider.id ? 'text-primary' : 'text-gray-900'
                    }`}>
                      {provider.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Account Details */}
          {selectedProvider && (
            <Animated.View entering={FadeInDown.delay(200)} className="space-y-4">
              <View>
                <Text className="text-gray-600 font-medium mb-2">
                  {selectedType === 'momo' ? 'Mobile Number' : 'Account Number'}
                </Text>
                <TextInput
                  className="bg-white p-4 rounded-xl border border-gray-200"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder={selectedType === 'momo' ? 'Enter mobile number' : 'Enter account number'}
                  keyboardType="numeric"
                />
              </View>
              <View>
                <Text className="text-gray-600 font-medium mb-2">
                  {selectedType === 'momo' ? 'Account Name' : 'Account Holder Name'}
                </Text>
                <TextInput
                  className="bg-white p-4 rounded-xl border border-gray-200"
                  value={accountName}
                  onChangeText={setAccountName}
                  placeholder="Enter account name"
                />
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>

      <View className="p-6 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!selectedType || !selectedProvider || !accountNumber || !accountName}
          className={`py-4 rounded-xl ${
            selectedType && selectedProvider && accountNumber && accountName
              ? 'bg-primary'
              : 'bg-gray-300'
          }`}
        >
          <Text className="text-white font-semibold text-center">Add Payment Method</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 