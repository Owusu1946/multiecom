export const SPICES = [
    {
    id: '1',
    name: 'Black Pepper',
    description: 'Freshly Ground Black Pepper',
    price: 12.99,
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.8,
    reviews: 128,
    weight: '250g',
    isAvailable: true,
    discount: 10,
  },
  {
    id: '2',
    name: 'Cinnamon Powder',
    description: 'Pure Ceylon Cinnamon',
    price: 15.99,
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.9,
    reviews: 95,
    weight: '200g',
    isAvailable: true,
    discount: 0,
  },
  {
    id: '3',
    name: 'Turmeric',
    description: 'Organic Ground Turmeric',
    price: 9.99,
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.7,
    reviews: 156,
    weight: '300g',
    isAvailable: true,
    discount: 15,
  },
  {
    id: '4',
    name: 'Chili Powder',
    description: 'Hot & Spicy Blend',
    price: 8.99,
    image: require('@/assets/images/adaptive-icon.png'),
    rating: 4.6,
    reviews: 89,
    weight: '200g',
    isAvailable: false,
    discount: 0,
  }
];

export type Spice = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: any;
  rating: number;
  reviews: number;
  weight: string;
  isAvailable: boolean;
  discount: number;
};