import { ImageSourcePropType } from 'react-native';

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to eMart',
    description: 'Your one-stop marketplace for all your daily needs',
    image: require('../../assets/images/adaptive-icon.png'),
  },
  {
    id: '2',
    title: 'Multi-Category Shopping',
    description: 'From groceries to electronics, find everything in one place',
    image: require('../../assets/images/adaptive-icon.png'),
  },
  {
    id: '3',
    title: 'Fast Delivery',
    description: 'Get your orders delivered quickly and safely to your doorstep',
    image: require('../../assets/images/adaptive-icon.png'),
  },
  {
    id: '4',
    title: 'Safe & Secure',
    description: 'Shop with confidence with verified sellers and secure payments',
    image: require('../../assets/images/adaptive-icon.png'),
  },
]; 