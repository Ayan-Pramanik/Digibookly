import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { validateEnv } from './utils/validateEnv'
import authRoutes from './routes/auth.routes'
import adminRoutes from './routes/admin.routes'
import userRoutes from './routes/user.routes'
import bookRoutes from './routes/book.routes'
import wishlistRoutes from './routes/wishlist.routes'
import cartRoutes from './routes/cart.routes'
import orderRoutes from './routes/order.routes'


dotenv.config()
validateEnv()

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API is working');
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/users', userRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
// app.use('/api/orders', orderRoutes)

app.listen(3000, () => console.log('Server running on http://localhost:3000'))
