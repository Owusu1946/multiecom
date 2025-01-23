import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState } from 'react';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SettingsHeader from '../../../components/rider/SettingsHeader';

interface SettingSection {
  title: string;
  icon: string;
  color: string;
  items: {
    label: string;
    value?: boolean;
    type: 'toggle' | 'link';
    description?: string;
    route?: string;
  }[];
}

const settings: SettingSection[] = [
  {
    title: 'Account',
    icon: 'person-outline',
    color: '#4F46E5',
    items: [
      {
        label: 'Profile Information',
        type: 'link',
        route: '/dashboard/settings/profile'
      },
      {
        label: 'Campus ID Verification',
        type: 'link',
        description: 'Verify your TaTU student/staff ID',
        route: '/dashboard/settings/verification'
      }
    ]
  },
  {
    title: 'Delivery Preferences',
    icon: 'bicycle-outline',
    color: '#22C55E',
    items: [
      {
        label: 'Campus Notifications',
        type: 'toggle',
        value: true,
        description: 'Get notified about campus deliveries'
      },
      {
        label: 'Auto-accept Campus Orders',
        type: 'toggle',
        value: false,
        description: 'Automatically accept orders within TaTU'
      }
    ]
  },
  {
    title: 'Security',
    icon: 'shield-outline',
    color: '#F59E0B',
    items: [
      {
        label: 'Change Password',
        type: 'link',
        route: '/dashboard/settings/password'
      },
      {
        label: 'Two-Factor Authentication',
        type: 'toggle',
        value: false,
        description: 'Secure your account with 2FA'
      }
    ]
  }
];

export default function SettingsScreen() {
  const [settingsState, setSettingsState] = useState(settings);
  const insets = useSafeAreaInsets();

  const handleToggle = (sectionIndex: number, itemIndex: number) => {
    const newSettings = [...settingsState];
    const item = newSettings[sectionIndex].items[itemIndex];
    if (item.type === 'toggle') {
      item.value = !item.value;
      setSettingsState(newSettings);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SettingsHeader title="Settings" showBackButton={false} />
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{
          padding: 24,
          paddingBottom: insets.bottom
        }}
        showsVerticalScrollIndicator={false}
      >
        {settingsState.map((section, sectionIndex) => (
          <Animated.View
            key={section.title}
            entering={FadeInDown.delay(200 + (sectionIndex * 100))}
            className="mb-8"
          >
            <View className="flex-row items-center mb-4">
              <View 
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: `${section.color}15` }}
              >
                <Ionicons name={section.icon as any} size={20} color={section.color} />
              </View>
              <Text className="text-lg font-semibold ml-3">{section.title}</Text>
            </View>

            <View className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => {
                    if (item.type === 'link' && item.route) {
                      router.push(item.route);
                    }
                  }}
                  className="bg-white p-4 rounded-xl"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="font-medium text-gray-900">{item.label}</Text>
                      {item.description && (
                        <Text className="text-gray-500 text-sm mt-1">
                          {item.description}
                        </Text>
                      )}
                    </View>
                    {item.type === 'toggle' ? (
                      <Switch
                        value={item.value}
                        onValueChange={() => handleToggle(sectionIndex, itemIndex)}
                        trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
                      />
                    ) : (
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
} 