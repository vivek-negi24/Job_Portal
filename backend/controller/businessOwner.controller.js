import BusinessOwner from '../models/BusinessOwner.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Job from '../models/Job.js';

const SECRET = process.env.JWT_SECRET;





export const createBusinessJob = async (req, res) => {
  const { title, company, location, salary, category, tags } = req.body;

  if (!title || !company || !location || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // 🔍 DEBUG: Check who is creating the job
    console.log('🧾 Creating job for owner ID:', req.user?.id);
    console.log('📁 Payload received:', { title, company, location, salary, category, tags });

    const newJob = await Job.create({
      title,
      company,
      location,
      salary,
      category,
      tags,
      ownerId: req.user.id, // business owner ID from token
    });

    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (err) {
    console.error('❌ Job Creation Error:', err.message);
    res.status(500).json({ message: 'Error creating job', error: err.message });
  }
};





export const registerOwner = async (req, res) => {
  const { name, email, password, company } = req.body;

  try {
    const existing = await BusinessOwner.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Owner already registered' });

    // ✅ Define hashedPassword before using it
    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await BusinessOwner.create({
      name,
      email,
      password: hashedPassword,  // Now it will be defined
      company
    });

    res.status(201).json({ message: 'Business owner registered' });
  } catch (err) {
    console.error('❌ Registration Error:', err.message);
    res.status(500).json({ message: 'Registration failed' });
  }
};


export const loginOwner = async (req, res) => {
  console.log('🔐 loginOwner called'); // ✅ DEBUG LOG
  const { email, password } = req.body;
  
  console.log('📥 Login attempt with:', { email, password });
  try {
    const owner = await BusinessOwner.findOne({ email });
    if (!owner) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // ✅ Create JWT token for business owner
    const token = jwt.sign(
      { id: owner._id, role: 'business' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 🔍 DEBUG: Log token and owner
    console.log('🔐 Business Owner Logged In');
    console.log('🔑 Generated Token:', token);
    console.log('📦 Owner Payload:', { id: owner._id, role: 'business' });

    // ✅ Set cookie and return token
    res.cookie('owner_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false
    });

    res.status(200).json({ message: 'Business owner logged in', token });
  } catch (err) {
    console.error('❌ Login Error:', err.message);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


export const getBusinessJobs = async (req, res) => {
    try {
      const jobs = await Job.find({ ownerId: req.user.id }); // assuming you store ownerId
      res.status(200).json(jobs);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch jobs' });
    }
  };

  export const getBusinessOwnerProfile = async (req, res) => {
    try {
      const owner = await BusinessOwner.findById(req.user.id).select('-password');
      if (!owner) return res.status(404).json({ message: 'Business owner not found' });
      res.status(200).json(owner);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };