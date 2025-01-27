import { TouchableOpacity, View, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  useSharedValue 
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

type Props = {
  section: any;
  index: number;
  onPress: () => void;
};

export default function CategoryCard({ section, index, onPress }: Props) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotateZ: `${rotation.value}deg` }
    ]
  }));

  useEffect(() => {
    rotation.value = withSequence(
      withSpring(-2),
      withSpring(2),
      withSpring(0)
    );
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      style={[animatedStyle]}
      className="w-[48%] mb-4"
    >
      <TouchableOpacity 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="relative"
      >
        <LinearGradient
          colors={section.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-3xl p-4 h-56"
        >
          {/* Decorative Elements */}
          <View className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <View className="w-full h-full rounded-full bg-white/20" />
          </View>
          <View className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
            <View className="w-full h-full rounded-full bg-white/20" />
          </View>

          {/* Main Content */}
          <View className="flex-1">
            {/* Header */}
            <View className="flex-row justify-between items-start">
              <View className="bg-white/10 p-2 rounded-2xl">
                <Text className="text-3xl">{section.icon}</Text>
              </View>
              <BlurView intensity={20} className="rounded-full">
                <View className="px-3 py-1.5">
                  <Text className="text-white text-xs font-medium">
                    {section.stats.stores}
                  </Text>
                </View>
              </BlurView>
            </View>

            {/* Animation Container */}
            <View className="absolute top-2 right-2 w-24 h-24 opacity-70">
              <LottieView
                source={section.animation}
                autoPlay
                loop
                style={{ width: '100%', height: '100%' }}
              />
            </View>

            {/* Content */}
            <View className="mt-auto">
              <Text className="text-white text-lg font-bold mb-1">
                {section.title}
              </Text>
              <Text className="text-white/80 text-sm mb-3">
                {section.description}
              </Text>

              {/* Stats Row */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="star" size={14} color="white" />
                  <Text className="text-white ml-1 font-medium">
                    {section.stats.rating}
                  </Text>
                </View>
                <BlurView intensity={20} className="rounded-full">
                  <View className="flex-row items-center px-3 py-1.5">
                    <MaterialCommunityIcons 
                      name="clock-outline" 
                      size={12} 
                      color="white" 
                    />
                    <Text className="text-white text-xs ml-1">
                      {section.stats.delivery}
                    </Text>
                  </View>
                </BlurView>
              </View>

              {/* Features Tags */}
              <View className="flex-row flex-wrap mt-3 gap-2">
                {section.features?.slice(0, 2).map((feature: string, idx: number) => (
                  <View 
                    key={idx} 
                    className="bg-white/10 px-2 py-1 rounded-full"
                  >
                    <Text className="text-white text-xs">
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Hover State Indicator */}
        <View className="absolute -bottom-1 left-[10%] right-[10%] h-3 bg-black/20 rounded-full blur-xl" />
      </TouchableOpacity>
    </Animated.View>
  );
} 