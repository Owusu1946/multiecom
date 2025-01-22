import { View, Text, Image } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface Props {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: Props) {
  return (
    <Animated.View entering={FadeInUp.duration(1000).springify()}>
      <Image 
        source={require('../../../assets/images/adaptive-icon.png')}
        className="w-20 h-20 self-center mb-6"
        resizeMode="contain"
      />
      <Text className="text-3xl font-bold text-primary text-center mb-2">
        {title}
      </Text>
      <Text className="text-gray-500 text-center mb-8">
        {subtitle}
      </Text>
    </Animated.View>
  );
} 