import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { SPICES, type Spice } from '@/app/data/spices';
import { Toast } from '@/app/components/ui/Toast';
import { QuantitySelector } from '@/app/components/product/QuantitySelector';
// Import SPICES data
    

export default function ProductScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Find product from SPICES data (we should move this to a global store later)
  const product = SPICES.find((p: Spice) => p.id === id);
  
  if (!product) return null;

  const handleAddToCart = () => {
    // Add to cart logic here
    setToast({ message: 'Added to cart successfully!', type: 'success' });
    setTimeout(() => {
      router.push('/(user)/cart');
    }, 1000);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setToast({ 
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites!', 
      type: 'success' 
    });
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onHide={() => setToast(null)} 
        />
      )}
      
      {/* Header */}
      <BlurView intensity={70} className="absolute top-0 left-0 right-0 z-50">
        <View style={{ paddingTop: insets.top }} className="px-4 pb-4">
          <View className="flex-row items-center justify-between py-4">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
              <Ionicons name="share-outline" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingTop: insets.top + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View className="px-4 py-6 bg-gray-50 rounded-b-3xl">
          <Image 
            source={product.image}
            className="w-full h-72"
            resizeMode="contain"
          />
          {product.discount > 0 && (
            <View className="absolute top-8 left-8 bg-red-500 px-3 py-1.5 rounded-full">
              <Text className="text-white font-medium">-{product.discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View className="p-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-semibold text-gray-900">{product.name}</Text>
              <Text className="text-gray-500 mt-1">{product.description}</Text>
            </View>
            <TouchableOpacity 
              className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#EF4444" : "#666"} 
              />
            </TouchableOpacity>
          </View>

          {/* Rating & Weight */}
          <View className="flex-row items-center mt-4">
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color="#FBBF24" />
              <Text className="text-gray-900 font-medium ml-1">{product.rating}</Text>
              <Text className="text-gray-500 ml-1">({product.reviews} reviews)</Text>
            </View>
            <View className="w-1 h-1 bg-gray-300 rounded-full mx-3" />
            <Text className="text-gray-500">{product.weight}</Text>
          </View>

          <QuantitySelector 
            quantity={quantity}
            onIncrease={() => setQuantity(q => q + 1)}
            onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
            price={product.price}
          />
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <Animated.View 
        entering={SlideInDown.delay(200)}
        className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100"
      >
        <TouchableOpacity 
          className="w-full bg-primary py-4 rounded-2xl items-center"
          onPress={handleAddToCart}
        >
          <Text className="text-white font-semibold text-lg">
            Add to Cart • ₵{(product.price * quantity).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
} 