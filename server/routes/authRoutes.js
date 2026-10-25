import express from 'express';
import { login, register, verifyToken, getDemoCredentials } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify', protect, verifyToken);
router.get('/demo-credentials', getDemoCredentials);

export default router;
