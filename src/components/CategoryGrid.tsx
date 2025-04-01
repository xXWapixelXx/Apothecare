import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'Vitaminen',
    description: 'Essentiële vitaminen voor uw dagelijkse gezondheid',
    image: '/images/vitamins.jpg',
    color: 'bg-orange-100',
  },
  {
    id: 2,
    name: 'Supplementen',
    description: 'Voedingssupplementen voor optimale gezondheid',
    image: '/images/supplements.jpg',
    color: 'bg-blue-100',
  },
  {
    id: 3,
    name: 'Medicijnen',
    description: 'Betrouwbare medicatie voor uw klachten',
    image: '/images/medicines.jpg',
    color: 'bg-green-100',
  },
  {
    id: 4,
    name: 'Persoonlijke Verzorging',
    description: 'Producten voor uw dagelijkse verzorging',
    image: '/images/personal-care.jpg',
    color: 'bg-purple-100',
  },
  {
    id: 5,
    name: 'EHBO',
    description: 'Eerste hulp en verbandmiddelen',
    image: '/images/first-aid.jpg',
    color: 'bg-red-100',
  },
  {
    id: 6,
    name: 'Gezondheid',
    description: 'Algemene gezondheidsproducten',
    image: '/images/health.jpg',
    color: 'bg-teal-100',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CategoryGrid() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12"
    >
      {categories.map((category) => (
        <motion.div
          key={category.id}
          variants={item}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative overflow-hidden rounded-2xl shadow-lg ${category.color} transition-all duration-300 hover:shadow-xl`}
        >
          <Link to={`/products?category=${category.name.toLowerCase()}`}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {category.name}
                </h3>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="text-gray-600"
                >
                  <ArrowRight size={20} />
                </motion.div>
              </div>
              <p className="mt-2 text-gray-600">{category.description}</p>
              <div className="mt-4 h-48 overflow-hidden rounded-lg">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
} 