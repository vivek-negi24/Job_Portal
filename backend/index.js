import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import applicationRoutes from './routes/application.routes.js';
import adminRoutes from './routes/admin.routes.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import jobRoutes from './routes/jobs.routes.js';
import businessOwnerRoutes from './routes/businessOwner.routes.js';
import adminStatsRoutes from './routes/adminStats.routes.js';

dotenv.config();
const app = express();
const port = 3000;

connectDB(); 

app.use(cors({
  origin: 'http://localhost:3001',
   credentials: true,
   })); 
   app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api', adminRoutes);
app.use('/api', userRoutes);
app.use('/api', jobRoutes);
app.use('/api', applicationRoutes);
app.use('/api', businessOwnerRoutes);
app.use('/api', adminStatsRoutes);

app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
});
