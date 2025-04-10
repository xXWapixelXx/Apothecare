import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { productRoutes } from './routes/products'
import { categoryRoutes } from './routes/categories'
import { authRoutes } from './routes/auth'
import { orderRoutes } from './routes/orders'
import { customerRoutes } from './routes/customers'
import { dashboardRoutes } from './routes/dashboard'
import { chatRoutes } from './routes/chat'
import path from 'path'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Enable CORS with specific options
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

// API Routes
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/chat', chatRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
}) 