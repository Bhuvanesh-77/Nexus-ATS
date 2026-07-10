import express from 'express';
import { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus, getAllApplications, getApplicationById, getCandidateDatabase, getCandidateProfile } from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/:jobId', protect, upload.single('resume'), applyForJob);
router.get('/me', protect, getMyApplications);
router.get('/all', protect, authorize('recruiter', 'admin'), getAllApplications);
router.get('/candidate-pool', protect, authorize('recruiter', 'admin'), getCandidateDatabase);
router.get('/:id', protect, getApplicationById);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
router.get('/candidate/:id', protect, authorize('recruiter', 'admin'), getCandidateProfile);
router.put('/:id/status', protect, authorize('recruiter', 'admin', 'candidate'), updateApplicationStatus);

export default router;
