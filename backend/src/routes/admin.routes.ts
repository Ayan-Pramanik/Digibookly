import express from 'express'
import { adminLogin } from '../controllers/admin.controller'
import { isAdmin } from '../middlewares/isAdmin'
import { getAllOrders, getOrderById } from '../controllers/adminOrder.controller'
import { protect } from '../middlewares/auth'
import { getAllUsers, resetUserPassword, revokeUserAccess } from '../controllers/adminUser.controller'
import { getDashboardStats } from '../controllers/adminDashboard.controller'

const router = express.Router()

router.post('/login', adminLogin)


router.get('/dashboard/orders', isAdmin, getAllOrders)
router.get('/dashboard/orders/:id', isAdmin, getOrderById)

router.get('/dashboard/users', protect, isAdmin, getAllUsers)
router.put('/dashboard/users/:id/reset-password', protect, isAdmin, resetUserPassword)
router.put('/dashboard/users/:id/revoke', protect, isAdmin, revokeUserAccess)

router.get('/dashboard/stats', protect, isAdmin, getDashboardStats)


export default router
