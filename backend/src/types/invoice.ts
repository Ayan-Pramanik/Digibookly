export interface InvoiceData {
  orderId: string;
  paymentId: string;
  user: { name: string; email: string };
  books: { title: string; author: string; price: number }[];
  totalAmount: number;
  date: Date;
}