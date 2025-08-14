import express from 'express';
import { createBusinessJob, getBusinessJobs, getBusinessOwnerProfile, loginOwner, registerOwner } from '../controller/businessOwner.controller.js';
import { verifyBusinessOwner } from '../middleware/verifyBusinessOwner.js';
import { createJob, getJobsByOwner } from '../controller/job.controller.js';

const router = express.Router();

router.post('/business-owners/register', registerOwner);
router.post('/business-owners/login', loginOwner);
// POST /api/business-owner/logout
router.post('/logout', (req, res) => {
    res.clearCookie('business_token');
    res.status(200).json({ message: 'Logged out' });
  });



  router.get('/business-owner/profile', verifyBusinessOwner, getBusinessOwnerProfile);
export default router;
