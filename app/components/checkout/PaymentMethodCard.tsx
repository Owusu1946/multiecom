import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
  last4?: string;
};

type Props = {
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
};

export function PaymentMethodCard({ method, selected, onSelect }: Props) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`p-4 rounded-2xl mb-3 flex-row items-center justify-between ${
        selected ? 'bg-primary/5 border-primary' : 'bg-white border-gray-100'
      } border`}
    >
      <View className="flex-row items-center flex-1">
        <Image 
          source={{ uri: method.icon }}
          className="w-10 h-10 rounded-lg"
        />
        <View className="ml-3 flex-1">
          <Text className="text-gray-900 font-medium">{method.name}</Text>
          {method.last4 && (
            <Text className="text-gray-500 text-sm">•••• {method.last4}</Text>
          )}
        </View>
      </View>
      <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
        selected ? 'border-primary' : 'border-gray-300'
      }`}>
        {selected && <View className="w-3 h-3 rounded-full bg-primary" />}
      </View>
    </TouchableOpacity>
  );
} 