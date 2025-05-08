// src/routes/user.routes.ts
import express from 'express'
import { getMe, updateMe } from '../controllers/user.controller'
import { protect } from '../middlewares/auth'

const router = express.Router()

router.get('/me', protect, getMe)
router.patch('/me', protect, updateMe)

export default router
