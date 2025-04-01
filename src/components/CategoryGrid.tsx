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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-emerald-200 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Oeps! Er ging iets mis
        </h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((category, index) => {
        const Icon = iconMap[category.icon] || Activity;
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-all duration-500"></div>
            <Link
              to={`/products?category=${category.slug}`}
              className="relative block bg-white rounded-2xl p-1 transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
            >
              <div className="relative rounded-xl overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-emerald-900/90 to-emerald-600/20"></div>
                
                {/* Category Icon with Glow Effect */}
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <div className={`relative p-3 rounded-xl ${category.bgColor} transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon className={`w-6 h-6 ${category.textColor}`} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="space-y-3 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 text-xs font-medium text-emerald-100 bg-emerald-900/30 backdrop-blur-sm rounded-full">
                        {category.productCount} producten
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-200 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm text-white/80 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {category.description}
                    </p>
                    <div className="flex items-center text-emerald-200 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <span>Ontdek meer</span>
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
} 