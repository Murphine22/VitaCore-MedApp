import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: '' },
    headDoctor: { type: String, default: '' },
    location: { type: String, default: '' },
    phone: { type: String, default: '' },
    color: { type: String, default: '#0ea5e9' },
    icon: { type: String, default: 'Stethoscope' },
  },
  { timestamps: true }
);

export const Department = mongoose.model('Department', departmentSchema);
