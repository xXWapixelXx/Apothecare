import { BrowserRouter as Router } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import AppRoutes from './routes'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  )
}

export default App
