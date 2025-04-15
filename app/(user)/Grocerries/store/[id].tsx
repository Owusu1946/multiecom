import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, FlatList, TextInput, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Toast } from '@/app/components/ui/Toast';

// Define types
type Store = {
  id: string;
  name: string;
  description: string;
  image: any;
  coverImage: any;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: string;
  isOpen: boolean;
  discount: string;
  featured: boolean;
  tags: string[];
  minOrder: string;
  location: string;
  distance: string;
}

type StoresData = {
  [key: string]: Store;
}

type CartItem = {
  name: string;
  quantity: number;
  price?: number;
  note?: string;
}

type PendingIngredient = {
  name: string;
  price: string;
};

// Sample data for stores
const STORES: StoresData = {
  '1': {
    id: '1',
    name: 'Fresh Market',
    description: 'Premium organic groceries',
    image: require('@/assets/images/adaptive-icon.png'),
    coverImage: require('@/assets/images/adaptive-icon.png'),
    rating: 4.8,
    reviews: 128,
    deliveryTime: '20-30 min',
    deliveryFee: '₵3.99',
    isOpen: true,
    discount: '10% OFF',
    featured: true,
    tags: ['Organic', 'Fresh Produce'],
    minOrder: '₵10.00',
    location: '123 Market Avenue, Accra',
    distance: '2.5 km'
  },
  '2': {
    id: '2',
    name: 'Global Foods',
    description: 'International grocery selection',
    image: require('@/assets/images/adaptive-icon.png'),
    coverImage: require('@/assets/images/adaptive-icon.png'),
    rating: 4.9,
    reviews: 95,
    deliveryTime: '25-40 min',
    deliveryFee: '₵2.50',
    isOpen: true,
    discount: '',
    featured: false,
    tags: ['International', 'Bulk Items'],
    minOrder: '₵15.00',
    location: '45 Market Street, Kumasi',
    distance: '3.2 km'
  },
  '3': {
    id: '3',
    name: 'Family Mart',
    description: 'Everyday essentials & fresh food',
    image: require('@/assets/images/adaptive-icon.png'),
    coverImage: require('@/assets/images/adaptive-icon.png'),
    rating: 4.7,
    reviews: 156,
    deliveryTime: '30-45 min',
    deliveryFee: '₵4.50',
    isOpen: true,
    discount: '15% OFF',
    featured: true,
    tags: ['Local Produce', 'Bakery'],
    minOrder: '₵8.00',
    location: '78 Central Road, Tamale',
    distance: '1.8 km'
  },
  '4': {
    id: '4',
    name: 'Green Basket',
    description: 'Farm-to-table groceries',
    image: require('@/assets/images/adaptive-icon.png'),
    coverImage: require('@/assets/images/adaptive-icon.png'),
    rating: 4.6,
    reviews: 89,
    deliveryTime: '15-25 min',
    deliveryFee: '₵3.50',
    isOpen: false,
    discount: '',
    featured: false,
    tags: ['Sustainable', 'Local'],
    minOrder: '₵12.00',
    location: '22 Eco Lane, Cape Coast',
    distance: '4.3 km'
  }
};

// Sample data for products
const GROCERIES = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    description: 'Locally grown tomatoes',
    price: 12.99,
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.8,
    reviews: 128,
    weight: '1kg',
    isAvailable: true,
    discount: 10,
  },
  {
    id: '2',
    name: 'Whole Grain Bread',
    description: 'Freshly baked daily',
    price: 15.99,
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.9,
    reviews: 95,
    weight: '500g',
    isAvailable: true,
    discount: 0,
  },
  {
    id: '3',
    name: 'Organic Milk',
    description: 'Grass-fed cow milk',
    price: 9.99,
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.7,
    reviews: 156,
    weight: '1L',
    isAvailable: true,
    discount: 15,
  },
  {
    id: '4',
    name: 'Free-Range Eggs',
    description: 'Farm fresh eggs',
    price: 8.99,
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.6,
    reviews: 89,
    weight: 'Pack of 12',
    isAvailable: false,
    discount: 0,
  },
  {
    id: '5',
    name: 'Organic Apples',
    description: 'Sweet and crisp',
    price: 18.99,
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.7,
    reviews: 72,
    weight: '1kg',
    isAvailable: true,
    discount: 5,
  },
  {
    id: '6',
    name: 'Brown Rice',
    description: 'Whole grain brown rice',
    price: 7.99,
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.5,
    reviews: 64,
    weight: '2kg',
    isAvailable: true,
    discount: 0,
  }
];

