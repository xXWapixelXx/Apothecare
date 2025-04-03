import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Get total products and out of stock products
    const productsStats = await prisma.product.aggregate({
      _count: {
        id: true,
      },
      where: {
        stock: {
          equals: 0,
        },
      },
    })

    const totalProducts = await prisma.product.count()

    // Get total customers
    const totalCustomers = await prisma.user.count()

    // Get total orders and revenue
    const ordersStats = await prisma.order.aggregate({
      _count: {
        id: true,
      },
      _sum: {
        total: true,
      },
    })

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        items: true,
      },
    })

    // Get popular products
    const popularProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    })

    // Get product details for popular products
    const popularProductDetails = await Promise.all(
      popularProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { category: true },
        })
        return {
          ...product,
          totalSold: item._sum.quantity,
        }
      })
    )

    // Transform recent orders
    const transformedOrders = recentOrders.map((order) => ({
      id: order.id,
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      total: Number(order.total),
      status: order.status.toLowerCase(),
      date: order.createdAt.toISOString().split('T')[0],
      items: order.items.length,
    }))

    // Transform popular products
    const transformedPopularProducts = popularProductDetails.map((product) => ({
      id: product?.id,
      name: product?.name,
      price: Number(product?.price || 0),
      stock: product?.stock || 0,
      category: product?.category?.name || 'Unknown',
      totalSold: product?.totalSold || 0,
      image: product?.image ? `http://localhost:3001${product.image}` : null,
    }))

    res.json({
      stats: {
        totalProducts,
        outOfStockProducts: productsStats._count.id,
        totalCustomers,
        totalOrders: ordersStats._count.id,
        totalRevenue: Number(ordersStats._sum.total || 0),
      },
      recentOrders: transformedOrders,
      popularProducts: transformedPopularProducts,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
})

export const dashboardRoutes = router 