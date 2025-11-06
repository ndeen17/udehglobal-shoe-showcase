import { 
  Palette, 
  Car, 
  ShoppingBag, 
  Smartphone, 
  Laptop, 
  Shirt, 
  Dumbbell,
  Home,
  Sparkles,
  Baby,
  Trophy,
  BookOpen,
  Gamepad2,
  Hammer,
  PenTool,
  Settings,
  LucideIcon
} from 'lucide-react';

// Import product images
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

// Import artwork images
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import artwork4 from "@/assets/artwork-4.jpg";
import artwork5 from "@/assets/artwork-5.jpg";

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
  },
  {
    id: 'home-kitchen',
    name: 'HOME & KITCHEN',
    icon: Home,
    description: 'APPLIANCES & LIVING',
    slug: 'home-kitchen',
    isActive: true
  },
  {
    id: 'health-beauty',
    name: 'HEALTH & BEAUTY',
    icon: Sparkles,
    description: 'WELLNESS PRODUCTS',
    slug: 'health-beauty',
    isActive: true
  },
  {
    id: 'baby-kids',
    name: 'BABY & KIDS',
    icon: Baby,
    description: 'CHILDREN ESSENTIALS',
    slug: 'baby-kids',
    isActive: true
  },
  {
    id: 'sports',
    name: 'SPORTS',
    icon: Trophy,
    description: 'ATHLETIC GEAR',
    slug: 'sports',
    isActive: true
  },
  {
    id: 'books-movies-music',
    name: 'BOOKS & MEDIA',
    icon: BookOpen,
    description: 'ENTERTAINMENT',
    slug: 'books-movies-music',
    isActive: true
  },
  {
    id: 'gaming-consoles',
    name: 'GAMING',
    icon: Gamepad2,
    description: 'CONSOLES & GAMES',
    slug: 'gaming-consoles',
    isActive: true
  },
  {
    id: 'home-improvement',
    name: 'HOME IMPROVEMENT',
    icon: Hammer,
    description: 'TOOLS & GARDEN',
    slug: 'home-improvement',
    isActive: true
  },
  {
    id: 'office-supplies',
    name: 'OFFICE SUPPLIES',
    icon: PenTool,
    description: 'STATIONERY & WORKSPACE',
    slug: 'office-supplies',
    isActive: true
  },
  {
    id: 'industrial-equipment',
    name: 'INDUSTRIAL',
    icon: Settings,
    description: 'EQUIPMENT & MACHINERY',
    slug: 'industrial-equipment',
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
      image: product1,
      category: 'shoes',
      description: "Premium comfort design with ergonomic footbed",
      inStock: true
    },
    { 
      id: 2, 
      name: "Classic Black Slides", 
      price: "₦15,000", 
      image: product2,
      category: 'shoes',
      description: "Timeless black design for everyday wear",
      inStock: true
    },
    { 
      id: 3, 
      name: "Sport White Slides", 
      price: "₦15,000", 
      image: product3,
      category: 'shoes',
      description: "Athletic-inspired white slides",
      inStock: true
    },
    { 
      id: 4, 
      name: "Navy Blue Comfort Slides", 
      price: "₦15,000", 
      image: product4,
      category: 'shoes',
      description: "Sophisticated navy blue comfort slides",
      inStock: true
    },
    { 
      id: 5, 
      name: "Designer Black Slides", 
      price: "₦15,000", 
      image: product5,
      category: 'shoes',
      description: "Premium designer black slides",
      inStock: true
    },
    { 
      id: 6, 
      name: "Flip Flop Style Slides", 
      price: "₦15,000", 
      image: product6,
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
      image: artwork1,
      category: 'artworks',
      description: "Modern abstract painting in blue tones",
      inStock: true
    },
    { 
      id: 102, 
      name: "Modern Wall Art", 
      price: "₦35,000", 
      image: artwork2,
      category: 'artworks',
      description: "Contemporary wall art piece",
      inStock: true
    },
    { 
      id: 103, 
      name: "Minimalist Print", 
      price: "₦25,000", 
      image: artwork3,
      category: 'artworks',
      description: "Clean minimalist design print",
      inStock: true
    },
    { 
      id: 104, 
      name: "Urban Street Art", 
      price: "₦40,000", 
      image: artwork4,
      category: 'artworks',
      description: "Contemporary urban art piece",
      inStock: true
    },
    { 
      id: 105, 
      name: "Digital Art Print", 
      price: "₦30,000", 
      image: artwork5,
      category: 'artworks',
      description: "Modern digital art creation",
      inStock: true
    }
  ],
  'cars': [
    { 
      id: 201, 
      name: "Tesla Model 3", 
      price: "₦15,000,000", 
      image: "",
      category: 'cars',
      description: "Electric luxury sedan",
      inStock: false
    },
    { 
      id: 202, 
      name: "BMW X5", 
      price: "₦12,000,000", 
      image: "",
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
      image: "",
      category: 'phones',
      description: "Latest iPhone with Pro features",
      inStock: true
    },
    { 
      id: 302, 
      name: "Samsung Galaxy S24", 
      price: "₦400,000", 
      image: "",
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
      image: "",
      category: 'electronics',
      description: "Professional laptop with M3 chip",
      inStock: true
    },
    { 
      id: 402, 
      name: "iPad Air", 
      price: "₦350,000", 
      image: "",
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
      image: "",
      category: 'clothes',
      description: "High-quality cotton t-shirt",
      inStock: true
    },
    { 
      id: 502, 
      name: "Designer Jeans", 
      price: "₦15,000", 
      image: "",
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
      image: "",
      category: 'gym-wear',
      description: "Athletic performance shorts",
      inStock: true
    },
    { 
      id: 602, 
      name: "Athletic T-Shirt", 
      price: "₦5,000", 
      image: "",
      category: 'gym-wear',
      description: "Moisture-wicking athletic shirt",
      inStock: true
    }
  ],
  'home-kitchen': [
    { 
      id: 701, 
      name: "Smart Coffee Maker", 
      price: "₦45,000", 
      image: "",
      category: 'home-kitchen',
      description: "WiFi-enabled coffee brewing system",
      inStock: true
    },
    { 
      id: 702, 
      name: "Premium Blender", 
      price: "₦25,000", 
      image: "",
      category: 'home-kitchen',
      description: "High-performance kitchen blender",
      inStock: true
    },
    { 
      id: 703, 
      name: "Air Fryer Deluxe", 
      price: "₦35,000", 
      image: "",
      category: 'home-kitchen',
      description: "Digital air fryer with multiple presets",
      inStock: false
    }
  ],
  'health-beauty': [
    { 
      id: 801, 
      name: "Skincare Set", 
      price: "₦18,000", 
      image: "",
      category: 'health-beauty',
      description: "Complete daily skincare routine",
      inStock: true
    },
    { 
      id: 802, 
      name: "Hair Styling Tools", 
      price: "₦22,000", 
      image: "",
      category: 'health-beauty',
      description: "Professional hair styling kit",
      inStock: true
    },
    { 
      id: 803, 
      name: "Wellness Supplements", 
      price: "₦12,000", 
      image: "",
      category: 'health-beauty',
      description: "Daily health supplement pack",
      inStock: true
    }
  ],
  'baby-kids': [
    { 
      id: 901, 
      name: "Educational Toys Set", 
      price: "₦15,000", 
      image: "",
      category: 'baby-kids',
      description: "Interactive learning toys for kids",
      inStock: true
    },
    { 
      id: 902, 
      name: "Baby Care Bundle", 
      price: "₦20,000", 
      image: "",
      category: 'baby-kids',
      description: "Essential baby care products",
      inStock: true
    },
    { 
      id: 903, 
      name: "Kids Safety Gear", 
      price: "₦8,000", 
      image: "",
      category: 'baby-kids',
      description: "Safety equipment for children",
      inStock: false
    }
  ],
  'sports': [
    { 
      id: 1001, 
      name: "Tennis Racket Pro", 
      price: "₦35,000", 
      image: "",
      category: 'sports',
      description: "Professional tennis racket",
      inStock: true
    },
    { 
      id: 1002, 
      name: "Basketball Official", 
      price: "₦8,000", 
      image: "",
      category: 'sports',
      description: "Official size basketball",
      inStock: true
    },
    { 
      id: 1003, 
      name: "Swimming Goggles", 
      price: "₦5,500", 
      image: "",
      category: 'sports',
      description: "Anti-fog swimming goggles",
      inStock: true
    }
  ],
  'books-movies-music': [
    { 
      id: 1101, 
      name: "Bestseller Book Collection", 
      price: "₦12,000", 
      image: "",
      category: 'books-movies-music',
      description: "Top 10 bestselling novels",
      inStock: true
    },
    { 
      id: 1102, 
      name: "Vinyl Records Classic", 
      price: "₦18,000", 
      image: "",
      category: 'books-movies-music',
      description: "Classic vinyl record collection",
      inStock: false
    },
    { 
      id: 1103, 
      name: "4K Movie Bundle", 
      price: "₦15,000", 
      image: "",
      category: 'books-movies-music',
      description: "Latest movies in 4K format",
      inStock: true
    }
  ],
  'gaming-consoles': [
    { 
      id: 1201, 
      name: "Gaming Controller Pro", 
      price: "₦25,000", 
      image: "",
      category: 'gaming-consoles',
      description: "Wireless gaming controller",
      inStock: true
    },
    { 
      id: 1202, 
      name: "Gaming Headset Elite", 
      price: "₦30,000", 
      image: "",
      category: 'gaming-consoles',
      description: "7.1 surround sound gaming headset",
      inStock: true
    },
    { 
      id: 1203, 
      name: "Game Collection Pack", 
      price: "₦45,000", 
      image: "",
      category: 'gaming-consoles',
      description: "Top 5 AAA games bundle",
      inStock: false
    }
  ],
  'home-improvement': [
    { 
      id: 1301, 
      name: "Power Drill Set", 
      price: "₦40,000", 
      image: "",
      category: 'home-improvement',
      description: "Cordless power drill with bits",
      inStock: true
    },
    { 
      id: 1302, 
      name: "Garden Tool Kit", 
      price: "₦15,000", 
      image: "",
      category: 'home-improvement',
      description: "Complete gardening tool set",
      inStock: true
    },
    { 
      id: 1303, 
      name: "Paint & Brush Set", 
      price: "₦12,000", 
      image: "",
      category: 'home-improvement',
      description: "Interior painting supplies",
      inStock: true
    }
  ],
  'office-supplies': [
    { 
      id: 1401, 
      name: "Desk Organizer Premium", 
      price: "₦8,000", 
      image: "",
      category: 'office-supplies',
      description: "Wooden desk organization system",
      inStock: true
    },
    { 
      id: 1402, 
      name: "Stationery Bundle", 
      price: "₦6,000", 
      image: "",
      category: 'office-supplies',
      description: "Complete office stationery set",
      inStock: true
    },
    { 
      id: 1403, 
      name: "Printer Paper Pack", 
      price: "₦4,500", 
      image: "",
      category: 'office-supplies',
      description: "A4 high-quality printing paper",
      inStock: true
    }
  ],
  'industrial-equipment': [
    { 
      id: 1501, 
      name: "Industrial Scanner", 
      price: "₦150,000", 
      image: "",
      category: 'industrial-equipment',
      description: "High-speed barcode scanner",
      inStock: false
    },
    { 
      id: 1502, 
      name: "Safety Equipment Set", 
      price: "₦75,000", 
      image: "",
      category: 'industrial-equipment',
      description: "Complete industrial safety gear",
      inStock: true
    },
    { 
      id: 1503, 
      name: "Measurement Tools", 
      price: "₦95,000", 
      image: "",
      category: 'industrial-equipment',
      description: "Precision measurement instruments",
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