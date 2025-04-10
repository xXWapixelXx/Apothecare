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
    console.log('Received query params:', { category, sortBy })

    let products = await prisma.product.findMany({
      where: category ? {
        category: {
          name: category as string
        }
      } : undefined,
      include: {
        category: true
      }
    })

    // Transform products to include full image URL
    products = products.map(product => ({
      ...product,
      image: product.image ? `http://localhost:3001${product.image}` : null
    }))

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
        case 'name-asc':
          products.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'name-desc':
          products.sort((a, b) => b.name.localeCompare(a.name))
          break
      }
    }

    res.json(products)
  } catch (error) {
    console.error('Error in /products route:', error)
    res.status(500).json({ 
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
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
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, price, stock } = req.body;
    console.log('Received product data:', req.body);

    // Find or create category
    const categoryRecord = await prisma.category.findFirst({
      where: { name: category }
    });

    if (!categoryRecord) {
      console.error('Category not found:', category);
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Prepare create data with proper type conversion
    const createData: any = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      categoryId: categoryRecord.id,
    };

    // If a new image was uploaded, add it to the create data
    if (req.file) {
      createData.image = `/uploads/${req.file.filename}`;
    }

    console.log('Creating product with data:', createData);

    // Create the product
    const product = await prisma.product.create({
      data: createData,
      include: {
        category: true
      }
    });

    // Add full image URL to response
    const responseProduct = {
      ...product,
      image: product.image ? `http://localhost:3001${product.image}` : null
    };

    console.log('Created product:', responseProduct);
    res.status(201).json(responseProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

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