import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type QuantitySelectorProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  price: number;
};

export function QuantitySelector({ quantity, onIncrease, onDecrease, price }: QuantitySelectorProps) {
  return (
    <View className="flex-row items-center justify-between mt-6 bg-gray-50 p-4 rounded-2xl">
      <View className="flex-row items-center space-x-4">
        <TouchableOpacity 
          onPress={onDecrease}
          className="w-10 h-10 bg-white rounded-full items-center justify-center"
        >
          <Ionicons name="remove" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-900">{quantity}</Text>
        <TouchableOpacity 
          onPress={onIncrease}
          className="w-10 h-10 bg-white rounded-full items-center justify-center"
        >
          <Ionicons name="add" size={24} color="#374151" />
        </TouchableOpacity>
      </View>
      <Text className="text-2xl font-semibold text-primary">
        ₵{(price * quantity).toFixed(2)}
      </Text>
    </View>
  );
} 