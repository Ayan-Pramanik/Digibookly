import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const adminLogin = async (req: Request, res: Response): Promise<any> => {
  const parseResult = loginSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid input' })
  }

  const { email, password } = parseResult.data

  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' })

  const isMatch = await bcrypt.compare(password, admin.password)
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign(
    { id: admin.id, role: 'admin' },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  return res.status(200).json({ message: 'Login successful', token })
}
