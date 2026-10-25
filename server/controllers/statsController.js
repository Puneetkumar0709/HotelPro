import { getRoomsStore } from './roomController.js';
import { getBookingsStore } from './bookingController.js';
import { getPaymentsStore } from './paymentController.js';

export const getDashboardStats = async (req, res) => {
  try {
    const rooms = getRoomsStore();
    const bookings = getBookingsStore();
    const payments = getPaymentsStore();

    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((r) => r.status === 'Occupied').length;
    const availableRooms = rooms.filter((r) => r.status === 'Available').length;
    const cleaningRooms = rooms.filter((r) => r.status === 'Cleaning').length;
    const reservedRooms = rooms.filter((r) => r.status === 'Reserved').length;

    const occupancyRate = Math.round((occupiedRooms / (totalRooms || 1)) * 100);

    const totalRevenue = payments
      .filter((p) => p.status === 'Success')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const activeBookings = bookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In').length;

    return res.status(200).json({
      success: true,
      stats: {
        totalRooms,
        availableRooms,
        occupiedRooms,
        cleaningRooms,
        reservedRooms,
        occupancyRate,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        activeBookings,
        avgRating: 4.88,
        staffOnDuty: 14,
        checkInsToday: 3,
        checkOutsToday: 2,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
