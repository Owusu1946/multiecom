import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';

const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: 'phone-portrait' },
  { id: 'fashion', name: 'Fashion', icon: 'shirt' },
  { id: 'home', name: 'Home & Garden', icon: 'home' },
  { id: 'sports', name: 'Sports', icon: 'football' },
  { id: 'beauty', name: 'Beauty', icon: 'color-palette' },
  { id: 'books', name: 'Books', icon: 'book' },
  { id: 'toys', name: 'Toys', icon: 'game-controller' },
  { id: 'other', name: 'Other', icon: 'grid' },
] as const;

type Category = typeof CATEGORIES[number]['id'];

type ProductImage = {
  uri: string;
  type: string;
  name: string;
};

export default function AddProductScreen() {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '' as Category,
    sku: '',
    weight: '',
    dimensions: '',
    brand: '',
    tags: '',
    discountPrice: '',
  });
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => ({
        uri: asset.uri,
        type: 'image/jpeg',
        name: `product-${Date.now()}.jpg`,
      }));
      setImages(prev => [...prev, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Add your product creation logic here
      console.log('Form Data:', formData);
      console.log('Images:', images);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      router.back();
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Animated.View 
            entering={SlideInRight}
            className="space-y-6"
          >
            {/* Image Upload Section */}
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-semibold">Product Images</Text>
                <Text className="text-gray-500 text-sm">{images.length}/5</Text>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="space-x-4"
              >
                {images.map((image, index) => (
                  <Animated.View 
                    key={index} 
                    entering={FadeInDown.delay(index * 100)}
                    className="relative"
                  >
                    <Image 
                      source={{ uri: image.uri }}
                      className="w-32 h-32 rounded-2xl"
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    >
                      <Ionicons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
                {images.length < 5 && (
                  <TouchableOpacity
                    onPress={pickImage}
                    className="w-32 h-32 bg-gray-100 rounded-2xl items-center justify-center border-2 border-dashed border-gray-300"
                  >
                    <Ionicons name="camera-outline" size={32} color="#666" />
                    <Text className="text-gray-500 text-sm mt-2">Add Image</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>

            {/* Basic Information */}
            <View className="space-y-4">
              <Text className="text-lg font-semibold">Basic Information</Text>
              
              <View>
                <Text className="text-gray-600 mb-2">Product Name*</Text>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-xl"
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter product name"
                />
              </View>

              <View>
                <Text className="text-gray-600 mb-2">Brand (Optional)</Text>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-xl"
                  value={formData.brand}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, brand: text }))}
                  placeholder="Enter brand name"
                />
              </View>

              <View>
                <Text className="text-gray-600 mb-2">Description*</Text>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-xl min-h-[100]"
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  placeholder="Enter product description"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View 
            entering={SlideInRight}
            className="space-y-6"
          >
            {/* Pricing & Inventory */}
            <View className="space-y-4">
              <Text className="text-lg font-semibold">Pricing & Inventory</Text>
              
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-gray-600 mb-2">Regular Price*</Text>
                  <TextInput
                    className="bg-gray-100 px-4 py-3 rounded-xl"
                    value={formData.price}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-600 mb-2">Sale Price</Text>
                  <TextInput
                    className="bg-gray-100 px-4 py-3 rounded-xl"
                    value={formData.discountPrice}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, discountPrice: text }))}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-gray-600 mb-2">Stock Quantity*</Text>
                  <TextInput
                    className="bg-gray-100 px-4 py-3 rounded-xl"
                    value={formData.stock}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, stock: text }))}
                    placeholder="0"
                    keyboardType="number-pad"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-600 mb-2">SKU</Text>
                  <TextInput
                    className="bg-gray-100 px-4 py-3 rounded-xl"
                    value={formData.sku}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, sku: text }))}
                    placeholder="Enter SKU"
                  />
                </View>
              </View>
            </View>

            {/* Category Selection */}
            <View className="space-y-4">
              <Text className="text-lg font-semibold">Category*</Text>
              <View className="flex-row flex-wrap gap-3">
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => setFormData(prev => ({ ...prev, category: category.id }))}
                    className={`px-4 py-3 rounded-xl border-2 flex-row items-center space-x-2 ${
                      formData.category === category.id 
                        ? 'bg-primary border-primary' 
                        : 'border-gray-200'
                    }`}
                  >
                    <Ionicons 
                      name={category.icon} 
                      size={20} 
                      color={formData.category === category.id ? 'white' : '#666'} 
                    />
                    <Text className={
                      formData.category === category.id 
                        ? 'text-white' 
                        : 'text-gray-600'
                    }>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tags */}
            <View>
              <Text className="text-gray-600 mb-2">Tags (Optional)</Text>
              <TextInput
                className="bg-gray-100 px-4 py-3 rounded-xl"
                value={formData.tags}
                onChangeText={(text) => setFormData(prev => ({ ...prev, tags: text }))}
                placeholder="Enter tags separated by commas"
              />
            </View>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.name && formData.description && images.length > 0;
    }
    return formData.price && formData.stock && formData.category;
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      {/* Progress Bar */}
      <View className="px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-semibold">
            Step {currentStep} of 2
          </Text>
          <Text className="text-gray-500">
            {currentStep === 1 ? 'Basic Info' : 'Pricing & Category'}
          </Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full">
          <Animated.View 
            className="h-2 bg-primary rounded-full"
            style={{ width: `${(currentStep / 2) * 100}%` }}
          />
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
        <View className="h-20" />
      </ScrollView>

      {/* Navigation Buttons */}
      <View 
        className="p-6 bg-white border-t border-gray-200"
        style={{ paddingBottom: insets.bottom }}
      >
        <View className="flex-row space-x-4">
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={() => setCurrentStep(1)}
              className="flex-1 py-4 rounded-xl bg-gray-100"
            >
              <Text className="text-center font-semibold text-gray-600">
                Back
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              if (currentStep === 1) {
                setCurrentStep(2);
              } else {
                handleSubmit();
              }
            }}
            disabled={!isStepValid() || loading}
            className={`flex-1 py-4 rounded-xl ${
              isStepValid() && !loading ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold">
                {currentStep === 1 ? 'Next' : 'Create Product'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
} 