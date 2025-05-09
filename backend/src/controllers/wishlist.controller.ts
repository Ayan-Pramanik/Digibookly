import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { userInfoRequest } from "../utils/userInterface";

export const getWishlist = async (
  req: userInfoRequest,
  res: Response
): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = req.user.id;
  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId },
    include: { book: true },
  });
  res.json(wishlist);
};

export const addToWishlist = async (
  req: userInfoRequest,
  res: Response
): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = req.user.id;
  const { bookId } = req.body;

  const existing = await prisma.wishlistItem.findFirst({
    where: { userId, bookId },
  });
  if (existing) return res.status(409).json({ message: "Already in wishlist" });

  const newItem = await prisma.wishlistItem.create({
    data: { userId, bookId },
  });
  res.status(201).json(newItem);
};

export const removeFromWishlist = async (
  req: userInfoRequest,
  res: Response
): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = req.user.id;
  const bookId = req.params.bookId;

  await prisma.wishlistItem.deleteMany({
    where: { userId, bookId },
  });
  res.status(200).json({ message: "Item removed from wishlist" });
};
