import { Router } from 'express';
import { Prescription } from '../models/Prescription.js';
import { Patient } from '../models/Patient.js';
import { Doctor } from '../models/Doctor.js';
import { crudController } from '../utils/crudController.js';
import { protect } from '../middleware/auth.js';

async function denormalize(body) {
  const next = { ...body };
  if (body.patient) {
    const patient = await Patient.findById(body.patient);
    if (patient) next.patientName = patient.name;
  }
  if (body.doctor) {
    const doctor = await Doctor.findById(body.doctor);
    if (doctor) next.doctorName = doctor.name;
  }
  return next;
}

const ctrl = crudController(Prescription, {
  searchFields: ['patientName', 'doctorName', 'diagnosis', 'medications', 'status'],
  beforeSave: denormalize,
});

const router = Router();

router.use(protect);
router.route('/').get(ctrl.list).post(ctrl.create);
router.route('/:id').get(ctrl.getOne).put(ctrl.update).delete(ctrl.remove);

export default router;
