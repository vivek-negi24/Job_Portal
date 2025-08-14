import Admin from '../models/Admin.js';
import BusinessOwner from '../models/BusinessOwner.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config(); // ✅ This is required if you're calling process.env directly in controller

const SECRET = process.env.JWT_SECRET;


export const getAllBusinessOwners = async (req, res) => {
  try {
    const owners = await BusinessOwner.find().select('-password');
    res.status(200).json(owners);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch business owners' });
  }
};

export const getBusinessOwnerById = async (req, res) => {
  try {
    const owner = await BusinessOwner.findById(req.params.id).select('-password');
    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    const jobs = await Job.find({ ownerId: owner._id });

    res.status(200).json({
      ...owner.toObject(),
      jobCount: jobs.length,
      jobs,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching owner info' });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    // console.log('JWT_SECRET:', process.env.JWT_SECRET); // ✅ Should log your key

    const token = jwt.sign({ id: admin._id, role: 'admin' }, SECRET, { expiresIn: '5d' });
    res.cookie('admin_token', token, { httpOnly: true });
    res.status(200).json({ message: 'Logged in',token, user: { role: 'admin' } });
  } catch (err) {
    console.error('❌ Admin login error:', err);
    res.status(500).json({ message: 'Login error' });
  }
};

export const verifyAdminAccess = (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    res.status(200).json({ ok: true });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};


export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const applications = await Application.find({ userId: user._id }).populate('jobId');

    res.status(200).json({
      user,
      applications
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // ✅ Fetch user basic info
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Fetch applications submitted by this user
    const applications = await Application.find({ userId }).populate('jobId');

    // ✅ Send response
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
      },
      applications: applications || []
    });
  } catch (error) {
    console.error('❌ Error fetching user details:', error.message);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};