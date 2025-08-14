import express from 'express';
import { registerUser, loginUser, getAllUsers, getUserProfile } from '../controller/user.controller.js';
import { verifyTokenRole } from '../middleware/verifyRole.js';
import cookieParser from 'cookie-parser';
import { verifyUser } from '../middleware/verifyUser.js';

const router = express.Router();
router.use(cookieParser());

// Register route
router.post('/user/register', registerUser);

// Login route
router.post('/user/login', loginUser);

// Verify user route
router.get('/user/verify', verifyTokenRole('user'), verifyUser);

router.get('/users', getAllUsers);

// router.get('/profile', verifyUser, getUserProfile);

export default router;
