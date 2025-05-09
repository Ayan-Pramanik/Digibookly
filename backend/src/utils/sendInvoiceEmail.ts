import nodemailer from "nodemailer";
import { generateInvoicePDF } from "./generateInvoicePDF";
import { InvoiceData } from "../types/invoice";

export const sendInvoiceEmail = async (invoice: InvoiceData) => {
  const stream = await generateInvoicePDF(invoice);
  const contents = stream.getContents();

  if (!contents) throw new Error("Failed to generate invoice PDF.");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const bookTitles = invoice.books.map((b) => `"${b.title}"`).join(", ");

  const mailOptions = {
    from: `"DigiBookly" <${process.env.EMAIL_USER}>`,
    to: invoice.user.email,
    subject: `Invoice for your DigiBookly Purchase`,
    text: `Hello ${invoice.user.name},

Thank you for your purchase on DigiBookly.

Books: ${bookTitles}
Total Paid: ₹${(invoice.totalAmount / 100).toFixed(2)}

Please find your invoice attached.

– DigiBookly Team`,
    attachments: [
      {
        filename: "invoice.pdf",
        content: contents,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
