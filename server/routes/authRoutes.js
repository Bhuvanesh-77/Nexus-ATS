import express from 'express';
import { register, login, logout, getMe, saveJob, unsaveJob, updateSkills } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/save-job/:jobId', protect, saveJob);
router.put('/unsave-job/:jobId', protect, unsaveJob);
router.put('/skills', protect, updateSkills);

export default router;
