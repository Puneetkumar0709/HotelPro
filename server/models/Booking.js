import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
    },
    guestName: {
      type: String,
      required: true,
    },
    guestEmail: {
      type: String,
      required: true,
    },
    guestPhone: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    roomTitle: {
      type: String,
      required: true,
    },
    checkInDate: {
      type: String,
      required: true,
    },
    checkOutDate: {
      type: String,
      required: true,
    },
    totalNights: {
      type: Number,
      default: 1,
    },
    totalGuests: {
      type: Number,
      default: 2,
    },
    baseAmount: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    addOnAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    addOns: {
      type: [String],
      default: [],
    },
    specialRequests: {
      type: String,
      default: '',
    },
    bookingStatus: {
      type: String,
      enum: ['Confirmed', 'Checked In', 'Checked Out', 'Cancelled'],
      default: 'Confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Refunded'],
      default: 'Paid',
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash at Desk'],
      default: 'Credit Card',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
