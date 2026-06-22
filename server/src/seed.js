import { connectDB, disconnectDB } from './config/db.js';
import { User } from './models/User.js';
import { Department } from './models/Department.js';
import { Doctor } from './models/Doctor.js';
import { Patient } from './models/Patient.js';
import { Appointment } from './models/Appointment.js';
import { Invoice } from './models/Invoice.js';
import { Prescription } from './models/Prescription.js';

const pick = (arr, i) => arr[i % arr.length];

function daysFromNow(n, hour = 9) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function isoDate(y, m, d) {
  return new Date(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
}

const MALE_FIRST = [
  'Chinedu', 'Emeka', 'Tunde', 'Ibrahim', 'Daniel', 'Samuel', 'Kelvin', 'Uche', 'Obinna', 'Yusuf',
  'Musa', 'Segun', 'Femi', 'Kunle', 'Bashir', 'Gabriel', 'Henry', 'Victor', 'Chidi', 'Nnamdi',
  'Abdul', 'Sadiq', 'Ifeanyi', 'Olamide', 'Chukwudi', 'Bode', 'Kayode', 'Wale', 'Sola', 'Tobi',
];
const FEMALE_FIRST = [
  'Ada', 'Ngozi', 'Chioma', 'Fatima', 'Aisha', 'Blessing', 'Esther', 'Mary', 'Grace', 'Amaka',
  'Halima', 'Zainab', 'Funke', 'Bukola', 'Yetunde', 'Nkechi', 'Ifeoma', 'Tolu', 'Damilola', 'Sade',
  'Hauwa', 'Rukayat', 'Patience', 'Joy', 'Peace', 'Gloria', 'Comfort', 'Onyeka', 'Chinwe', 'Ronke',
];
const LAST = [
  'Okonkwo', 'Eze', 'Adesina', 'Balogun', 'Mohammed', 'Okafor', 'Abiodun', 'Eke', 'Sani', 'Udo',
  'Obi', 'Bello', 'Okoro', 'Adeyemi', 'Nwosu', 'Ogunleye', 'Lawal', 'Afolabi', 'Chukwu', 'Olawale',
  'Danjuma', 'Ekwueme', 'Aliyu', 'Adebayo', 'Nwachukwu', 'Oluwaseun', 'Ojo', 'Akinyemi', 'Ademola', 'Yakubu',
  'Babatunde', 'Nnaji', 'Onuoha', 'Akpan', 'Mustapha', 'Okeke', 'Ogungbe', 'Salami', 'Ironkwe', 'Bamidele',
];
const CITIES = [
  'Ikeja, Lagos', 'Wuse, Abuja', 'GRA, Port Harcourt', 'Independence Layout, Enugu', 'Bodija, Ibadan',
  'Nasarawa, Kano', 'Barnawa, Kaduna', 'Ugbowo, Benin City', 'Rayfield, Jos', 'Calabar South, Calabar',
  'New Owerri, Owerri', 'Ewet Housing, Uyo', 'Oke-Ilewo, Abeokuta', 'Tanke, Ilorin', 'Effurun, Warri',
];
const BLOOD = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const ALLERGY_POOL = ['Penicillin', 'Latex', 'Aspirin', 'Sulfa', 'Peanuts', 'Iodine', 'Pollen', 'Shellfish'];
const PATIENT_STATUS = ['active', 'active', 'active', 'admitted', 'discharged'];
const DOC_STATUS = ['available', 'available', 'busy', 'on-leave'];

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
  { name: 'Oncology', description: 'Cancer diagnosis & treatment', headDoctor: 'Dr. Yusuf Aliyu', location: 'Block E, Floor 4', phone: '+234 801 777 7777', color: '#14b8a6', icon: 'Ribbon' },
  { name: 'Radiology', description: 'Medical imaging & scans', headDoctor: 'Dr. Halima Danjuma', location: 'Block B, Floor 1', phone: '+234 801 888 8888', color: '#6366f1', icon: 'ScanLine' },
  { name: 'ENT', description: 'Ear, nose & throat care', headDoctor: 'Dr. Segun Afolabi', location: 'Block C, Floor 2', phone: '+234 801 999 9999', color: '#f97316', icon: 'Ear' },
  { name: 'Ophthalmology', description: 'Eye & vision care', headDoctor: 'Dr. Funke Ogunleye', location: 'Block D, Floor 1', phone: '+234 802 101 0101', color: '#0891b2', icon: 'Eye' },
  { name: 'Gynecology', description: "Women's reproductive health", headDoctor: 'Dr. Amaka Nwachukwu', location: 'Block F, Floor 2', phone: '+234 802 202 0202', color: '#db2777', icon: 'Flower2' },
  { name: 'Urology', description: 'Urinary & kidney care', headDoctor: 'Dr. Musa Yakubu', location: 'Block E, Floor 1', phone: '+234 802 303 0303', color: '#22c55e', icon: 'Droplets' },
];

