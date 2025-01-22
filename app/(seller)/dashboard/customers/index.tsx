import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState, useMemo } from 'react';

// Define filter types
type FilterStatus = 'all' | 'active' | 'inactive';
type SortBy = 'recent' | 'orders' | 'spent';

const CUSTOMERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    orders: 12,
    totalSpent: 1250.50,
    lastOrder: '2024-03-15',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    orders: 8,
    totalSpent: 890.75,
    lastOrder: '2024-03-10',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'inactive',
  },
  {
    id: '3',
    name: 'Augustus Tsatsu',
    email: 'augustus@gmail.com',
    orders: 10,
    totalSpent: 992.5,
    lastOrder: '2025-01-03',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'active',
  }] as const;

export default function CustomersScreen() {
  const insets = useSafeAreaInsets();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    return CUSTOMERS
      .filter(customer => {
        const matchesSearch = 
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = 
          filterStatus === 'all' || customer.status === filterStatus;

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'orders':
            return b.orders - a.orders;
          case 'spent':
            return b.totalSpent - a.totalSpent;
          case 'recent':
          default:
            return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime();
        }
      });
  }, [searchQuery, filterStatus, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = CUSTOMERS.length;
    const active = CUSTOMERS.filter(c => c.status === 'active').length;
    return {
      total,
      active,
      inactive: total - active
    };
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View 
        className="bg-white px-6 border-b border-gray-200"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between py-4">
          <Text className="text-xl font-semibold">Customers</Text>
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity 
              className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
              onPress={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Ionicons name="search" size={22} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons name="options-outline" size={22} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        {isSearchVisible && (
          <Animated.View 
            entering={FadeInUp}
            className="pb-4"
          >
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4">
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-3 px-3"
                placeholder="Search customers..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}

        {/* Filter Options */}
        {showFilters && (
          <Animated.View 
            entering={FadeInUp}
            className="pb-4 space-y-4"
          >
            {/* Status Filter */}
            <View className="flex-row space-x-2">
              {(['all', 'active', 'inactive'] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full ${
                    filterStatus === status ? 'bg-primary' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`capitalize ${
                      filterStatus === status ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Sort Options */}
            <View className="flex-row space-x-2">
              {([
                { value: 'recent', label: 'Recent' },
                { value: 'orders', label: 'Orders' },
                { value: 'spent', label: 'Spent' }
              ] as const).map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSortBy(option.value)}
                  className={`px-4 py-2 rounded-full ${
                    sortBy === option.value ? 'bg-primary' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`${
                      sortBy === option.value ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}
      </View>

      {/* Stats Bar */}
      <View className="flex-row justify-between px-6 py-4 bg-white mt-2">
        <View className="items-center">
          <Text className="text-2xl font-semibold text-[#22C55E]">{stats.total}</Text>
          <Text className="text-gray-500 text-sm">Total</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-semibold text-blue-500">{stats.active}</Text>
          <Text className="text-gray-500 text-sm">Active</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-semibold text-gray-400">{stats.inactive}</Text>
          <Text className="text-gray-500 text-sm">Inactive</Text>
        </View>
      </View>

      {/* Customer List */}
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-4">
          {filteredCustomers.map((customer, index) => (
            <Animated.View 
              key={customer.id}
              entering={FadeInUp.delay(index * 100)}
              className="bg-white p-5 rounded-2xl"
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3
              }}
            >
              <View className="flex-row items-center">
                <View className="relative">
                  <Image 
                    source={{ uri: customer.avatar }}
                    className="w-14 h-14 rounded-full"
                  />
                  <View 
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                      customer.status === 'active' ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-semibold">{customer.name}</Text>
                  <Text className="text-gray-500">{customer.email}</Text>
                </View>
                <TouchableOpacity 
                  className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
                >
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-100">
                <View className="items-center">
                  <Text className="text-gray-500 text-sm mb-1">Orders</Text>
                  <Text className="text-lg font-medium">{customer.orders}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-gray-500 text-sm mb-1">Spent</Text>
                  <Text className="text-lg font-medium text-[#22C55E]">
                  ₵{customer.totalSpent.toFixed(0)}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-gray-500 text-sm mb-1">Last Order</Text>
                  <Text className="text-sm font-medium">
                    {new Date(customer.lastOrder).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}