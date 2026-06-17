import { Router } from 'express';
import { Doctor } from '../models/Doctor.js';
import { crudController } from '../utils/crudController.js';
import { protect } from '../middleware/auth.js';

const ctrl = crudController(Doctor, {
  searchFields: ['name', 'email', 'specialty', 'department'],
});

const router = Router();

router.use(protect);
router.route('/').get(ctrl.list).post(ctrl.create);
router.route('/:id').get(ctrl.getOne).put(ctrl.update).delete(ctrl.remove);

export default router;
