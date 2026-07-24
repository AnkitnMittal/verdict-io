import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
} from '../controllers/authController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';

const router = Router();

/* Public Authentication Routes */
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh').post(refreshAccessToken);

/* Protected Authenticated Routes */
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/me').get(verifyJWT, getCurrentUser);

export default router;
