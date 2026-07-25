import { Router } from 'express';
import { getProblems, getProblemById, createProblem } from '../controllers/problemController.js';
import { verifyJWT, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

router.route('/').get(getProblems);
router.route('/:problemId').get(getProblemById);

router.route('/').post(verifyJWT, authorizeRoles('admin'), createProblem);

export default router;
