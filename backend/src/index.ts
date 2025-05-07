import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.routes'

dotenv.config()
const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API is working');
})

app.use('/api/auth', authRoutes)

app.listen(3000, () => console.log('Server running on http://localhost:3000'))
