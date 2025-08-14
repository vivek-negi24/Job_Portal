import express from 'express';
import { loginAdmin, verifyAdminAccess ,getAllBusinessOwners, getBusinessOwnerById, getSingleUser, getUserById } from '../controller/admin.controller.js';
import { verifyTokenRole } from '../middleware/verifyRole.js';
import cookieParser from 'cookie-parser';
import { getAllUsers } from '../controller/user.controller.js';
import { getAllJobs, getJobById } from '../controller/job.controller.js';
import { getAllApplications, getApplicationById } from '../controller/application.controller.js';

const router = express.Router();
router.use(cookieParser());

// 🟠 Admin Login
router.post('/admin/login', loginAdmin);

// 🔒 Route to verify if admin is logged in
router.get('/admin/verify', verifyAdminAccess);

// 🛡️ Protected route only for admins
router.get('/admin-only-data', verifyTokenRole('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome, verified admin!' });
});

router.get('/admin/dashboard/business-owners', verifyTokenRole('admin'), getAllBusinessOwners);

router.get('/admin/dashboard/business-owners/:id', verifyTokenRole('admin'), getBusinessOwnerById);

router.get('/admin/dashboard/users', verifyTokenRole('admin'), getAllUsers);

router.get('/admin/dashboard/users/:id', verifyTokenRole('admin'), getUserById);


router.get('/admin/dashboard/jobs', verifyTokenRole('admin'), getAllJobs);

router.get('/admin/dashboard/jobs/:id', verifyTokenRole('admin'), getJobById);

router.get('/admin/dashboard/applications', verifyTokenRole('admin'), getAllApplications);

router.get('/admin/dashboard/applications/:id', verifyTokenRole('admin'), getApplicationById);




export default router;
