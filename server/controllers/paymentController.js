import { initialPayments } from '../data/seedData.js';

let paymentsStore = [...initialPayments];

export const recordPayment = ({
  bookingReference,
  guestName,
  amount,
  method = 'Credit Card',
  cardLast4 = '4242',
}) => {
  const transactionId = `TXN-${Math.floor(10000 + Math.random() * 90000)}-HP`;
  const receiptNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const payment = {
    id: `tx-${Date.now()}`,
    transactionId,
    bookingReference,
    guestName,
    amount: Number(amount),
    currency: 'USD',
    method,
    status: 'Success',
    receiptNumber,
    cardLast4,
    date: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  paymentsStore.unshift(payment);
  return payment;
};

export const getAllPayments = async (req, res) => {
  try {
    const { search, status } = req.query;
    let list = [...paymentsStore];

    if (status && status !== 'All') {
      list = list.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.transactionId.toLowerCase().includes(q) ||
          p.bookingReference.toLowerCase().includes(q) ||
          p.guestName.toLowerCase().includes(q) ||
          p.receiptNumber.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const processPayment = async (req, res) => {
  try {
    const { bookingReference, guestName, amount, method, cardLast4 } = req.body;

    if (!amount || !guestName) {
      return res.status(400).json({ success: false, message: 'Amount and guest name are required' });
    }

    const payment = recordPayment({
      bookingReference: bookingReference || `HP-BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName,
      amount,
      method: method || 'Credit Card',
      cardLast4: cardLast4 || '4242',
    });

    return res.status(201).json({
      success: true,
      message: 'Payment processed successfully via HotelPro Secure Gateway',
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentReceipt = async (req, res) => {
  try {
    const payment = paymentsStore.find(
      (p) => p.transactionId === req.params.id || p.receiptNumber === req.params.id || p.id === req.params.id
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }

    return res.status(200).json({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentsStore = () => paymentsStore;
