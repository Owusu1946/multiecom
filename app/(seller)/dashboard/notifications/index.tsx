import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useState } from 'react';
import { router } from 'expo-router';

type NotificationType = 'order' | 'stock' | 'review' | 'promotion' | 'system';

const NOTIFICATIONS = [
  { 
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD001 needs processing',
    time: '2 mins ago',
    icon: 'cart-outline',
    color: '#4F46E5',
    read: false,
    actionUrl: '/dashboard/orders/ORD001'
  },
  {
    id: '2',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'iPhone 13 Pro Max is running low',
    time: '1 hour ago',
    icon: 'alert-circle-outline',
    color: '#EF4444',
    read: false,
    actionUrl: '/dashboard/products'
  },
  {
    id: '3',
    type: 'system',
    title: 'System Update',
    message: 'New features available! Check out our latest improvements.',
    time: '2 hours ago',
    icon: 'sync-circle-outline',
    color: '#22C55E',
    read: false,
    actionUrl: null
  },
  {
    id: '4',
    type: 'review',
    title: 'New Review',
    message: 'You received a 5-star review',
    time: '3 hours ago',
    icon: 'star-outline',
    color: '#F59E0B',
    read: true,
    actionUrl: null
  },
  {
    id: '5',
    type: 'promotion',
    title: 'Promotion Ending Soon',
    message: 'Your "Summer Sale" ends in 24 hours',
    time: '5 hours ago',
    icon: 'pricetag-outline',
    color: '#8B5CF6',
    read: true,
    actionUrl: '/dashboard/promotions'
  },
] as const;

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationPress = (notification: typeof NOTIFICATIONS[number]) => {
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <Animated.View 
        entering={FadeInDown}
        className="px-6 py-4 border-b border-gray-200 bg-white"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold">Notifications</Text>
            <Text className="text-gray-500 mt-1">
              {unreadCount} unread notifications
            </Text>
          </View>
          <TouchableOpacity 
            onPress={markAllAsRead}
            className="bg-gray-100 px-4 py-2 rounded-full"
          >
            <Text className="text-primary font-medium">Mark all as read</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-4">
          {notifications.map((notification, index) => (
            <Animated.View
              key={notification.id}
              entering={FadeInUp.delay(index * 100)}
            >
              <TouchableOpacity
                onPress={() => handleNotificationPress(notification)}
                className={`bg-white p-4 rounded-2xl ${
                  !notification.read ? 'border-l-4 border-primary shadow-sm' : ''
                }`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: !notification.read ? 2 : 0
                }}
              >
                <View className="flex-row items-center">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${notification.color}15` }}
                  >
                    <Ionicons 
                      name={notification.icon as any}
                      size={24}
                      color={notification.color}
                    />
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </Text>
                    <Text className={`mt-1 ${!notification.read ? 'text-gray-600' : 'text-gray-500'}`}>
                      {notification.message}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-2">{notification.time}</Text>
                  </View>
                  {!notification.read && (
                    <View className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 