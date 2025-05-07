import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { registerSchema } from '../schemas/user.schema'

const prisma = new PrismaClient()

export const register = async (req: Request, res: Response): Promise<Response> => {
  const parse = registerSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json(parse.error)

  const { name, email, password } = parse.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  })

  return res.status(201).json({ message: 'User created', user })
}
