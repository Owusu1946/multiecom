import { View, Text, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  FadeInDown, 
  SlideInRight, 
  ZoomIn,
  withSpring,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  useSharedValue,
  FadeIn
} from 'react-native-reanimated';
import TermsConditionsModal, { TERMS_CONDITIONS } from './TermsConditionsModal';
import { RIDER_SETUP_STATES } from '../auth/SetupCompletion';

type Bike = {
  id: string;
  code: string;
  type: 'motorcycle' | 'bicycle';
  status: 'available' | 'assigned' | 'maintenance';
  location: string;
  lastMaintenance: string;
};

const AVAILABLE_BIKES: Bike[] = [
  {
    id: 'B001',
    code: 'MTR-001',
    type: 'motorcycle',
    status: 'available',
    location: 'Main Hub - East Legon',
    lastMaintenance: '2024-03-01',
  },
  {
    id: 'B002',
    code: 'MTR-002',
    type: 'motorcycle',
    status: 'available',
    location: 'Main Hub - East Legon',
    lastMaintenance: '2024-03-05',
  },
  {
    id: 'B003',
    code: 'BCL-001',
    type: 'bicycle',
    status: 'available',
    location: 'Main Hub - East Legon',
    lastMaintenance: '2024-03-10',
  },
];

// Add new states for the bike assignment process
const ASSIGNMENT_STATES = [
  'Scanning available fleet...',
  'Checking vehicle conditions...',
  'Analyzing delivery patterns...',
  'Matching rider preferences...',
  'Finalizing vehicle selection...',
  ...RIDER_SETUP_STATES.slice(0, -1) // Include all except 'Complete!'
];

export default function BikeAssignmentFlow({ onComplete }: { onComplete: () => void }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<'assigning' | 'assigned'>('assigning');
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState<string[]>([]);
  const [currentState, setCurrentState] = useState(0);

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (step === 'assigning') {
      // Animate through different states
      const stateInterval = setInterval(() => {
        setCurrentState(prev => {
          if (prev < ASSIGNMENT_STATES.length - 1) {
            return prev + 1;
          }
          clearInterval(stateInterval);
          return prev;
        });
      }, 1500); // Increased duration to match SetupCompletion

      // Existing animation code
      rotation.value = withRepeat(withSequence(
        withSpring(360, { duration: 2000 }),
        withSpring(0, { duration: 0 })
      ), -1);

      scale.value = withRepeat(
        withSequence(
          withSpring(1.2, { duration: 1000 }),
          withSpring(1, { duration: 1000 })
        ),
        -1,
        true
      );

      progress.value = withSpring(1, { duration: 3000 });

      // Select random bike after states are shown
      setTimeout(() => {
        const availableBikes = AVAILABLE_BIKES.filter(bike => bike.status === 'available');
        const randomBike = availableBikes[Math.floor(Math.random() * availableBikes.length)];
        setSelectedBike(randomBike);
        setStep('assigned');
      }, ASSIGNMENT_STATES.length * 1500); // Adjust timeout based on states length

      return () => clearInterval(stateInterval);
    }
  }, [step]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ]
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const handleBikeClaim = () => {
    setShowTerms(true);
  };

  const handleAcceptTerm = (term: string) => {
    if (acceptedTerms.includes(term)) {
      setAcceptedTerms(prev => prev.filter(t => t !== term));
    } else {
      setAcceptedTerms(prev => [...prev, term]);
    }
  };

  const handleConfirm = () => {
    setShowTerms(false);
    onComplete();
  };

  return (
    <View 
      className="flex-1 bg-white"
      style={{ 
        paddingTop: insets.top,
        paddingBottom: insets.bottom 
      }}
    >
      <ScrollView className="flex-1">
        {step === 'assigning' && (
          <View className="flex-1 items-center justify-center py-20">
            <Animated.View entering={ZoomIn} className="items-center px-6">
              <Animated.View style={animatedStyles}>
                <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-6">
                  <Ionicons name="sync" size={40} color="#4F46E5" />
                </View>
              </Animated.View>
              <Text className="text-2xl font-bold mb-2">Finding Your Vehicle</Text>
              <Animated.Text 
                entering={FadeIn}
                className="text-gray-500 text-center mb-8"
              >
                {ASSIGNMENT_STATES[currentState]}
              </Animated.Text>

              <View className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <Animated.View 
                  className="h-full bg-primary rounded-full"
                  style={progressStyle}
                />
              </View>
            </Animated.View>
          </View>
        )}

        {step === 'assigned' && selectedBike && (
          <Animated.View 
            entering={SlideInRight} 
            className="flex-1 p-6"
          >
            <View className="items-center mb-8">
              <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="checkmark-circle" size={48} color="#22C55E" />
              </View>
              <Text className="text-2xl font-bold text-center">Perfect Match Found!</Text>
              <Text className="text-gray-500 text-center mt-2">
                We've found the ideal vehicle for your deliveries
              </Text>
            </View>

            <Animated.View 
              entering={FadeInDown.delay(400)}
              className="bg-primary/5 p-6 rounded-2xl border-2 border-primary mb-8"
            >
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                  <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center">
                    <Ionicons 
                      name={selectedBike.type === 'motorcycle' ? 'bicycle-outline' : 'bicycle'} 
                      size={32} 
                      color="#4F46E5" 
                    />
                  </View>
                  <View className="ml-4">
                    <Text className="text-2xl font-bold text-gray-900">{selectedBike.code}</Text>
                    <Text className="text-primary font-medium capitalize">{selectedBike.type}</Text>
                  </View>
                </View>
                <View className="bg-green-100 px-4 py-2 rounded-full">
                  <Text className="text-green-600 font-medium">Ready</Text>
                </View>
              </View>

              <View className="space-y-4">
                <View className="flex-row items-center bg-white/50 p-4 rounded-xl">
                  <Ionicons name="location-outline" size={24} color="#4F46E5" />
                  <View className="ml-3">
                    <Text className="text-sm text-gray-500">Pickup Location</Text>
                    <Text className="text-gray-900 font-medium">{selectedBike.location}</Text>
                  </View>
                </View>

                <View className="flex-row items-center bg-white/50 p-4 rounded-xl">
                  <Ionicons name="time-outline" size={24} color="#4F46E5" />
                  <View className="ml-3">
                    <Text className="text-sm text-gray-500">Last Maintenance</Text>
                    <Text className="text-gray-900 font-medium">{selectedBike.lastMaintenance}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(600)}
              className="bg-primary py-4 rounded-xl active:bg-primary/90"
              onTouchEnd={handleBikeClaim}
            >
              <Text className="text-white text-lg font-semibold text-center">Claim Vehicle</Text>
            </Animated.View>
          </Animated.View>
        )}
      </ScrollView>

      <TermsConditionsModal 
        isVisible={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleConfirm}
        acceptedTerms={acceptedTerms}
        onToggleTerm={handleAcceptTerm}
      />
    </View>
  );
} 