import { View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';

type Props = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
};

export default function SkeletonLoader({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  className = '' 
}: Props) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(229, 231, 235, ${1 - shimmer.value})`,
    transform: [{ translateX: shimmer.value * 20 }],
  }));

  return (
    <View 
      style={{ 
        width, 
        height, 
        borderRadius,
        overflow: 'hidden',
      }}
      className={className}
    >
      <Animated.View 
        style={[
          { 
            width: '100%', 
            height: '100%',
          },
          animatedStyle
        ]} 
      />
    </View>
  );
} 