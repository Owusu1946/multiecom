import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { BUSINESS_TYPES } from '@/app/(seller)/profile-setup';

export default function BusinessProfileScreen() {
  const insets = useSafeAreaInsets();
  const [profileData, setProfileData] = useState({
    businessName: 'Tech Store',
    businessType: 'Electronics' as typeof BUSINESS_TYPES[number],
    email: 'contact@techstore.com',
    phone: '+233 20 123 4567',
    address: '123 Main Street, Accra',
    logo: null as string | null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileData(prev => ({ ...prev, logo: result.assets[0].uri }));
    }
  };

  const handleSave = () => {
    // Save profile data to backend
    setIsEditing(false);
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
        <View className="items-center mb-8">
          <TouchableOpacity 
            onPress={handleImagePick}
            className="relative"
          >
            <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
              {profileData.logo ? (
                <Image 
                  source={{ uri: profileData.logo }}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <Ionicons name="business" size={40} color="#9CA3AF" />
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center">
              <Ionicons name="camera" size={18} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="space-y-6">
          {[
            { label: 'Business Name', key: 'businessName', icon: 'business-outline' },
            { label: 'Business Type', key: 'businessType', icon: 'pricetag-outline' },
            { label: 'Email', key: 'email', icon: 'mail-outline' },
            { label: 'Phone', key: 'phone', icon: 'call-outline' },
            { label: 'Address', key: 'address', icon: 'location-outline' },
          ].map((field) => (
            <Animated.View
              key={field.key}
              entering={FadeInUp.delay(200)}
              className="bg-white p-4 rounded-2xl"
            >
              <Text className="text-gray-500 text-sm mb-2">{field.label}</Text>
              <View className="flex-row items-center">
                <Ionicons 
                  name={field.icon as any} 
                  size={20} 
                  color="#22C55E"
                  style={{ marginRight: 8 }}
                />
                {isEditing ? (
                  <TextInput
                    value={profileData[field.key as keyof typeof profileData] as string}
                    onChangeText={(text) => 
                      setProfileData(prev => ({ ...prev, [field.key]: text }))
                    }
                    className="flex-1 text-gray-900"
                  />
                ) : (
                  <Text className="flex-1 text-gray-900">
                    {profileData[field.key as keyof typeof profileData]}
                  </Text>
                )}
              </View>
            </Animated.View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`mt-8 py-4 rounded-xl ${isEditing ? 'bg-primary' : 'bg-gray-100'}`}
        >
          <Text className={`text-center font-semibold ${isEditing ? 'text-white' : 'text-gray-900'}`}>
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 