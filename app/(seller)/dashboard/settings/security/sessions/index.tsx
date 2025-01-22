import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';

type Session = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  icon: string;
};

export default function SessionsScreen() {
  const insets = useSafeAreaInsets();
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'iPhone 13 Pro',
      location: 'Accra, Ghana',
      lastActive: 'Active now',
      isCurrent: true,
      icon: 'phone-portrait-outline',
    },
    {
      id: '2',
      device: 'Chrome - Windows',
      location: 'Kumasi, Ghana',
      lastActive: '2 hours ago',
      isCurrent: false,
      icon: 'laptop-outline',
    },
    {
      id: '3',
      device: 'Safari - MacBook',
      location: 'Lagos, Nigeria',
      lastActive: '1 day ago',
      isCurrent: false,
      icon: 'desktop-outline',
    },
  ]);

  const handleEndSession = (sessionId: string) => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this session?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            setSessions(prev => prev.filter(session => session.id !== sessionId));
          },
        },
      ]
    );
  };

  const handleEndAllSessions = () => {
    Alert.alert(
      'End All Sessions',
      'Are you sure you want to end all other sessions?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'End All',
          style: 'destructive',
          onPress: () => {
            setSessions(prev => prev.filter(session => session.isCurrent));
          },
        },
      ]
    );
  };

  return (
    <View 
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-6">
          {sessions.map((session, index) => (
            <Animated.View
              key={session.id}
              entering={FadeInUp.delay(index * 100)}
              className="bg-white p-4 rounded-2xl"
            >
              <View className="flex-row items-center">
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: session.isCurrent ? '#22C55E15' : '#6B728015' }}
                >
                  <Ionicons 
                    name={session.icon as any}
                    size={24}
                    color={session.isCurrent ? '#22C55E' : '#6B7280'}
                  />
                </View>
                <View className="flex-1 ml-3">
                  <View className="flex-row items-center">
                    <Text className="font-semibold text-gray-900">
                      {session.device}
                    </Text>
                    {session.isCurrent && (
                      <View className="bg-primary/10 px-2 py-1 rounded-full ml-2">
                        <Text className="text-primary text-xs">Current</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-gray-500 text-sm mt-1">
                    {session.location} • {session.lastActive}
                  </Text>
                </View>
                {!session.isCurrent && (
                  <TouchableOpacity
                    onPress={() => handleEndSession(session.id)}
                    className="p-2"
                  >
                    <Ionicons name="close-circle-outline" size={24} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          ))}
        </View>

        {sessions.length > 1 && (
          <TouchableOpacity
            onPress={handleEndAllSessions}
            className="mt-8 py-4 rounded-xl bg-red-500"
          >
            <Text className="text-white text-center font-semibold">
              End All Other Sessions
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
} 