import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import multer from 'multer'
import path from 'path'

const router = Router()
const prisma = new PrismaClient()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP images are allowed.'))
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, sortBy } = req.query
    let products = await prisma.product.findMany({
      include: {
        category: true
      }
    })

    // Transform products to include full image URL
    products = products.map(product => ({
      ...product,
      image: product.image ? `http://localhost:3001${product.image}` : null
    }))

    // Filter by category if provided
    if (category) {
      products = products.filter(product => 
        product.category.name.toLowerCase() === String(category).toLowerCase()
      )
    }

    // Sort products
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          products.sort((a, b) => Number(a.price) - Number(b.price))
          break
        case 'price-desc':
          products.sort((a, b) => Number(b.price) - Number(a.price))
          break
        case 'newest':
          products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          break
      }
    }

    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    })
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// Create product
router.post('/', async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body
    })
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// Update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, category, price, stock } = req.body

    // Prepare update data with proper type conversion
    const updateData: any = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
    }

    // If category is provided, update it
    if (category) {
      const categoryRecord = await prisma.category.findFirst({
        where: { name: category }
      })
      if (categoryRecord) {
        updateData.categoryId = categoryRecord.id
      }
    }

    // If a new image was uploaded, add it to the update data
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`
    }

    // Update the product
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    })

    // Add full image URL to response
    const responseProduct = {
      ...product,
      image: product.image ? `http://localhost:3001${product.image}` : null
    }

    res.json(responseProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    })
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

export const productRoutes = router 