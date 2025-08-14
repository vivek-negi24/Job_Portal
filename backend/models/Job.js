import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  tags: [String],
  salary: String,
  category: String,
  date: {
    type: Date,
    default: Date.now
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessOwner'
  }
});

export default mongoose.models.Job || mongoose.model('Job', jobSchema);