const DEPT_SPECIALTY = {
  Cardiology: 'Cardiologist',
  Neurology: 'Neurologist',
  Pediatrics: 'Pediatrician',
  Orthopedics: 'Orthopedic Surgeon',
  Emergency: 'Emergency Physician',
  Dermatology: 'Dermatologist',
  Oncology: 'Oncologist',
  Radiology: 'Radiologist',
  ENT: 'ENT Surgeon',
  Ophthalmology: 'Ophthalmologist',
  Gynecology: 'Gynecologist',
  Urology: 'Urologist',
};
const DEPT_NAMES = departments.map((d) => d.name);

const baseDoctors = [
  { name: 'Dr. Samuel Eze', email: 'samuel.eze@vitacore.io', phone: '+234 802 100 0001', specialty: 'Cardiologist', department: 'Cardiology', gender: 'male', experienceYears: 14, consultationFee: 25000, status: 'available', rating: 4.9, bio: 'Interventional cardiologist with 14 years of clinical excellence.' },
  { name: 'Dr. Chioma Nwosu', email: 'chioma.nwosu@vitacore.io', phone: '+234 802 100 0002', specialty: 'Neurologist', department: 'Neurology', gender: 'female', experienceYears: 11, consultationFee: 30000, status: 'available', rating: 4.8, bio: 'Specialist in stroke recovery and neurodegenerative disorders.' },
  { name: 'Dr. Tunde Adesina', email: 'tunde.adesina@vitacore.io', phone: '+234 802 100 0003', specialty: 'Pediatrician', department: 'Pediatrics', gender: 'male', experienceYears: 9, consultationFee: 18000, status: 'busy', rating: 4.7, bio: 'Compassionate pediatric care from newborns to teens.' },
  { name: 'Dr. Femi Balogun', email: 'femi.balogun@vitacore.io', phone: '+234 802 100 0004', specialty: 'Orthopedic Surgeon', department: 'Orthopedics', gender: 'male', experienceYears: 16, consultationFee: 28000, status: 'available', rating: 4.9, bio: 'Joint replacement and sports injury expert.' },
  { name: 'Dr. Aisha Mohammed', email: 'aisha.mohammed@vitacore.io', phone: '+234 802 100 0005', specialty: 'Emergency Physician', department: 'Emergency', gender: 'female', experienceYears: 8, consultationFee: 20000, status: 'available', rating: 4.6, bio: 'Rapid-response trauma and critical-care specialist.' },
  { name: 'Dr. Ngozi Okafor', email: 'ngozi.okafor@vitacore.io', phone: '+234 802 100 0006', specialty: 'Dermatologist', department: 'Dermatology', gender: 'female', experienceYears: 7, consultationFee: 22000, status: 'on-leave', rating: 4.8, bio: 'Medical and cosmetic dermatology.' },
];

function genDoctors(count) {
  const out = [];
  for (let n = 0; n < count; n += 1) {
    const male = n % 2 === 0;
    const first = male ? pick(MALE_FIRST, n + 3) : pick(FEMALE_FIRST, n + 5);
    const last = pick(LAST, n * 2 + 1);
    const dept = pick(DEPT_NAMES, n);
    const specialty = DEPT_SPECIALTY[dept];
    const num = String(n + 7).padStart(4, '0');
    out.push({
      name: `Dr. ${first} ${last}`,
      email: `${first}.${last}.${n + 7}@vitacore.io`.toLowerCase(),
      phone: `+234 802 100 ${num}`,
      specialty,
      department: dept,
      gender: male ? 'male' : 'female',
      experienceYears: 4 + (n % 22),
      consultationFee: 15000 + (n % 9) * 2500,
      status: pick(DOC_STATUS, n),
      rating: Math.round((4.1 + (n % 9) * 0.1) * 10) / 10,
      bio: `${specialty} dedicated to patient-centred, evidence-based ${dept.toLowerCase()} care.`,
    });
  }
  return out;
}

const doctors = [...baseDoctors, ...genDoctors(30)];

