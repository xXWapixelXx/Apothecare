import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { productRoutes } from './routes/products'
import { categoryRoutes } from './routes/categories'
import { authRoutes } from './routes/auth'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Routes
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/auth', authRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
}) 