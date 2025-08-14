import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    jobTitle: { type: String, required: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String },
    experience: { type: String },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);
