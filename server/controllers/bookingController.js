import { initialBookings } from '../data/seedData.js';
import { getRoomsStore } from './roomController.js';
import { recordPayment } from './paymentController.js';

let bookingsStore = [...initialBookings];

export const getAllBookings = async (req, res) => {
  try {
    const { status, search } = req.query;
    let list = [...bookingsStore];

    if (status && status !== 'All') {
      list = list.filter((b) => b.bookingStatus.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.guestName.toLowerCase().includes(q) ||
          b.bookingReference.toLowerCase().includes(q) ||
          b.roomNumber.toLowerCase().includes(q) ||
          b.guestEmail.toLowerCase().includes(q)
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

export const createBooking = async (req, res) => {
  try {
    const {
      guestName,
      guestEmail,
      guestPhone,
      roomId,
      roomNumber,
      roomTitle,
      checkInDate,
      checkOutDate,
      totalNights = 1,
      totalGuests = 2,
      baseAmount,
      taxAmount = 0,
      addOnAmount = 0,
      totalAmount,
      addOns = [],
      specialRequests = '',
      paymentMethod = 'Credit Card',
    } = req.body;

    if (!guestName || !guestEmail || !roomNumber || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required reservation fields (guestName, guestEmail, roomNumber, totalAmount)',
      });
    }

    const refNumber = `HP-BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: `bk-${Date.now()}`,
      bookingReference: refNumber,
      guestName,
      guestEmail,
      guestPhone: guestPhone || '+1 (555) 000-0000',
      roomId: roomId || `room-${roomNumber}`,
      roomNumber,
      roomTitle: roomTitle || `Room ${roomNumber}`,
      checkInDate,
      checkOutDate,
      totalNights: Number(totalNights),
      totalGuests: Number(totalGuests),
      baseAmount: Number(baseAmount),
      taxAmount: Number(taxAmount),
      addOnAmount: Number(addOnAmount),
      totalAmount: Number(totalAmount),
      addOns,
      specialRequests,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    bookingsStore.unshift(newBooking);

    // Update room status to Occupied/Reserved
    const rooms = getRoomsStore();
    const targetRoom = rooms.find((r) => r.roomNumber === roomNumber || r.id === roomId);
    if (targetRoom) {
      targetRoom.status = 'Occupied';
    }

    // Auto-record payment transaction
    const paymentRecord = recordPayment({
      bookingReference: refNumber,
      guestName,
      amount: totalAmount,
      method: paymentMethod,
      cardLast4: paymentMethod === 'Credit Card' ? '4242' : 'VPA',
    });

    return res.status(201).json({
      success: true,
      message: `Reservation confirmed for ${guestName}! Reference: ${refNumber}`,
      data: newBooking,
      payment: paymentRecord,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = bookingsStore.find((b) => b.id === req.params.id || b.bookingReference === req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    booking.bookingStatus = status;

    // Synchronize room status
    const rooms = getRoomsStore();
    const targetRoom = rooms.find((r) => r.roomNumber === booking.roomNumber);
    if (targetRoom) {
      if (status === 'Checked In') {
        targetRoom.status = 'Occupied';
      } else if (status === 'Checked Out') {
        targetRoom.status = 'Cleaning';
      } else if (status === 'Cancelled') {
        targetRoom.status = 'Available';
      }
    }

    return res.status(200).json({
      success: true,
      message: `Reservation status updated to '${status}'`,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingsStore = () => bookingsStore;
