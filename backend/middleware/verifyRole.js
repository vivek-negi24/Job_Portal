import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyTokenRole = (role) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== role) {
        return res.status(403).json({ message: 'Access denied' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

// export const verifyTokenRole = (role) => {
//   return (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'No token provided' });

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) return res.status(403).json({ message: 'Invalid token' });

//       if (decoded.role !== role) return res.status(403).json({ message: 'Access denied' });

//       // const ownerId=req.owner.id
//       req.owner = decoded; // ✅ Attach owner
//       next();
//     });
//   };
// };


