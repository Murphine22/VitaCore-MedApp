import { Router } from 'express';
import { Invoice } from '../models/Invoice.js';
import { Patient } from '../models/Patient.js';
import { crudController } from '../utils/crudController.js';
import { protect } from '../middleware/auth.js';

async function denormalize(body) {
  const next = { ...body };
  if (body.patient) {
    const patient = await Patient.findById(body.patient);
    if (patient) next.patientName = patient.name;
  }
  return next;
}

const ctrl = crudController(Invoice, {
  searchFields: ['invoiceNo', 'patientName', 'status', 'method'],
  beforeSave: denormalize,
});

const router = Router();

router.use(protect);
router.route('/').get(ctrl.list).post(ctrl.create);
router.route('/:id').get(ctrl.getOne).put(ctrl.update).delete(ctrl.remove);

export default router;
