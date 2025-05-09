import express from 'express'
import { protect } from '../middlewares/auth'
import { createCheckoutOrder, verifyCheckoutPayment, downloadBook, getInvoice } from '../controllers/order.controller'

const router = express.Router()

router.post('/create', protect, createCheckoutOrder)
router.post('/verify', protect, verifyCheckoutPayment)
router.get('/:id/download', protect, downloadBook)
router.get('/:orderId/invoice', protect, getInvoice)


export default router
