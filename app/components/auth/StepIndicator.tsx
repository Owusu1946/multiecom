import { View, Text } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  currentStep: number;
  steps: string[];
}

export default function StepIndicator({ currentStep, steps }: Props) {
  return (
    <View className="mb-8 px-8">
      {/* Progress Bar */}
      <View className="flex-row items-center justify-center space-x-4 mb-6">
        {steps.map((_, index) => (
          <View key={index} className="items-center">
            <View className="flex-row items-center">
              <View 
                className={`w-10 h-10 rounded-full items-center justify-center border-2 
                  ${index + 1 === currentStep 
                    ? 'bg-primary border-primary' 
                    : index + 1 < currentStep 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-gray-50 border-gray-200'
                  }`}
              >
                {index + 1 < currentStep ? (
                  <Ionicons name="checkmark" size={18} color="#007AFF" />
                ) : (
                  <Text 
                    className={`${
                      index + 1 === currentStep 
                        ? 'text-white' 
                        : 'text-gray-400'
                    } font-semibold text-base`}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              {index < steps.length - 1 && (
                <View 
                  className={`w-12 h-[2px] mx-2 ${
                    index + 1 < currentStep 
                      ? 'bg-primary' 
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Step Title */}
      <Animated.View 
        entering={currentStep > 1 ? FadeInRight : FadeInLeft}
        className="items-center"
      >
        <Text className="text-xl font-semibold text-gray-800">
          {steps[currentStep - 1]}
        </Text>
        <Text className="text-gray-500 text-center mt-1">
          Step {currentStep} of {steps.length}
        </Text>
      </Animated.View>
    </View>
  );
} 