const basePatients = [
  { name: 'John Abiodun', email: 'john.abiodun@example.com', phone: '+234 803 200 0001', gender: 'male', dateOfBirth: '1988-04-12', bloodGroup: 'O+', address: '14 Allen Ave, Ikeja, Lagos', emergencyContact: '+234 803 999 0001', allergies: ['Penicillin'], status: 'active' },
  { name: 'Mary Eke', email: 'mary.eke@example.com', phone: '+234 803 200 0002', gender: 'female', dateOfBirth: '1995-09-30', bloodGroup: 'A+', address: '7 Wuse II, Abuja', emergencyContact: '+234 803 999 0002', allergies: [], status: 'admitted' },
  { name: 'Ibrahim Sani', email: 'ibrahim.sani@example.com', phone: '+234 803 200 0003', gender: 'male', dateOfBirth: '1979-01-22', bloodGroup: 'B+', address: '22 GRA, Port Harcourt', emergencyContact: '+234 803 999 0003', allergies: ['Aspirin', 'Latex'], status: 'active' },
  { name: 'Blessing Udo', email: 'blessing.udo@example.com', phone: '+234 803 200 0004', gender: 'female', dateOfBirth: '2001-07-18', bloodGroup: 'AB+', address: '5 Independence Layout, Enugu', emergencyContact: '+234 803 999 0004', allergies: [], status: 'discharged' },
  { name: 'Chinedu Obi', email: 'chinedu.obi@example.com', phone: '+234 803 200 0005', gender: 'male', dateOfBirth: '1992-11-05', bloodGroup: 'O-', address: '9 Bodija, Ibadan', emergencyContact: '+234 803 999 0005', allergies: ['Sulfa'], status: 'active' },
  { name: 'Fatima Bello', email: 'fatima.bello@example.com', phone: '+234 803 200 0006', gender: 'female', dateOfBirth: '1985-03-14', bloodGroup: 'A-', address: '11 Nasarawa, Kano', emergencyContact: '+234 803 999 0006', allergies: [], status: 'admitted' },
  { name: 'Daniel Okoro', email: 'daniel.okoro@example.com', phone: '+234 803 200 0007', gender: 'male', dateOfBirth: '1998-06-28', bloodGroup: 'B-', address: '3 Marina, Lagos', emergencyContact: '+234 803 999 0007', allergies: [], status: 'active' },
  { name: 'Esther Adeyemi', email: 'esther.adeyemi@example.com', phone: '+234 803 200 0008', gender: 'female', dateOfBirth: '1990-12-02', bloodGroup: 'O+', address: '18 Lekki Phase 1, Lagos', emergencyContact: '+234 803 999 0008', allergies: ['Peanuts'], status: 'active' },
];

function genPatients(count) {
  const out = [];
  for (let n = 0; n < count; n += 1) {
    const male = n % 2 === 1;
    const first = male ? pick(MALE_FIRST, n) : pick(FEMALE_FIRST, n);
    const last = pick(LAST, n + 7);
    const seq = n + 9;
    const num = String(seq).padStart(4, '0');
    const year = 1950 + (n * 7) % 66;
    const month = 1 + (n % 12);
    const day = 1 + (n % 27);
    out.push({
      name: `${first} ${last}`,
      email: `${first}.${last}.${seq}@example.com`.toLowerCase(),
      phone: `+234 803 200 ${num}`,
      gender: male ? 'male' : 'female',
      dateOfBirth: isoDate(year, month, day),
      bloodGroup: pick(BLOOD, n),
      address: `${1 + (n % 90)} ${pick(CITIES, n)}`,
      emergencyContact: `+234 803 999 ${num}`,
      allergies: n % 3 === 0 ? [pick(ALLERGY_POOL, n)] : [],
      status: pick(PATIENT_STATUS, n),
    });
  }
  return out;
}

const patients = [...basePatients, ...genPatients(100)];

const APPT_REASONS = [
  'Routine check-up', 'Follow-up consultation', 'Chest pain evaluation', 'Vaccination',
  'Lab results review', 'Post-surgery review', 'Antenatal visit', 'Eye examination',
  'Skin rash assessment', 'Migraine consultation', 'Fracture follow-up', 'Blood pressure review',
  'Diabetes management', 'Hearing test', 'Cancer screening', 'Kidney function review',
];
const APPT_STATUSES = ['scheduled', 'completed', 'completed', 'cancelled', 'scheduled', 'no-show', 'scheduled', 'completed'];
const APPT_TIMES = ['08:30', '09:00', '09:45', '10:30', '11:15', '12:00', '13:00', '14:00', '14:45', '15:30', '16:00', '16:45'];

const SERVICE_ITEMS = [
  { description: 'Consultation', unitPrice: 25000 },
  { description: 'Lab Tests', unitPrice: 15000 },
  { description: 'X-Ray / Imaging', unitPrice: 20000 },
  { description: 'Medication', unitPrice: 12000 },
  { description: 'Minor Procedure', unitPrice: 45000 },
  { description: 'Physiotherapy Session', unitPrice: 18000 },
  { description: 'Ultrasound Scan', unitPrice: 22000 },
  { description: 'Ward Admission (per night)', unitPrice: 35000 },
];
const INV_STATUSES = ['paid', 'pending', 'paid', 'overdue', 'paid', 'pending', 'paid', 'paid'];
const INV_METHODS = ['card', 'cash', 'transfer', 'insurance'];

