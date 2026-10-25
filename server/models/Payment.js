import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    bookingReference: {
      type: String,
      required: true,
    },
    guestName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    method: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash'],
      default: 'Credit Card',
    },
    status: {
      type: String,
      enum: ['Success', 'Pending', 'Failed', 'Refunded'],
      default: 'Success',
    },
    receiptNumber: {
      type: String,
      required: true,
    },
    cardLast4: {
      type: String,
      default: '4242',
    },
    gatewayResponse: {
      type: String,
      default: 'Authorized - 200 OK',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
