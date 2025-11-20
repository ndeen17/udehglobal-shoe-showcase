// Product types that exactly match backend IProduct interface
export interface ProductImage {
  url: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  _id?: string;
  variantType: string; // 'size', 'color', 'material', 'style'
  variantValue: string;
  priceAdjustment: number;
  stockQuantity: number;
  sku?: string;
}

export interface Product {
  _id: string; // MongoDB ObjectId
  category: string; // Category ID or populated category object
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  stockQuantity: number;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  images: ProductImage[];
  variants: ProductVariant[];
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// Legacy interface for compatibility with existing static data
export interface LegacyProduct {
  id: number; // Legacy numeric ID
  name: string;
  price: string;
  image: string;
  category: string;
  stock?: number;
  status?: string;
  reviews?: number;
}

export default Product;