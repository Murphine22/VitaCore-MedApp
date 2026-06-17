import asyncHandler from 'express-async-handler';
import { Patient } from '../models/Patient.js';
import { Doctor } from '../models/Doctor.js';
import { Appointment } from '../models/Appointment.js';
import { Invoice } from '../models/Invoice.js';
import { Department } from '../models/Department.js';

export const getStats = asyncHandler(async (req, res) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    patients,
    doctors,
    departments,
    appointmentsTotal,
    appointmentsToday,
    invoices,
    revenueAgg,
    statusAgg,
    deptAgg,
    recentAppointments,
  ] = await Promise.all([
    Patient.countDocuments(),
    Doctor.countDocuments(),
    Department.countDocuments(),
    Appointment.countDocuments(),
    Appointment.countDocuments({
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    }),
    Invoice.countDocuments(),
    Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Appointment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Appointment.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    Appointment.find().sort('-createdAt').limit(6),
  ]);

  // Last 6 months revenue trend
  const monthly = await Invoice.aggregate([
    {
      $group: {
        _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.y': 1, '_id.m': 1 } },
    { $limit: 6 },
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  res.json({
    success: true,
    data: {
      totals: {
        patients,
        doctors,
        departments,
        appointments: appointmentsTotal,
        appointmentsToday,
        invoices,
        revenue: revenueAgg[0]?.total || 0,
      },
      appointmentsByStatus: statusAgg.map((s) => ({ status: s._id, count: s.count })),
      appointmentsByDepartment: deptAgg.map((d) => ({
        department: d._id || 'Unassigned',
        count: d.count,
      })),
      revenueTrend: monthly.map((m) => ({
        month: monthNames[m._id.m - 1],
        revenue: m.revenue,
        invoices: m.count,
      })),
      recentAppointments,
    },
  });
});
