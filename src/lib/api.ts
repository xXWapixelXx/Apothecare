const API_URL = 'http://localhost:3001/api'

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

export const api = {
  async getProducts(params?: { category?: string; sortBy?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.append('category', params.category)
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    
    const response = await fetch(`${API_URL}/products?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json() as Promise<Product[]>
  },

  async getProduct(id: string) {
    const response = await fetch(`${API_URL}/products/${id}`)
    if (!response.ok) throw new Error('Failed to fetch product')
    return response.json() as Promise<Product>
  },

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
    if (!response.ok) throw new Error('Failed to create product')
    return response.json() as Promise<Product>
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
    if (!response.ok) throw new Error('Failed to update product')
    return response.json() as Promise<Product>
  },

  async deleteProduct(id: string) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete product')
  },
} 