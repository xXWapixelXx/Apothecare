import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Activity, Pill, Heart, SprayCan, Syringe, Stethoscope, Search, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Category {
  id: string
  name: string
  description: string
  slug: string
  productCount: number
  icon: string
  color: string
  bgColor: string
  textColor: string
  image: string
}

const iconMap: { [key: string]: any } = {
  'Activity': Activity,
  'Pill': Pill,
  'Heart': Heart,
  'SprayCan': SprayCan,
  'Syringe': Syringe,
  'Stethoscope': Stethoscope
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oeps! Er ging iets mis</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Animated background patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large gradient circles */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-emerald-300/30 to-teal-300/30 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/2 -right-48 w-96 h-96 bg-gradient-to-br from-cyan-300/30 to-emerald-300/30 rounded-full blur-3xl animate-float-slow-reverse"></div>
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-gradient-to-br from-teal-300/30 to-cyan-300/30 rounded-full blur-3xl animate-float"></div>

          {/* Decorative grid pattern */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2320B2AA' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
            opacity: 0.5
          }}></div>
        </div>

        {/* Fade out gradient at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

        <div className="container mx-auto px-4 py-24 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1 
              className="text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Ontdek Onze{' '}
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                  Categorieën
                </span>
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                ></motion.span>
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Verken ons uitgebreide assortiment van gezondheidsproducten, 
              van vitaminen tot persoonlijke verzorging.
            </motion.p>

            <motion.div 
              className="relative max-w-xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-30 group-hover:opacity-100 blur transition duration-500"></div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Zoek een categorie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 rounded-full border-2 border-transparent bg-white/80 backdrop-blur-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-300 pl-12 shadow-lg relative z-10"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-20" />
                </div>
              </div>
            </motion.div>

            {/* Scroll Down Button */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-12 relative z-20"
            >
              <motion.button
                onClick={() => document.querySelector('.categories-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 font-medium text-base">
                  Bekijk categorieën
                </span>
                <motion.div
                  className="relative z-10"
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12 categories-grid">
        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCategories.map((category, index) => {
              const Icon = iconMap[category.icon] || Activity;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition-all duration-500"></div>
                  <Link
                    to={`/products?category=${category.slug}`}
                    className="relative block bg-white rounded-2xl p-1 transform transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="relative rounded-xl overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-emerald-900/90 via-emerald-800/50 to-transparent"></div>
                      
                      {/* Category Icon with Enhanced Glow Effect */}
                      <div className="absolute top-4 right-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 scale-150"></div>
                          <motion.div 
                            className={`relative p-3 rounded-xl ${category.bgColor} backdrop-blur-sm transform group-hover:scale-110 transition-all duration-500`}
                            whileHover={{ rotate: 12 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon className={`w-6 h-6 ${category.textColor}`} />
                          </motion.div>
                        </div>
                      </div>

                      {/* Enhanced Content */}
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <div className="space-y-3 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                          <motion.div 
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <span className="px-3 py-1 text-xs font-medium text-emerald-100 bg-emerald-900/30 backdrop-blur-sm rounded-full border border-emerald-500/20">
                              {category.productCount} producten
                            </span>
                          </motion.div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-emerald-200 transition-colors duration-300">
                            {category.name}
                          </h3>
                          <p className="text-sm text-white/90 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm">
                            {category.description}
                          </p>
                          <div className="flex items-center text-emerald-200 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <span className="font-medium">Bekijk producten</span>
                            <motion.div
                              animate={{ x: [0, 4, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Geen categorieën gevonden
            </h3>
            <p className="text-gray-600">
              Probeer andere zoektermen of bekijk alle categorieën
            </p>
          </motion.div>
        )}
      </div>

      {/* Category Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64">
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
              <div className="p-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${selectedCategory.bgColor} mb-4`}>
                  {React.createElement(iconMap[selectedCategory.icon] || Activity, {
                    className: `w-6 h-6 ${selectedCategory.textColor}`
                  })}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedCategory.name}
                </h2>
                <p className="text-gray-600 mb-6">
                  {selectedCategory.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    {selectedCategory.productCount} producten beschikbaar
                  </span>
                  <Link
                    to={`/products?category=${selectedCategory.slug}`}
                    className="inline-flex items-center px-6 py-2 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Bekijk alle producten
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">
            Klaar om te winkelen?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Ontdek onze volledige productcatalogus en vind de perfecte gezondheidsproducten voor jou.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-4 rounded-full bg-white text-emerald-600 font-medium hover:bg-emerald-50 transition-colors"
          >
            Bekijk alle producten
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 