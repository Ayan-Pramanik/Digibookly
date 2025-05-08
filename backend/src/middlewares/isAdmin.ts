import { Request, Response, NextFunction } from 'express'
import { userInfoRequest } from '../utils/userInterface'

export const isAdmin = (req: userInfoRequest, res: Response, next: NextFunction): any => {
  if (!req.user || req.user.role !== 'admin') {
    console.log('Admin')
    return res.status(403).json({ message: 'Access denied. Admins only.' })
  }
  next()
}
