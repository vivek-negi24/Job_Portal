import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import BusinessOwner from '../models/BusinessOwner.js';

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalBusinessOwners = await BusinessOwner.countDocuments();

    res.status(200).json({
      totalUsers,
      totalJobs,
      totalApplications,
      totalBusinessOwners,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};
