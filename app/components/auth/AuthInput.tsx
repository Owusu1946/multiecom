import { View, TextInput, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  style?: StyleProp<ViewStyle>;
  numberOfLines?: number;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
}

export default function AuthInput({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  showPasswordToggle,
  onTogglePassword,
  style,
  numberOfLines,
  textAlignVertical
}: Props) {
  return (
    <View className="relative mb-4" style={style}>
      <Ionicons 
        name={icon} 
        size={20} 
        color="#666" 
        style={{ position: 'absolute', left: 16, top: 16 }}
      />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        numberOfLines={numberOfLines}
        textAlignVertical={textAlignVertical}
        className="border border-gray-200 p-4 pl-12 rounded-xl bg-gray-50"
      />
      {showPasswordToggle && (
        <TouchableOpacity 
          onPress={onTogglePassword}
          style={{ position: 'absolute', right: 16, top: 16 }}
        >
          <Ionicons 
            name={secureTextEntry ? "eye-outline" : "eye-off-outline"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
      )}
    </View>
  );
} 