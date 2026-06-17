import { Router } from 'express';
import { Patient } from '../models/Patient.js';
import { crudController } from '../utils/crudController.js';
import { protect } from '../middleware/auth.js';

const ctrl = crudController(Patient, {
  searchFields: ['name', 'email', 'phone', 'bloodGroup'],
});

const router = Router();

router.use(protect);
router.route('/').get(ctrl.list).post(ctrl.create);
router.route('/:id').get(ctrl.getOne).put(ctrl.update).delete(ctrl.remove);

export default router;
