import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PaymentMethod = {
  id: string;
  type: 'momo' | 'bank';
  name: string;
  icon: string;
  color: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'mtn',
    type: 'momo',
    name: 'MTN Mobile Money',
    icon: 'phone-portrait-outline',
    color: '#FDB913',
  },
  {
    id: 'telecel',
    type: 'momo',
    name: 'Telecel Cash',
    icon: 'phone-portrait-outline',
    color: '#E40520',
  },
  {
    id: 'ecobank',
    type: 'bank',
    name: 'Ecobank',
    icon: 'business-outline',
    color: '#0066B3',
  },
  {
    id: 'gcb',
    type: 'bank',
    name: 'GCB Bank',
    icon: 'business-outline',
    color: '#E31B23',
  },
];

type Props = {
  isVisible: boolean;
  onClose: () => void;
  balance: number;
  onSubmit: (data: {
    amount: number;
    method: PaymentMethod;
    accountNumber: string;
    accountName: string;
  }) => void;
};

export default function WithdrawModal({ isVisible, onClose, balance, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const handleSubmit = () => {
    if (!selectedMethod || !amount || !accountNumber || !accountName) return;
    
    onSubmit({
      amount: Number(amount),
      method: selectedMethod,
      accountNumber,
      accountName
    });
    
    // Reset form
    setAmount('');
    setSelectedMethod(null);
    setAccountNumber('');
    setAccountName('');
    onClose();
  };

  const isValidAmount = Number(amount) > 0 && Number(amount) <= balance;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        <View 
          className="bg-white px-6 border-b border-gray-200"
          style={{ paddingTop: insets.top }}
        >
          <View className="flex-row justify-between items-center py-4">
            <Text className="text-xl font-semibold">Withdraw Funds</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-6">
          {/* Amount Input */}
          <View className="mb-6">
            <Text className="text-gray-500 mb-2">Amount to Withdraw</Text>
            <View className="bg-white p-4 rounded-xl flex-row items-center">
              <Text className="text-xl font-semibold mr-2">₵</Text>
              <TextInput
                className="flex-1 text-xl"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>
            <Text className="text-gray-500 text-sm mt-2">
              Available Balance: ₵{balance.toFixed(2)}
            </Text>
            {amount && !isValidAmount && (
              <Text className="text-red-500 text-sm mt-1">
                Please enter a valid amount
              </Text>
            )}
          </View>

          {/* Payment Methods */}
          <View className="mb-6">
            <Text className="text-gray-500 mb-2">Select Payment Method</Text>
            <View className="space-y-2">
              {PAYMENT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  className={`flex-row items-center p-4 rounded-xl ${
                    selectedMethod?.id === method.id 
                      ? 'bg-green-50 border-2 border-[#22C55E]' 
                      : 'bg-white'
                  }`}
                  onPress={() => setSelectedMethod(method)}
                >
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${method.color}20` }}
                  >
                    <Ionicons 
                      name={method.icon as any} 
                      size={20} 
                      color={method.color} 
                    />
                  </View>
                  <Text className="flex-1 ml-3 font-medium">{method.name}</Text>
                  <View className="w-6 h-6 rounded-full border-2 border-gray-300 items-center justify-center">
                    {selectedMethod?.id === method.id && (
                      <View className="w-4 h-4 rounded-full bg-[#22C55E]" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Account Details */}
          {selectedMethod && (
            <View className="space-y-4">
              <View>
                <Text className="text-gray-500 mb-2">
                  {selectedMethod.type === 'momo' ? 'Mobile Number' : 'Account Number'}
                </Text>
                <TextInput
                  className="bg-white p-4 rounded-xl"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder={
                    selectedMethod.type === 'momo' 
                      ? 'Enter mobile number' 
                      : 'Enter account number'
                  }
                  keyboardType="numeric"
                />
              </View>
              <View>
                <Text className="text-gray-500 mb-2">
                  {selectedMethod.type === 'momo' ? 'Account Name' : 'Account Holder Name'}
                </Text>
                <TextInput
                  className="bg-white p-4 rounded-xl"
                  value={accountName}
                  onChangeText={setAccountName}
                  placeholder="Enter account name"
                />
              </View>
            </View>
          )}
        </ScrollView>

        <View 
          className="bg-white border-t border-gray-200"
          style={{ paddingBottom: insets.bottom }}
        >
          <TouchableOpacity 
            className={`mx-6 my-4 p-4 rounded-xl ${
              isValidAmount && selectedMethod && accountNumber && accountName
                ? 'bg-[#22C55E]'
                : 'bg-gray-300'
            }`}
            onPress={handleSubmit}
            disabled={!isValidAmount || !selectedMethod || !accountNumber || !accountName}
          >
            <Text className="text-white text-center font-semibold">
              Withdraw ₵{amount || '0.00'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
} 