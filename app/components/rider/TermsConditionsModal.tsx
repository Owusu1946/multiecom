import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TERMS_CONDITIONS = [
  'I will maintain the bike in good condition',
  'I will report any damages immediately',
  'I will not let anyone else use the assigned bike',
  'I will follow all traffic rules and safety guidelines',
  'I understand that I am responsible for the bike during my shift',
];

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onAccept: () => void;
  acceptedTerms: string[];
  onToggleTerm: (term: string) => void;
};

export default function TermsConditionsModal({ 
  isVisible, 
  onClose, 
  onAccept, 
  acceptedTerms, 
  onToggleTerm 
}: Props) {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-semibold">Terms & Conditions</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="max-h-[50vh]">
            {TERMS_CONDITIONS.map((term) => (
              <TouchableOpacity
                key={term}
                onPress={() => onToggleTerm(term)}
                className="flex-row items-center py-3"
              >
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  acceptedTerms.includes(term) ? 'bg-primary border-primary' : 'border-gray-300'
                }`}>
                  {acceptedTerms.includes(term) && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="flex-1 ml-3 text-gray-600">{term}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={onAccept}
            disabled={acceptedTerms.length !== TERMS_CONDITIONS.length}
            className={`mt-6 py-4 rounded-xl ${
              acceptedTerms.length === TERMS_CONDITIONS.length 
                ? 'bg-primary' 
                : 'bg-gray-200'
            }`}
          >
            <Text className={`text-center font-semibold ${
              acceptedTerms.length === TERMS_CONDITIONS.length 
                ? 'text-white' 
                : 'text-gray-500'
            }`}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export { TERMS_CONDITIONS }; 