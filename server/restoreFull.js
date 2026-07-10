import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';
import User from './models/User.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB for fresh data setup!');

        // Clear existing data
        await Promise.all([
            Job.deleteMany(),
            User.deleteMany()
        ]);
        console.log('🧹 Cleared all existing data!');

        // Create Recruiter (main user who posts jobs)
        const recruiter = await User.create({
            name: 'Sarah Johnson',
            email: 'sarah.j@techhire.com',
            password: 'password123',
            role: 'recruiter',
            companyName: 'TechHire Solutions'
        });
        console.log('👤 Recruiter created:', recruiter.email);

        // Create 3 Unique Candidates
        const candidate1 = await User.create({
            name: 'Amit Patel',
            email: 'amit.patel@email.com',
            password: 'password123',
            role: 'candidate',
            skills: ['React', 'Node.js', 'MongoDB', 'AWS']
        });

        const candidate2 = await User.create({
            name: 'Emily Chen',
            email: 'emily.chen@email.com',
            password: 'password123',
            role: 'candidate',
            skills: ['Python', 'Django', 'Machine Learning', 'SQL']
        });

        const candidate3 = await User.create({
            name: 'Michael Rodriguez',
            email: 'michael.rodriguez@email.com',
            password: 'password123',
            role: 'candidate',
            skills: ['Java', 'Spring Boot', 'Kubernetes', 'Docker']
        });
        console.log('👥 Candidates created!');

        // Create ALL Jobs (5 detailed + 14 varied)
        const jobs = await Job.insertMany([
            // Detailed Jobs (Original Fresh Ones)
            {
                title: 'Full Stack Engineer',
                description: 'Build scalable web applications using React and Node.js. Work on real-time features and high-performance APIs.',
                company: 'TechHire Solutions',
                location: 'San Francisco, CA',
                type: 'Full-time',
                requirements: '3+ years React, Node.js experience; knowledge of AWS',
                salary: '$130,000 - $170,000',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Data Scientist (ML)',
                description: 'Develop predictive models and analyze large datasets using Python and TensorFlow.',
                company: 'DataInsight Labs',
                location: 'New York, NY',
                type: 'Full-time',
                requirements: 'MS/PhD in CS/Stats; experience with ML frameworks',
                salary: '$140,000 - $190,000',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'DevOps Engineer',
                description: 'Manage cloud infrastructure using Kubernetes, Docker, and CI/CD pipelines.',
                company: 'CloudScale Systems',
                location: 'Remote',
                type: 'Contract',
                requirements: 'Experience with Kubernetes, AWS, Jenkins',
                salary: '$120,000 - $150,000',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Frontend Developer (React)',
                description: 'Create beautiful, responsive user interfaces with React and Tailwind CSS.',
                company: 'DesignCraft Inc',
                location: 'Austin, TX',
                type: 'Part-time',
                requirements: 'Expert in React, modern CSS, responsive design',
                salary: '$75,000 - $95,000',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Backend Developer (Java)',
                description: 'Build enterprise-grade backend systems using Spring Boot and microservices.',
                company: 'EnterpriseTech Corp',
                location: 'Chicago, IL',
                type: 'Full-time',
                requirements: '5+ years Java/Spring experience; microservices knowledge',
                salary: '$125,000 - $165,000',
                postedBy: recruiter._id,
                status: 'Open'
            },
            // Extra Varied Jobs (From Original Seed)
            {
                title: 'Senior Frontend Engineer',
                description: 'Lead the UI/UX evolution of our flagship analytics dashboard. Focus on performance, accessibility, and modern React patterns.',
                company: 'Designly Creative Labs',
                location: 'Manhattan, NY',
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
            {
                title: 'Backend Developer',
                description: 'Build scalable APIs.',
                company: 'TechBase',
                location: 'Bangalore',
                type: 'Full-time',
                salary: '₹12L - ₹18L',
                requirements: 'Node.js, MongoDB',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'DevOps Engineer',
                description: 'Manage infrastructure.',
                company: 'CloudWorks',
                location: 'Bangalore',
                type: 'Full-time',
                salary: '₹15L - ₹22L',
                requirements: 'AWS, Docker, K8s',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Frontend Developer',
                description: 'Build beautiful UIs.',
                company: 'UI Masters',
                location: 'Bangalore',
                type: 'Part-time',
                salary: '₹6L - ₹8L',
                requirements: 'React, CSS',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Product Manager',
                description: 'Drive product vision.',
                company: 'FinTech Hub',
                location: 'Mumbai',
                type: 'Full-time',
                salary: '₹20L - ₹30L',
                requirements: 'Agile, Product Roadmap',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'UI/UX Designer',
                description: 'Design user experiences.',
                company: 'Creative Labs',
                location: 'Mumbai',
                type: 'Part-time',
                salary: '₹8L - ₹12L',
                requirements: 'Figma, Adobe XD',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'HR Manager',
                description: 'Manage talent.',
                company: 'PeopleFirst',
                location: 'Mumbai',
                type: 'Part-time',
                salary: '₹10L - ₹15L',
                requirements: 'Recruitment, HR Policies',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Financial Analyst',
                description: 'Analyze financial data.',
                company: 'MoneyMatrix',
                location: 'Mumbai',
                type: 'Contract',
                salary: '₹15L - ₹20L',
                requirements: 'Finance, Excel',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Content Strategist',
                description: 'Strategic content creation.',
                company: 'MediaWave',
                location: 'Delhi',
                type: 'Part-time',
                salary: '₹5L - ₹7L',
                requirements: 'Writing, SEO',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Cybersecurity Specialist',
                description: 'Secure our systems.',
                company: 'SecureNet',
                location: 'Delhi',
                type: 'Contract',
                salary: '₹18L - ₹25L',
                requirements: 'Network Security',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Sales Executive',
                description: 'Drive sales growth.',
                company: 'MarketGrow',
                location: 'Delhi',
                type: 'Contract',
                salary: '₹6L - ₹10L',
                requirements: 'Sales, Marketing',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Customer Support Lead',
                description: 'Lead support team.',
                company: 'GlobalAssist',
                location: 'Remote',
                type: 'Full-time',
                salary: '₹8L - ₹12L',
                requirements: 'Communication',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Python Developer',
                description: 'Develop AI models.',
                company: 'AIBrain',
                location: 'Remote',
                type: 'Full-time',
                salary: '₹15L - ₹25L',
                requirements: 'Python, ML',
                postedBy: recruiter._id,
                status: 'Open'
            },
            {
                title: 'Blockchain Engineer',
                description: 'Develop on-chain.',
                company: 'CryptoCore',
                location: 'Remote',
                type: 'Contract',
                salary: '₹25L - ₹40L',
                requirements: 'Solidity, Web3',
                postedBy: recruiter._id,
                status: 'Open'
            }
        ]);
        console.log('💼 19 Jobs created! (5 detailed + 14 varied)');

        console.log('\n🎉 Complete data setup done!');
        console.log('\n📋 Login Credentials:');
        console.log('  Recruiter: sarah.j@techhire.com / password123');
        console.log('  Candidate 1: amit.patel@email.com / password123');
        console.log('  Candidate 2: emily.chen@email.com / password123');
        console.log('  Candidate 3: michael.rodriguez@email.com / password123');

        process.exit();
    } catch (error) {
        console.error('❌ Complete data setup failed:', error);
        process.exit(1);
    }
};

seedData();
