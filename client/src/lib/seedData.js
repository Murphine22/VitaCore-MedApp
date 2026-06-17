// Demo dataset used when VITE_USE_API=false. Mirrors the backend seed so the
// standalone experience matches the live API.

function daysFromNow(n, hour = 9) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const demoUsers = [
  { _id: 'u1', name: 'Dr. Ada Okonkwo', email: 'admin@vitacore.io', password: 'password123', role: 'admin' },
  { _id: 'u2', name: 'Dr. Samuel Eze', email: 'doctor@vitacore.io', password: 'password123', role: 'doctor' },
  { _id: 'u3', name: 'Grace Bello', email: 'reception@vitacore.io', password: 'password123', role: 'receptionist' },
];

export const demoDepartments = [
  { _id: 'd1', name: 'Cardiology', description: 'Heart & vascular care', headDoctor: 'Dr. Samuel Eze', location: 'Block A, Floor 2', phone: '+234 801 111 1111', color: '#ef4444', icon: 'HeartPulse' },
  { _id: 'd2', name: 'Neurology', description: 'Brain & nervous system', headDoctor: 'Dr. Chioma Nwosu', location: 'Block B, Floor 3', phone: '+234 801 222 2222', color: '#8b5cf6', icon: 'Brain' },
  { _id: 'd3', name: 'Pediatrics', description: 'Child & infant health', headDoctor: 'Dr. Tunde Adesina', location: 'Block C, Floor 1', phone: '+234 801 333 3333', color: '#f59e0b', icon: 'Baby' },
  { _id: 'd4', name: 'Orthopedics', description: 'Bones, joints & muscles', headDoctor: 'Dr. Femi Balogun', location: 'Block A, Floor 1', phone: '+234 801 444 4444', color: '#10b981', icon: 'Bone' },
  { _id: 'd5', name: 'Emergency', description: '24/7 urgent care', headDoctor: 'Dr. Aisha Mohammed', location: 'Ground Floor', phone: '+234 801 555 5555', color: '#0ea5e9', icon: 'Ambulance' },
  { _id: 'd6', name: 'Dermatology', description: 'Skin, hair & nails', headDoctor: 'Dr. Ngozi Okafor', location: 'Block D, Floor 2', phone: '+234 801 666 6666', color: '#ec4899', icon: 'Sparkles' },
];

export const demoDoctors = [
  { _id: 'dr1', name: 'Dr. Samuel Eze', email: 'samuel.eze@vitacore.io', phone: '+234 802 100 0001', specialty: 'Cardiologist', department: 'Cardiology', gender: 'male', experienceYears: 14, consultationFee: 25000, status: 'available', rating: 4.9, bio: 'Interventional cardiologist with 14 years of clinical excellence.' },
  { _id: 'dr2', name: 'Dr. Chioma Nwosu', email: 'chioma.nwosu@vitacore.io', phone: '+234 802 100 0002', specialty: 'Neurologist', department: 'Neurology', gender: 'female', experienceYears: 11, consultationFee: 30000, status: 'available', rating: 4.8, bio: 'Specialist in stroke recovery and neurodegenerative disorders.' },
  { _id: 'dr3', name: 'Dr. Tunde Adesina', email: 'tunde.adesina@vitacore.io', phone: '+234 802 100 0003', specialty: 'Pediatrician', department: 'Pediatrics', gender: 'male', experienceYears: 9, consultationFee: 18000, status: 'busy', rating: 4.7, bio: 'Compassionate pediatric care from newborns to teens.' },
  { _id: 'dr4', name: 'Dr. Femi Balogun', email: 'femi.balogun@vitacore.io', phone: '+234 802 100 0004', specialty: 'Orthopedic Surgeon', department: 'Orthopedics', gender: 'male', experienceYears: 16, consultationFee: 28000, status: 'available', rating: 4.9, bio: 'Joint replacement and sports injury expert.' },
  { _id: 'dr5', name: 'Dr. Aisha Mohammed', email: 'aisha.mohammed@vitacore.io', phone: '+234 802 100 0005', specialty: 'Emergency Physician', department: 'Emergency', gender: 'female', experienceYears: 8, consultationFee: 20000, status: 'available', rating: 4.6, bio: 'Rapid-response trauma and critical-care specialist.' },
  { _id: 'dr6', name: 'Dr. Ngozi Okafor', email: 'ngozi.okafor@vitacore.io', phone: '+234 802 100 0006', specialty: 'Dermatologist', department: 'Dermatology', gender: 'female', experienceYears: 7, consultationFee: 22000, status: 'on-leave', rating: 4.8, bio: 'Medical and cosmetic dermatology.' },
];

