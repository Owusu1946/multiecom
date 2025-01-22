import { View, Text, Dimensions } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  BounceIn, 
  BounceOut 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  visible: boolean;
  message: string;
}

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

export default function SuccessModal({ visible, message }: Props) {
  if (!visible) return null;

  return (
    <Animated.View 
      entering={FadeIn}
      exiting={FadeOut}
      className="absolute inset-0 bg-black/50 items-center justify-center z-50"
      style={{ height: SCREEN_HEIGHT }}
    >
      <Animated.View 
        entering={BounceIn}
        exiting={BounceOut}
        className="bg-white p-8 rounded-3xl items-center mx-8"
      >
        <View className="w-20 h-20 bg-green-50 rounded-full items-center justify-center mb-4">
          <AnimatedIcon 
            entering={BounceIn.delay(400)}
            name="checkmark-circle" 
            size={50} 
            color="#22c55e"
          />
        </View>
        <Text className="text-xl font-semibold text-center">{message}</Text>
      </Animated.View>
    </Animated.View>
  );
} 