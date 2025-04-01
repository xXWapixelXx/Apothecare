import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, MapPin, CreditCard, Calendar, ShoppingBag, LogOut, Settings, ChevronRight } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: 'USER' | 'ADMIN';
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string;
  };
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const [profileResponse, ordersResponse] = await Promise.all([
          fetch('http://localhost:3001/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch('http://localhost:3001/api/auth/orders', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
        ]);

        if (!profileResponse.ok || !ordersResponse.ok) {
          throw new Error('Failed to load profile data');
        }

        const [profileData, ordersData] = await Promise.all([
          profileResponse.json(),
          ordersResponse.json(),
        ]);

        setUser(profileData);
        setOrders(ordersData);
      } catch (err) {
        setError('Er is iets misgegaan bij het laden van je profiel');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oeps!</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pt-20">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-2">
              <div className="p-4 text-center border-b border-gray-100 mb-2">
                <div className="inline-flex items-center justify-center bg-emerald-100 rounded-full p-3 mb-3">
                  <User className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-emerald-50'
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Profiel
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-emerald-50'
                }`}
              >
                <Package className="w-5 h-5 mr-3" />
                Bestellingen
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-emerald-50'
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                Instellingen
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-4"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Uitloggen
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Personal Information */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Persoonlijke gegevens</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Naam</label>
                        <p className="mt-1 text-gray-900">{user.firstName} {user.lastName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-gray-900">{user.email}</p>
                      </div>
                      {user.phone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Telefoon</label>
                          <p className="mt-1 text-gray-900">{user.phone}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Lid sinds</label>
                        <p className="mt-1 text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString('nl-NL')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Adressen</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.addresses.map((address) => (
                        <div key={address.id} className="bg-emerald-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                            <h3 className="font-medium text-gray-900">
                              {address.type === 'shipping' ? 'Verzendadres' : 'Factuuradres'}
                            </h3>
                          </div>
                          <p className="text-gray-600">{address.street}</p>
                          <p className="text-gray-600">
                            {address.postalCode} {address.city}
                          </p>
                          <p className="text-gray-600">{address.country}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                      <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Geen bestellingen gevonden
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Je hebt nog geen bestellingen geplaatst.
                      </p>
                      <button
                        onClick={() => navigate('/products')}
                        className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        Bekijk producten
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <Package className="w-5 h-5 text-emerald-600" />
                              <span className="font-medium">Bestelling #{order.id.slice(0, 8)}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('nl-NL')}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'SHIPPED' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status === 'DELIVERED' ? 'Bezorgd' :
                                 order.status === 'PROCESSING' ? 'In verwerking' :
                                 order.status === 'SHIPPED' ? 'Verzonden' :
                                 'In afwachting'}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">
                                      {item.product.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {item.quantity}x €{item.price.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div className="flex justify-between items-center pt-4 border-t">
                              <span className="font-medium text-gray-900">Totaal</span>
                              <span className="font-medium text-lg text-emerald-600">€{order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Instellingen</h2>
                  <p className="text-gray-500">Instellingen zijn momenteel niet beschikbaar.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 