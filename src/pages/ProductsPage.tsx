import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Search, Filter, ShoppingCart, Star, Heart, ChevronLeft, ChevronRight, X, Tag, Package, Truck, Shield, Clock, ChevronDown } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import Error from '../components/Error'
import { useCart } from '../contexts/CartContext'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  discount?: number
  isNew?: boolean
  isBestSeller?: boolean
  deliveryTime?: string
  brand?: string
  tags?: string[]
}

interface ErrorResponse {
  error?: string
}

const ITEMS_PER_PAGE = 8

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const selectedCategoryParam = searchParams.get('category') || ''
  const selectedSortParam = searchParams.get('sort') || 'newest'

  useEffect(() => {
    fetchProducts()
  }, [selectedCategoryParam, selectedSortParam])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`http://localhost:3001/api/products?category=${selectedCategoryParam}&sortBy=${selectedSortParam}`)
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    const matchesBrand = !selectedBrand || product.brand === selectedBrand
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => product.tags?.includes(tag))
    return matchesSearch && matchesPrice && matchesCategory && matchesBrand && matchesTags
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const addToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      quantity: 1,
    })
  }

  const toggleFavorite = (product: Product) => {
    // Implement favorite functionality
    console.log('Toggled favorite:', product)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={fetchProducts} />

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
                Producten
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Vind de perfecte gezondheidsproducten voor jouw behoeften.
            </p>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Zoek een product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-300 pl-12"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white text-gray-700 hover:bg-emerald-50 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 cursor-pointer hover:border-emerald-500 transition-colors focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="popular">Meest populair</option>
              <option value="price-asc">Prijs: Laag naar hoog</option>
              <option value="price-desc">Prijs: Hoog naar laag</option>
              <option value="name-asc">Naam: A tot Z</option>
              <option value="name-desc">Naam: Z tot A</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-6 bg-white rounded-2xl shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorieën</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`block w-full text-left px-3 py-2 rounded-lg ${
                        !selectedCategory
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Alle categorieën
                    </button>
                    {['Vitaminen', 'Supplementen', 'Medicijnen', 'Persoonlijke Verzorging', 'EHBO', 'Gezondheid'].map(
                      (category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`block w-full text-left px-3 py-2 rounded-lg ${
                            selectedCategory === category
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {category}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Prijsbereik</h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-24 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">tot</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-24 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Nieuw', 'Best Seller', 'Sale', 'Gratis verzending', 'Op voorraad'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedTags(prev =>
                            prev.includes(tag)
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          )
                        }}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          selectedTags.includes(tag)
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Tag className="w-4 h-4 mr-1" />
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Products Grid/List */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {sortedProducts.length} producten gevonden
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }
          >
            {paginatedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={viewMode === 'grid' ? "group" : "group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"}
                onClick={() => setQuickViewProduct(product)}
              >
                <div className={viewMode === 'grid' 
                  ? "relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
                  : "flex items-center gap-6 p-4"
                }>
                  {/* Image */}
                  <div className={viewMode === 'grid'
                    ? "relative h-64 overflow-hidden"
                    : "relative w-48 h-48 overflow-hidden rounded-xl"
                  }>
                    <img
                      src={product.image || '/images/placeholder.png'}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {product.discount && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                        -{product.discount}%
                      </div>
                    )}
                    {product.isNew && (
                      <div className="absolute top-4 left-4 bg-emerald-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                        Nieuw
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Niet op voorraad</span>
                      </div>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(product)
                      }}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                    >
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className={viewMode === 'grid' ? "p-6" : "flex-1"}>
                    <h3 className={`font-bold text-gray-900 mb-2 ${viewMode === 'grid' ? 'text-xl' : 'text-2xl'}`}>
                      {product.name}
                    </h3>
                    <p className={`text-gray-600 mb-4 ${viewMode === 'grid' ? 'text-sm line-clamp-2' : ''}`}>
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`font-bold text-emerald-600 ${viewMode === 'grid' ? 'text-2xl' : 'text-3xl'}`}>
                          €{Number(product.price).toFixed(2)}
                        </span>
                        {product.discount && (
                          <span className="text-gray-500 line-through ml-2">
                            €{(product.price * (1 + product.discount / 100)).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product)
                        }}
                        disabled={product.stock === 0}
                        className={`inline-flex items-center px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors ${
                          product.stock === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        {product.stock === 0 ? 'Niet beschikbaar' : 'In winkelwagen'}
                      </button>
                    </div>
                    {viewMode === 'list' && (
                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-1" />
                          {product.stock} op voorraad
                        </div>
                        {product.deliveryTime && (
                          <div className="flex items-center">
                            <Truck className="w-4 h-4 mr-1" />
                            {product.deliveryTime}
                          </div>
                        )}
                        {product.brand && (
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 mr-1" />
                            {product.brand}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {sortedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Geen producten gevonden
            </h3>
            <p className="text-gray-600">
              Probeer andere zoektermen of pas de filters aan
            </p>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Pagina {currentPage} van {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white text-gray-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-emerald-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white text-gray-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-96">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {quickViewProduct.name}
                </h2>
                <p className="text-gray-600 mb-6">
                  {quickViewProduct.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-emerald-600">
                      €{Number(quickViewProduct.price).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {quickViewProduct.stock} op voorraad
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      addToCart(quickViewProduct)
                      setQuickViewProduct(null)
                    }}
                    className="inline-flex items-center px-6 py-3 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    In winkelwagen
                  </button>
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
            Klaar om te bestellen?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Bekijk je winkelwagen en voltooi je bestelling.
          </p>
          <Link
            to="/cart"
            className="inline-flex items-center px-8 py-4 rounded-full bg-white text-emerald-600 font-medium hover:bg-emerald-50 transition-colors"
          >
            Bekijk winkelwagen
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 