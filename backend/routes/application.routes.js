import express from 'express';
import {
 
  applyForJob,
  
  getAllApplications,
} from '../controller/application.controller.js';
import { verifyUser } from '../middleware/verifyUser.js';
import { verifyTokenRole } from '../middleware/verifyRole.js';

const router = express.Router();

// ✅ Apply to job (User Only)
router.post('/application/apply/:id', verifyUser, applyForJob);

// ✅ Admin route: Get all applications
router.get('/admin/dashboard/applications',verifyTokenRole('admin'), getAllApplications);




export default router;
