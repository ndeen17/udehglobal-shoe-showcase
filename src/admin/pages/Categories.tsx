import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Edit3,
  Trash2,
  Package,
  Search,
  Shirt,
  Smartphone,
  Home,
  Sparkles,
  Dumbbell,
  Car,
  BookOpen,
  Hammer,
  PenTool,
  Watch,
  Baby,
  Trophy,
  Gamepad2,
  Settings,
  Palette,
  ShoppingBag,
  Laptop
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { adminCategoryAPI } from '../api/admin-api';
import { Category } from '../../types/Category';

// Icon mapping for category selection
const iconOptions = [
  { name: 'Package', icon: Package, value: 'Package' },
  { name: 'Shirt', icon: Shirt, value: 'Shirt' },
  { name: 'Smartphone', icon: Smartphone, value: 'Smartphone' },
  { name: 'Home', icon: Home, value: 'Home' },
  { name: 'Sparkles', icon: Sparkles, value: 'Sparkles' },
  { name: 'Dumbbell', icon: Dumbbell, value: 'Dumbbell' },
  { name: 'Car', icon: Car, value: 'Car' },
  { name: 'Book Open', icon: BookOpen, value: 'BookOpen' },
  { name: 'Hammer', icon: Hammer, value: 'Hammer' },
  { name: 'Pen Tool', icon: PenTool, value: 'PenTool' },
  { name: 'Watch', icon: Watch, value: 'Watch' },
  { name: 'Baby', icon: Baby, value: 'Baby' },
  { name: 'Trophy', icon: Trophy, value: 'Trophy' },
  { name: 'Gaming', icon: Gamepad2, value: 'Gamepad2' },
  { name: 'Settings', icon: Settings, value: 'Settings' },
  { name: 'Palette', icon: Palette, value: 'Palette' },
  { name: 'Shopping Bag', icon: ShoppingBag, value: 'ShoppingBag' },
  { name: 'Laptop', icon: Laptop, value: 'Laptop' }
];

interface CategoryWithCount extends Category {
  productCount?: number;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    iconName: 'Package',
    isActive: true
  });
  const { toast } = useToast();

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      
      // Check if admin is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: 'Authentication Required',
          description: 'Please login to access admin features',
          variant: 'destructive',
        });
        return;
      }
      
      const categoriesData = await adminCategoryAPI.getCategories();
      
      // Fetch product counts for each category
      const categoriesWithCounts = await Promise.all(
        categoriesData.map(async (category) => {
          try {
            // Get products for this category
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/products?category=${category._id}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                }
              }
            );
            const result = await response.json();
            return {
              ...category,
              productCount: result.data?.total || 0
            };
          } catch (error) {
            return { ...category, productCount: 0 };
          }
        })
      );
      
      setCategories(categoriesWithCounts);
    } catch (error: any) {
      console.error('Failed to load categories:', error);
      const errorMessage = error.message || 'Failed to load categories';
      
      if (errorMessage.includes('Authentication') || errorMessage.includes('Unauthorized')) {
        toast({
          title: 'Authentication Error',
          description: 'Please login again to access admin features',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const categoryData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        displayOrder: categories.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await adminCategoryAPI.createCategory(categoryData);
      setFormData({ name: '', description: '', iconName: 'Package', isActive: true });
      setIsCreateDialogOpen(false);
      toast({
        title: 'Success',
        description: `Category "${formData.name}" created successfully`,
      });
      // Reload categories to get updated data with product counts
      loadCategories();
    } catch (error: any) {
      console.error('Failed to create category:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create category',
        variant: 'destructive',
      });
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;

    try {
      await adminCategoryAPI.updateCategory(editingCategory._id, formData);
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', iconName: 'Package', isActive: true });
      toast({
        title: 'Success',
        description: `Category "${formData.name}" updated successfully`,
      });
      // Reload categories to get updated data
      loadCategories();
    } catch (error: any) {
      console.error('Failed to update category:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update category',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async (category: CategoryWithCount) => {
    // Check if category has products
    if (category.productCount && category.productCount > 0) {
      const confirmed = window.confirm(
        `Warning: This category "${category.name}" has ${category.productCount} product(s). ` +
        `Deleting it may affect these products. Are you sure you want to continue?`
      );
      
      if (!confirmed) {
        return;
      }
    }

    try {
      await adminCategoryAPI.deleteCategory(category._id);
      toast({
        title: 'Success',
        description: `Category "${category.name}" deleted successfully`,
      });
      // Reload categories to update counts
      loadCategories();
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      iconName: category.iconName || 'Package',
      isActive: category.isActive
    });
    setIsEditDialogOpen(true);
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    return iconOption ? iconOption.icon : Package;
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories and organize your inventory
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Add a new category to organize your products.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={formData.iconName}
                  onValueChange={(value) => setFormData({ ...formData, iconName: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {option.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateCategory} disabled={!formData.name.trim()}>
                Create Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(cat => cat.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(cat => cat.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.length} Categories
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories List</CardTitle>
          <CardDescription>
            Manage your product categories, their icons, and organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => {
                    const IconComponent = getIconComponent(category.iconName || 'Package');
                    return (
                      <TableRow key={category._id}>
                        <TableCell>
                          <IconComponent className="h-5 w-5 text-muted-foreground" />
                        </TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {category.slug}
                          </code>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {category.description || 'No description'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {category.productCount || 0} {category.productCount === 1 ? 'product' : 'products'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={category.isActive ? 'default' : 'secondary'}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(category)}
                              title="Edit category"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category)}
                              disabled={false}
                              title="Delete category"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-icon">Icon</Label>
              <Select
                value={formData.iconName}
                onValueChange={(value) => setFormData({ ...formData, iconName: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {option.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditCategory} disabled={!formData.name.trim()}>
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;