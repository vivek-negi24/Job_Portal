import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import connectDB from '../config/db.js';

dotenv.config(); // load .env

const createAdmin = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const rawPassword = process.env.ADMIN_PASSWORD;

  if (!email || !rawPassword) {
    console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('⚠️ Admin already exists');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const newAdmin = await Admin.create({
    name: 'Admin',
    email,
    password: hashedPassword,
    role: 'admin',
  });

  console.log('✅ Admin inserted successfully:', newAdmin);
  process.exit();
};

createAdmin();
