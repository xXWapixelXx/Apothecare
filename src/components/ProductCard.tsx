import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isNew: boolean;
    stock: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      {/* New Badge */}
      {product.isNew && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            Nieuw
          </span>
        </div>
      )}

      {/* Wishlist Button */}
      <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-emerald-50">
        <Heart className="h-5 w-5 text-gray-600 hover:text-emerald-600 transition-colors" />
      </button>

      {/* Image */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div className="text-sm text-emerald-600 font-medium mb-2">
          {product.category}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              €{product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              {product.stock > 0 ? 'Op voorraad' : 'Niet op voorraad'}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-colors duration-200"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span>Toevoegen</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 