const MEDICATIONS = [
  { name: 'Amoxicillin 500mg', dosage: '1 capsule 3x daily for 7 days' },
  { name: 'Lisinopril 10mg', dosage: '1 tablet once daily' },
  { name: 'Metformin 850mg', dosage: '1 tablet twice daily with meals' },
  { name: 'Atorvastatin 20mg', dosage: '1 tablet at night' },
  { name: 'Paracetamol 1g', dosage: '1 tablet every 6 hours as needed' },
  { name: 'Artemether/Lumefantrine', dosage: '4 tablets twice daily for 3 days' },
  { name: 'Omeprazole 20mg', dosage: '1 capsule before breakfast' },
  { name: 'Salbutamol Inhaler', dosage: '2 puffs as needed' },
  { name: 'Ibuprofen 400mg', dosage: '1 tablet 3x daily after food' },
  { name: 'Ceftriaxone 1g', dosage: 'IV once daily for 5 days' },
];
const RX_NOTES = [
  'Complete the full course. Return if symptoms persist.',
  'Monitor blood pressure weekly.',
  'Take with plenty of water. Avoid alcohol.',
  'Review in two weeks.',
  'Report any adverse reactions immediately.',
];
const RX_STATUS = ['active', 'active', 'completed', 'active', 'cancelled'];

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
    Prescription.deleteMany({}),
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

  // Appointments (46): 6 deterministic + 40 generated.
  const appointments = [];
  for (let i = 0; i < 6; i += 1) {
    const p = createdPatients[i];
    const doc = createdDoctors[i % createdDoctors.length];
    appointments.push({
      patient: p._id,
      patientName: p.name,
      doctor: doc._id,
      doctorName: doc.name,
      department: doc.department,
      date: daysFromNow(i - 2),
      time: APPT_TIMES[i],
      reason: APPT_REASONS[i],
      status: APPT_STATUSES[i],
    });
  }
  for (let n = 0; n < 40; n += 1) {
    const p = createdPatients[(n * 3 + 5) % createdPatients.length];
    const doc = createdDoctors[(n * 2 + 1) % createdDoctors.length];
    appointments.push({
      patient: p._id,
      patientName: p.name,
      doctor: doc._id,
      doctorName: doc.name,
      department: doc.department,
      date: daysFromNow(n - 18, 9),
      time: pick(APPT_TIMES, n),
      reason: pick(APPT_REASONS, n),
      status: pick(APPT_STATUSES, n),
    });
  }
  await Appointment.insertMany(appointments);

  // Invoices (40): pre-validate hook computes amount + invoiceNo.
  for (let n = 0; n < 40; n += 1) {
    const p = createdPatients[n < 6 ? n : (n * 4 + 9) % createdPatients.length];
    const item1 = pick(SERVICE_ITEMS, n);
    const item2 = pick(SERVICE_ITEMS, n + 3);
    // eslint-disable-next-line no-await-in-loop
    await Invoice.create({
      patient: p._id,
      patientName: p.name,
      items: [
        { description: item1.description, quantity: 1, unitPrice: item1.unitPrice },
        { description: item2.description, quantity: 1 + (n % 3), unitPrice: item2.unitPrice },
      ],
      tax: 2000,
      discount: n % 4 === 0 ? 1500 : 0,
      status: pick(INV_STATUSES, n),
      method: pick(INV_METHODS, n),
      dueDate: daysFromNow(7 + (n % 21)),
    });
  }

  // Prescriptions (30).
  const prescriptions = [];
  for (let i = 0; i < 30; i += 1) {
    const p = createdPatients[(i * 5 + 2) % createdPatients.length];
    const doc = createdDoctors[(i * 3 + 4) % createdDoctors.length];
    const med1 = pick(MEDICATIONS, i);
    const med2 = pick(MEDICATIONS, i + 4);
    prescriptions.push({
      patient: p._id,
      patientName: p.name,
      doctor: doc._id,
      doctorName: doc.name,
      diagnosis: pick(APPT_REASONS, i + 2).replace(' consultation', '').replace(' evaluation', ''),
      date: daysFromNow(-(i % 30), 10),
      medications: `${med1.name} — ${med1.dosage}; ${med2.name} — ${med2.dosage}`,
      notes: pick(RX_NOTES, i),
      status: pick(RX_STATUS, i),
    });
  }
  await Prescription.insertMany(prescriptions);

  // eslint-disable-next-line no-console
  console.log(
    `✓ Seeded: ${users.length} users, ${createdDepartments.length} departments, ${createdDoctors.length} doctors, ${createdPatients.length} patients, ${appointments.length} appointments, 40 invoices, ${prescriptions.length} prescriptions.`
  );
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
