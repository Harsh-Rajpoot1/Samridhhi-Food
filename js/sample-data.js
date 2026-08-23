// ============================================
// SAMPLE DATA — used when Firebase isn't configured
// ============================================

export const SAMPLE_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Premium Wheat Atta',
    category: 'wheat',
    description: 'Stone-ground whole wheat flour, made from the finest MP Sharbati wheat. Perfect for soft rotis and chapatis.',
    imageUrl: '',
    variants: [
      { weight: '1 kg', price: 45 },
      { weight: '5 kg', price: 210 },
      { weight: '10 kg', price: 400 },
      { weight: '25 kg', price: 950 }
    ],
    featured: true,
    inStock: true
  },
  {
    id: 'prod_2',
    name: 'Sharbati Gold Atta',
    category: 'wheat',
    description: 'Premium Sharbati wheat atta with a golden hue. Makes the softest rotis that stay fresh longer.',
    imageUrl: '',
    variants: [
      { weight: '1 kg', price: 55 },
      { weight: '5 kg', price: 260 },
      { weight: '10 kg', price: 500 },
      { weight: '25 kg', price: 1200 }
    ],
    featured: true,
    inStock: true
  },
  {
    id: 'prod_3',
    name: 'Multigrain Health Atta',
    category: 'multigrain',
    description: 'A nutritious blend of 7 grains — wheat, barley, oats, soya, ragi, chana, and flaxseed for a healthier roti.',
    imageUrl: '',
    variants: [
      { weight: '1 kg', price: 65 },
      { weight: '5 kg', price: 300 },
      { weight: '10 kg', price: 580 }
    ],
    featured: true,
    inStock: true
  },
  {
    id: 'prod_4',
    name: 'Fresh Besan (Gram Flour)',
    category: 'besan',
    description: 'Freshly ground premium besan from the best chana dal. Ideal for pakoras, ladoos, and all your favorite recipes.',
    imageUrl: '',
    variants: [
      { weight: '500 g', price: 40 },
      { weight: '1 kg', price: 75 },
      { weight: '5 kg', price: 350 }
    ],
    featured: true,
    inStock: true
  },
  {
    id: 'prod_5',
    name: 'Fine Maida',
    category: 'maida',
    description: 'Ultra-fine refined flour perfect for naans, bhaturas, cakes, and bakery items. Smooth and elastic.',
    imageUrl: '',
    variants: [
      { weight: '1 kg', price: 40 },
      { weight: '5 kg', price: 185 },
      { weight: '10 kg', price: 350 }
    ],
    featured: false,
    inStock: true
  },
  {
    id: 'prod_6',
    name: 'Rice Flour (Chawal Atta)',
    category: 'rice',
    description: 'Finely milled rice flour, perfect for dosas, idlis, modaks, and gluten-free cooking.',
    imageUrl: '',
    variants: [
      { weight: '500 g', price: 35 },
      { weight: '1 kg', price: 65 },
      { weight: '5 kg', price: 300 }
    ],
    featured: false,
    inStock: true
  },
  {
    id: 'prod_7',
    name: 'Bajra Flour',
    category: 'millet',
    description: 'Traditional pearl millet flour, rich in iron and fiber. Perfect for bajra rotis and thalipeeth.',
    imageUrl: '',
    variants: [
      { weight: '1 kg', price: 55 },
      { weight: '5 kg', price: 250 }
    ],
    featured: false,
    inStock: true
  },
  {
    id: 'prod_8',
    name: 'Jowar Flour',
    category: 'millet',
    description: 'Gluten-free sorghum flour, a healthy alternative for bhakri and rotis. High in nutrients and antioxidants.',
    imageUrl: '',
    variants: [
      { weight: '1 kg', price: 50 },
      { weight: '5 kg', price: 230 }
    ],
    featured: false,
    inStock: true
  },
  {
    id: 'prod_9',
    name: 'Ragi Flour (Nachni)',
    category: 'millet',
    description: 'Nutrient-dense finger millet flour packed with calcium. Great for ragi rotis and baby food.',
    imageUrl: '',
    variants: [
      { weight: '500 g', price: 45 },
      { weight: '1 kg', price: 80 },
      { weight: '5 kg', price: 380 }
    ],
    featured: false,
    inStock: true
  },
  {
    id: 'prod_10',
    name: 'Sattu Powder',
    category: 'multigrain',
    description: 'High-protein roasted gram flour. Perfect for sattu drinks, parathas, and litti chokha.',
    imageUrl: '',
    variants: [
      { weight: '500 g', price: 50 },
      { weight: '1 kg', price: 90 },
      { weight: '5 kg', price: 420 }
    ],
    featured: false,
    inStock: true
  },
  {
    id: 'prod_11',
    name: 'Makka Atta (Corn Flour)',
    category: 'millet',
    description: 'Fresh corn flour for authentic makki ki roti. Stone-ground for the best traditional taste.',
    imageUrl: '',
    variants: [
      { weight: '1 kg', price: 50 },
      { weight: '5 kg', price: 230 }
    ],
    featured: false,
    inStock: true
  },
  {
    id: 'prod_12',
    name: 'Suji / Rava (Semolina)',
    category: 'wheat',
    description: 'Coarse wheat semolina for upma, halwa, and rava dosa. Clean and free from impurities.',
    imageUrl: '',
    variants: [
      { weight: '500 g', price: 30 },
      { weight: '1 kg', price: 55 },
      { weight: '5 kg', price: 250 }
    ],
    featured: false,
    inStock: true
  }
];

