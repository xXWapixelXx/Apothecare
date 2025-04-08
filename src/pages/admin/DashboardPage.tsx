import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Clock,
  Star,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  recentOrders: Order[];
  lowStockProducts: Product[];
  topProducts: Product[];
  ordersTrend: number;
  productsTrend: number;
  customersTrend: number;
  revenueTrend: number;
}

interface Order {
  id: string;
  customerName: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  date: string;
  items: number;
}

interface Product {
  id: string;
  name: string;
  stock: number;
  price: number | string;
  sales: number;
  image: string | null;
  category: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
    topProducts: [],
    ordersTrend: 0,
    productsTrend: 0,
    customersTrend: 0,
    revenueTrend: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products
      const products = await api.getProducts();
      const orders = await api.getOrders();
      const customers = await api.getCustomers();

      // Calculate stats
      const totalProducts = products.length;
      const totalOrders = orders.length;
      const totalCustomers = customers.length;
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

      // Get low stock products (less than 10 items)
      const lowStockProducts = products
        .filter(product => product.stock < 10)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5)
        .map(product => ({
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          sales: product.sales || 0,
          category: typeof product.category === 'string' ? product.category : product.category.name
        }));

      // Get top products by sales
      const topProducts = [...products]
        .sort((a, b) => ((b.sales || 0) - (a.sales || 0)))
        .slice(0, 4)
        .map(product => ({
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          sales: product.sales || 0,
          category: typeof product.category === 'string' ? product.category : product.category.name
        }));

      // Get recent orders
      const recentOrders = orders
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map(order => ({
          ...order,
          total: typeof order.total === 'string' ? parseFloat(order.total) : order.total
        }));

      // Calculate trends (mock data for now, replace with real calculations)
      const stats: DashboardStats = {
        totalOrders,
        totalProducts,
        totalCustomers,
        totalRevenue,
        recentOrders,
        lowStockProducts,
        topProducts,
        ordersTrend: 12,
        productsTrend: 8,
        customersTrend: 24,
        revenueTrend: 18,
      };

      setStats(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setError("Failed to fetch dashboard data. Please try again.");
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-sm text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="text-gray-900">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your pharmacy today.
          </p>
        </div>
        <button
          onClick={fetchDashboardStats}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalOrders}
              </h3>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            {stats.ordersTrend > 0 ? (
              <ChevronUp className="w-4 h-4 text-green-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-red-500" />
            )}
            <span className={stats.ordersTrend > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
              {Math.abs(stats.ordersTrend)}%
            </span>
            <span className="text-gray-600 ml-2">from last month</span>
          </div>
        </motion.div>

        {/* Total Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalProducts}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            {stats.productsTrend > 0 ? (
              <ChevronUp className="w-4 h-4 text-green-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-red-500" />
            )}
            <span className={stats.productsTrend > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
              {Math.abs(stats.productsTrend)}%
            </span>
            <span className="text-gray-600 ml-2">from last month</span>
          </div>
        </motion.div>

        {/* Total Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalCustomers}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            {stats.customersTrend > 0 ? (
              <ChevronUp className="w-4 h-4 text-green-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-red-500" />
            )}
            <span className={stats.customersTrend > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
              {Math.abs(stats.customersTrend)}%
            </span>
            <span className="text-gray-600 ml-2">from last month</span>
          </div>
        </motion.div>

        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                €{stats.totalRevenue.toFixed(2)}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            {stats.revenueTrend > 0 ? (
              <ChevronUp className="w-4 h-4 text-green-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-red-500" />
            )}
            <span className={stats.revenueTrend > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
              {Math.abs(stats.revenueTrend)}%
            </span>
            <span className="text-gray-600 ml-2">from last month</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders & Low Stock Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="p-6">
            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-500">No recent orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-500">{order.date}</p>
                        <span className="text-sm text-gray-400">•</span>
                        <p className="text-sm text-gray-500">{order.items} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        €{Number(order.total).toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Low Stock Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
          </div>
          <div className="p-6">
            {stats.lowStockProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-500">No low stock products</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <p className="text-sm text-red-500">
                            Only {product.stock} units left
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        €{Number(product.price).toFixed(2)}
                      </p>
                      <span className="text-sm text-gray-500">{product.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm mt-6"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
        </div>
        <div className="p-6">
          {stats.topProducts.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="mt-2 text-gray-500">No top products data</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <p className="text-sm text-green-500">{product.sales} sales</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      €{Number(product.price).toFixed(2)}
                    </p>
                    <span className="text-sm text-gray-500">{product.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 