import Application from '../models/Application.js';
import Job from '../models/Job.js';


// export const applyToJob = async (req, res) => {
//   const { jobId } = req.body;
//   const user = req.user;

//   if (!jobId || !user) {
//     return res.status(400).json({ message: 'Missing job ID or user info' });
//   }

//   try {
//     const newApplication = await Application.create({
//       jobId,
//       userId: user.id,
//       name: user.name,
//       email: user.email
//     });

//     res.status(201).json({ message: 'Application submitted', application: newApplication });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to apply', error: err.message });
//   }
// };

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('jobId', 'title company location')
      .populate('userId', 'name email');
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

export const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user?.id; // or however your middleware attaches user
    // console.log('🚀 Params:', params);
    console.log('🚀 Job ID:', jobId);

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    console.log('Applying for job:', job.title);

    const application = await Application.create({
      name: req.body.name,
      email: req.body.email,
      jobId: req.params.id,
      jobTitle: job.title,
      userId,
    });

    res.status(201).json({ message: 'Application submitted', application });
  } catch (err) {
    console.error('❌ Application Error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('userId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      applicant: {
        name: application.name || application.userId?.name || 'N/A',
        email: application.email || application.userId?.email || 'N/A',
        address: application.address || 'Not provided',
        experience: application.experience || 'Not provided',
      },
      job: {
        title: application.jobId?.title || 'N/A',
        company: application.jobId?.company || 'N/A',
        location: application.jobId?.location || 'N/A',
        catagory: application.jobId?.catagory || 'N/A',
      },
      appliedOn: application.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};





