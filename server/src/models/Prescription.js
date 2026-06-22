import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    patientName: { type: String, default: '' },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    doctorName: { type: String, default: '' },
    diagnosis: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    medications: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const Prescription = mongoose.model('Prescription', prescriptionSchema);
