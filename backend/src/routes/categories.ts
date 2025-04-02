import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get all categories with product counts
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    // Transform the data to match our frontend needs
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || '',
      slug: category.slug,
      productCount: category._count.products,
      // We'll keep these hardcoded for now since they're UI-specific
      icon: 'Activity', // This will be mapped in the frontend
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      image: `https://placehold.co/600x400/059669/white?text=${encodeURIComponent(category.name)}`
    }))

    res.json(transformedCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

export const categoryRoutes = router 