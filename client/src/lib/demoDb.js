import { demoSeed } from './seedData.js';

const STORAGE_KEY = 'vitacore_demo_db_v2';
const COLLECTIONS = ['users', 'departments', 'doctors', 'patients', 'appointments', 'invoices', 'prescriptions'];

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to seed
  }
  const seeded = structuredClone(demoSeed);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

function persist(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function computeInvoice(record) {
  const subtotal = (record.items || []).reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0
  );
  record.amount = Math.max(0, subtotal + (Number(record.tax) || 0) - (Number(record.discount) || 0));
  if (!record.invoiceNo) {
    record.invoiceNo = `INV-${Date.now().toString(36).toUpperCase()}`;
  }
  return record;
}

function denormalize(db, collection, record) {
  if (collection === 'appointments') {
    const patient = db.patients.find((p) => p._id === record.patient);
    const doctor = db.doctors.find((d) => d._id === record.doctor);
    if (patient) record.patientName = patient.name;
    if (doctor) {
      record.doctorName = doctor.name;
      if (!record.department) record.department = doctor.department || doctor.specialty;
    }
  }
  if (collection === 'invoices') {
    const patient = db.patients.find((p) => p._id === record.patient);
    if (patient) record.patientName = patient.name;
    computeInvoice(record);
  }
  if (collection === 'prescriptions') {
    const patient = db.patients.find((p) => p._id === record.patient);
    const doctor = db.doctors.find((d) => d._id === record.doctor);
    if (patient) record.patientName = patient.name;
    if (doctor) record.doctorName = doctor.name;
  }
  return record;
}

function matchesSearch(record, search, fields) {
  if (!search) return true;
  const q = search.toLowerCase();
  return fields.some((f) => String(record[f] ?? '').toLowerCase().includes(q));
}

const SEARCH_FIELDS = {
  patients: ['name', 'email', 'phone', 'bloodGroup'],
  doctors: ['name', 'email', 'specialty', 'department'],
  departments: ['name', 'description', 'headDoctor', 'location'],
  appointments: ['patientName', 'doctorName', 'department', 'reason', 'status'],
  invoices: ['invoiceNo', 'patientName', 'status', 'method'],
  prescriptions: ['patientName', 'doctorName', 'diagnosis', 'medications', 'status'],
};

export const demoDb = {
  reset() {
    const seeded = structuredClone(demoSeed);
    persist(seeded);
    return seeded;
  },

  authLogin({ email, password }) {
    const db = load();
    const user = db.users.find((u) => u.email === email && u.password === password);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }
    const safe = { _id: user._id, name: user.name, email: user.email, role: user.role };
    return { token: `demo.${btoa(user.email)}.token`, user: safe };
  },

  authRegister({ name, email, password, role = 'receptionist' }) {
    const db = load();
    if (db.users.some((u) => u.email === email)) {
      const err = new Error('A user with that email already exists');
      err.status = 409;
      throw err;
    }
    const user = { _id: uid('u'), name, email, password, role };
    db.users.push(user);
    persist(db);
    const safe = { _id: user._id, name, email, role };
    return { token: `demo.${btoa(email)}.token`, user: safe };
  },

  list(collection, params = {}) {
    const db = load();
    let rows = [...(db[collection] || [])];
    const { search, status, department, patient, doctor, sort = '-createdAt', page, limit } = params;
    if (status) rows = rows.filter((r) => r.status === status);
    if (department) rows = rows.filter((r) => r.department === department);
    if (patient) rows = rows.filter((r) => r.patient === patient);
    if (doctor) rows = rows.filter((r) => r.doctor === doctor);
    if (search) rows = rows.filter((r) => matchesSearch(r, search, SEARCH_FIELDS[collection] || []));
    if (sort) {
      const desc = sort.startsWith('-');
      const key = desc ? sort.slice(1) : sort;
      rows.sort((a, b) => {
        const av = a[key] ?? 0;
        const bv = b[key] ?? 0;
        if (av < bv) return desc ? 1 : -1;
        if (av > bv) return desc ? -1 : 1;
        return 0;
      });
    }
    const total = rows.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    if (!Number.isNaN(pageNum) && !Number.isNaN(limitNum)) {
      rows = rows.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    }
    return { success: true, count: rows.length, total, data: rows };
  },

  get(collection, id) {
    const db = load();
    const doc = (db[collection] || []).find((r) => r._id === id);
    if (!doc) throw new Error(`${collection} not found`);
    return { success: true, data: doc };
  },

  create(collection, body) {
    const db = load();
    const now = new Date().toISOString();
    let record = { ...body, _id: uid(collection.slice(0, 3)), createdAt: now, updatedAt: now };
    record = denormalize(db, collection, record);
    db[collection].unshift(record);
    persist(db);
    return { success: true, data: record };
  },

  update(collection, id, body) {
    const db = load();
    const idx = (db[collection] || []).findIndex((r) => r._id === id);
    if (idx === -1) throw new Error(`${collection} not found`);
    let record = { ...db[collection][idx], ...body, updatedAt: new Date().toISOString() };
    record = denormalize(db, collection, record);
    db[collection][idx] = record;
    persist(db);
    return { success: true, data: record };
  },

  remove(collection, id) {
    const db = load();
    db[collection] = (db[collection] || []).filter((r) => r._id !== id);
    persist(db);
    return { success: true, message: 'deleted' };
  },

  stats() {
    const db = load();
    const today = new Date().toDateString();
    const revenue = db.invoices
      .filter((i) => i.status === 'paid')
      .reduce((s, i) => s + (i.amount || 0), 0);

    const byStatus = {};
    db.appointments.forEach((a) => {
      byStatus[a.status] = (byStatus[a.status] || 0) + 1;
    });
    const revByStatus = {};
    db.invoices.forEach((inv) => {
      revByStatus[inv.status] = (revByStatus[inv.status] || 0) + (inv.amount || 0);
    });
    const byDept = {};
    db.appointments.forEach((a) => {
      const key = a.department || 'Unassigned';
      byDept[key] = (byDept[key] || 0) + 1;
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const revenueTrend = monthNames.map((month, i) => ({
      month,
      revenue: Math.round(revenue * (0.5 + i * 0.12)),
      invoices: 3 + i,
    }));

    return {
      success: true,
      data: {
        totals: {
          patients: db.patients.length,
          doctors: db.doctors.length,
          departments: db.departments.length,
          appointments: db.appointments.length,
          appointmentsToday: db.appointments.filter(
            (a) => new Date(a.date).toDateString() === today
          ).length,
          invoices: db.invoices.length,
          prescriptions: db.prescriptions.length,
          revenue,
        },
        appointmentsByStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
        revenueByStatus: Object.entries(revByStatus).map(([status, amount]) => ({ status, amount })),
        appointmentsByDepartment: Object.entries(byDept)
          .map(([department, count]) => ({ department, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8),
        revenueTrend,
        recentAppointments: db.appointments.slice(0, 6),
      },
    };
  },
};

export { COLLECTIONS };