export const demoPatients = [
  { _id: 'p1', name: 'John Abiodun', email: 'john.abiodun@example.com', phone: '+234 803 200 0001', gender: 'male', dateOfBirth: '1988-04-12', bloodGroup: 'O+', address: '14 Allen Ave, Ikeja, Lagos', emergencyContact: '+234 803 999 0001', allergies: ['Penicillin'], status: 'active' },
  { _id: 'p2', name: 'Mary Eke', email: 'mary.eke@example.com', phone: '+234 803 200 0002', gender: 'female', dateOfBirth: '1995-09-30', bloodGroup: 'A+', address: '7 Wuse II, Abuja', emergencyContact: '+234 803 999 0002', allergies: [], status: 'admitted' },
  { _id: 'p3', name: 'Ibrahim Sani', email: 'ibrahim.sani@example.com', phone: '+234 803 200 0003', gender: 'male', dateOfBirth: '1979-01-22', bloodGroup: 'B+', address: '22 GRA, Port Harcourt', emergencyContact: '+234 803 999 0003', allergies: ['Aspirin', 'Latex'], status: 'active' },
  { _id: 'p4', name: 'Blessing Udo', email: 'blessing.udo@example.com', phone: '+234 803 200 0004', gender: 'female', dateOfBirth: '2001-07-18', bloodGroup: 'AB+', address: '5 Independence Layout, Enugu', emergencyContact: '+234 803 999 0004', allergies: [], status: 'discharged' },
  { _id: 'p5', name: 'Chinedu Obi', email: 'chinedu.obi@example.com', phone: '+234 803 200 0005', gender: 'male', dateOfBirth: '1992-11-05', bloodGroup: 'O-', address: '9 Bodija, Ibadan', emergencyContact: '+234 803 999 0005', allergies: ['Sulfa'], status: 'active' },
  { _id: 'p6', name: 'Fatima Bello', email: 'fatima.bello@example.com', phone: '+234 803 200 0006', gender: 'female', dateOfBirth: '1985-03-14', bloodGroup: 'A-', address: '11 Nasarawa, Kano', emergencyContact: '+234 803 999 0006', allergies: [], status: 'admitted' },
  { _id: 'p7', name: 'Daniel Okoro', email: 'daniel.okoro@example.com', phone: '+234 803 200 0007', gender: 'male', dateOfBirth: '1998-06-28', bloodGroup: 'B-', address: '3 Marina, Lagos', emergencyContact: '+234 803 999 0007', allergies: [], status: 'active' },
  { _id: 'p8', name: 'Esther Adeyemi', email: 'esther.adeyemi@example.com', phone: '+234 803 200 0008', gender: 'female', dateOfBirth: '1990-12-02', bloodGroup: 'O+', address: '18 Lekki Phase 1, Lagos', emergencyContact: '+234 803 999 0008', allergies: ['Peanuts'], status: 'active' },
];

const apptReasons = ['Routine check-up', 'Follow-up consultation', 'Chest pain evaluation', 'Vaccination', 'Lab results review', 'Post-surgery review'];
const apptStatuses = ['scheduled', 'completed', 'completed', 'cancelled', 'scheduled', 'no-show'];
const apptTimes = ['09:00', '10:30', '11:15', '13:00', '14:45', '16:00'];

export const demoAppointments = demoPatients.slice(0, 6).map((p, i) => {
  const doc = demoDoctors[i % demoDoctors.length];
  return {
    _id: `a${i + 1}`,
    patient: p._id,
    patientName: p.name,
    doctor: doc._id,
    doctorName: doc.name,
    department: doc.department,
    date: daysFromNow(i - 2),
    time: apptTimes[i],
    reason: apptReasons[i],
    status: apptStatuses[i],
  };
});

const invStatuses = ['paid', 'pending', 'paid', 'overdue', 'paid', 'pending'];
const invMethods = ['card', 'cash', 'transfer', 'insurance', 'card', 'cash'];

export const demoInvoices = demoPatients.slice(0, 6).map((p, i) => {
  const items = [
    { description: 'Consultation', quantity: 1, unitPrice: 25000 },
    { description: 'Lab Tests', quantity: 1, unitPrice: 15000 + i * 2000 },
  ];
  const tax = 2000;
  const discount = i % 2 === 0 ? 1000 : 0;
  const amount = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0) + tax - discount;
  return {
    _id: `inv${i + 1}`,
    invoiceNo: `INV-DEMO-${(i + 1).toString().padStart(3, '0')}`,
    patient: p._id,
    patientName: p.name,
    items,
    tax,
    discount,
    amount,
    status: invStatuses[i],
    method: invMethods[i],
    dueDate: daysFromNow(7),
  };
});

export const demoSeed = {
  users: demoUsers,
  departments: demoDepartments,
  doctors: demoDoctors,
  patients: demoPatients,
  appointments: demoAppointments,
  invoices: demoInvoices,
};
