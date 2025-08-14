import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  getJobsByOwner,
  getSingleJob
} from '../controller/job.controller.js';

import { verifyTokenRole } from '../middleware/verifyRole.js';
import { verifyBusinessOwner } from '../middleware/verifyBusinessOwner.js';

const router = express.Router();

// 🔍 Public: Get all jobs
router.get('/jobs', getAllJobs);


// 🔐 Protected: Create a job (Business Owner only)
router.post('/jobs', verifyTokenRole('business'), createJob);

router.get('/owners/jobs', verifyBusinessOwner, getJobsByOwner);
router.get('/business-owners/dashboard/jobs/:id', verifyTokenRole('business'), getJobById);

// 🔍 Public: Get job by ID
router.get('/jobs/:id', getSingleJob);

export default router;
