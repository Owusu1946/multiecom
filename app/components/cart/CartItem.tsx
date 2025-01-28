import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spice } from '@/app/data/spices';

type CartItemProps = {
  item: Spice;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartItem({ item, quantity, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <View className="flex-row p-4 bg-white rounded-2xl mb-4">
      <Image 
        source={item.image} 
        className="w-20 h-20 rounded-xl"
        resizeMode="contain"
      />
      <View className="flex-1 ml-4">
        <View className="flex-row justify-between items-start">
          <Text className="text-gray-900 font-medium flex-1" numberOfLines={1}>
            {item.name}
          </Text>
          <TouchableOpacity onPress={onRemove}>
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-500 text-sm mt-1">{item.weight}</Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-primary font-semibold">₵{item.price}</Text>
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity 
              onPress={onDecrease}
              className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="remove" size={20} color="#374151" />
            </TouchableOpacity>
            <Text className="text-gray-900 font-medium">{quantity}</Text>
            <TouchableOpacity 
              onPress={onIncrease}
              className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="add" size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
} 