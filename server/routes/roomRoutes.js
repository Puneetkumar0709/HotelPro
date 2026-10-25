import express from 'express';
import { getAllRooms, getRoomById, updateRoomStatus, createRoom } from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.patch('/:id/status', updateRoomStatus);
router.post('/', protect, authorize('admin', 'manager'), createRoom);

export default router;
