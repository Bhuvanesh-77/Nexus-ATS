import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true,
        maxlength: [100, 'Job title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    company: {
        type: String,
        required: [true, 'Please add a company name']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        default: 'Full-time'
    },
    requirements: {
        type: [String],
        default: []
    },
    salary: {
        type: String,
        default: 'Not specified'
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Job', jobSchema);
