import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import { router } from 'expo-router';

type SettingSection = {
  title: string;
  items: {
    id: string;
    label: string;
    icon: string;
    color: string;
    type: 'toggle' | 'link';
    value?: boolean;
    onPress?: () => void;
  }[];
};

const SETTINGS: SettingSection[] = [
  {
    title: 'Account',
    items: [
      {
        id: 'profile',
        label: 'Business Profile',
        icon: 'business-outline',
        color: '#4F46E5',
        type: 'link',
        onPress: () => router.push('/dashboard/settings/profile/index'),
      },
      {
        id: 'payment',
        label: 'Payment Methods',
        icon: 'card-outline',
        color: '#22C55E',
        type: 'link',
        onPress: () => router.push('/dashboard/settings/payment'),
      },
      {
        id: 'security',
        label: 'Security',
        icon: 'shield-checkmark-outline',
        color: '#F59E0B',
        type: 'link',
        onPress: () => router.push('/dashboard/settings/security'),
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      {
        id: 'notifications',
        label: 'Push Notifications',
        icon: 'notifications-outline',
        color: '#8B5CF6',
        type: 'toggle',
        value: true,
      },
      {
        id: 'sound',
        label: 'Order Alert Sound',
        icon: 'volume-high-outline',
        color: '#EF4444',
        type: 'toggle',
        value: true,
      },
      {
        id: 'darkMode',
        label: 'Dark Mode',
        icon: 'moon-outline',
        color: '#1F2937',
        type: 'toggle',
        value: false,
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        id: 'help',
        label: 'Help Center',
        icon: 'help-circle-outline',
        color: '#059669',
        type: 'link',
        onPress: () => router.push('/dashboard/support/index'),
      },
      {
        id: 'terms',
        label: 'Terms of Service',
        icon: 'document-text-outline',
        color: '#6B7280',
        type: 'link',
        onPress: () => router.push('/dashboard/settings/terms/index'),
      },
      {
        id: 'privacy',
        label: 'Privacy Policy',
        icon: 'lock-closed-outline',
        color: '#6B7280',
        type: 'link',
        onPress: () => router.push('/dashboard/settings/privacy/index'),
      },
    ],
  },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState(SETTINGS);

  const handleToggle = (sectionIndex: number, itemIndex: number) => {
    const newSettings = [...settings];
    const item = newSettings[sectionIndex].items[itemIndex];
    if (item.type === 'toggle') {
      item.value = !item.value;
      setSettings(newSettings);
    }
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <Animated.View 
        entering={FadeInUp}
        className="px-6 py-4 border-b border-gray-200 bg-white"
      >
        <Text className="text-2xl font-bold">Settings</Text>
      </Animated.View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-8">
          {settings.map((section, sectionIndex) => (
            <Animated.View
              key={section.title}
              entering={FadeInUp.delay(sectionIndex * 100)}
              className="space-y-4"
            >
              <Text className="text-gray-500 font-medium ml-4">
                {section.title}
              </Text>

              <View className="bg-white rounded-2xl overflow-hidden">
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      if (item.type === 'link' && item.onPress) {
                        item.onPress();
                      } else if (item.type === 'toggle') {
                        handleToggle(sectionIndex, itemIndex);
                      }
                    }}
                    className={`flex-row items-center p-4 ${
                      itemIndex < section.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Ionicons 
                        name={item.icon as any}
                        size={20}
                        color={item.color}
                      />
                    </View>
                    <Text className="flex-1 ml-3 font-medium">{item.label}</Text>
                    {item.type === 'toggle' ? (
                      <Switch
                        value={item.value}
                        onValueChange={() => handleToggle(sectionIndex, itemIndex)}
                        trackColor={{ false: '#D1D5DB', true: '#22C55E' }}
                      />
                    ) : (
                      <Ionicons 
                        name="chevron-forward" 
                        size={20} 
                        color="#9CA3AF" 
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 