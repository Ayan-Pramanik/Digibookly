import jwt, { Secret } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export const signToken = (payload: object): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

  if (!JWT_SECRET) throw new Error('JWT_SECRET not set')

  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions)
}

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET as Secret)
}
