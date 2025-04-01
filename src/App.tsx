import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import CategoryGrid from './components/CategoryGrid'
import ProductsPage from './pages/ProductsPage'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <div className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">
                          Populaire Categorieën
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                          Ontdek onze meest populaire producten per categorie
                        </p>
                      </div>
                      <CategoryGrid />
                    </div>
                  </div>
                </>
              }
            />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
