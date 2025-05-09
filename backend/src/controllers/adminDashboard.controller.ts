import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const getDashboardStats = async (_req: Request, res: Response) => {
    const [userCount, bookCount, revenueData, topBooks] = await Promise.all([
      prisma.user.count(),
      prisma.book.count(),
      prisma.order.aggregate({
        _sum: { amount: true },
        where: { status: 'success' },
      }),
      prisma.orderItem.groupBy({
        by: ['bookId'],
        _count: { bookId: true },
        orderBy: { _count: { bookId: 'desc' } },
        take: 5,
      }),
    ])
  
    const books = await prisma.book.findMany({
      where: {
        id: {
          in: topBooks.map((b) => b.bookId),
        },
      },
      select: {
        id: true,
        title: true,
        author: true,
        coverImageUrl: true,
      },
    })
  
    const mostDownloadedBooks = topBooks.map((b) => {
      const bookInfo = books.find((bk) => bk.id === b.bookId)
      return {
        ...bookInfo!,
        downloads: b._count.bookId,
      }
    })
  
    res.json({
      totalUsers: userCount,
      totalBooks: bookCount,
      totalRevenue: (revenueData._sum.amount || 0) / 100,
      mostDownloadedBooks,
    })
  }
  