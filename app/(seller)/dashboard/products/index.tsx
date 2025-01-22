import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState, useMemo } from 'react';
import { Link } from 'expo-router';

// Define product types and filters
type ProductStatus = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
type SortBy = 'recent' | 'price' | 'stock' | 'sales';

const PRODUCTS = [
  {
    id: '1',
    name: 'iPhone 13 Pro Max',
    category: 'Electronics',
    price: 1299.99,
    stock: 15,
    sales: 124,
    thumbnail: 'https://picsum.photos/200/200',
    status: 'in-stock',
    lastUpdated: '2024-03-15',
  },
  {
    id: '2',
    name: 'MacBook Pro M1',
    category: 'Electronics',
    price: 1999.99,
    stock: 3,
    sales: 89,
    thumbnail: 'https://picsum.photos/200/201',
    status: 'low-stock',
    lastUpdated: '2024-03-14',
  },
  {
    id: '3',
    name: 'AirPods Pro',
    category: 'Electronics',
    price: 249.99,
    stock: 0,
    sales: 56,
    thumbnail: 'https://picsum.photos/200/202',
    status: 'out-of-stock',
    lastUpdated: '2024-03-13',
  },
] as const;

export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProductStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('recent');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS
      .filter(product => {
        const matchesSearch = 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = 
          filterStatus === 'all' || product.status === filterStatus;

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return b.price - a.price;
          case 'stock':
            return b.stock - a.stock;
          case 'sales':
            return b.sales - a.sales;
          case 'recent':
          default:
            return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        }
      });
  }, [searchQuery, filterStatus, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = PRODUCTS.length;
    const inStock = PRODUCTS.filter(p => p.status === 'in-stock').length;
    const lowStock = PRODUCTS.filter(p => p.status === 'low-stock').length;
    const outOfStock = PRODUCTS.filter(p => p.status === 'out-of-stock').length;
    return { total, inStock, lowStock, outOfStock };
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View 
        className="bg-white px-6 border-b border-gray-200"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between py-4">
          <Text className="text-xl font-semibold">Products</Text>
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity 
              className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
              onPress={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Ionicons name="search" size={22} color="#374151" />
            </TouchableOpacity>
            <Link href="/add-product" asChild>
              <TouchableOpacity 
                className="bg-[#22C55E] px-4 py-2 rounded-full flex-row items-center"
              >
                <Ionicons name="add" size={20} color="white" />
                <Text className="text-white font-medium ml-1">Add Product</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Search Input */}
        {isSearchVisible && (
          <Animated.View 
            entering={FadeInUp}
            className="pb-4"
          >
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-2 px-3"
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ) : null}
            </View>
          </Animated.View>
        )}

        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="pb-4"
        >
          <View className="flex-row space-x-2">
            {(['all', 'in-stock', 'low-stock', 'out-of-stock'] as const).map((status) => (
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
                  {status.replace('-', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Stats */}
      <View className="flex-row justify-between px-6 py-4 bg-white mt-2">
        <View className="items-center">
          <Text className="text-2xl font-semibold text-gray-700">{stats.total}</Text>
          <Text className="text-gray-500 text-sm">Total</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-semibold text-[#22C55E]">{stats.inStock}</Text>
          <Text className="text-gray-500 text-sm">In Stock</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-semibold text-orange-500">{stats.lowStock}</Text>
          <Text className="text-gray-500 text-sm">Low Stock</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-semibold text-red-500">{stats.outOfStock}</Text>
          <Text className="text-gray-500 text-sm">Out of Stock</Text>
        </View>
      </View>

      {/* Product List */}
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-4">
          {filteredProducts.map((product, index) => (
            <Animated.View 
              key={product.id}
              entering={FadeInUp.delay(index * 100)}
              className="bg-white p-4 rounded-2xl shadow-sm"
            >
              <View className="flex-row">
                <Image 
                  source={{ uri: product.thumbnail }}
                  className="w-20 h-20 rounded-xl"
                />
                <View className="flex-1 ml-4">
                  <Text className="text-lg font-semibold">{product.name}</Text>
                  <Text className="text-gray-500">{product.category}</Text>
                  <Text className="text-[#22C55E] font-semibold mt-1">
                    ₵{product.price.toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity 
                  className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
                >
                  <Ionicons name="ellipsis-vertical" size={20} color="#374151" />
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-100">
                <View className="items-center">
                  <Text className="text-gray-500 text-sm">Stock</Text>
                  <Text className={`text-lg font-medium ${
                    product.stock === 0 ? 'text-red-500' :
                    product.stock <= 5 ? 'text-orange-500' :
                    'text-[#22C55E]'
                  }`}>
                    {product.stock}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-gray-500 text-sm">Sales</Text>
                  <Text className="text-lg font-medium">{product.sales}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-gray-500 text-sm">Last Updated</Text>
                  <Text className="text-sm font-medium">
                    {new Date(product.lastUpdated).toLocaleDateString()}
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