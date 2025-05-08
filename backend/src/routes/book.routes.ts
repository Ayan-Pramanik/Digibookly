import express from 'express'
import { getBooks, getBookById, deleteBook, updateBook } from '../controllers/book.controller'
import { protect } from '../middlewares/auth'
import { isAdmin } from '../middlewares/isAdmin'

const router = express.Router()

router.get('/', getBooks)
router.get('/:id', getBookById)
router.patch('/:id', protect, isAdmin, updateBook)
router.delete('/:id', protect, isAdmin, deleteBook)

export default router
