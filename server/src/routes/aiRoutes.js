import { Router } from 'express';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { generateHintStream, generateDebugReport } from '../controllers/aiController.js';

const router = Router();

router.use(verifyJWT);

router.post('/hint', generateHintStream);
router.post('/debug', generateDebugReport);

export default router;
