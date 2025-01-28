import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Address = {
  id: string;
  name: string;
  address: string;
  isDefault?: boolean;
};

type Props = {
  address: Address;
  selected: boolean;
  onSelect: () => void;
};

export function AddressCard({ address, selected, onSelect }: Props) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`p-4 rounded-2xl mb-3 ${
        selected ? 'bg-primary/5 border-primary' : 'bg-white border-gray-100'
      } border`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-gray-900 font-medium">{address.name}</Text>
          <Text className="text-gray-500 mt-1">{address.address}</Text>
        </View>
        <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          selected ? 'border-primary' : 'border-gray-300'
        }`}>
          {selected && <View className="w-3 h-3 rounded-full bg-primary" />}
        </View>
      </View>
      {address.isDefault && (
        <View className="mt-2">
          <Text className="text-primary text-sm">Default Address</Text>
        </View>
      )}
    </TouchableOpacity>
  );
} 