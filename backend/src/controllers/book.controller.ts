import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { ObjectId } from 'bson'

export const getBooks = async (req: Request, res: Response): Promise<any> => {
  const { genre, author, minPrice, maxPrice } = req.body

  try {
    const books = await prisma.book.findMany({
      where: {
        genre: genre ? String(genre) : undefined,
        author: author
          ? { contains: String(author), mode: 'insensitive' }
          : undefined,
        price: {
          gte: minPrice ? parseFloat(String(minPrice)) : undefined,
          lte: maxPrice ? parseFloat(String(maxPrice)) : undefined,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.status(200).json({ books })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch books' })
  }
}

export const getBookById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params
  
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID format' })
    }
  
    try {
      const book = await prisma.book.findUnique({
        where: { id },
      })
  
      if (!book) return res.status(404).json({ message: 'Book not found' })
  
      res.status(200).json({ book })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Failed to fetch book details' })
    }
}

export const updateBook = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid book ID format' })
  }

  try {
    const book = await prisma.book.update({
      where: { id },
      data: req.body,
    })

    res.status(200).json({ message: 'Book updated', book })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update book' })
  }
}

export const deleteBook = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid book ID format' })
  }

  try {
    await prisma.book.delete({
      where: { id },
    })

    res.status(200).json({ message: 'Book deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete book' })
  }
}