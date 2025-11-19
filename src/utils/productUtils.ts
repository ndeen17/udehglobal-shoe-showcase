import { Product, LegacyProduct } from '../types/Product';

/**
 * Utility functions to handle product data format differences
 * between legacy static data (numeric IDs) and MongoDB data (ObjectId strings)
 */

// Type guard to check if a product uses legacy format
export const isLegacyProduct = (product: any): product is LegacyProduct => {
  return typeof product.id === 'number';
};

// Type guard to check if a product uses new MongoDB format
export const isMongoProduct = (product: any): product is Product => {
  return typeof product._id === 'string';
};

// Get product ID regardless of format
export const getProductId = (product: Product | LegacyProduct): string => {
  if (isLegacyProduct(product)) {
    return product.id.toString();
  }
  return product._id;
};

// Get product image URL regardless of format
export const getProductImageUrl = (product: Product | LegacyProduct): string => {
  if (isLegacyProduct(product)) {
    return product.image;
  }
  
  const imageUrl = product.images?.[0]?.url || '/placeholder-product.jpg';
  
  // Cloudinary URLs are already full URLs (https://res.cloudinary.com/...)
  // Return as is - no need to prepend backend URL
  return imageUrl;
};

// Get product price regardless of format
export const getProductPrice = (product: Product | LegacyProduct): string => {
  if (isLegacyProduct(product)) {
    return product.price;
  }
  return `$${product.price.toFixed(2)}`;
};

// Get product name regardless of format
export const getProductName = (product: Product | LegacyProduct): string => {
  return product.name;
};

// Get product category regardless of format
export const getProductCategory = (product: Product | LegacyProduct): string => {
  if (typeof product.category === 'string') {
    return product.category;
  }
  // Handle populated category object from backend
  if (product.category && typeof product.category === 'object' && 'name' in product.category) {
    return (product.category as any).name;
  }
  return product.category;
};

// Get product stock/status regardless of format
export const getProductStock = (product: Product | LegacyProduct): number => {
  if (isLegacyProduct(product)) {
    return product.stock || 0;
  }
  return product.stockQuantity;
};

// Get product status regardless of format
export const getProductStatus = (product: Product | LegacyProduct): string => {
  if (isLegacyProduct(product)) {
    return product.status || 'active';
  }
  return product.isActive ? 'active' : 'inactive';
};

// Get product reviews count regardless of format
export const getProductReviewsCount = (product: Product | LegacyProduct): number => {
  if (isLegacyProduct(product)) {
    return product.reviews || 0;
  }
  // Reviews not yet implemented in backend
  return 0;
};

// Convert legacy product to MongoDB format (for migration)
export const legacyToMongoProduct = (legacyProduct: LegacyProduct): Partial<Product> => {
  return {
    _id: `legacy_${legacyProduct.id}`, // Temporary ID for legacy products
    name: legacyProduct.name,
    slug: legacyProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: '',
    price: parseFloat(legacyProduct.price.replace('$', '')),
    stockQuantity: legacyProduct.stock || 0,
    category: legacyProduct.category,
    images: [{
      url: legacyProduct.image,
      altText: legacyProduct.name,
      displayOrder: 0,
      isPrimary: true
    }],
    variants: [],
    tags: [],
    isActive: legacyProduct.status !== 'inactive',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Convert MongoDB product to legacy format (for backwards compatibility)
export const mongoToLegacyProduct = (mongoProduct: Product): LegacyProduct => {
  return {
    id: parseInt(mongoProduct._id.slice(-6), 16), // Convert ObjectId to numeric ID
    name: mongoProduct.name,
    price: `$${mongoProduct.price.toFixed(2)}`,
    image: mongoProduct.images?.[0]?.url || '/placeholder-product.jpg',
    category: mongoProduct.category,
    stock: mongoProduct.stockQuantity,
    status: mongoProduct.isActive ? 'active' : 'inactive',
    reviews: 0 // Reviews not yet implemented in backend
  };
};

// Normalize product data for consistent usage
export const normalizeProduct = (product: Product | LegacyProduct) => {
  return {
    id: getProductId(product),
    name: getProductName(product),
    price: getProductPrice(product),
    image: getProductImageUrl(product),
    category: getProductCategory(product),
    stock: getProductStock(product),
    status: getProductStatus(product),
    reviews: getProductReviewsCount(product),
    originalProduct: product
  };
};