const CATEGORIES = ['All', 'Popular', 'Fresh Produce', 'Dairy', 'Bakery', 'Meat', 'Beverages', 'Organic'];

// Sample data for popular items
const POPULAR_ITEMS = [
  "Bananas",
  "Bread",
  "Milk",
  "Eggs",
  "Rice",
  "Pasta",
  "Chicken",
  "Potatoes",
  "Onions",
  "Cheese",
  "Yogurt",
  "Vegetables"
];

export default function StoreScreen() {
  const insets = useSafeAreaInsets();
  const { id, category } = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [itemInput, setItemInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showPriceEditor, setShowPriceEditor] = useState(false);
  const [menuInput, setMenuInput] = useState('');
  const [pendingIngredients, setPendingIngredients] = useState<PendingIngredient[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  // Get store data
  const store = STORES[id as string] || null;
  
  if (!store) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Store not found</Text>
      </View>
    );
  }

  const handleAddItem = () => {
    if (!itemInput.trim()) return;
    
    // Parse price input
    let price: number | undefined = undefined;
    if (priceInput.trim()) {
      const parsedPrice = parseFloat(priceInput.trim());
      if (!isNaN(parsedPrice) && parsedPrice > 0) {
        price = parsedPrice;
      }
    }
    
    // Check if the item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      item => item.name.toLowerCase() === itemInput.trim().toLowerCase()
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      
      // Update price if provided
      if (price !== undefined) {
        updatedItems[existingItemIndex].price = price;
      }
      
      setCartItems(updatedItems);
      setToast({ message: `Increased quantity of ${itemInput}`, type: 'success' });
    } else {
      // Add new item with price if provided
      setCartItems([...cartItems, { 
        name: itemInput.trim(), 
        quantity: 1,
        price
      }]);
      setToast({ message: `Added ${itemInput} to your cart`, type: 'success' });
    }
    
    // Clear inputs
    setItemInput('');
    setPriceInput('');
  };

  const handleAddQuickItem = (addition: string) => {
    if (!itemInput.trim()) {
      // If no input, set this tag as the input
      setItemInput(addition);
      return;
    }
    
    const updatedInput = `${itemInput} ${addition}`.trim();
    setItemInput(updatedInput);
  };

  const updateCartItemQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    
    const updatedItems = [...cartItems];
    updatedItems[index] = { ...updatedItems[index], quantity };
    setCartItems(updatedItems);
  };

  const removeCartItem = (index: number) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    setCartItems(updatedItems);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setToast({ message: 'Please add at least one item to your cart', type: 'error' });
      return;
    }

    try {
      // Encode cart items to pass in URL params
      const cartItemsParam = encodeURIComponent(JSON.stringify(cartItems));
      router.push(`/Grocerries/checkout?storeId=${id}&cartItems=${cartItemsParam}` as any);
    } catch (error) {
      console.error('Error navigating to checkout:', error);
      setToast({ message: 'Error proceeding to checkout', type: 'error' });
    }
  };

  // Handle AI menu generation
  const handleGenerateIngredients = async () => {
    if (!menuInput.trim()) {
      setToast({ message: 'Please enter a meal or menu', type: 'error' });
      return;
    }

    setIsLoadingAI(true);

    try {
      // NOTE: In a production app, API calls should go through a backend service
      // to protect API keys. This is simplified for demonstration purposes.
      const apiKey = 'AIzaSyBoGzLU3TL6G09R7_Pn3U4JUvN4GblE9PM';
      const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
      
      const prompt = `
        I need a list of grocery ingredients to make the following meal or menu: "${menuInput}".
        
        Please provide a simple list of grocery ingredients needed for this meal.
        For example, if the meal is spaghetti bolognese, the ingredients might include:
        - Ground beef
        - Onions
        - Garlic
        - Tomato paste
        - Canned tomatoes
        - Spaghetti
        - Olive oil
        - Salt
        - Pepper
        - Italian herbs

        Return only the ingredients list without any explanations or cooking instructions.
      `;

      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          }
        })
      });

      const data = await response.json();
      
      if (!data || !data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Unexpected API response structure:', JSON.stringify(data));
        throw new Error('Invalid response format from AI service');
      }
      
      // Extract the text from the response
      const textResponse = data.candidates[0].content.parts[0].text;
      
      if (!textResponse) {
        console.error('No text in response:', JSON.stringify(data));
        throw new Error('No text content in AI response');
      }

      // Parse the text response into ingredient items
      const ingredients = textResponse
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0 && (line.startsWith('-') || line.match(/^[0-9]+\./)))
        .map((line: string) => line.replace(/^[-0-9.\s]+/, '').trim())
        .filter((line: string) => line.length > 0);

      // If no ingredients were parsed with the structured approach, try a simpler approach
      if (ingredients.length === 0) {
        const simpleIngredients = textResponse
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 2 && !line.includes(':') && !line.toUpperCase().match(/^[A-Z\s]+$/))
          .map((line: string) => line.replace(/^[•\-*]\s*/, '').trim());
          
        if (simpleIngredients.length > 0) {
          ingredients.push(...simpleIngredients);
        }
      }

      if (ingredients.length === 0) {
        console.error('Could not parse ingredients from:', textResponse);
        throw new Error('Could not identify ingredients in the AI response');
      }

      // Create pending ingredients with empty prices instead of directly adding to cart
      const newPendingIngredients = ingredients.map((name: string) => ({ 
        name, 
        price: ''  // Empty price field for user to fill
      }));
      
      // Set the pending ingredients and show the price editor
      setPendingIngredients(newPendingIngredients);
      setShowAIAssistant(false);
      setShowPriceEditor(true);
      
    } catch (error) {
      console.error('Error generating ingredients:', error);
      setToast({ 
        message: 'Failed to generate ingredients. Please try again.', 
        type: 'error' 
      });
      setPendingIngredients([]);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Add ingredients to cart after price editing
  const handleAddIngredientsToCart = () => {
    // Convert pending ingredients to cart items
    const newItems = pendingIngredients.map(item => {
      // Parse price if it exists
      let price: number | undefined = undefined;
      if (item.price.trim()) {
        const parsedPrice = parseFloat(item.price.trim());
        if (!isNaN(parsedPrice) && parsedPrice > 0) {
          price = parsedPrice;
        }
      }
      
      return {
        name: item.name,
        quantity: 1,
        price
      };
    });
    
    // Check for duplicates and merge with existing cart
    const updatedCart = [...cartItems];
    
    newItems.forEach((newItem: { name: string, quantity: number, price?: number }) => {
      const existingIndex = updatedCart.findIndex(
        item => item.name.toLowerCase() === newItem.name.toLowerCase()
      );
      
      if (existingIndex >= 0) {
        updatedCart[existingIndex].quantity += 1;
        // Update price if provided
        if (newItem.price !== undefined) {
          updatedCart[existingIndex].price = newItem.price;
        }
      } else {
        updatedCart.push(newItem);
      }
    });
    
    // Update cart, clear pending ingredients, and hide price editor
    setCartItems(updatedCart);
    setPendingIngredients([]);
    setShowPriceEditor(false);
    setToast({ 
      message: `Added ${newItems.length} ingredients for your meal!`, 
      type: 'success' 
    });
  };

  // Skip price editing and add ingredients directly
  const handleSkipPriceEditing = () => {
    const newItems = pendingIngredients.map(item => ({
      name: item.name,
      quantity: 1,
      price: undefined
    }));
    
    // Check for duplicates and merge with existing cart
    const updatedCart = [...cartItems];
    
    newItems.forEach((newItem: { name: string, quantity: number, price?: number }) => {
      const existingIndex = updatedCart.findIndex(
        item => item.name.toLowerCase() === newItem.name.toLowerCase()
      );
      
      if (existingIndex >= 0) {
        updatedCart[existingIndex].quantity += 1;
      } else {
        updatedCart.push(newItem);
      }
    });
    
    setCartItems(updatedCart);
    setPendingIngredients([]);
    setShowPriceEditor(false);
    setToast({ 
      message: `Added ${newItems.length} ingredients for your meal!`, 
      type: 'success' 
    });
  };

  // Update price for a pending ingredient
  const updatePendingIngredientPrice = (index: number, price: string) => {
    const updatedIngredients = [...pendingIngredients];
    updatedIngredients[index] = { 
      ...updatedIngredients[index], 
      price 
    };
    setPendingIngredients(updatedIngredients);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type as 'success' | 'error'} 
          onHide={() => setToast(null)} 
        />
      )}
      
      {/* Store Header - Overlaid on top of the cover image */}
      <View className="absolute top-0 left-0 right-0 z-50" style={{ paddingTop: insets.top }}>
        <View className="px-4 py-2 flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-black/20 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View className="flex-row space-x-3">
            <TouchableOpacity className="w-10 h-10 bg-black/20 rounded-full items-center justify-center">
              <Ionicons name="heart-outline" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-black/20 rounded-full items-center justify-center">
              <Ionicons name="share-social-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Store Cover Image */}
        <View className="h-52 relative">
          <Image 
            source={store.coverImage}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30" />
          
          {/* Closed Overlay */}
          {!store.isOpen && (
            <View className="absolute inset-0 bg-black/60 items-center justify-center">
              <Text className="text-white text-2xl font-bold">Currently Closed</Text>
              <Text className="text-white/80 mt-2">Opens tomorrow at 8:00 AM</Text>
            </View>
          )}
        </View>
        
        {/* Store Information Card */}
        <View className="bg-white -mt-6 rounded-t-3xl p-4 relative">
          <View className="absolute -top-10 right-4 w-20 h-20 rounded-2xl overflow-hidden border-4 border-white">
            <Image 
              source={store.image}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          
          {/* Store Details */}
          <View className="mt-2">
            <Text className="text-2xl font-bold text-gray-900">{store.name}</Text>
            <Text className="text-gray-500 mt-1">{store.description}</Text>
            
            {/* Tags */}
            <View className="flex-row mt-3 space-x-2">
              {store.tags.map((tag) => (
                <View key={tag} className="bg-gray-100 px-3 py-1.5 rounded-full">
                  <Text className="text-gray-700 text-xs">{tag}</Text>
                </View>
              ))}
            </View>
            
            {/* Stats & Info */}
            <View className="flex-row mt-4 justify-between">
              <View className="items-center">
                <View className="flex-row items-center">
                  <Ionicons name="star" size={18} color="#FBBF24" />
                  <Text className="text-gray-900 text-lg font-semibold ml-1">{store.rating}</Text>
                </View>
                <Text className="text-gray-500 text-xs mt-1">{store.reviews} ratings</Text>
              </View>
              
              <View className="items-center">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="clock-outline" size={18} color="#6B7280" />
                  <Text className="text-gray-900 text-base font-medium ml-1">{store.deliveryTime}</Text>
                </View>
                <Text className="text-gray-500 text-xs mt-1">Delivery Time</Text>
              </View>
              
              <View className="items-center">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="bike" size={18} color="#6B7280" />
                  <Text className="text-gray-900 text-base font-medium ml-1">{store.deliveryFee}</Text>
                </View>
                <Text className="text-gray-500 text-xs mt-1">Delivery Fee</Text>
              </View>
              
              <View className="items-center">
                <View className="flex-row items-center">
                  <Feather name="package" size={18} color="#6B7280" />
                  <Text className="text-gray-900 text-base font-medium ml-1">{store.minOrder}</Text>
                </View>
                <Text className="text-gray-500 text-xs mt-1">Min Order</Text>
              </View>
            </View>
            
            {/* Location */}
            <View className="flex-row items-center mt-4 bg-gray-50 p-3 rounded-xl">
              <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center">
                <Ionicons name="location-outline" size={20} color="#4B5563" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-900 font-medium" numberOfLines={1}>{store.location}</Text>
                <Text className="text-gray-500 text-xs">{store.distance} away from your location</Text>
              </View>
              <TouchableOpacity className="bg-gray-200 p-2 rounded-lg">
                <Feather name="map-pin" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* AI Shopping Assistant Button */}
          <TouchableOpacity 
            className="flex-row items-center justify-between mt-4 bg-indigo-50 p-4 rounded-xl"
            onPress={() => setShowAIAssistant(true)}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center">
                <FontAwesome5 name="robot" size={24} color="#4F46E5" />
              </View>
              <View className="ml-3">
                <Text className="text-gray-900 font-semibold text-base">AI Shopping Assistant</Text>
                <Text className="text-gray-600 text-sm">Enter a meal, we'll suggest the ingredients</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#4F46E5" />
          </TouchableOpacity>
          
          {/* Category Pills */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Categories</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="pb-2"
            >
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`mr-2 px-4 py-2 rounded-full border ${
                    selectedCategory === category 
                      ? 'bg-primary border-primary' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text 
                    className={`text-sm font-medium ${
                      selectedCategory === category ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Custom Item Input */}
          <View className="mt-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold text-gray-900">Request Items</Text>
              <TouchableOpacity 
                className="px-3 py-1 bg-gray-100 rounded-lg flex-row items-center"
                onPress={() => setShowHowItWorks(true)}
              >
                <Ionicons name="information-circle-outline" size={16} color="#374151" />
                <Text className="text-gray-700 text-xs ml-1">How it works</Text>
              </TouchableOpacity>
            </View>
            
            <Text className="text-gray-500 text-sm mb-4">
              Simply type the grocery items you want and add them to your cart. The store will confirm availability and price.
            </Text>
            
            {/* Input Area */}
            <View className="bg-gray-50 rounded-xl p-4 mb-4">
              <View className="flex-row items-center mb-3">
                <View className="flex-1 flex-row items-center bg-white rounded-lg border border-gray-200 px-3 py-2.5">
                  <Ionicons name="search" size={18} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-2 text-gray-900"
                    placeholder="Type item name (e.g. Whole Wheat Bread)"
                    placeholderTextColor="#9CA3AF"
                    value={itemInput}
                    onChangeText={setItemInput}
                  />
                </View>
                <View className="mx-2 flex-row items-center bg-white rounded-lg border border-gray-200 px-3 py-2.5">
                  <Text className="text-gray-500 mr-1">₵</Text>
                  <TextInput
                    className="w-16 text-gray-900"
                    placeholder="Price"
                    placeholderTextColor="#9CA3AF" 
                    keyboardType="numeric"
                    value={priceInput}
                    onChangeText={setPriceInput}
                  />
                </View>
                <TouchableOpacity 
                  className="bg-primary rounded-lg px-3 py-2.5"
                  onPress={handleAddItem}
                >
                  <Ionicons name="add" size={22} color="white" />
                </TouchableOpacity>
              </View>
              
              {/* Optional extras */}
              <View className="flex-row flex-wrap">
                <TouchableOpacity 
                  className="flex-row items-center bg-white rounded-full border border-gray-200 px-3 py-1.5 mr-2 mb-2"
                  onPress={() => handleAddQuickItem("Fresh")}
                >
                  <Text className="text-gray-700 text-xs">Fresh</Text>
                  <Ionicons name="add-circle" size={14} color="#4F46E5" className="ml-1" />
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-row items-center bg-white rounded-full border border-gray-200 px-3 py-1.5 mr-2 mb-2"
                  onPress={() => handleAddQuickItem("Organic")}
                >
                  <Text className="text-gray-700 text-xs">Organic</Text>
                  <Ionicons name="add-circle" size={14} color="#4F46E5" className="ml-1" />
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-row items-center bg-white rounded-full border border-gray-200 px-3 py-1.5 mr-2 mb-2"
                  onPress={() => handleAddQuickItem("Whole")}
                >
                  <Text className="text-gray-700 text-xs">Whole</Text>
                  <Ionicons name="add-circle" size={14} color="#4F46E5" className="ml-1" />
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-row items-center bg-white rounded-full border border-gray-200 px-3 py-1.5 mr-2 mb-2"
                  onPress={() => handleAddQuickItem("Family Size")}
                >
                  <Text className="text-gray-700 text-xs">Family Size</Text>
                  <Ionicons name="add-circle" size={14} color="#4F46E5" className="ml-1" />
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-row items-center bg-white rounded-full border border-gray-200 px-3 py-1.5 mr-2 mb-2"
                  onPress={() => handleAddQuickItem("1kg")}
                >
                  <Text className="text-gray-700 text-xs">1kg</Text>
                  <Ionicons name="add-circle" size={14} color="#4F46E5" className="ml-1" />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Cart Items */}
            {cartItems.length > 0 && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-900 mb-3">Your Cart</Text>
                  
                {cartItems.map((item, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeInDown.delay(index * 50)}
                    className="bg-white rounded-xl p-3 mb-2 border border-gray-100"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-gray-900 font-medium">{item.name}</Text>
                        {item.price !== undefined ? (
                          <Text className="text-green-600 text-xs">₵{item.price.toFixed(2)}</Text>
                        ) : (
                          <Text className="text-gray-500 text-xs">Price will be confirmed by store</Text>
                        )}
                      </View>
                      
                      <View className="flex-row items-center space-x-3">
                        <View className="flex-row items-center bg-gray-100 rounded-lg">
                          <TouchableOpacity 
                            className="p-2"
                            onPress={() => updateCartItemQuantity(index, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Ionicons 
                              name="remove" 
                              size={16} 
                              color={item.quantity <= 1 ? "#D1D5DB" : "#4B5563"} 
                            />
                          </TouchableOpacity>
                          <Text className="w-6 text-center text-gray-900">{item.quantity}</Text>
                          <TouchableOpacity 
                            className="p-2"
                            onPress={() => updateCartItemQuantity(index, item.quantity + 1)}
                          >
                            <Ionicons name="add" size={16} color="#4B5563" />
                          </TouchableOpacity>
                        </View>
                        
                        <TouchableOpacity
                          onPress={() => removeCartItem(index)}
                          className="p-2"
                        >
                          <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Animated.View>
                ))}
                
                {/* Checkout Button */}
                <TouchableOpacity 
                  className="bg-primary rounded-xl py-4 mt-4"
                  onPress={handleCheckout}
                >
                  <Text className="text-white text-center font-semibold">
                    Proceed to Checkout ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Popular Items Section */}
            <View className="mt-2">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Popular Items</Text>
              <View className="flex-row flex-wrap">
                {POPULAR_ITEMS.map((item) => (
                  <TouchableOpacity 
                    key={item}
                    className="bg-gray-100 rounded-full px-3 py-2 mr-2 mb-2 flex-row items-center"
                    onPress={() => {
                      setItemInput(item);
                    }}
                    onLongPress={() => {
                      // Add directly to cart on long press
                      const existingItemIndex = cartItems.findIndex(
                        cartItem => cartItem.name.toLowerCase() === item.toLowerCase()
                      );
                      
                      if (existingItemIndex >= 0) {
                        updateCartItemQuantity(existingItemIndex, cartItems[existingItemIndex].quantity + 1);
                        setToast({ message: `Increased quantity of ${item}`, type: 'success' });
                      } else {
                        setCartItems([...cartItems, { name: item, quantity: 1 }]);
                        setToast({ message: `Added ${item} to your cart`, type: 'success' });
                      }
                    }}
                  >
                    <Text className="text-gray-800">{item}</Text>
                    <TouchableOpacity
                      className="ml-1"
                      onPress={(e) => {
                        e.stopPropagation();
                        // Add directly to cart
                        const existingItemIndex = cartItems.findIndex(
                          cartItem => cartItem.name.toLowerCase() === item.toLowerCase()
                        );
                        
                        if (existingItemIndex >= 0) {
                          updateCartItemQuantity(existingItemIndex, cartItems[existingItemIndex].quantity + 1);
                          setToast({ message: `Increased quantity of ${item}`, type: 'success' });
                        } else {
                          setCartItems([...cartItems, { name: item, quantity: 1 }]);
                          setToast({ message: `Added ${item} to your cart`, type: 'success' });
                        }
                      }}
                    >
                      <Ionicons name="add-circle" size={16} color="#4F46E5" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* How it works modal */}
      {showHowItWorks && (
        <View className="absolute inset-0 bg-black/50 z-50 justify-center items-center px-6">
          <Animated.View 
            entering={FadeIn.duration(200)}
            className="bg-white rounded-2xl w-full p-5"
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">How Grocery Ordering Works</Text>
              <TouchableOpacity onPress={() => setShowHowItWorks(false)} className="p-1">
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <ScrollView className="max-h-96">
              {/* Step 1 */}
              <View className="flex-row mb-4">
                <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold mb-1">Request Your Items</Text>
                  <Text className="text-gray-600 text-sm">
                    Simply type the name of any grocery item you want to order. You can specify variety, quantity, and any special preferences.
                  </Text>
                </View>
              </View>
              
              {/* Step 2 */}
              <View className="flex-row mb-4">
                <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold mb-1">Submit Your Order</Text>
                  <Text className="text-gray-600 text-sm">
                    Review your cart and submit your order request. No payment is required at this stage.
                  </Text>
                </View>
              </View>
              
              {/* Step 3 */}
              <View className="flex-row mb-4">
                <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold">3</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold mb-1">Store Confirmation</Text>
                  <Text className="text-gray-600 text-sm">
                    The store will review your request, check availability, and confirm prices for each item. You'll receive a notification when this is complete.
                  </Text>
                </View>
              </View>
              
              {/* Step 4 */}
              <View className="flex-row mb-4">
                <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold">4</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold mb-1">Review & Payment</Text>
                  <Text className="text-gray-600 text-sm">
                    Once prices are confirmed, you'll be notified to review the final order details and proceed to payment if you're happy with everything.
                  </Text>
                </View>
              </View>
              
              {/* Step 5 */}
              <View className="flex-row mb-4">
                <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold">5</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold mb-1">Delivery</Text>
                  <Text className="text-gray-600 text-sm">
                    After payment, your groceries will be prepared for delivery or pickup according to your preference.
                  </Text>
                </View>
              </View>
              
              {/* Note */}
              <View className="bg-blue-50 p-4 rounded-xl mt-2 mb-4">
                <Text className="text-blue-800 font-medium mb-1">Why we use this approach</Text>
                <Text className="text-blue-600 text-sm">
                  This system allows you to request any grocery item you need without being limited to a predefined catalog. Prices can vary based on market conditions, quality, and availability, so the store will always confirm final pricing before charging you.
                </Text>
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              className="bg-primary py-3 rounded-xl mt-4"
              onPress={() => setShowHowItWorks(false)}
            >
              <Text className="text-white text-center font-semibold">Got it</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
      
      {/* AI Shopping Assistant Modal */}
      {showAIAssistant && (
        <View className="absolute inset-0 bg-black/50 z-50 justify-center items-center px-6">
          <Animated.View 
            entering={FadeIn.duration(200)}
            className="bg-white rounded-2xl w-full p-5"
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">AI Shopping Assistant</Text>
              <TouchableOpacity onPress={() => setShowAIAssistant(false)} className="p-1">
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <Text className="text-gray-600 mb-4">
              Enter a meal or menu you want to cook, and our AI will suggest all the ingredients you need.
            </Text>
            
            <TextInput
              className="bg-gray-50 rounded-xl p-4 text-gray-900 min-h-[100px]"
              placeholder="Example: 'Spaghetti Bolognese' or 'Sunday roast chicken dinner with vegetables'"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={menuInput}
              onChangeText={setMenuInput}
            />
            
            <View className="mt-4 flex-row">
              <TouchableOpacity 
                className="bg-gray-200 py-3 rounded-xl flex-1 mr-2"
                onPress={() => setShowAIAssistant(false)}
              >
                <Text className="text-gray-900 text-center font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-indigo-600 py-3 rounded-xl flex-1 ml-2 flex-row justify-center items-center"
                onPress={handleGenerateIngredients}
                disabled={isLoadingAI || !menuInput.trim()}
              >
                {isLoadingAI ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Text className="text-white text-center font-medium">Generate</Text>
                    <FontAwesome5 name="magic" size={16} color="white" className="ml-2" />
                  </>
                )}
              </TouchableOpacity>
            </View>
            
            <View className="mt-4 p-3 bg-blue-50 rounded-xl">
              <Text className="text-blue-800 text-xs">
                The AI will analyze your meal and suggest ingredients. Add, remove, or edit them in your cart afterward.
              </Text>
            </View>
          </Animated.View>
        </View>
      )}
      
      {/* Price Editor Modal for AI-generated ingredients */}
      {showPriceEditor && (
        <View className="absolute inset-0 bg-black/50 z-50 justify-center items-center px-6">
          <Animated.View 
            entering={FadeIn.duration(200)}
            className="bg-white rounded-2xl w-full p-5 max-h-[80%]"
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">Set Prices (Optional)</Text>
              <TouchableOpacity onPress={() => setShowPriceEditor(false)} className="p-1">
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <Text className="text-gray-600 mb-4">
              You can set prices for the ingredients or leave them blank for the store to confirm.
            </Text>
            
            <ScrollView className="max-h-[400px]">
              {pendingIngredients.map((ingredient, index) => (
                <View 
                  key={index}
                  className="flex-row items-center justify-between mb-3 border-b border-gray-100 pb-3"
                >
                  <Text className="flex-1 text-gray-900 font-medium">{ingredient.name}</Text>
                  <View className="flex-row items-center bg-gray-50 rounded-lg border border-gray-200 px-3 py-2">
                    <Text className="text-gray-500 mr-1">₵</Text>
                    <TextInput
                      className="w-16 text-gray-900"
                      placeholder="Price"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={ingredient.price}
                      onChangeText={(text) => updatePendingIngredientPrice(index, text)}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
            
            <View className="mt-4 flex-row">
              <TouchableOpacity 
                className="bg-gray-200 py-3 rounded-xl flex-1 mr-2"
                onPress={handleSkipPriceEditing}
              >
                <Text className="text-gray-900 text-center font-medium">Skip Pricing</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-primary py-3 rounded-xl flex-1 ml-2"
                onPress={handleAddIngredientsToCart}
              >
                <Text className="text-white text-center font-medium">Save & Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
} 