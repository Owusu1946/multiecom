import { View, Text } from 'react-native';

type Props = {
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  date: string;
};

export function ReceiptContent({ orderId, items, subtotal, shipping, total, date }: Props) {
  return (
    <View className="bg-white p-6">
      <View className="items-center mb-6">
        <Text className="text-2xl font-semibold">Receipt</Text>
      </View>

      <View className="border-b border-gray-200 pb-4 mb-4">
        <Text className="text-gray-500">Order #{orderId}</Text>
        <Text className="text-gray-500 mt-1">{date}</Text>
      </View>

      {items.map((item, index) => (
        <View key={index} className="flex-row justify-between mb-3">
          <View className="flex-1">
            <Text className="text-gray-900">{item.name}</Text>
            <Text className="text-gray-500">x{item.quantity}</Text>
          </View>
          <Text className="text-gray-900">₵{(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      ))}

      <View className="border-t border-gray-200 mt-4 pt-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">Subtotal</Text>
          <Text className="text-gray-900">₵{subtotal.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">Shipping</Text>
          <Text className="text-gray-900">₵{shipping.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between pt-2 border-t border-gray-200">
          <Text className="font-semibold text-gray-900">Total</Text>
          <Text className="font-semibold text-gray-900">₵{total.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
} 