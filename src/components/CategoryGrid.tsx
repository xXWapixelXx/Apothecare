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

  const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

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
    <div className="space-y-16">
      {/* Title Section with Decorative Elements */}
      <div className="relative text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-200/50 rounded-full blur-3xl"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Populaire Categorieën
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ontdek onze meest populaire producten per categorie
          </p>
        </motion.div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.slice(0, 3).map((category, index) => {
          const Icon = iconMap[category.icon] || Activity;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                ease: "easeOut"
              }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-all duration-700"></div>
              <Link
                to={`/products?category=${category.slug}`}
                onClick={scrollToTop}
                className="relative block bg-white rounded-2xl p-1 transform transition-all duration-700 hover:scale-[1.02] hover:-translate-y-1"
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
                    <div className="space-y-3 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700">
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
                      <div className="flex items-center text-emerald-200 opacity-0 group-hover:opacity-100 transition-all duration-700">
                        <span>Ontdek meer</span>
                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced View All Categories Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="relative text-center py-12"
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-[500px] h-[200px] bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-full blur-3xl opacity-70"></div>
        </div>
        
        {/* Decorative Lines */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent via-emerald-300 to-transparent opacity-30"></div>
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent via-emerald-300 to-transparent opacity-30"></div>

        <div className="relative">
          <Link
            to="/categories"
            onClick={scrollToTop}
            className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="relative">
              <span className="absolute inset-0 bg-white/20 rounded-full blur animate-pulse"></span>
              <span className="relative">Bekijk alle categorieën</span>
            </span>
            <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-700 group-hover:translate-x-1" />
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="mt-6 text-gray-600"
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Ontdek al onze {categories.length} categorieën
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 