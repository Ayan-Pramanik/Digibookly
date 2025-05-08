import { Router } from 'express'
import { register, login, logout } from '../controllers/auth.controller'
import { prisma } from '../lib/prisma';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout',logout);

router.get('/users',protect, async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users)
  })
export default router
