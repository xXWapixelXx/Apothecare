import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform the data to match the frontend interface
    const transformedOrders = orders.map(order => ({
      id: order.id,
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      total: Number(order.total),
      status: order.status.toLowerCase(),
      date: order.createdAt.toISOString().split('T')[0],
      items: order.items.length,
    }))

    res.json(transformedOrders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const transformedOrder = {
      id: order.id,
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      total: Number(order.total),
      status: order.status.toLowerCase(),
      date: order.createdAt.toISOString().split('T')[0],
      items: order.items.length,
    }

    res.json(transformedOrder)
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

export const orderRoutes = router 