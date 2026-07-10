import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';
import User from './models/User.js';
import Application from './models/Application.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Promise.all([
            Job.deleteMany(),
            Application.deleteMany()
        ]);
        console.log('Cleared existing Jobs and Applications...');

        // Get a recruiter user to "post" these jobs
        // If no recruiter exists, we create one
        let recruiter = await User.findOne({ email: 'recruiter@example.com' });

        if (!recruiter) {
            console.log('No recruiter found, creating a default recruiter...');
            recruiter = await User.create({
                name: 'Default Recruiter',
                email: 'recruiter@example.com',
                password: 'password123',
                role: 'recruiter',
                companyName: 'TechCorp'
            });
        } else {
            console.log('Recruiter found, resetting password...');
            recruiter.password = 'password123';
            await recruiter.save();
        }

        const jobs = [
            // Original Jobs (Preserving existing features/data)
            {
                title: 'Full Stack Developer',
                description: 'Join our core engineering team to scale our MERN enterprise platform. You will work on high-availability cloud services and distributed database architectures.',
                company: 'TechCorp Solutions',
                location: '123 Innovation Drive, Silicon Valley, CA 94043',
                type: 'Full-time',
                requirements: '3+ years experience with React, Node.js, and MongoDB. Professional AWS knowledge.',
                salary: '$125,000 - $160,000',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Senior Frontend Engineer',
                description: 'Lead the UI/UX evolution of our flagship analytics dashboard. Focus on performance, accessibility, and modern React patterns.',
                company: 'Designly Creative Labs',
                location: '450 Fifth Avenue, Midtown Manhattan, NY 10018',
                type: 'Full-time',
                requirements: 'Expert knowledge of React, Tailwind CSS, and Framer Motion.',
                salary: '$140,000 - $185,000',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Mobile App Developer (iOS/Android)',
                description: 'Build high-performance native and cross-platform mobile applications for our global user base.',
                company: 'AppVenture Studio',
                location: 'Remote / Bangalore, India',
                type: 'Full-time',
                requirements: 'Strong experience with React Native, Swift, or Flutter.',
                salary: '₹25,00,000 - ₹40,00,000',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Cloud Infrastructure Architect',
                description: 'Help us automate and scale our distributed systems using modern DevOps practices and Infrastructure as Code.',
                company: 'Global DataFlow Systems',
                location: 'Market Street Towers, San Francisco, CA 94103',
                type: 'Contract',
                requirements: 'Terraform, Kubernetes, AWS, and expert networking knowledge.',
                salary: '$180,000 - $240,000',
                postedBy: recruiter._id,
                status: 'Open'
            },

            // New Distributed Jobs (Added for variety)
            // Bangalore (additional)
            { title: 'Backend Developer', company: 'TechBase', location: 'Bangalore', type: 'Full-time', salary: '₹12L - ₹18L', requirements: 'Node.js, MongoDB', description: 'Build scalable APIs.', postedBy: recruiter._id, status: 'Open' },
            { title: 'DevOps Engineer', company: 'CloudWorks', location: 'Bangalore', type: 'Full-time', salary: '₹15L - ₹22L', requirements: 'AWS, Docker, K8s', description: 'Manage infrastructure.', postedBy: recruiter._id, status: 'Open' },
            { title: 'Frontend Developer', company: 'UI Masters', location: 'Bangalore', type: 'Part-time', salary: '₹6L - ₹8L', requirements: 'React, CSS', description: 'Build beautiful UIs.', postedBy: recruiter._id, status: 'Open' },

            // Mumbai (4 jobs)
            { title: 'Product Manager', company: 'FinTech Hub', location: 'Mumbai', type: 'Full-time', salary: '₹20L - ₹30L', requirements: 'Agile, Product Roadmap', description: 'Drive product vision.', postedBy: recruiter._id, status: 'Open' },
            { title: 'UI/UX Designer', company: 'Creative Labs', location: 'Mumbai', type: 'Part-time', salary: '₹8L - ₹12L', requirements: 'Figma, Adobe XD', description: 'Design user experiences.', postedBy: recruiter._id, status: 'Open' },
            { title: 'HR Manager', company: 'PeopleFirst', location: 'Mumbai', type: 'Part-time', salary: '₹10L - ₹15L', requirements: 'Recruitment, HR Policies', description: 'Manage talent.', postedBy: recruiter._id, status: 'Open' },
            { title: 'Financial Analyst', company: 'MoneyMatrix', location: 'Mumbai', type: 'Contract', salary: '₹15L - ₹20L', requirements: 'Finance, Excel', description: 'Analyze financial data.', postedBy: recruiter._id, status: 'Open' },

            // Delhi (4 jobs)
            { title: 'Full Stack Developer', company: 'EduTech Plus', location: 'Delhi', type: 'Full-time', salary: '₹10L - ₹15L', requirements: 'MERN Stack', description: 'Full stack development.', postedBy: recruiter._id, status: 'Open' },
            { title: 'Content Strategist', company: 'MediaWave', location: 'Delhi', type: 'Part-time', salary: '₹5L - ₹7L', requirements: 'Writing, SEO', description: 'Strategic content creation.', postedBy: recruiter._id, status: 'Open' },
            { title: 'Cybersecurity Specialist', company: 'SecureNet', location: 'Delhi', type: 'Contract', salary: '₹18L - ₹25L', requirements: 'Network Security', description: 'Secure our systems.', postedBy: recruiter._id, status: 'Open' },
            { title: 'Sales Executive', company: 'MarketGrow', location: 'Delhi', type: 'Contract', salary: '₹6L - ₹10L', requirements: 'Sales, Marketing', description: 'Drive sales growth.', postedBy: recruiter._id, status: 'Open' },

            // Remote (additional)
            { title: 'Customer Support Lead', company: 'GlobalAssist', location: 'Remote', type: 'Full-time', salary: '₹8L - ₹12L', requirements: 'Communication', description: 'Lead support team.', postedBy: recruiter._id, status: 'Open' },
            { title: 'Python Developer', company: 'AIBrain', location: 'Remote', type: 'Full-time', salary: '₹15L - ₹25L', requirements: 'Python, ML', description: 'Develop AI models.', postedBy: recruiter._id, status: 'Open' },
            { title: 'App Developer', company: 'MobileDev', location: 'Remote', type: 'Part-time', salary: '₹10L - ₹15L', requirements: 'React Native', description: 'Build mobile apps.', postedBy: recruiter._id, status: 'Open' },
            { title: 'Blockchain Engineer', company: 'CryptoCore', location: 'Remote', type: 'Contract', salary: '₹25L - ₹40L', requirements: 'Solidity, Web3', description: 'Develop on-chain.', postedBy: recruiter._id, status: 'Open' }
        ];

        await Job.insertMany(jobs);
        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
