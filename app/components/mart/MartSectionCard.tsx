import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { 
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 48 = padding (16*2) + gap between cards (16)

type SectionProps = {
  id: string;
  title: string;
  description: string;
  colors: [string, string] | string[];
  icon: string;
  stats: {
    stores: string;
    rating: string;
    delivery: string;
  };
  features?: string[];
  index: number;
};

export default function MartSectionCard({ 
  id, 
  title, 
  description, 
  colors, 
  icon, 
  stats, 
  features = [],
  index
}: SectionProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(400)}
      style={[animatedStyle]}
      className="w-[48%] mb-4"
    >
      <TouchableOpacity 
        onPress={() => router.push(`/(user)/${id}` as any)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={colors.length >= 2 ? [colors[0], colors[1]] : ['#4F46E5', '#818CF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-3xl p-4 h-40"
        >
          {/* Decorative Elements */}
          <View className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <View className="w-full h-full rounded-full bg-white/20" />
          </View>
          
          {/* Header Content */}
          <View className="flex-row justify-between items-start">
            <Text className="text-3xl">{icon}</Text>
            <BlurView intensity={20} className="rounded-full overflow-hidden">
              <View className="bg-white/10 px-2.5 py-1">
                <Text className="text-white text-xs font-medium">
                  {stats.stores}
                </Text>
              </View>
            </BlurView>
          </View>

          {/* Bottom Content */}
          <View className="mt-auto">
            <Text className="text-white text-lg font-bold mb-1">
              {title}
            </Text>
            <Text className="text-white/80 text-xs mb-3">
              {description}
            </Text>
            
            {/* Stats Row */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="star" size={12} color="white" />
                <Text className="text-white ml-1 text-xs font-medium">
                  {stats.rating}
                </Text>
              </View>
              <BlurView intensity={20} className="rounded-full overflow-hidden">
                <View className="bg-white/10 flex-row items-center px-2 py-1">
                  <MaterialCommunityIcons 
                    name="clock-outline" 
                    size={10} 
                    color="white" 
                  />
                  <Text className="text-white text-[10px] ml-1">
                    {stats.delivery}
                  </Text>
                </View>
              </BlurView>
            </View>
          </View>
        </LinearGradient>
        
        {/* Shadow */}
        <View className="absolute -bottom-1 left-[10%] right-[10%] h-2 bg-black/20 rounded-full blur-md" />
      </TouchableOpacity>
    </Animated.View>
  );
} 