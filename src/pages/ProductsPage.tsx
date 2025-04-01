import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import Error from '../components/Error'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isNew: boolean
  stock: number
}

interface ErrorResponse {
  error?: string
}

const sortOptions = [
  { value: 'newest', label: 'Nieuwste eerst' },
  { value: 'price-low', label: 'Prijs: laag naar hoog' },
  { value: 'price-high', label: 'Prijs: hoog naar laag' },
  { value: 'name-asc', label: 'Naam: A-Z' },
  { value: 'name-desc', label: 'Naam: Z-A' },
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const selectedCategory = searchParams.get('category') || ''
  const selectedSort = searchParams.get('sort') || 'newest'

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, selectedSort])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`http://localhost:3001/api/products?category=${selectedCategory}&sortBy=${selectedSort}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch products' })) as ErrorResponse
        throw new Error(errorData.error || 'Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het ophalen van de producten.')
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (value: string) => {
    searchParams.set('sort', value)
    setSearchParams(searchParams)
  }

  const handleCategoryChange = (category: string) => {
    if (category) {
      searchParams.set('category', category)
    } else {
      searchParams.delete('category')
    }
    setSearchParams(searchParams)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={fetchProducts} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {selectedCategory ? `${selectedCategory} Producten` : 'Alle Producten'}
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <SlidersHorizontal size={20} className="mr-2" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="col-span-12 lg:col-span-3 space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Categorieën
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`block w-full text-left px-3 py-2 rounded-md ${
                      !selectedCategory
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Alle Producten
                  </button>
                  {['Vitaminen', 'Supplementen', 'Medicijnen', 'Persoonlijke Verzorging', 'EHBO', 'Gezondheid'].map(
                    (category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`block w-full text-left px-3 py-2 rounded-md ${
                          selectedCategory === category
                            ? 'bg-blue-100 text-blue-800'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {category}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Sorteren
                </h3>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`block w-full text-left px-3 py-2 rounded-md ${
                        selectedSort === option.value
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`col-span-12 ${
            showFilters ? 'lg:col-span-9' : 'lg:col-span-12'
          }`}
        >
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 