import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.routes'
import { validateEnv } from './utils/validateEnv'
import userRoutes from './routes/user.routes'
import bookRoutes from './routes/book.routes'


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
app.use('/api/users', userRoutes)
app.use('/api/books', bookRoutes)

app.listen(3000, () => console.log('Server running on http://localhost:3000'))
