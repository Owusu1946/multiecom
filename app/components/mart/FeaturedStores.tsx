import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const FEATURED_STORES = [
  {
    id: '1',
    title: 'Smart Shopping',
    subtitle: 'Convenient Shopping For Everyday Needs',
    image: require('@/assets/images/react-logo.png'),
    discount: '10% OFF',
    rating: 4.8,
    reviews: 2400,
    location: 'House: 00, Road: 00, City-000',
    isFavorite: false,
    tags: ['Express Delivery', 'Top Rated']
  },
  {
    id: '2',
    title: 'Daily Care',
    subtitle: 'Everyday Essentials For Your Wellness Journey',
    image: require('@/assets/images/react-logo.png'),
    rating: 4.9,
    reviews: 1800,
    location: 'House: 00, Road: 00, City-000',
    isFavorite: false,
    tags: ['24/7 Service', 'Trending']
  }
];

export default function FeaturedStores() {
  return (
    <View className="mt-4">
      {/* Header Section */}
      <View className="flex-row items-center justify-between px-4 mb-4">
        <View>
          <Text className="text-lg font-bold text-gray-900">Featured Stores</Text>
          <Text className="text-xs text-gray-500">Discover the best in your area</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/stores')}
          className="flex-row items-center space-x-1 bg-primary/5 px-3 py-1.5 rounded-full"
        >
          <Text className="text-primary text-sm font-medium">See All</Text>
          <Ionicons name="arrow-forward" size={14} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-4"
        decelerationRate="fast"
        snapToInterval={236} // card width (220) + margin right (16)
      >
        {FEATURED_STORES.map((store) => (
          <TouchableOpacity
            key={store.id}
            onPress={() => router.push(`/store/${store.id}`)}
            className="mr-4 w-[220px]"
          >
            {/* Image Container */}
            <View className="relative rounded-2xl overflow-hidden">
              <Image
                source={store.image}
                className="w-full h-[130px]"
                resizeMode="cover"
              />
              
              {/* Gradient Overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)']}
                className="absolute inset-0"
              />

              {/* Discount Badge */}
              {store.discount && (
                <BlurView intensity={30} className="absolute top-2.5 left-2.5 overflow-hidden rounded-lg">
                  <View className="px-2.5 py-1.5 bg-red-500/90">
                    <Text className="text-white text-xs font-semibold">{store.discount}</Text>
                  </View>
                </BlurView>
              )}

              {/* Favorite Button */}
              <TouchableOpacity 
                className="absolute top-2.5 right-2.5"
                onPress={() => {}}
              >
                <BlurView intensity={30} className="w-8 h-8 rounded-full overflow-hidden">
                  <View className="flex-1 items-center justify-center bg-black/5">
                    <Ionicons 
                      name={store.isFavorite ? "heart" : "heart-outline"} 
                      size={16} 
                      color={store.isFavorite ? "#EF4444" : "#fff"} 
                    />
                  </View>
                </BlurView>
              </TouchableOpacity>

              {/* Tags Container */}
              <View className="absolute bottom-2.5 left-2.5 right-2.5 flex-row flex-wrap gap-1">
                {store.tags.map((tag, idx) => (
                  <BlurView key={idx} intensity={30} className="rounded-full overflow-hidden">
                    <View className="px-2.5 py-1 bg-black/5">
                      <Text className="text-white text-[10px] font-medium">{tag}</Text>
                    </View>
                  </BlurView>
                ))}
              </View>
            </View>

            {/* Content Container */}
            <View className="mt-3 px-0.5">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-2">
                  <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
                    {store.title}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
                    {store.subtitle}
                  </Text>
                </View>
                <View className="bg-green-50 px-2 py-1 rounded-md">
                  <Text className="text-green-700 text-xs font-semibold">{store.rating}</Text>
                </View>
              </View>
              
              {/* Stats Row */}
              <View className="flex-row items-center mt-2 space-x-3">
                <View className="flex-row items-center">
                  <Ionicons name="star" size={12} color="#FBBF24" />
                  <Text className="text-gray-600 text-xs ml-1">
                    ({store.reviews.toLocaleString()})
                  </Text>
                </View>
                <View className="w-1 h-1 bg-gray-300 rounded-full" />
                <View className="flex-row items-center flex-1">
                  <Ionicons name="location-outline" size={12} color="#6B7280" />
                  <Text className="text-gray-500 text-xs ml-0.5" numberOfLines={1}>
                    {store.location}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}