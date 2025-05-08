import bcrypt from 'bcryptjs'
import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { userInfoRequest } from '../utils/userInterface'
import { updateUserSchema } from '../schemas/user.schema'

export const getMe = async (req: userInfoRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) return res.status(404).json({ message: 'User not found' })

    res.status(200).json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateMe = async (req: userInfoRequest, res: Response): Promise<any> => {
    const userId = req.user?.id
  
    const parsed = updateUserSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
    }
  
    const { name, email, password } = parsed.data
  
    try {
      const dataToUpdate: any = {}
      if (name) dataToUpdate.name = name
      if (email) dataToUpdate.email = email
      if (password) {
        const hashed = await bcrypt.hash(password, 10)
        dataToUpdate.password = hashed
      }
  
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          updatedAt: true,
        },
      })
  
      res.status(200).json({ user: updatedUser })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Failed to update user' })
    }
  }
