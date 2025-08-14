import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyBusinessOwner = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('🛡️ Authorization Header:', authHeader); // ✅

  if (!authHeader?.startsWith('Bearer ')) {
    console.log('⛔ No Bearer token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔑 Extracted Token:', token); // ✅

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded Token:', decoded); // ✅

    if (decoded.role !== 'business') {
      console.log('⛔ Not a business owner:', decoded.role);
      return res.status(403).json({ message: 'Access denied' });
    }

    req.owner = decoded;
    next();
  } catch (err) {
    console.log('❌ Token Verification Error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};
