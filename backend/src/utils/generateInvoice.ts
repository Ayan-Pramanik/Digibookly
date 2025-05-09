import PDFDocument from 'pdfkit';
import { Response } from 'express';

export const generateInvoice = (
  res: Response,
  {
    orderId,
    paymentId,
    user,
    books,
    totalAmount,
    date,
  }: {
    orderId: string;
    paymentId: string;
    user: { name: string; email: string };
    books: { title: string; author: string; price: number }[];
    totalAmount: number;
    date: Date;
  }
) => {
  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=invoice_${orderId}.pdf`
  );

  doc.pipe(res);

  // 🧾 Header
  doc.fontSize(20).text('DigiBookly Invoice', { align: 'center' });
  doc.moveDown();

  // 📅 Order Info
  doc.fontSize(12).text(`Invoice Date: ${date.toDateString()}`);
  doc.text(`Order ID: ${orderId}`);
  doc.text(`Payment ID: ${paymentId}`);
  doc.moveDown();

  // 👤 Customer Info
  doc.text(`Customer Name: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.moveDown();

  // 📚 Books Section
  doc.fontSize(14).text('Books Purchased:', { underline: true });
  doc.moveDown(0.5);
  books.forEach((book, index) => {
    doc.fontSize(12).text(`${index + 1}. ${book.title} by ${book.author} - ₹${book.price}`);
  });

  doc.moveDown();
  doc.font('Helvetica-Bold').fontSize(14).text(`Total Amount Paid: ₹${totalAmount / 100}`);

  doc.end();
};
