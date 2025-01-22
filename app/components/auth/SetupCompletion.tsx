import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import Animated, { 
  FadeIn, 
  FadeInUp, 
  ZoomIn, 
  ZoomOut, 
  SlideInRight, 
  SlideOutLeft,
  withSpring,
  withRepeat,
  withSequence,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';

export const RIDER_SETUP_STATES = [
  'Setting up your rider dashboard...',
  'Configuring delivery preferences...',
  'Optimizing route algorithms...',
  'Syncing payment methods...',
  'Initializing earnings tracker...',
  'Setting up real-time notifications...',
  'Finalizing your rider profile...',
  'Complete!'
];

export const SELLER_SETUP_STATES = [
  'Setting up your store...',
  'Configuring business profile...',
  'Adding finishing touches...',
  'Almost there...',
  'Complete!'
];

interface Props {
  onComplete: () => void;
  type?: 'seller' | 'rider';
}

export default function SetupCompletion({ onComplete, type = 'seller' }: Props) {
  const [currentState, setCurrentState] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const rotation = useSharedValue(0);

  const SETUP_STATES = type === 'rider' ? RIDER_SETUP_STATES : SELLER_SETUP_STATES;

  // Rotating animation for the loading icon
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    // Start rotating animation
    rotation.value = withRepeat(
      withSequence(
        withSpring(360, { duration: 1000 }),
        withSpring(0, { duration: 0 })
      ),
      -1
    );

    const timer = setInterval(() => {
      setCurrentState(prev => {
        if (prev === SETUP_STATES.length - 1) {
          clearInterval(timer);
          setShowConfetti(true);
          setTimeout(onComplete, 2500);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  return (
    <View className="flex-1 bg-white items-center justify-center px-4">
      {showConfetti && (
        <>
          <ConfettiCannon
            count={200}
            origin={{ x: -10, y: 0 }}
            autoStart={true}
            fadeOut={true}
          />
          <ConfettiCannon
            count={200}
            origin={{ x: 400, y: 0 }}
            autoStart={true}
            fadeOut={true}
          />
        </>
      )}
      
      {currentState === SETUP_STATES.length - 1 ? (
        <Animated.View 
          entering={ZoomIn.duration(1000).springify()}
          className="items-center"
        >
          <Animated.View 
            entering={FadeInUp.duration(800).springify()}
            className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-6"
          >
            <Ionicons name="checkmark-circle" size={56} color="#007AFF" />
          </Animated.View>
          <Animated.Text 
            entering={SlideInRight.duration(500).springify()}
            className="text-2xl font-bold text-center mb-2"
          >
            You're Ready to Ride!
          </Animated.Text>
          <Animated.Text 
            entering={FadeIn.delay(300)}
            className="text-gray-500 text-center"
          >
            {type === 'rider' 
              ? 'Your rider account is fully set up'
              : 'Your Dashboard is ready to go'
            }
          </Animated.Text>
        </Animated.View>
      ) : (
        <Animated.View 
          entering={FadeIn}
          exiting={SlideOutLeft}
          className="items-center"
        >
          <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-6">
            <Animated.View style={animatedStyles}>
              <Ionicons name="sync" size={56} color="#007AFF" />
            </Animated.View>
          </View>
          <Animated.Text 
            entering={SlideInRight}
            exiting={ZoomOut}
            className="text-xl text-center"
          >
            {SETUP_STATES[currentState]}
          </Animated.Text>
        </Animated.View>
      )}
    </View>
  );
} 