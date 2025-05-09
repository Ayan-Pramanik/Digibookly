import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { userInfoRequest } from "../utils/userInterface";

export const getCart = async (
  req: userInfoRequest,
  res: Response
): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = req.user.id;
  const cart = await prisma.cartItem.findMany({
    where: { userId },
    include: { book: true },
  });
  res.json(cart);
};

export const addToCart = async (
  req: userInfoRequest,
  res: Response
): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = req.user.id;
  const { bookId, quantity = 1 } = req.body;

  const existing = await prisma.cartItem.findFirst({
    where: { userId, bookId },
  });

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: quantity },
    });
    return res.json(updated);
  }

  const newItem = await prisma.cartItem.create({
    data: { userId, bookId, quantity },
  });
  res.status(201).json(newItem);
};

export const removeFromCart = async (
  req: userInfoRequest,
  res: Response
): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = req.user.id;
  const bookId = req.params.bookId;

  await prisma.cartItem.deleteMany({
    where: { userId, bookId },
  });
  res.status(200).json({ message: "Item removed from cart" });
};
