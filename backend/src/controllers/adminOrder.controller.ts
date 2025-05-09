import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const getAllOrders = async (req: Request, res: Response) => {
  const { userId, startDate, endDate } = req.body

  const filters: any = {}

  if (userId) filters.userId = userId
  if (startDate || endDate) {
    filters.createdAt = {
      ...(startDate && { gte: new Date(startDate as string) }),
      ...(endDate && { lte: new Date(endDate as string) }),
    }
  }

  const orders = await prisma.order.findMany({
    where: filters,
    include: {
      user: true,
      orderItems: {
        include: {
          book: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({ orders })
}

export const getOrderById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      orderItems: {
        include: {
          book: true,
        },
      },
    },
  })

  if (!order) return res.status(404).json({ message: 'Order not found' })

  res.json({ order })
}
