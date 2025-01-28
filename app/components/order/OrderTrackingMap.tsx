import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRef, useEffect } from 'react';

type Props = {
  status: 'preparing' | 'picked-up' | 'on-way' | 'delivered';
};

export function OrderTrackingMap({ status }: Props) {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    if (animation.current) {
      animation.current.play();
    }
  }, []);

  return (
    <View className="h-64 bg-gray-50 rounded-2xl overflow-hidden">
      <LottieView
        ref={animation}
        source={require('@/assets/Onboarding/fast delivery.json')}
        autoPlay
        loop
        style={{ flex: 1 }}
      />
    </View>
  );
} 