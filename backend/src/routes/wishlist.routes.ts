import express from 'express'
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller'
import { protect } from '../middlewares/auth'

const router = express.Router()

router.get('/', protect, getWishlist)
router.post('/', protect, addToWishlist)
router.delete('/:bookId', protect, removeFromWishlist)

export default router
