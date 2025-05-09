import PDFDocument from "pdfkit";
import { InvoiceData } from "../types/invoice";
import getStream from "get-stream";

export const generateInvoicePDF = async (invoice: InvoiceData) => {
  const doc = new PDFDocument();
  const stream = doc.pipe(getStream.buffer());

  doc.fontSize(20).text("DigiBookly Invoice", { align: "center" }).moveDown();

  // Invoice Info
  doc.fontSize(12).text(`Order ID: ${invoice.orderId}`);
  doc.text(`Payment ID: ${invoice.paymentId}`);
  doc.text(`Date: ${invoice.date.toDateString()}`).moveDown();

  // User Info
  doc.text(`Billed To: ${invoice.user.name}`);
  doc.text(`Email: ${invoice.user.email}`).moveDown();

  // Book List
  doc.text("Purchased Books:", { underline: true }).moveDown(0.5);

  invoice.books.forEach((book, index) => {
    doc.text(`${index + 1}. ${book.title} by ${book.author} — ₹${book.price}`);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Paid: ₹${(invoice.totalAmount / 100).toFixed(2)}`, {
    underline: true,
  });

  doc.end();

  return await stream;
};
