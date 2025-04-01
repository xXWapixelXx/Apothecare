export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isNew: boolean
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Vitamin C 1000mg',
    description: 'High-strength vitamin C supplement with bioflavonoids for optimal absorption and immune support.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1579722820618-eb1b1b1b1b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Vitamins',
    isNew: true,
  },
  {
    id: '2',
    name: 'Omega-3 Fish Oil',
    description: 'Premium fish oil supplement with high DHA and EPA content for heart and brain health.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1579722820618-eb1b1b1b1b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Supplements',
    isNew: false,
  },
  {
    id: '3',
    name: 'Probiotic Complex',
    description: 'Advanced probiotic formula with 50 billion CFU and 10 different strains for gut health.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1579722820618-eb1b1b1b1b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Probiotics',
    isNew: true,
  },
  {
    id: '4',
    name: 'Magnesium Citrate',
    description: 'Highly absorbable magnesium supplement for muscle relaxation and sleep support.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1579722820618-eb1b1b1b1b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Minerals',
    isNew: false,
  },
  {
    id: '5',
    name: 'Collagen Powder',
    description: 'Hydrolyzed collagen powder with vitamin C for skin, hair, and joint health.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1579722820618-eb1b1b1b1b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Beauty',
    isNew: true,
  },
  {
    id: '6',
    name: 'Zinc + Vitamin D',
    description: 'Combination supplement for immune support and bone health.',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1579722820618-eb1b1b1b1b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Vitamins',
    isNew: false,
  },
] 