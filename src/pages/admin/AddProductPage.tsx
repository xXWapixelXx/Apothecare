import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Loader2, AlertCircle, ChevronLeft, Search, Settings, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
}

export default function AddProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null as File | null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryError(null);
        const data = await api.getCategories();
        if (!data || data.length === 0) {
          setCategoryError('No categories available');
        }
        setCategories(data);
      } catch (error) {
        setCategoryError(error instanceof Error ? error.message : 'Failed to load categories');
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      const price = parseFloat(formData.price);
      const stock = parseInt(formData.stock, 10);

      if (isNaN(price) || price <= 0) {
        throw new Error('Please enter a valid price');
      }

      if (isNaN(stock) || stock < 0) {
        throw new Error('Please enter a valid stock quantity');
      }

      const selectedCategory = categories.find(cat => cat.id === formData.category);
      if (!selectedCategory) {
        throw new Error('Please select a valid category');
      }

      const productData = new FormData();
      productData.append('name', formData.name.trim());
      productData.append('description', formData.description.trim());
      productData.append('price', price.toString());
      productData.append('stock', stock.toString());
      productData.append('category', selectedCategory.name);
      
      const sku = `${selectedCategory.name.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      productData.append('sku', sku);
      productData.append('isNew', 'true');
      
      if (formData.image) {
        productData.append('image', formData.image);
      } else {
        productData.append('image', '');
      }

      await api.createProduct(productData);
      toast.success('Product added successfully');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border-b">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between p-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/admin/products')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create a new product in your inventory
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/admin/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Settings">
                <Settings className="w-5 h-5 text-gray-600" />
              </Link>
            </div>

            <div className="hidden md:block w-px h-8 bg-gray-200"></div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Admin User</div>
                <div className="text-xs text-gray-500">admin@apothecare.nl</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 w-full bg-gray-100">
          <div className="h-full bg-emerald-500 w-1/3" title="Form completion progress"></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select a category</option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    {categoryError || 'Loading categories...'}
                  </option>
                )}
              </select>
              {categoryError && (
                <p className="mt-1 text-sm text-red-600">{categoryError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (€)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter stock quantity"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-lg"
                />
              )}
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 