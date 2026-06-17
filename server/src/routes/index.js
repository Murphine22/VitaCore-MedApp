import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import authRoutes from './authRoutes.js';
import patientRoutes from './patientRoutes.js';
import doctorRoutes from './doctorRoutes.js';
import departmentRoutes from './departmentRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import invoiceRoutes from './invoiceRoutes.js';
import { getStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get(
  '/health',
  asyncHandler(async (_req, res) => {
    res.json({ success: true, status: 'ok', service: 'vitacore-api', time: new Date().toISOString() });
  })
);

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/departments', departmentRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/invoices', invoiceRoutes);
router.get('/dashboard/stats', protect, getStats);

export default router;
