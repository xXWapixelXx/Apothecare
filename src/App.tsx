import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import AppRoutes from './routes'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AiSupport } from './components/AiSupport'
import ScrollToTop from './components/ScrollToTop'

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        {!isAdminRoute && <Navbar />}
        <main className="flex-grow">
          <AppRoutes />
        </main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <AiSupport />}
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
