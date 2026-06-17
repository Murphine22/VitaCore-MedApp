import { Router } from 'express';
import { Department } from '../models/Department.js';
import { crudController } from '../utils/crudController.js';
import { protect, authorize } from '../middleware/auth.js';

const ctrl = crudController(Department, {
  searchFields: ['name', 'description', 'headDoctor', 'location'],
});

const router = Router();

router.use(protect);
router.route('/').get(ctrl.list).post(authorize('admin'), ctrl.create);
router
  .route('/:id')
  .get(ctrl.getOne)
  .put(authorize('admin'), ctrl.update)
  .delete(authorize('admin'), ctrl.remove);

export default router;
