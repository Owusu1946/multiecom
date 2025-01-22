import { View, Text, TouchableOpacity, TextInput, Image, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (promotion: {
    title: string;
    description: string;
    type: 'discount' | 'bogo' | 'fixed';
    value?: number;
    startDate: Date;
    endDate: Date;
    thumbnail?: string;
  }) => void;
};

export default function AddPromotionModal({ isVisible, onClose, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'discount' | 'bogo' | 'fixed'>('discount');
  const [value, setValue] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [thumbnail, setThumbnail] = useState<string>();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0].uri);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View 
          className="bg-white px-6 border-b border-gray-200"
          style={{ paddingTop: insets.top }}
        >
          <View className="flex-row justify-between items-center py-4">
            <Text className="text-xl font-semibold">New Promotion</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-6">
          {/* Thumbnail Picker */}
          <TouchableOpacity 
            onPress={pickImage}
            className="h-40 bg-gray-100 rounded-xl mb-6 items-center justify-center"
          >
            {thumbnail ? (
              <Image 
                source={{ uri: thumbnail }} 
                className="w-full h-full rounded-xl"
                style={{ resizeMode: 'cover' }}
              />
            ) : (
              <View className="items-center">
                <Ionicons name="image-outline" size={32} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2">Add Promotion Image</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Title Input */}
          <View className="mb-4">
            <Text className="text-gray-500 mb-2">Title</Text>
            <TextInput
              className="bg-white p-4 rounded-xl"
              value={title}
              onChangeText={setTitle}
              placeholder="Enter promotion title"
            />
          </View>

          {/* Description Input */}
          <View className="mb-4">
            <Text className="text-gray-500 mb-2">Description</Text>
            <TextInput
              className="bg-white p-4 rounded-xl"
              value={description}
              onChangeText={setDescription}
              placeholder="Enter promotion description"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Promotion Type */}
          <View className="mb-4">
            <Text className="text-gray-500 mb-2">Promotion Type</Text>
            <View className="space-y-2">
              {[
                { value: 'discount', label: 'Percentage Discount' },
                { value: 'fixed', label: 'Fixed Amount Off' },
                { value: 'bogo', label: 'Buy One Get One' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className={`flex-row items-center p-4 rounded-xl ${
                    type === option.value ? 'bg-green-50' : 'bg-white'
                  }`}
                  onPress={() => setType(option.value as typeof type)}
                >
                  <View className="w-5 h-5 rounded-full border-2 border-gray-300 items-center justify-center">
                    {type === option.value && (
                      <View className="w-3 h-3 rounded-full bg-[#22C55E]" />
                    )}
                  </View>
                  <Text className={`ml-3 ${
                    type === option.value ? 'text-[#22C55E]' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Value Input (for discount and fixed) */}
          {type !== 'bogo' && (
            <View className="mb-4">
              <Text className="text-gray-500 mb-2">
                {type === 'discount' ? 'Discount Percentage' : 'Amount Off'}
              </Text>
              <TextInput
                className="bg-white p-4 rounded-xl"
                value={value}
                onChangeText={setValue}
                placeholder={type === 'discount' ? 'Enter percentage' : 'Enter amount'}
                keyboardType="numeric"
              />
            </View>
          )}

          {/* Date Pickers */}
          <View className="mb-4">
            <Text className="text-gray-500 mb-2">Duration</Text>
            <TouchableOpacity 
              className="bg-white p-4 rounded-xl mb-2"
              onPress={() => setShowStartPicker(true)}
            >
              <Text>Start: {startDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-white p-4 rounded-xl"
              onPress={() => setShowEndPicker(true)}
            >
              <Text>End: {endDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker Modals */}
          {(showStartPicker || showEndPicker) && Platform.OS !== 'web' && (
            <DateTimePicker
              value={showStartPicker ? startDate : endDate}
              mode="date"
              onChange={(event, date) => {
                if (showStartPicker) {
                  setShowStartPicker(false);
                  if (date) setStartDate(date);
                } else {
                  setShowEndPicker(false);
                  if (date) setEndDate(date);
                }
              }}
            />
          )}
        </ScrollView>

        {/* Submit Button */}
        <View 
          className="bg-white border-t border-gray-200"
          style={{ paddingBottom: insets.bottom }}
        >
          <TouchableOpacity 
            className="bg-[#22C55E] p-4 rounded-xl mx-6 my-4"
            onPress={() => {
              onSubmit({
                title,
                description,
                type,
                ...(type !== 'bogo' && { value: Number(value) }),
                startDate,
                endDate,
                ...(thumbnail && { thumbnail }),
              });
              onClose();
            }}
          >
            <Text className="text-white text-center font-semibold">
              Create Promotion
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
} 