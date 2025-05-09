import express from 'express'
import { getCart, addToCart, removeFromCart } from '../controllers/cart.controller'
import { protect } from '../middlewares/auth'

const router = express.Router()

router.get('/', protect, getCart)
router.post('/', protect, addToCart)
router.delete('/:bookId', protect, removeFromCart)

export default router
