import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';

interface PaymentMethod {
  id: string;
  type: 'momo' | 'bank';
  provider: string;
  accountNumber: string;
  accountName: string;
  isDefault?: boolean;
}

interface Transaction {
  id: string;
  type: 'withdrawal' | 'earning';
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  method: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm1',
    type: 'momo',
    provider: 'MTN MoMo',
    accountNumber: '024*****789',
    accountName: 'John Doe',
    isDefault: true
  },
  {
    id: 'pm2',
    type: 'momo',
    provider: 'Airtel Tigo Money',
    accountNumber: '027*****456',
    accountName: 'John Doe'
  },
  {
    id: 'pm3',
    type: 'bank',
    provider: 'GCB Bank',
    accountNumber: '1234****7890',
    accountName: 'John Doe'
  }
];

const TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    type: 'withdrawal',
    amount: 500.00,
    date: '2024-03-15 14:30',
    status: 'completed',
    method: 'MTN MoMo'
  },
  {
    id: 'tx2',
    type: 'earning',
    amount: 150.00,
    date: '2024-03-15 12:00',
    status: 'completed',
    method: 'Delivery Earnings'
  },
  {
    id: 'tx3',
    type: 'withdrawal',
    amount: 300.00,
    date: '2024-03-14',
    status: 'pending',
    method: 'GCB Bank'
  }
];

