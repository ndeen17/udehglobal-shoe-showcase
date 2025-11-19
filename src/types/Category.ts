// Category types that match backend ICategory interface
export interface Category {
  _id: string; // MongoDB ObjectId
  name: string;
  slug: string;
  description?: string;
  iconName?: string; // For Lucide React icons
  displayOrder: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export default Category;