import crypto from "crypto";
import Razorpay from "razorpay";
import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { userInfoRequest } from "../utils/userInterface";
import { sendInvoiceEmail } from "../utils/sendInvoiceEmail";
import { generateInvoice } from "../utils/generateInvoice";

export const createCheckoutOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { bookIds } = req.body;

  if (!Array.isArray(bookIds) || bookIds.length === 0) {
    return res
      .status(400)
      .json({ message: "bookIds must be a non-empty array" });
  }

  const books = await prisma.book.findMany({
    where: {
      id: { in: bookIds },
    },
  });

  if (books.length !== bookIds.length) {
    return res.status(404).json({ message: "One or more books not found" });
  }

  const totalAmount = books.reduce((acc, book) => acc + book.price * 100, 0); // price in paisa

  const options = {
    amount: totalAmount,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay error:", err);
    return res.status(500).json({ message: "Payment initiation failed" });
  }
};

export const verifyCheckoutPayment = async (
  req: userInfoRequest,
  res: Response
): Promise<any> => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookIds, // should be an array of book IDs
  } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.id;

  // Signature verification
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  // Fetch all selected books
  const books = await prisma.book.findMany({
    where: { id: { in: bookIds } },
  });

  if (books.length !== bookIds.length) {
    return res.status(400).json({ message: "One or more books not found" });
  }

  const totalAmount = books.reduce((acc, book) => acc + book.price * 100, 0); // in paise

  // Create order
  const order = await prisma.order.create({
    data: {
      userId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: totalAmount,
      status: "success",
      orderItems: {
        create: books.map((book) => ({
          bookId: book.id,
          price: book.price,
        })),
      },
    },
    include: {
      user: true,
      orderItems: {
        include: {
          book: true,
        },
      },
    },
  });

  // Send invoice
  await sendInvoiceEmail({
    orderId: order.orderId,
    paymentId: order.paymentId,
    user: { name: order.user.name, email: order.user.email },
    books: order.orderItems.map((item) => ({
      title: item.book.title,
      author: item.book.author,
      price: item.book.price,
    })),
    totalAmount,
    date: order.createdAt,
  });

  return res.status(200).json({
    message: "Payment verified. Books purchased successfully.",
  });
};

export const downloadBook = async (
  req: userInfoRequest,
  res: Response
): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.id;
  const bookId = req.params.id;

  // Check if the user has purchased this specific book
  const hasPurchased = await prisma.order.findFirst({
    where: {
      userId,
      status: "success",
      orderItems: {
        some: {
          bookId,
        },
      },
    },
  });

  if (!hasPurchased) {
    return res
      .status(403)
      .json({ message: "You have not purchased this book" });
  }

  const book = await prisma.book.findUnique({ where: { id: bookId } });

  if (!book || !book.fileUrl) {
    return res.status(404).json({ message: "Book or file not found" });
  }

  return res.redirect(book.fileUrl);
};

export const getInvoice = async (
  req: userInfoRequest,
  res: Response
): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.id;
  const orderId = req.params.orderId;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      orderItems: {
        include: {
          book: true,
        },
      },
    },
  });

  if (!order || order.userId !== userId) {
    return res.status(403).json({ message: "Unauthorized or order not found" });
  }

  generateInvoice(res, {
    orderId: order.orderId,
    paymentId: order.paymentId,
    user: {
      name: order.user.name,
      email: order.user.email,
    },
    books: order.orderItems.map((item) => ({
      title: item.book.title,
      author: item.book.author,
      price: item.book.price,
    })),
    totalAmount: order.amount,
    date: order.createdAt,
  });
};
