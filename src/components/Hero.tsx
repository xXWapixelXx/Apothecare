import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
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

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="space-y-8"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="block text-gray-900"
              >
                Uw gezondheid,
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                className="block text-emerald-600"
              >
                Onze zorg
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className="text-lg sm:text-xl text-gray-600 max-w-2xl"
            >
              Ontdek ons uitgebreide assortiment van hoogwaardige gezondheidsproducten, 
              vitaminen en verzorgingsartikelen. Professioneel advies en snelle bezorging.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/products" onClick={scrollToTop}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-all duration-700"
                >
                  <span>Ontdek Producten</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-700 group-hover:translate-x-1" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-emerald-600 font-semibold shadow-lg hover:bg-gray-50 transition-all duration-700"
              >
                Vraag Advies
              </motion.button>
            </motion.div>
            
            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8">
              {[
                { title: 'Gratis Verzending', subtitle: 'Vanaf €50' },
                { title: 'Snelle Levering', subtitle: '1-2 werkdagen' },
                { title: 'Expert Advies', subtitle: '24/7 beschikbaar' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.2, ease: "easeOut" }}
                  className="text-center p-4 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-700"
                >
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.subtitle}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="relative lg:h-[600px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-300 rounded-3xl transform rotate-3 transition-transform duration-700" />
            <img
              src="/images/hero-image.jpg"
              alt="Healthcare Products"
              className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl transform -rotate-3 transition-all duration-700 hover:rotate-0"
            />
            
            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="absolute top-10 right-10 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center"
            >
              <img src="/images/vitamin-c.png" alt="Vitamin C" className="w-12 h-12" />
            </motion.div>
            
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="absolute bottom-10 left-10 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
            >
              <img src="/images/heart.png" alt="Heart" className="w-10 h-10" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 