import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, sortBy } = req.query
    let products = await prisma.product.findMany()

    // Filter by category if provided
    if (category) {
      products = products.filter(product => product.category === category)
    }

    // Sort products
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          products.sort((a, b) => b.price - a.price)
          break
        case 'newest':
          products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          break
      }
    }

    res.json(products)
  } catch (error) {
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
router.put('/:id', async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json(product)
  } catch (error) {
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
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

export const productRoutes = router 