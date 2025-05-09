import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { Request, Response } from "express";


export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ users });
};

export const resetUserPassword = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { newPassword } = req.params;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  res.json({ message: "Password reset successfully" });
};

export const revokeUserAccess = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.$transaction([
    prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        revokedAt: new Date()
      },
    }),
    prisma.session.deleteMany({
      where: { userId: id },
    }),
  ]);

  res.json({ message: 'User access revoked and sessions invalidated' });
};
  