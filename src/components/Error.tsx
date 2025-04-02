import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function Error({ 
  message = "Er is iets misgegaan. Probeer het later opnieuw.", 
  onRetry 
}: ErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-red-500 mb-4"
      >
        <AlertCircle size={48} />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Oeps!
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <RefreshCw size={20} className="mr-2" />
          Probeer opnieuw
        </motion.button>
      )}
    </motion.div>
  );
} 