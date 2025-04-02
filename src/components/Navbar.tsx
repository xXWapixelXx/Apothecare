import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Search, User, LogOut, ChevronDown, Package, Settings, Bell } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
  const { totalItems } = useCart();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsAuthenticated(!!token);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Producten', path: '/products' },
    { name: 'Categorieën', path: '/categories' },
    { name: 'Over Ons', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              ApotheCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-600 hover:text-emerald-500 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search, Cart, and User Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-600 hover:text-emerald-500 transition-colors duration-200">
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-emerald-500 transition-colors duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-emerald-500 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-emerald-600" />
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-600 hover:text-emerald-500 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                </Link>
              )}

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 border border-gray-100"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user ? `${user.firstName} ${user.lastName}` : 'Mijn Account'}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profiel
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4 mr-3" />
                        Bestellingen
                      </Link>
                      <Link
                        to="/notifications"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Bell className="h-4 w-4 mr-3" />
                        Notificaties
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Instellingen
                      </Link>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Uitloggen
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-emerald-500 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-white shadow-lg overflow-hidden"
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block px-3 py-2 text-gray-600 hover:text-emerald-500 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex items-center space-x-4 px-3 py-2">
            <button className="text-gray-600 hover:text-emerald-500 transition-colors duration-200">
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-emerald-500 transition-colors duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
          </div>
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 text-gray-600 hover:text-emerald-500 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mijn Profiel
              </Link>
              <Link
                to="/orders"
                className="block px-3 py-2 text-gray-600 hover:text-emerald-500 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bestellingen
              </Link>
              <Link
                to="/notifications"
                className="block px-3 py-2 text-gray-600 hover:text-emerald-500 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Notificaties
              </Link>
              <Link
                to="/settings"
                className="block px-3 py-2 text-gray-600 hover:text-emerald-500 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Instellingen
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Uitloggen
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 text-gray-600 hover:text-emerald-500 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inloggen
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-emerald-600 hover:bg-emerald-50 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Registreren
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar; 