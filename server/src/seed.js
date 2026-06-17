import { connectDB, disconnectDB } from './config/db.js';
import { User } from './models/User.js';
import { Department } from './models/Department.js';
import { Doctor } from './models/Doctor.js';
import { Patient } from './models/Patient.js';
import { Appointment } from './models/Appointment.js';
import { Invoice } from './models/Invoice.js';

const users = [
  { name: 'Dr. Ada Okonkwo', email: 'admin@vitacore.io', password: 'password123', role: 'admin' },
  { name: 'Dr. Samuel Eze', email: 'doctor@vitacore.io', password: 'password123', role: 'doctor' },
  { name: 'Grace Bello', email: 'reception@vitacore.io', password: 'password123', role: 'receptionist' },
];

const departments = [
  { name: 'Cardiology', description: 'Heart & vascular care', headDoctor: 'Dr. Samuel Eze', location: 'Block A, Floor 2', phone: '+234 801 111 1111', color: '#ef4444', icon: 'HeartPulse' },
  { name: 'Neurology', description: 'Brain & nervous system', headDoctor: 'Dr. Chioma Nwosu', location: 'Block B, Floor 3', phone: '+234 801 222 2222', color: '#8b5cf6', icon: 'Brain' },
  { name: 'Pediatrics', description: 'Child & infant health', headDoctor: 'Dr. Tunde Adesina', location: 'Block C, Floor 1', phone: '+234 801 333 3333', color: '#f59e0b', icon: 'Baby' },
  { name: 'Orthopedics', description: 'Bones, joints & muscles', headDoctor: 'Dr. Femi Balogun', location: 'Block A, Floor 1', phone: '+234 801 444 4444', color: '#10b981', icon: 'Bone' },
  { name: 'Emergency', description: '24/7 urgent care', headDoctor: 'Dr. Aisha Mohammed', location: 'Ground Floor', phone: '+234 801 555 5555', color: '#0ea5e9', icon: 'Ambulance' },
  { name: 'Dermatology', description: 'Skin, hair & nails', headDoctor: 'Dr. Ngozi Okafor', location: 'Block D, Floor 2', phone: '+234 801 666 6666', color: '#ec4899', icon: 'Sparkles' },
];

const doctors = [
  { name: 'Dr. Samuel Eze', email: 'samuel.eze@vitacore.io', phone: '+234 802 100 0001', specialty: 'Cardiologist', department: 'Cardiology', gender: 'male', experienceYears: 14, consultationFee: 25000, status: 'available', rating: 4.9, bio: 'Interventional cardiologist with 14 years of clinical excellence.' },
  { name: 'Dr. Chioma Nwosu', email: 'chioma.nwosu@vitacore.io', phone: '+234 802 100 0002', specialty: 'Neurologist', department: 'Neurology', gender: 'female', experienceYears: 11, consultationFee: 30000, status: 'available', rating: 4.8, bio: 'Specialist in stroke recovery and neurodegenerative disorders.' },
  { name: 'Dr. Tunde Adesina', email: 'tunde.adesina@vitacore.io', phone: '+234 802 100 0003', specialty: 'Pediatrician', department: 'Pediatrics', gender: 'male', experienceYears: 9, consultationFee: 18000, status: 'busy', rating: 4.7, bio: 'Compassionate pediatric care from newborns to teens.' },
  { name: 'Dr. Femi Balogun', email: 'femi.balogun@vitacore.io', phone: '+234 802 100 0004', specialty: 'Orthopedic Surgeon', department: 'Orthopedics', gender: 'male', experienceYears: 16, consultationFee: 28000, status: 'available', rating: 4.9, bio: 'Joint replacement and sports injury expert.' },
  { name: 'Dr. Aisha Mohammed', email: 'aisha.mohammed@vitacore.io', phone: '+234 802 100 0005', specialty: 'Emergency Physician', department: 'Emergency', gender: 'female', experienceYears: 8, consultationFee: 20000, status: 'available', rating: 4.6, bio: 'Rapid-response trauma and critical-care specialist.' },
  { name: 'Dr. Ngozi Okafor', email: 'ngozi.okafor@vitacore.io', phone: '+234 802 100 0006', specialty: 'Dermatologist', department: 'Dermatology', gender: 'female', experienceYears: 7, consultationFee: 22000, status: 'on-leave', rating: 4.8, bio: 'Medical and cosmetic dermatology.' },
];

