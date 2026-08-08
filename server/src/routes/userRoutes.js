import { Router } from 'express';
import { getUserProfile } from '../controllers/userController.js';

const router = Router();

router.get('/:username', getUserProfile);

export default router;
