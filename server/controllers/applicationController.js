import fs from 'fs';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { extractTextFromPDF, calculateScore, checkIsResume } from '../services/nlpService.js';
import workflowEvents from '../services/workflowService.js';
import { sendOfferLetter, sendInterviewInvite } from '../services/emailService.js';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
export const applyForJob = async (req, res) => {
    try {
        const { coverLetter } = req.body;
        const jobId = req.params.jobId;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (req.user.role !== 'candidate') {
            return res.status(403).json({ message: 'Only candidates can apply' });
        }

        // Check if already applied
        const alreadyApplied = await Application.findOne({
            job: jobId,
            candidate: req.user._id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied to this job' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a resume' });
        }

        // Validate resume content
        const text = await extractTextFromPDF(req.file.path);
        const isValidResume = checkIsResume(text);

        if (!isValidResume) {
            // Delete the invalid file
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ message: 'invalid document is not permitted to upload here' });
        }

        const application = await Application.create({
            job: jobId,
            candidate: req.user._id,
            resume: req.file.path,
            coverLetter,
            parsedText: text // Reuse the extracted text
        });

        // AI Scoring (Background Processing - text already extracted)
        setImmediate(async () => {
            try {
                const score = calculateScore(text, job.description + " " + job.requirements);
                application.aiScore = score;
                await application.save();

                console.log(`[AI] Candidate ${req.user.name} scored ${score} for job: ${job.title}`);
                workflowEvents.emit('newApplication', application);
            } catch (err) {
                console.error('AI Processing Error:', err);
            }
        });

        res.status(201).json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get my applications
// @route   GET /api/applications/me
// @access  Private (Candidate)
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ candidate: req.user._id })
            .populate('job', 'title company location status')
            .select('status appliedAt interviewDate interviewLocation job');
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all applications (Admin/Recruiter)
// @route   GET /api/applications/all
// @access  Private (Admin/Recruiter)
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find({})
            .populate('candidate', 'name email')
            .populate('job', 'title company location status');
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get applications for a job (Recruiter)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
export const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check ownership
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('candidate', 'name email')
            .populate('job', 'title company location status');

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id)
            .populate('job')
            .populate('candidate', 'name email');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (!application.job) {
            return res.status(404).json({ message: 'Associated job not found' });
        }

        // Authorization Check
        const isOwner = application.job.postedBy && application.job.postedBy.toString() === req.user._id.toString();
        const isCandidate = application.candidate._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (status === 'Accepted') {
            // Candidates can accept their own offers
            if (!isCandidate && !isAdmin && !isOwner) {
                return res.status(403).json({ message: 'Not authorized to accept this offer' });
            }
        } else {
            // Other status changes are restricted to recruiters/admins
            if (!isOwner && !isAdmin) {
                return res.status(403).json({ message: 'Not authorized to change status' });
            }
        }

        const prevStatus = application.status;
        application.status = status;
        if (req.body.signature) {
            application.signature = req.body.signature;
        }

        if (status === 'Interview') {
            application.interviewDate = req.body.interviewDate || application.interviewDate;
            application.interviewLocation = req.body.interviewLocation || application.interviewLocation;

            // Send Invite
            sendInterviewInvite(application.candidate.email, application.candidate.name, {
                date: application.interviewDate,
                location: application.interviewLocation,
                jobTitle: application.job.title
            });
        }

        if (status === 'Offer') {
            sendOfferLetter(application.candidate.email, application.candidate.name, application.job);
        }

        await application.save();

        // Trigger Workflow Event
        workflowEvents.emit('applicationStatusChanged', {
            application,
            prevStatus,
            newStatus: status
        });

        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get Single Application by ID
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('candidate', 'name email')
            .populate('job', 'title company location description salary requirements type');

        if (!application) {
            console.log(`[API] Application not found ID: ${req.params.id}`);
            return res.status(404).json({ message: "Application not found in database." });
        }

        // Authorization check: Only owner or recruiter/admin can see it
        console.log(`[AUTH] Checking access: User ${req.user._id} Role ${req.user.role} for App ${application._id}`);
        if (req.user.role === 'candidate' && application.candidate._id.toString() !== req.user._id.toString()) {
            console.log(`[AUTH] Unauthorized! App Candidate ID: ${application.candidate._id}`);
            return res.status(401).json({ message: "Unauthorized: You do not have permission to view this offer." });
        }

        if (!application.job) {
            console.log(`[API] Application ${application._id} has NO job linked!`);
            return res.status(404).json({ message: "No job is associated with this application." });
        }

        res.json(application);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get all candidates who applied to recruiter's jobs
// @route   GET /api/applications/candidate-pool
// @access  Private (Recruiter/Admin)
export const getCandidateDatabase = async (req, res) => {
    try {
        // Find all jobs posted by this recruiter
        const jobs = await Job.find({ postedBy: req.user._id });
        const jobIds = jobs.map(j => j._id);

        // Find all unique candidates who applied to these jobs
        const applications = await Application.find({ job: { $in: jobIds } })
            .populate('candidate', 'name email skills resume')
            .populate('job', 'title');

        // Extract unique candidates and attach their application info
        const candidatesMap = new Map();
        applications.forEach(app => {
            if (app.candidate) {
                const candidateId = app.candidate._id.toString();
                if (!candidatesMap.has(candidateId)) {
                    candidatesMap.set(candidateId, {
                        ...app.candidate._doc,
                        resume: app.resume || app.candidate.resume,
                        appliedJobs: [{ id: app.job?._id, title: app.job?.title, status: app.status }],
                        lastAppliedAt: app.appliedAt
                    });
                } else {
                    const existing = candidatesMap.get(candidateId);
                    existing.appliedJobs.push({ id: app.job?._id, title: app.job?.title, status: app.status });
                }
            }
        });

        res.json(Array.from(candidatesMap.values()));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get detailed profile of a candidate
// @route   GET /api/applications/candidate/:id
// @access  Private (Recruiter/Admin)
export const getCandidateProfile = async (req, res) => {
    try {
        const candidate = await User.findById(req.params.id).select('-password');
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const applications = await Application.find({ candidate: req.params.id })
            .populate('job', 'title company location description salary type')
            .sort({ appliedAt: -1 });

        res.json({
            ...candidate._doc,
            applications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
