import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '', lowercase: true, trim: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    dateOfBirth: { type: Date },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
      default: 'unknown',
    },
    address: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    allergies: { type: [String], default: [] },
    medicalHistory: { type: String, default: '' },
    status: { type: String, enum: ['active', 'admitted', 'discharged'], default: 'active' },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Patient = mongoose.model('Patient', patientSchema);
