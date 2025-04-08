const API_URL = 'http://localhost:3001/api'
const PHP_API_URL = 'http://localhost/php-api/api'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isNew: boolean
  stock: number
  sku: string
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  customerName: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  date: string
  items: number
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  productCount?: number;
}

export const api = {
  async getProducts(params?: { category?: string; sortBy?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.append('category', params.category)
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    
    const response = await fetch(`${API_URL}/products?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json() as Promise<Product[]>
  },

  async getUsers() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async getProduct(id: string) {
    const response = await fetch(`${API_URL}/products/${id}`)
    if (!response.ok) throw new Error('Failed to fetch product')
    return response.json() as Promise<Product>
  },

  async createProduct(productData: FormData): Promise<Product> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        body: productData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async updateProduct(id: string, data: Partial<Product> | FormData) {
    let options: RequestInit = {
      method: 'PUT',
    }

    if (data instanceof FormData) {
      options.body = data
    } else {
      options.headers = { 'Content-Type': 'application/json' }
      options.body = JSON.stringify(data)
    }

    const response = await fetch(`${API_URL}/products/${id}`, options)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update product')
    }
    return response.json() as Promise<Product>
  },

  async deleteProduct(id: string) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete product')
  },

  async getOrders() {
    const response = await fetch(`${API_URL}/orders`)
    if (!response.ok) throw new Error('Failed to fetch orders')
    return response.json() as Promise<Order[]>
  },

  async getOrder(id: string) {
    const response = await fetch(`${API_URL}/orders/${id}`)
    if (!response.ok) throw new Error('Failed to fetch order')
    return response.json() as Promise<Order>
  },

  async getCustomers() {
    const response = await fetch(`${API_URL}/customers`)
    if (!response.ok) throw new Error('Failed to fetch customers')
    return response.json() as Promise<Customer[]>
  },

  async getCustomer(id: string) {
    const response = await fetch(`${API_URL}/customers/${id}`)
    if (!response.ok) throw new Error('Failed to fetch customer')
    return response.json() as Promise<Customer>
  },

  async updateCustomer(id: string, data: Partial<Customer>) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update customer');
    }

    return response.json() as Promise<Customer>;
  },

  async deleteCustomer(id: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete customer');
    }
  },

  async getProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('http://localhost:3001/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  async login(email: string, password: string) {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data: data
        }
      };
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },

  async logout() {
    localStorage.removeItem('token');
  },

  async getCategories() {
    try {
      console.log('Fetching categories...');
      const response = await fetch(`${API_URL}/categories`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch categories:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Categories fetched successfully:', data);
      return data as Category[];
    } catch (error) {
      console.error('Error in getCategories:', error);
      throw error;
    }
  },

  async getDashboardStats() {
    const response = await fetch(`${API_URL}/dashboard/stats`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch dashboard stats');
    }
    return response.json();
  },
} 