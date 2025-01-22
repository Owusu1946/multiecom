import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import { FadeInUp } from 'react-native-reanimated';
import WithdrawModal from '@/app/components/seller/WithdrawModal';

type TransactionType = 'all' | 'sales' | 'payouts' | 'refunds';

const TRANSACTIONS = [
  {
    id: '1',
    type: 'sale',
    amount: 950.00,
    date: '2024-03-15',
    status: 'completed',
    customer: 'John Doe',
    orderId: '#ORD-001',
  },
  {
    id: '2',
    type: 'payout',
    amount: 500.00,
    date: '2024-03-14',
    status: 'processing',
    reference: '#PAY-001',
    method: 'Bank Transfer',
  },
  {
    id: '3',
    type: 'refund',
    amount: 75.00,
    date: '2024-03-13',
    status: 'completed',
    customer: 'Jane Smith',
    orderId: '#ORD-002',
  },
  {
    id: '4',
    type: 'payout',
    amount: 100.00,
    date: '2024-03-16',
    status: 'pending',
    reference: '#PAY-002',
    method: 'MTN Mobile Money',
  },
] as const;

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const [transactionType, setTransactionType] = useState<TransactionType>('all');
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);

  const stats = useMemo(() => {
    const totalSales = TRANSACTIONS
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalPayouts = TRANSACTIONS
      .filter(t => t.type === 'payout')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalRefunds = TRANSACTIONS
      .filter(t => t.type === 'refund')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalSales - totalPayouts - totalRefunds;
    
    return { totalSales, totalPayouts, totalRefunds, balance };
  }, []);

  const filteredTransactions = useMemo(() => {
    if (transactionType === 'all') return TRANSACTIONS;
    return TRANSACTIONS.filter(t => {
      switch (transactionType) {
        case 'sales': return t.type === 'sale';
        case 'payouts': return t.type === 'payout';
        case 'refunds': return t.type === 'refund';
        default: return true;
      }
    });
  }, [transactionType]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View 
        className="bg-white px-6 border-b border-gray-200"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between py-4">
          <Text className="text-xl font-semibold">Transactions</Text>
          <TouchableOpacity 
            className="bg-[#22C55E] px-4 py-2 rounded-full flex-row items-center"
            onPress={() => setIsWithdrawModalVisible(true)}
          >
            <Ionicons name="cash-outline" size={20} color="white" />
            <Text className="text-white ml-1 font-medium">Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View className="bg-[#22C55E] p-6 rounded-2xl mb-4">
          <Text className="text-white/80 text-sm mb-1">Available Balance</Text>
          <Text className="text-white text-3xl font-semibold">
            ₵{stats.balance.toFixed(2)}
          </Text>
          <View className="flex-row mt-4 space-x-4">
            <View>
              <Text className="text-white/80 text-xs">Total Sales</Text>
              <Text className="text-white font-medium">₵{stats.totalSales.toFixed(2)}</Text>
            </View>
            <View>
              <Text className="text-white/80 text-xs">Total Payouts</Text>
              <Text className="text-white font-medium">₵{stats.totalPayouts.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="py-2"
        >
          {(['all', 'sales', 'payouts', 'refunds'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setTransactionType(type)}
              className={`mr-2 px-4 py-2 rounded-full ${
                transactionType === type ? 'bg-green-100' : 'bg-gray-100'
              }`}
            >
              <Text className={`capitalize ${
                transactionType === type ? 'text-[#22C55E]' : 'text-gray-600'
              }`}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Transactions List */}
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-4">
          {filteredTransactions.map((transaction, index) => (
            <Animated.View 
              key={transaction.id}
              entering={FadeInUp.delay(index * 100)}
              className="bg-white p-4 rounded-xl"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3
              }}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <View className={`w-10 h-10 rounded-full items-center justify-center ${
                      transaction.type === 'sale' ? 'bg-green-100' :
                      transaction.type === 'payout' ? 'bg-blue-100' : 'bg-red-100'
                    }`}>
                      <Ionicons 
                        name={
                          transaction.type === 'sale' ? 'cart-outline' :
                          transaction.type === 'payout' ? 'cash-outline' : 'return-up-back-outline'
                        } 
                        size={20} 
                        color={
                          transaction.type === 'sale' ? '#22C55E' :
                          transaction.type === 'payout' ? '#3B82F6' : '#EF4444'
                        }
                      />
                    </View>
                    <View className="ml-3">
                      <Text className="font-medium capitalize">{transaction.type}</Text>
                      <Text className="text-gray-500 text-sm">
                        {transaction.type === 'payout' ? transaction.reference : transaction.orderId}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="items-end">
                  <Text className={`font-semibold ${
                    transaction.type === 'sale' ? 'text-[#22C55E]' :
                    transaction.type === 'payout' ? 'text-blue-500' : 'text-red-500'
                  }`}>
                                       {transaction.type === 'sale' ? '+' : '-'}₵{transaction.amount.toFixed(2)}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View className="mt-3 pt-3 border-t border-gray-100 flex-row justify-between items-center">
                {transaction.type !== 'payout' && (
                  <Text className="text-gray-500 text-sm">
                    Customer: {transaction.customer}
                  </Text>
                )}
                {transaction.type === 'payout' && (
                  <Text className="text-gray-500 text-sm">
                    Method: {transaction.method}
                  </Text>
                )}
                <View className={`px-2 py-1 rounded-full ${
                  transaction.status === 'completed' ? 'bg-green-100' : 
                  transaction.status === 'pending' ? 'bg-yellow-100' :
                  'bg-orange-100'
                }`}>
                  <Text className={`text-xs capitalize ${
                    transaction.status === 'completed' ? 'text-green-600' : 
                    transaction.status === 'pending' ? 'text-yellow-600' :
                    'text-orange-600'
                  }`}>
                    {transaction.status}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <WithdrawModal 
        isVisible={isWithdrawModalVisible}
        onClose={() => setIsWithdrawModalVisible(false)}
        balance={stats.balance}
        onSubmit={(data) => {
          console.log('Withdrawal:', data);
          // Add your withdrawal logic here
          setIsWithdrawModalVisible(false);
        }}
      />
    </View>
  );
} 