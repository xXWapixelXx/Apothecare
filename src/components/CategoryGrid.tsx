import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Pill, Heart, SprayCan, Syringe, Stethoscope } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  productCount: number;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  image: string;
}

const iconMap: { [key: string]: any } = {
  'Activity': Activity,
  'Pill': Pill,
  'Heart': Heart,
  'SprayCan': SprayCan,
  'Syringe': Syringe,
  'Stethoscope': Stethoscope
};

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => {
        const Icon = iconMap[category.icon] || Activity;
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
            </div>
            <div className="p-6">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${category.bgColor} mb-4`}>
                <Icon className={`w-6 h-6 ${category.textColor}`} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h2>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{category.productCount} producten</span>
                <Link
                  to={`/products?category=${category.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Bekijk producten
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
} 