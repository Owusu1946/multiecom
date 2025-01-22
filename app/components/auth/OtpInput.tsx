import { View, TextInput } from 'react-native';
import { useRef, useEffect } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Props {
  otp: string[];
  setOtp: (otp: string[]) => void;
  error?: boolean;
}

export default function OtpInput({ otp, setOtp, error }: Props) {
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Animated.View 
      entering={FadeInDown.duration(1000).springify()}
      className="flex-row justify-between px-4 py-8"
    >
      {[0, 1, 2, 3].map((index) => (
        <TextInput
          key={index}
          ref={(ref) => ref && (inputRefs.current[index] = ref)}
          className={`w-16 h-16 border-2 ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-xl text-center text-2xl font-bold`}
          maxLength={1}
          keyboardType="number-pad"
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
        />
      ))}
    </Animated.View>
  );
} 