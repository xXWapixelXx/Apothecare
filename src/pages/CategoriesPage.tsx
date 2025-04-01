import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Activity, Pill, Heart, SprayCan, Syringe, Stethoscope, Search } from 'lucide-react'
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
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Ontdek Onze{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                Categorieën
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Verken ons uitgebreide assortiment van gezondheidsproducten, 
              van vitaminen tot persoonlijke verzorging.
            </p>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Zoek een categorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-300 pl-12"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
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
                            <span>Bekijk producten</span>
                            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
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