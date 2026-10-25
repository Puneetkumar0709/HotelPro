import express from 'express';
import { getAllPayments, processPayment, getPaymentReceipt } from '../controllers/paymentController.js';

const router = express.Router();

router.get('/', getAllPayments);
router.post('/process', processPayment);
router.get('/receipt/:id', getPaymentReceipt);

export default router;
