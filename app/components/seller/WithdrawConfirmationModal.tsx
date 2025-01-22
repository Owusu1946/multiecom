import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  withdrawalData: {
    amount: number;
    method: {
      name: string;
      type: 'momo' | 'bank';
    };
  };
};

export default function WithdrawConfirmationModal({ isVisible, onClose, withdrawalData }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <Animated.View 
          entering={FadeIn}
          className="bg-white m-6 p-6 rounded-2xl w-full max-w-sm"
        >
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="checkmark-circle" size={32} color="#22C55E" />
            </View>
            <Text className="text-xl font-semibold text-center">
              Withdrawal Initiated
            </Text>
          </View>

          <Text className="text-gray-600 text-center mb-6">
            Your withdrawal of ₵{withdrawalData.amount.toFixed(2)} via {withdrawalData.method.name} 
            has been initiated. This may take a few minutes to reflect in your account.
          </Text>

          <TouchableOpacity 
            className="bg-[#22C55E] p-4 rounded-xl"
            onPress={onClose}
          >
            <Text className="text-white text-center font-semibold">
              Track Withdrawal
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
} 