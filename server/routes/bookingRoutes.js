import express from 'express';
import { getAllBookings, createBooking, updateBookingStatus } from '../controllers/bookingController.js';

const router = express.Router();

router.get('/', getAllBookings);
router.post('/', createBooking);
router.patch('/:id/status', updateBookingStatus);

export default router;