export default function PaymentsScreen() {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawalStep, setWithdrawalStep] = useState<'confirm' | 'processing' | 'success'>('confirm');

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  const processWithdrawal = () => {
    setWithdrawalStep('processing');
    // Simulate API call
    setTimeout(() => {
      setWithdrawalStep('success');
    }, 2000);
  };

  const handleDismiss = () => {
    setShowWithdrawModal(false);
    setWithdrawalStep('confirm');
    setAmount('');
    setSelectedMethod(null);
  };

  const WithdrawalModal = () => {
    return (
      <Modal
        visible={showWithdrawModal}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <Animated.View 
            entering={FadeIn}
            className="bg-white w-[90%] rounded-2xl p-6"
          >
            {withdrawalStep === 'confirm' && (
              <>
                <View className="items-center mb-6">
                  <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-4">
                    <Ionicons name="cash-outline" size={32} color="#4F46E5" />
                  </View>
                  <Text className="text-xl font-semibold text-gray-900">Confirm Withdrawal</Text>
                  <Text className="text-gray-500 text-center mt-2">
                    You are about to withdraw GH₵ {amount} to your {selectedMethod?.provider} account
                  </Text>
                </View>

                <View className="bg-gray-50 p-4 rounded-xl mb-6">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-500">Amount</Text>
                    <Text className="font-semibold">GH₵ {amount}</Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-500">Fee</Text>
                    <Text className="font-semibold">GH₵ 0.00</Text>
                  </View>
                  <View className="flex-row justify-between pt-2 border-t border-gray-200">
                    <Text className="text-gray-900 font-medium">Total</Text>
                    <Text className="font-semibold">GH₵ {amount}</Text>
                  </View>
                </View>

                <View className="flex-row space-x-4">
                  <TouchableOpacity
                    onPress={() => setShowWithdrawModal(false)}
                    className="flex-1 py-3 bg-gray-100 rounded-xl"
                  >
                    <Text className="text-gray-600 text-center font-medium">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={processWithdrawal}
                    className="flex-1 py-3 bg-primary rounded-xl"
                  >
                    <Text className="text-white text-center font-medium">Confirm</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {withdrawalStep === 'processing' && (
              <View className="items-center py-8">
                <LottieView
                  autoPlay
                  style={{ width: 120, height: 120 }}
                  source={require('@/assets/Onboarding/fast delivery.json')}
                />
                <Text className="text-lg font-semibold mt-4">Processing Withdrawal</Text>
                <Text className="text-gray-500 text-center mt-2">
                  Please wait while we process your withdrawal request
                </Text>
              </View>
            )}

            {withdrawalStep === 'success' && (
              <View className="items-center py-8">
                <LottieView
                  autoPlay
                  style={{ width: 120, height: 120 }}
                  source={require('@/assets/Onboarding/fast delivery.json')}
                />
                <Text className="text-lg font-semibold mt-4">Withdrawal Initiated!</Text>
                <Text className="text-gray-500 text-center mt-2 mb-6">
                  Your withdrawal request has been initiated. You'll receive a notification once it's completed.
                </Text>
                <TouchableOpacity
                  onPress={handleDismiss}
                  className="bg-primary w-full py-3 rounded-xl"
                >
                  <Text className="text-white text-center font-medium">
                    Dismiss
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    );
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <View 
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top }}
    >
      <WithdrawalModal />
      
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Payments</Text>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <Animated.View 
          entering={FadeInDown.delay(200)}
          className="bg-primary p-6 rounded-2xl mb-6"
        >
          <Text className="text-white/80">Available Balance</Text>
          <Text className="text-white text-3xl font-bold mt-1">GH₵ 1,250.00</Text>
          
          {/* Quick Withdraw Input */}
          <View className="mt-4 bg-white/10 rounded-xl p-4">
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount to withdraw"
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType="numeric"
              className="text-white text-lg"
            />
            <TouchableOpacity
              onPress={handleWithdraw}
              disabled={!amount || !selectedMethod}
              className={`mt-3 py-3 rounded-lg ${
                amount && selectedMethod ? 'bg-white' : 'bg-white/50'
              }`}
            >
              <Text className={`text-center font-medium ${
                amount && selectedMethod ? 'text-primary' : 'text-primary/50'
              }`}>
                Withdraw Now
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Payment Methods */}
        <Animated.View 
          entering={FadeInDown.delay(300)}
          className="bg-white rounded-2xl p-6 mb-6"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Payment Methods</Text>
            <TouchableOpacity 
              onPress={() => router.push('/dashboard/payments/add-method')}
              className="flex-row items-center"
            >
              <Ionicons name="add-circle-outline" size={20} color="#4F46E5" />
              <Text className="text-primary ml-1">Add New</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedMethod(method)}
                className={`p-4 rounded-xl border ${
                  selectedMethod?.id === method.id 
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200'
                }`}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                      <Ionicons 
                        name={method.type === 'momo' ? 'phone-portrait-outline' : 'card-outline'}
                        size={20}
                        color="#4F46E5"
                      />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="font-medium">{method.provider}</Text>
                      <Text className="text-gray-500 text-sm">
                        {method.accountNumber}
                      </Text>
                    </View>
                  </View>
                  {method.isDefault && (
                    <View className="bg-primary/10 px-3 py-1 rounded-full">
                      <Text className="text-primary text-sm">Default</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recent Transactions */}
        <Animated.View 
          entering={FadeInDown.delay(400)}
          className="bg-white rounded-2xl p-6"
        >
          <Text className="text-lg font-semibold mb-4">Recent Transactions</Text>
          <View className="space-y-4">
            {TRANSACTIONS.map((transaction) => (
              <View 
                key={transaction.id}
                className="flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <View className={`w-10 h-10 rounded-full items-center justify-center ${
                    transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <Ionicons 
                      name={transaction.type === 'withdrawal' ? 'arrow-up' : 'arrow-down'}
                      size={20}
                      color={transaction.type === 'withdrawal' ? '#EF4444' : '#22C55E'}
                    />
                  </View>
                  <View className="ml-3">
                    <Text className="font-medium">
                      {transaction.type === 'withdrawal' ? 'Withdrawal' : 'Earning'}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {transaction.method}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="font-medium">
                    {transaction.type === 'withdrawal' ? '-' : '+'}
                    GH₵ {transaction.amount.toFixed(2)}
                  </Text>
                  <Text className={`text-sm ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
} 