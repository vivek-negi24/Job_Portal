import Job from '../models/Job.js';
import Application from '../models/Application.js';

// Fetch all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
};

// Create a new job
export const createJob = async (req, res) => {
  const { title, company, location, tags, salary, category, date } = req.body;
  const ownerId = req.user?.id || req.owner?.id; // ✅ dynamically support owner

  if (!title || !company || !location || !date || !ownerId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const job = await Job.create({
      title,
      company,
      location,
      tags,
      salary,
      category,
      date: new Date(date),
      ownerId
    });

    res.status(201).json({ message: 'Job created', job });
  } catch (err) {
    res.status(500).json({ message: 'Error creating job', error: err.message });
  }
};




export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const applicants = await Application.find({ jobId: req.params.id });
    res.status(200).json({
      jobs:{
        title: job.title,
        company: job.company,
        location: job.location,
        category: job.category,
        salary: job.salary || 'Not specified',
        tags: job.tags || [],
        date: job.date ? new Date(job.date).toLocaleDateString() : 'Not Available',
        
      },
      applicants: applicants || [],
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const getJobsByOwner = async (req, res) => {
  console.log('🛡️ Business Owner ID:', req.owner?.id); // 👈 add this
  try {
    const ownerId = req.owner.id;
    // console.log("ownerId", ownerId)
    const jobs = await Job.find({ ownerId }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

export const getSingleJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ jobs: job }); // ✅ Notice: 'jobs'
  } catch (error) {
    console.error('Error fetching job:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
