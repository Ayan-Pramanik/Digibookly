import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt';
import { PrismaClient } from '@prisma/client';
import { registerSchema, loginSchema } from '../schemas/user.schema';

const prisma = new PrismaClient();

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

// Register Controller
export const register = async (req: Request, res: Response): Promise<any> => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error);

  const { name, email, password } = parse.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return res.status(201).json({ message: 'User created', user });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Login Controller
export const login = async (req: Request, res: Response): Promise<any> => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error);

  const { email, password } = parse.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

  await prisma.session.deleteMany({ where: { userId: user.id } });

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  
  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  })

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(400).json({ message: 'Token missing' })

  await prisma.session.delete({ where: { token } })

  return res.status(200).json({ message: 'Logged out successfully' })
}