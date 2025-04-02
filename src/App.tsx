import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import AppRoutes from './routes'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        {!isAdminRoute && <Navbar />}
        <main className="flex-grow">
          <AppRoutes />
        </main>
        {!isAdminRoute && <Footer />}
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
