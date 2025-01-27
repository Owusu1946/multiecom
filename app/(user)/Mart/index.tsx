import { View, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { router } from 'expo-router';
import MartHeader from '@/app/components/mart/MartHeader';
import MartHero from '@/app/components/mart/MartHero';
import CategoryCard from '@/app/components/mart/CategoryCard';
import FeaturedStores from '@/app/components/mart/FeaturedStores';
import { MART_SECTIONS } from '@/app/constants/mart';

export default function MartScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <MartHeader />

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingTop: insets.top + 70 }}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        <MartHero />

        <View className="px-4">
          <View className="flex-row flex-wrap justify-between">
            {MART_SECTIONS.map((section, index) => (
              <CategoryCard
                key={section.id}
                section={section}
                index={index}
                onPress={() => {
                  setSelectedSection(section.id);
                  router.push(`/${section.id}`);
                }}
              />
            ))}
          </View>
        </View>

        <FeaturedStores />
      </ScrollView>
    </View>
  );
}