export const SAMPLE_DELIVERY_RATES = [
  {
    id: 'zone_1',
    zoneName: 'Local (Within City)',
    pincodes: ['452001', '452002', '452003', '452004', '452005', '452006', '452007', '452008', '452009', '452010'],
    rate: 30,
    freeAbove: 500
  },
  {
    id: 'zone_2',
    zoneName: 'Nearby Areas',
    pincodes: ['452011', '452012', '452013', '452014', '452015', '453001', '453002', '453003'],
    rate: 50,
    freeAbove: 800
  },
  {
    id: 'zone_3',
    zoneName: 'Extended Zone',
    pincodes: ['453111', '453112', '453220', '453331', '453441', '453551', '454001', '454002'],
    rate: 80,
    freeAbove: 1200
  }
];

export const SAMPLE_ORDERS = [
  {
    id: 'order_1',
    orderId: 'SAC-M1A2B3-X7Y8',
    customerName: 'Rajesh Kumar',
    phone: '9876543210',
    address: '23, MG Road, Indore',
    city: 'Indore',
    pincode: '452001',
    items: [
      { productId: 'prod_1', name: 'Premium Wheat Atta', weight: '10 kg', qty: 2, price: 400 },
      { productId: 'prod_4', name: 'Fresh Besan', weight: '1 kg', qty: 1, price: 75 }
    ],
    subtotal: 875,
    deliveryCharge: 0,
    total: 875,
    paymentMode: 'cod',
    status: 'delivered',
    createdAt: { toDate: () => new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
  },
  {
    id: 'order_2',
    orderId: 'SAC-N4C5D6-P9Q0',
    customerName: 'Priya Sharma',
    phone: '9876543211',
    address: '45, Vijay Nagar, Indore',
    city: 'Indore',
    pincode: '452003',
    items: [
      { productId: 'prod_3', name: 'Multigrain Health Atta', weight: '5 kg', qty: 1, price: 300 },
      { productId: 'prod_7', name: 'Bajra Flour', weight: '1 kg', qty: 2, price: 55 }
    ],
    subtotal: 410,
    deliveryCharge: 30,
    total: 440,
    paymentMode: 'upi',
    status: 'processing',
    createdAt: { toDate: () => new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
  },
  {
    id: 'order_3',
    orderId: 'SAC-R7S8T9-U1V2',
    customerName: 'Amit Patel',
    phone: '9876543212',
    address: '12, Palasia, Indore',
    city: 'Indore',
    pincode: '452001',
    items: [
      { productId: 'prod_2', name: 'Sharbati Gold Atta', weight: '25 kg', qty: 1, price: 1200 }
    ],
    subtotal: 1200,
    deliveryCharge: 0,
    total: 1200,
    paymentMode: 'cod',
    status: 'placed',
    createdAt: { toDate: () => new Date() }
  }
];

export const SAMPLE_TESTIMONIALS = [
  {
    name: 'Sunita Devi',
    location: 'Indore',
    initials: 'SD',
    text: 'The wheat atta from Samriddhi is simply the best! My rotis come out soft and fresh every time. Been buying for 2 years now.',
    rating: 5
  },
  {
    name: 'Ramesh Gupta',
    location: 'Dewas',
    initials: 'RG',
    text: 'Their multigrain atta has improved our family\'s health. The quality is consistent and delivery is always on time. Highly recommended!',
    rating: 5
  },
  {
    name: 'Neha Joshi',
    location: 'Ujjain',
    initials: 'NJ',
    text: 'Fresh besan with amazing aroma! My pakoras have never been better. The stone-ground texture makes all the difference.',
    rating: 5
  }
];

/**
 * Get color for product category (for placeholder images)
 */
export function getCategoryColor(category) {
  const colors = {
    wheat: '#D4A017',
    multigrain: '#8B6914',
    besan: '#E6B422',
    maida: '#F5E1C0',
    rice: '#E8DCC8',
    millet: '#A67C00'
  };
  return colors[category] || '#D4A017';
}

/**
 * Generate a simple SVG placeholder for product images
 */
export function getProductPlaceholder(product) {
  const color = getCategoryColor(product.category);
  const icons = {
    wheat: '🌾',
    multigrain: '🌿',
    besan: '🫘',
    maida: '🍚',
    rice: '🍙',
    millet: '🌱'
  };
  const icon = icons[product.category] || '🌾';

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.15"/>
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.3"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg)"/>
      <text x="200" y="180" text-anchor="middle" font-size="80">${icon}</text>
      <text x="200" y="240" text-anchor="middle" font-family="system-ui" font-size="16" font-weight="600" fill="${color}">${product.name}</text>
      <text x="200" y="265" text-anchor="middle" font-family="system-ui" font-size="13" fill="#9C8578">Samriddhi Atta Chakki</text>
    </svg>
  `)}`;
}

import { isFirebaseConfigured as checkFirebase } from './firebase-config.js';

/**
 * Check if Firebase is configured (not using placeholder keys)
 */
export function isFirebaseConfigured() {
  try {
    return checkFirebase();
  } catch {
    return false;
  }
}

