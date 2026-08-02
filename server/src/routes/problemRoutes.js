import { Router } from 'express';
import { verifyJWT, authorizeRoles } from '../middlewares/authMiddleware.js';
import { getProblems, getProblemById, createProblem } from '../controllers/problemsController.js';

const router = Router();

router.route('/').get(getProblems);
router.route('/:problemId').get(getProblemById);

router.route('/').post(verifyJWT, authorizeRoles('admin'), createProblem);

export default router;