const patients = [
  { name: 'John Abiodun', email: 'john.abiodun@example.com', phone: '+234 803 200 0001', gender: 'male', dateOfBirth: '1988-04-12', bloodGroup: 'O+', address: '14 Allen Ave, Ikeja, Lagos', emergencyContact: '+234 803 999 0001', allergies: ['Penicillin'], status: 'active' },
  { name: 'Mary Eke', email: 'mary.eke@example.com', phone: '+234 803 200 0002', gender: 'female', dateOfBirth: '1995-09-30', bloodGroup: 'A+', address: '7 Wuse II, Abuja', emergencyContact: '+234 803 999 0002', allergies: [], status: 'admitted' },
  { name: 'Ibrahim Sani', email: 'ibrahim.sani@example.com', phone: '+234 803 200 0003', gender: 'male', dateOfBirth: '1979-01-22', bloodGroup: 'B+', address: '22 GRA, Port Harcourt', emergencyContact: '+234 803 999 0003', allergies: ['Aspirin', 'Latex'], status: 'active' },
  { name: 'Blessing Udo', email: 'blessing.udo@example.com', phone: '+234 803 200 0004', gender: 'female', dateOfBirth: '2001-07-18', bloodGroup: 'AB+', address: '5 Independence Layout, Enugu', emergencyContact: '+234 803 999 0004', allergies: [], status: 'discharged' },
  { name: 'Chinedu Obi', email: 'chinedu.obi@example.com', phone: '+234 803 200 0005', gender: 'male', dateOfBirth: '1992-11-05', bloodGroup: 'O-', address: '9 Bodija, Ibadan', emergencyContact: '+234 803 999 0005', allergies: ['Sulfa'], status: 'active' },
  { name: 'Fatima Bello', email: 'fatima.bello@example.com', phone: '+234 803 200 0006', gender: 'female', dateOfBirth: '1985-03-14', bloodGroup: 'A-', address: '11 Nasarawa, Kano', emergencyContact: '+234 803 999 0006', allergies: [], status: 'admitted' },
  { name: 'Daniel Okoro', email: 'daniel.okoro@example.com', phone: '+234 803 200 0007', gender: 'male', dateOfBirth: '1998-06-28', bloodGroup: 'B-', address: '3 Marina, Lagos', emergencyContact: '+234 803 999 0007', allergies: [], status: 'active' },
  { name: 'Esther Adeyemi', email: 'esther.adeyemi@example.com', phone: '+234 803 200 0008', gender: 'female', dateOfBirth: '1990-12-02', bloodGroup: 'O+', address: '18 Lekki Phase 1, Lagos', emergencyContact: '+234 803 999 0008', allergies: ['Peanuts'], status: 'active' },
];

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(9, 0, 0, 0);
  return d;
}

async function run() {
  await connectDB();
  // eslint-disable-next-line no-console
  console.log('✓ Connected. Clearing existing data...');

  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Doctor.deleteMany({}),
    Patient.deleteMany({}),
    Appointment.deleteMany({}),
    Invoice.deleteMany({}),
  ]);

  // Users are created one-by-one so the password pre-save hook runs.
  for (const u of users) {
    // eslint-disable-next-line no-await-in-loop
    await User.create(u);
  }

  const [createdDepartments, createdDoctors, createdPatients] = await Promise.all([
    Department.insertMany(departments),
    Doctor.insertMany(doctors),
    Patient.insertMany(patients),
  ]);

  const reasons = ['Routine check-up', 'Follow-up consultation', 'Chest pain evaluation', 'Vaccination', 'Lab results review', 'Post-surgery review'];
  const statuses = ['scheduled', 'completed', 'completed', 'cancelled', 'scheduled', 'no-show'];

  const appointments = createdPatients.slice(0, 6).map((p, i) => {
    const doc = createdDoctors[i % createdDoctors.length];
    return {
      patient: p._id,
      patientName: p.name,
      doctor: doc._id,
      doctorName: doc.name,
      department: doc.department,
      date: daysFromNow(i - 2),
      time: ['09:00', '10:30', '11:15', '13:00', '14:45', '16:00'][i],
      reason: reasons[i],
      status: statuses[i],
    };
  });
  await Appointment.insertMany(appointments);

  const invoiceStatuses = ['paid', 'pending', 'paid', 'overdue', 'paid', 'pending'];
  const methods = ['card', 'cash', 'transfer', 'insurance', 'card', 'cash'];
  for (let i = 0; i < 6; i += 1) {
    const p = createdPatients[i];
    // eslint-disable-next-line no-await-in-loop
    await Invoice.create({
      patient: p._id,
      patientName: p.name,
      items: [
        { description: 'Consultation', quantity: 1, unitPrice: 25000 },
        { description: 'Lab Tests', quantity: 1, unitPrice: 15000 + i * 2000 },
      ],
      tax: 2000,
      discount: i % 2 === 0 ? 1000 : 0,
      status: invoiceStatuses[i],
      method: methods[i],
      dueDate: daysFromNow(7),
    });
  }

  // eslint-disable-next-line no-console
  console.log(`✓ Seeded: ${users.length} users, ${createdDepartments.length} departments, ${createdDoctors.length} doctors, ${createdPatients.length} patients, ${appointments.length} appointments, 6 invoices.`);
  // eslint-disable-next-line no-console
  console.log('  Login: admin@vitacore.io / password123');

  await disconnectDB();
  process.exit(0);
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('✗ Seed failed:', err);
  process.exit(1);
});
