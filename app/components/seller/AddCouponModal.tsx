import { View, Text, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (coupon: {
    code: string;
    type: 'percentage' | 'flat';
    value: string;
    expiryDate: Date;
    isScheduled: boolean;
    scheduleDate?: Date;
  }) => void;
};

function RadioButton({ selected }: { selected: boolean }) {
  return (
    <View className="w-5 h-5 rounded-full border-2 border-gray-300 items-center justify-center">
      {selected && <View className="w-3 h-3 rounded-full bg-[#22C55E]" />}
    </View>
  );
}

export default function AddCouponModal({ isVisible, onClose, onSubmit }: Props) {
  const [couponType, setCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [couponCode, setCouponCode] = useState('');
  const [couponValue, setCouponValue] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 bg-black/50 z-50">
      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-semibold">Add New Coupon</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Coupon Type Selector */}
          <View className="mb-6">
            <Text className="text-gray-500 mb-3">Discount Type</Text>
            <View className="space-y-3">
              <TouchableOpacity 
                className="flex-row items-center bg-gray-50 p-4 rounded-xl"
                onPress={() => setCouponType('percentage')}
              >
                <RadioButton selected={couponType === 'percentage'} />
                <View className="ml-3">
                  <Text className={`font-medium ${
                    couponType === 'percentage' ? 'text-[#22C55E]' : 'text-gray-700'
                  }`}>
                    Percentage Discount
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Discount as a percentage of the total
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center bg-gray-50 p-4 rounded-xl"
                onPress={() => setCouponType('flat')}
              >
                <RadioButton selected={couponType === 'flat'} />
                <View className="ml-3">
                  <Text className={`font-medium ${
                    couponType === 'flat' ? 'text-[#22C55E]' : 'text-gray-700'
                  }`}>
                    Flat Price Discount
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Fixed amount discount
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Coupon Code */}
          <View className="mb-4">
            <Text className="text-gray-500 mb-2">Coupon Code</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-xl"
              placeholder="Enter coupon code"
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
            />
          </View>

          {/* Coupon Value */}
          <View className="mb-4">
            <Text className="text-gray-500 mb-2">
              {couponType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
            </Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-xl"
              placeholder={couponType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
              value={couponValue}
              onChangeText={setCouponValue}
              keyboardType="numeric"
            />
          </View>

          {/* Expiry Date */}
          <TouchableOpacity 
            className="mb-4"
            onPress={() => setShowExpiryPicker(true)}
          >
            <Text className="text-gray-500 mb-2">Expiry Date</Text>
            <View className="bg-gray-100 p-4 rounded-xl">
              <Text>{expiryDate.toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>

          {/* Schedule Toggle */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-500">Schedule Coupon</Text>
            <Switch
              value={isScheduled}
              onValueChange={setIsScheduled}
              trackColor={{ false: '#D1D5DB', true: '#22C55E' }}
            />
          </View>

          {/* Schedule Date */}
          {isScheduled && (
            <TouchableOpacity 
              className="mb-4"
              onPress={() => setShowSchedulePicker(true)}
            >
              <Text className="text-gray-500 mb-2">Schedule Date</Text>
              <View className="bg-gray-100 p-4 rounded-xl">
                <Text>{scheduleDate.toLocaleDateString()}</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Date Pickers */}
          {(showExpiryPicker || showSchedulePicker) && Platform.OS !== 'web' && (
            <DateTimePicker
              value={showExpiryPicker ? expiryDate : scheduleDate}
              mode="date"
              onChange={(event, date) => {
                if (showExpiryPicker) {
                  setShowExpiryPicker(false);
                  if (date) setExpiryDate(date);
                } else {
                  setShowSchedulePicker(false);
                  if (date) setScheduleDate(date);
                }
              }}
            />
          )}

          {/* Submit Button */}
          <TouchableOpacity 
            className="bg-[#22C55E] p-4 rounded-xl mt-4"
            onPress={() => {
              onSubmit({
                code: couponCode,
                type: couponType,
                value: couponValue,
                expiryDate,
                isScheduled,
                ...(isScheduled && { scheduleDate }),
              });
              onClose();
            }}
          >
            <Text className="text-white text-center font-semibold">Create Coupon</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 