import { View, Text, ScrollView, StatusBar, TouchableOpacity, Image, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { MART_SECTIONS } from '@/app/constants/mart';

// Define types for our data
type Section = {
  id: string;
  title: string;
  description: string;
  colors: string[];
  icon: string;
  stats: {
    stores: string;
    rating: string;
    delivery: string;
  };
};

type Store = {
  id: string;
  title: string;
  subtitle: string;
  image: any;
  discount?: string;
  rating: number;
  reviews: number;
  location: string;
  tags: string[];
};

// Sample data for featured stores
const FEATURED_STORES: Store[] = [
  {
    id: '1',
    title: 'Smart Shopping',
    subtitle: 'Everyday Needs',
    image: require('@/assets/images/react-logo.png'),
    discount: '10% OFF',
    rating: 4.8,
    reviews: 2400,
    location: 'House: 00, Road: 00, City-000',
    tags: ['Express Delivery', 'Top Rated']
  },
  {
    id: '2',
    title: 'Daily Care',
    subtitle: 'Wellness Journey',
    image: require('@/assets/images/react-logo.png'),
    rating: 4.9,
    reviews: 1800,
    location: 'House: 00, Road: 00, City-000',
    tags: ['24/7 Service', 'Trending']
  }
];

export default function MartScreen() {
  const insets = useSafeAreaInsets();
  const [userLocation, setUserLocation] = useState("Current Location");

  // Render the section item (replaces the heavier CategoryCard component)
  const renderSectionItem = ({ item, index }: { item: Section; index: number }) => (
    <TouchableOpacity
      key={item.id}
      style={{ width: '48%', marginBottom: 16 }}
      onPress={() => router.push(`/(user)/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <View 
        style={{ 
          borderRadius: 16,
          padding: 16,
          height: 160,
          backgroundColor: item.colors[0]
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 28 }}>{item.icon}</Text>
          <View style={{ 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12 
          }}>
            <Text style={{ color: 'white', fontSize: 12 }}>{item.stats.stores}</Text>
          </View>
        </View>

        <View style={{ marginTop: 'auto' }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
            {item.title}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 8 }}>
            {item.description}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="star" size={12} color="white" />
              <Text style={{ color: 'white', marginLeft: 4, fontSize: 12 }}>
                {item.stats.rating}
              </Text>
            </View>
            <View style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <MaterialCommunityIcons name="clock-outline" size={12} color="white" />
              <Text style={{ color: 'white', fontSize: 10, marginLeft: 4 }}>
                {item.stats.delivery}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render the store item (replaces the heavier FeaturedStores component)
  const renderStoreItem = ({ item }: { item: Store }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(user)/store/${item.id}` as any)}
      style={{ width: 200, marginRight: 16 }}
      activeOpacity={0.7}
    >
      <View style={{ borderRadius: 16, overflow: 'hidden' }}>
        <Image
          source={item.image}
          style={{ width: '100%', height: 120 }}
          resizeMode="cover"
        />
        
        {item.discount && (
          <View style={{ 
            position: 'absolute', 
            top: 8, 
            left: 8, 
            backgroundColor: '#EF4444',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8
          }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>{item.discount}</Text>
          </View>
        )}
      </View>

      <View style={{ marginTop: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#1F2937', flex: 1 }} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={{ backgroundColor: '#ecfdf5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
            <Text style={{ color: '#047857', fontSize: 12, fontWeight: '600' }}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }} numberOfLines={1}>
          {item.subtitle}
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Ionicons name="location-outline" size={12} color="#6B7280" />
          <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4, flex: 1 }} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />
      
      {/* Clean, simple header */}
      <View 
        style={{ 
          paddingTop: insets.top,
          paddingHorizontal: 16,
          paddingBottom: 12,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => router.push('/(user)/location-picker' as any)}
          >
            <MaterialCommunityIcons name="map-marker-outline" size={20} color="#4F46E5" />
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>Delivery to</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#1F2937', fontWeight: '500' }}>{userLocation}</Text>
                <Ionicons name="chevron-down" size={16} color="#374151" />
              </View>
            </View>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity 
              style={{ marginRight: 12 }}
              onPress={() => router.push('/(user)/notifications' as any)}
            >
              <Feather name="bell" size={22} color="#374151" />
              <View style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                width: 8, 
                height: 8, 
                backgroundColor: '#EF4444',
                borderRadius: 4 
              }} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.push('/(user)/cart' as any)}>
              <Feather name="shopping-bag" size={22} color="#374151" />
              <View style={{ 
                position: 'absolute', 
                top: -4, 
                right: -4, 
                backgroundColor: '#4F46E5',
                width: 16, 
                height: 16, 
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ color: 'white', fontSize: 10 }}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            backgroundColor: '#F3F4F6',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 8,
            marginTop: 12
          }}
          onPress={() => router.push('/(user)/search' as any)}
        >
          <Ionicons name="search" size={20} color="#6B7280" />
          <Text style={{ color: '#6B7280', marginLeft: 8, flex: 1 }}>Search in marketplace...</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Simple title section */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#1F2937' }}>Discover</Text>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#1F2937' }}>
            Our <Text style={{ color: '#4F46E5' }}>eMarketplace</Text>
          </Text>
        </View>

        {/* Efficient category grid using FlatList */}
        <View style={{ paddingHorizontal: 16 }}>
          <FlatList
            data={MART_SECTIONS as Section[]}
            renderItem={renderSectionItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            scrollEnabled={false}
          />
        </View>

        {/* Featured stores section */}
        <View style={{ marginTop: 24 }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            marginBottom: 12
          }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937' }}>Featured Stores</Text>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>Discover the best in your area</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/(user)/stores' as any)}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20
              }}
            >
              <Text style={{ color: '#4F46E5', fontSize: 12, fontWeight: '500', marginRight: 4 }}>See All</Text>
              <Ionicons name="arrow-forward" size={12} color="#4F46E5" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={FEATURED_STORES}
            renderItem={renderStoreItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
