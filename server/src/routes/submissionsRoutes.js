import { Router } from 'express';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { createSubmission, getSubmission } from '../controllers/submissionsController.js';

const router = Router();

router.use(verifyJWT);
router.route('/').post(createSubmission);
router.route('/:id').get(getSubmission);

export default router;
