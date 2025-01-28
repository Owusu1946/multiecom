import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Step = {
  title: string;
  description: string;
  time?: string;
  status: 'completed' | 'current' | 'pending';
};

type Props = {
  steps: Step[];
};

export function TrackingSteps({ steps }: Props) {
  return (
    <View className="mt-6">
      {steps.map((step, index) => (
        <View key={step.title} className="flex-row">
          <View className="items-center">
            <View className={`w-8 h-8 rounded-full items-center justify-center ${
              step.status === 'completed' ? 'bg-green-500' :
              step.status === 'current' ? 'bg-primary' : 'bg-gray-200'
            }`}>
              {step.status === 'completed' ? (
                <Ionicons name="checkmark" size={18} color="white" />
              ) : (
                <View className="w-3 h-3 rounded-full bg-white" />
              )}
            </View>
            {index < steps.length - 1 && (
              <View className={`w-0.5 h-16 ${
                step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </View>
          <View className="ml-4 flex-1">
            <Text className="font-medium text-gray-900">{step.title}</Text>
            <Text className="text-gray-500 mt-1">{step.description}</Text>
            {step.time && (
              <Text className="text-gray-400 text-sm mt-1">{step.time}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
} 