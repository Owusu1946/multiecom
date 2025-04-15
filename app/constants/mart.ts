export const MART_SECTIONS = [
  {
    id: 'Grocerries',
    title: 'Grocery',
    description: 'Fresh produce & essentials',
    animation: require('@/assets/Onboarding/fast delivery.json'),
    colors: ['#059669', '#34D399'],
    icon: '🥬',
    stats: { 
      stores: '234+', 
      rating: '4.8',
      delivery: '20-35 min'
    },
    features: ['Fresh Produce']
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy',
    description: 'Health & wellness essentials',
    animation: require('@/assets/Onboarding/fast delivery.json'),
    colors: ['#4F46E5', '#818CF8'],
    icon: '💊',
    stats: { 
      stores: '156+', 
      rating: '4.9',
      delivery: '25-40 min'
    },
    features: ['24/7 Service', 'Prescription']
  },
  {
    id: 'Parcel',
    title: 'Parcel',
    description: 'Nationwide delivery in Ghana',
    animation: require('@/assets/Onboarding/fast delivery.json'),
    colors: ['#DB2777', '#F472B6'],
    icon: '📦',
    stats: { 
      partners: '35+', 
      rating: '4.7',
      coverage: 'Nationwide'
    },
    features: ['Express Delivery', 'Real-time Tracking', 'Door-to-Door', 'Secure Handling'],
    cities: [
      'Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Sekondi-Takoradi', 
      'Sunyani', 'Koforidua', 'Ho', 'Wa', 'Bolgatanga'
    ],
    services: [
      {
        id: 'standard',
        name: 'Standard Delivery',
        description: 'Delivery within 2-3 days',
        icon: '🚚',
        price: 'From ₵15'
      },
      {
        id: 'express',
        name: 'Express Delivery',
        description: 'Same-day or next-day delivery',
        icon: '⚡',
        price: 'From ₵25'
      },
      {
        id: 'fragile',
        name: 'Fragile Items',
        description: 'Special handling for delicate items',
        icon: '🥚',
        price: 'From ₵30'
      },
      {
        id: 'heavy',
        name: 'Heavy Package',
        description: 'For items over 10kg',
        icon: '🏋️',
        price: 'From ₵40'
      }
    ]
  },
  {
    id: 'food',
    title: 'Food',
    description: 'Restaurant & takeaway',
    animation: require('@/assets/Onboarding/fast delivery.json'),
    colors: ['#EA580C', '#FB923C'],
    icon: '🍽️',
    stats: { 
      stores: '450+', 
      rating: '4.6',
      delivery: '15-30 min'
    },
    features: ['Live Tracking', 'Hot Deals']
  }
]; 

// Add Ghana regions data for parcel service
export const GHANA_REGIONS = [
  {
    name: 'Greater Accra',
    cities: ['Accra', 'Tema', 'Ashaiman', 'Madina', 'Adenta']
  },
  {
    name: 'Ashanti',
    cities: ['Kumasi', 'Obuasi', 'Ejisu', 'Bekwai', 'Konongo']
  },
  {
    name: 'Northern',
    cities: ['Tamale', 'Yendi', 'Savelugu', 'Bimbilla', 'Gushegu']
  },
  {
    name: 'Western',
    cities: ['Sekondi-Takoradi', 'Tarkwa', 'Axim', 'Nkroful', 'Bibiani']
  },
  {
    name: 'Eastern',
    cities: ['Koforidua', 'Nsawam', 'Akosombo', 'Nkawkaw', 'Kibi']
  },
  {
    name: 'Central',
    cities: ['Cape Coast', 'Winneba', 'Kasoa', 'Elmina', 'Agona Swedru']
  },
  {
    name: 'Volta',
    cities: ['Ho', 'Keta', 'Kpando', 'Hohoe', 'Anloga']
  },
  {
    name: 'Bono',
    cities: ['Sunyani', 'Techiman', 'Dormaa Ahenkro', 'Berekum', 'Nkoranza']
  },
  {
    name: 'Upper East',
    cities: ['Bolgatanga', 'Bawku', 'Navrongo', 'Zebilla', 'Sandema']
  },
  {
    name: 'Upper West',
    cities: ['Wa', 'Jirapa', 'Lawra', 'Tumu', 'Nandom']
  }
];

// Add package size options for parcel service
export const PACKAGE_SIZES = [
  {
    id: 'small',
    name: 'Small',
    dimensions: 'Up to 30cm x 20cm x 10cm',
    weight: 'Up to 2kg',
    icon: '📦',
    priceModifier: 1.0
  },
  {
    id: 'medium',
    name: 'Medium',
    dimensions: 'Up to 50cm x 40cm x 30cm',
    weight: 'Up to 5kg',
    icon: '📦',
    priceModifier: 1.5
  },
  {
    id: 'large',
    name: 'Large',
    dimensions: 'Up to 80cm x 60cm x 40cm',
    weight: 'Up to 10kg',
    icon: '📦',
    priceModifier: 2.0
  },
  {
    id: 'extra-large',
    name: 'Extra Large',
    dimensions: 'Up to 100cm x 80cm x 60cm',
    weight: 'Up to 20kg',
    icon: '📦',
    priceModifier: 3.0
  }
]; 