import express from 'express';
import { getAdminStats } from '../controller/adminStats.controller.js';
import { verifyTokenRole } from '../middleware/verifyRole.js';

const router = express.Router();

// Only admin can access this
router.get('/admin/dashboard/stats', verifyTokenRole('admin'), getAdminStats);

export default router;
