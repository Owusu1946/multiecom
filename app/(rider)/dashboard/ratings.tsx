import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Rating {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
}

const ratings: Rating[] = [
  {
    id: '1',
    customerName: 'Dr. Amina Ibrahim',
    rating: 5,
    comment: 'Very professional delivery to Engineering Block. Always on time!',
    date: '2024-03-15',
    location: 'TaTU Engineering Block'
  },
  {
    id: '2',
    customerName: 'Prof. Kwame Mensah',
    rating: 4,
    comment: 'Good service, handled documents with care',
    date: '2024-03-14',
    location: 'TaTU Administration Block'
  },
  {
    id: '3',
    customerName: 'Student Council',
    rating: 5,
    comment: 'Excellent service during campus event deliveries',
    date: '2024-03-13',
    location: 'TaTU Student Center'
  }
];

const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

export default function RatingsScreen() {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color="#F59E0B"
      />
    ));
  };

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Rating Overview */}
      <Animated.View 
        entering={FadeInDown.delay(200)}
        className="bg-white p-6 rounded-2xl mb-6"
      >
        <View className="items-center">
          <Text className="text-3xl font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </Text>
          <View className="flex-row my-2">
            {renderStars(Math.round(averageRating))}
          </View>
          <Text className="text-gray-500">
            Based on {ratings.length} campus delivery reviews
          </Text>
        </View>

        <View className="mt-6 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratings.filter(r => r.rating === star).length;
            const percentage = (count / ratings.length) * 100;
            
            return (
              <View key={star} className="flex-row items-center">
                <Text className="w-8 text-gray-500">{star}</Text>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <View className="flex-1 h-2 bg-gray-100 rounded-full mx-2 overflow-hidden">
                  <View 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </View>
                <Text className="text-gray-500 w-8">{count}</Text>
              </View>
            );
          })}
        </View>
      </Animated.View>

      {/* Recent Reviews */}
      <Animated.View 
        entering={FadeInDown.delay(300)}
        className="space-y-4"
      >
        <Text className="text-lg font-semibold">Recent Reviews</Text>
        {ratings.map((rating, index) => (
          <Animated.View
            key={rating.id}
            entering={FadeInDown.delay(400 + (index * 100))}
            className="bg-white p-4 rounded-xl"
          >
            <View className="flex-row justify-between items-start mb-2">
              <View>
                <Text className="font-medium text-gray-900">{rating.customerName}</Text>
                <Text className="text-gray-500 text-sm">{rating.date}</Text>
              </View>
              <View className="flex-row">
                {renderStars(rating.rating)}
              </View>
            </View>
            
            <Text className="text-gray-600 mb-2">{rating.comment}</Text>
            
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text className="text-gray-500 text-sm ml-1">{rating.location}</Text>
            </View>
          </Animated.View>
        ))}
      </Animated.View>
    </ScrollView>
  );
}