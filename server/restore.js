import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';
import User from './models/User.js';
import Application from './models/Application.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for restoration...');

        // Clear existing data
        await Promise.all([
            Job.deleteMany(),
            Application.deleteMany(),
            User.deleteMany()
        ]);
        console.log('Cleared existing data...');

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const recruiter = await User.create({
            name: 'Default Recruiter',
            email: 'recruiter@example.com',
            password: 'password123',
            role: 'recruiter',
            companyName: 'TechCorp'
        });

        const john = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'candidate'
        });

        const jane = await User.create({
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123',
            role: 'candidate'
        });

        console.log('Users created...');

        // Create Original Jobs
        const jobs = await Job.insertMany([
            {
                title: 'Full Stack Developer',
                description: 'Join our core engineering team to scale our MERN enterprise platform.',
                company: 'TechCorp Solutions',
                location: 'Silicon Valley, CA',
                type: 'Full-time',
                requirements: 'React, Node.js, MongoDB',
                salary: '$125,000 - $160,000',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Senior Frontend Engineer',
                description: 'Lead the UI/UX evolution of our flagship analytics dashboard.',
                company: 'Designly Creative Labs',
                location: 'Manhattan, NY',
                type: 'Full-time',
                requirements: 'React, Tailwind CSS',
                salary: '$140,000 - $185,000',
                postedBy: recruiter._id,
                status: 'Open'
            }
        ]);

        console.log('Jobs created...');

        // Create Original Applications
        await Application.insertMany([
            {
                job: jobs[0]._id,
                candidate: john._id,
                status: 'Interview',
                appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                aiScore: 85,
                resume: 'uploads/default_resume.pdf'
            },
            {
                job: jobs[0]._id,
                candidate: jane._id,
                status: 'Rejected',
                appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                aiScore: 42,
                resume: 'uploads/default_resume.pdf'
            },
            {
                job: jobs[1]._id,
                candidate: john._id,
                status: 'Offer',
                appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
                aiScore: 92,
                resume: 'uploads/default_resume.pdf'
            },
            {
                job: jobs[1]._id,
                candidate: jane._id,
                status: 'Accepted',
                appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                aiScore: 88,
                signature: 'Jane Smith',
                resume: 'uploads/default_resume.pdf'
            }
        ]);

        console.log('Applications restored...');
        console.log('Restoration Complete!');
        process.exit();
    } catch (error) {
        console.error('Restoration failed:', error);
        process.exit(1);
    }
};

seedData();
