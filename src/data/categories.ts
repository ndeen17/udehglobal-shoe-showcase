import { 
  Palette, 
  Car, 
  ShoppingBag, 
  Smartphone, 
  Laptop, 
  Shirt, 
  Dumbbell,
  LucideIcon
} from 'lucide-react';

export interface ProductCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  slug: string;
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
  inStock?: boolean;
}

// Product Categories Configuration
export const productCategories: ProductCategory[] = [
  {
    id: 'artworks',
    name: 'ARTWORKS',
    icon: Palette,
    description: 'CURATED ART PIECES',
    slug: 'artworks',
    isActive: true
  },
  {
    id: 'cars',
    name: 'CARS',
    icon: Car,
    description: 'PREMIUM VEHICLES',
    slug: 'cars',
    isActive: true
  },
  {
    id: 'shoes',
    name: 'SHOES',
    icon: ShoppingBag,
    description: 'COMFORT SLIDES',
    slug: 'shoes',
    isActive: true
  },
  {
    id: 'phones',
    name: 'PHONES',
    icon: Smartphone,
    description: 'MOBILE DEVICES',
    slug: 'phones',
    isActive: true
  },
  {
    id: 'electronics',
    name: 'ELECTRONICS',
    icon: Laptop,
    description: 'TECH ESSENTIALS',
    slug: 'electronics',
    isActive: true
  },
  {
    id: 'clothes',
    name: 'CLOTHES',
    icon: Shirt,
    description: 'LIFESTYLE WEAR',
    slug: 'clothes',
    isActive: true
  },
  {
    id: 'gym-wear',
    name: 'GYM WEAR',
    icon: Dumbbell,
    description: 'FITNESS APPAREL',
    slug: 'gym-wear',
    isActive: true
  }
];

// Sample Products Data (Replace with your actual product data)
export const sampleProducts: { [key: string]: Product[] } = {
  'shoes': [
    { 
      id: 1, 
      name: "Premium Comfort Slides - Multi Color", 
      price: "₦15,000", 
      image: "/api/placeholder/300/300",
      category: 'shoes',
      description: "Premium comfort design with ergonomic footbed",
      inStock: true
    },
    { 
      id: 2, 
      name: "Classic Black Slides", 
      price: "₦15,000", 
      image: "/api/placeholder/300/300",
      category: 'shoes',
      description: "Timeless black design for everyday wear",
      inStock: true
    },
    { 
      id: 3, 
      name: "Sport White Slides", 
      price: "₦15,000", 
      image: "/api/placeholder/300/300",
      category: 'shoes',
      description: "Athletic-inspired white slides",
      inStock: true
    },
    { 
      id: 4, 
      name: "Navy Blue Comfort Slides", 
      price: "₦15,000", 
      image: "/api/placeholder/300/300",
      category: 'shoes',
      description: "Sophisticated navy blue comfort slides",
      inStock: true
    },
    { 
      id: 5, 
      name: "Designer Black Slides", 
      price: "₦15,000", 
      image: "/api/placeholder/300/300",
      category: 'shoes',
      description: "Premium designer black slides",
      inStock: true
    },
    { 
      id: 6, 
      name: "Flip Flop Style Slides", 
      price: "₦15,000", 
      image: "/api/placeholder/300/300",
      category: 'shoes',
      description: "Classic flip flop design",
      inStock: true
    }
  ],
  'artworks': [
    { 
      id: 101, 
      name: "Abstract Canvas - Blue", 
      price: "₦50,000", 
      image: "/api/placeholder/300/300",
      category: 'artworks',
      description: "Modern abstract painting in blue tones",
      inStock: true
    },
    { 
      id: 102, 
      name: "Modern Wall Art", 
      price: "₦35,000", 
      image: "/api/placeholder/300/300",
      category: 'artworks',
      description: "Contemporary wall art piece",
      inStock: true
    },
    { 
      id: 103, 
      name: "Minimalist Print", 
      price: "₦25,000", 
      image: "/api/placeholder/300/300",
      category: 'artworks',
      description: "Clean minimalist design print",
      inStock: true
    }
  ],
  'cars': [
    { 
      id: 201, 
      name: "Tesla Model 3", 
      price: "₦15,000,000", 
      image: "/api/placeholder/300/300",
      category: 'cars',
      description: "Electric luxury sedan",
      inStock: false
    },
    { 
      id: 202, 
      name: "BMW X5", 
      price: "₦12,000,000", 
      image: "/api/placeholder/300/300",
      category: 'cars',
      description: "Premium luxury SUV",
      inStock: true
    }
  ],
  'phones': [
    { 
      id: 301, 
      name: "iPhone 15 Pro", 
      price: "₦500,000", 
      image: "/api/placeholder/300/300",
      category: 'phones',
      description: "Latest iPhone with Pro features",
      inStock: true
    },
    { 
      id: 302, 
      name: "Samsung Galaxy S24", 
      price: "₦400,000", 
      image: "/api/placeholder/300/300",
      category: 'phones',
      description: "Premium Android smartphone",
      inStock: true
    }
  ],
  'electronics': [
    { 
      id: 401, 
      name: "MacBook Pro M3", 
      price: "₦800,000", 
      image: "/api/placeholder/300/300",
      category: 'electronics',
      description: "Professional laptop with M3 chip",
      inStock: true
    },
    { 
      id: 402, 
      name: "iPad Air", 
      price: "₦350,000", 
      image: "/api/placeholder/300/300",
      category: 'electronics',
      description: "Versatile tablet for work and play",
      inStock: true
    }
  ],
  'clothes': [
    { 
      id: 501, 
      name: "Premium T-Shirt", 
      price: "₦8,000", 
      image: "/api/placeholder/300/300",
      category: 'clothes',
      description: "High-quality cotton t-shirt",
      inStock: true
    },
    { 
      id: 502, 
      name: "Designer Jeans", 
      price: "₦15,000", 
      image: "/api/placeholder/300/300",
      category: 'clothes',
      description: "Premium denim jeans",
      inStock: true
    }
  ],
  'gym-wear': [
    { 
      id: 601, 
      name: "Performance Shorts", 
      price: "₦6,000", 
      image: "/api/placeholder/300/300",
      category: 'gym-wear',
      description: "Athletic performance shorts",
      inStock: true
    },
    { 
      id: 602, 
      name: "Athletic T-Shirt", 
      price: "₦5,000", 
      image: "/api/placeholder/300/300",
      category: 'gym-wear',
      description: "Moisture-wicking athletic shirt",
      inStock: true
    }
  ]
};

// Helper functions
export const getCategoryBySlug = (slug: string): ProductCategory | undefined => {
  return productCategories.find(cat => cat.slug === slug);
};

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return sampleProducts[categorySlug] || [];
};

export const getActiveCategories = (): ProductCategory[] => {
  return productCategories.filter(cat => cat.isActive);
};

export const getAllProducts = (): Product[] => {
  return Object.values(sampleProducts).flat();
};