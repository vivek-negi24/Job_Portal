import mongoose from 'mongoose';

const businessOwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: { type: String },
  role: { type: String, default: 'owner' }
}, { timestamps: true });

export default mongoose.models.BusinessOwner || mongoose.model('BusinessOwner', businessOwnerSchema);
