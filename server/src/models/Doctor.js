import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    specialty: { type: String, required: true },
    department: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    experienceYears: { type: Number, default: 0, min: 0 },
    consultationFee: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['available', 'on-leave', 'busy'], default: 'available' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model('Doctor', doctorSchema);
