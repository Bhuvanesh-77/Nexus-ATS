import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: true
    },
    candidate: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Accepted', 'Rejected'],
        default: 'Applied'
    },
    resume: {
        type: String,
        required: [true, 'Please upload a resume']
    },
    coverLetter: {
        type: String
    },
    aiScore: {
        type: Number,
        default: 0
    },
    parsedText: {
        type: String
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    interviewDate: {
        type: Date
    },
    interviewLocation: {
        type: String,
        default: 'Main Office - Building A'
    },
    signature: {
        type: String
    }
});

// Prevent multiple applications for same job by same user
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
