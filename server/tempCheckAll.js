import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Job from './models/Job.js';
import Application from './models/Application.js';

dotenv.config();

const checkAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB!');
        const users = await User.find();
        console.log('\n👥 Users (', users.length, '):');
        users.forEach(u => console.log('  -', u.email, u.role));
        
        const jobs = await Job.find();
        console.log('\n💼 Jobs (', jobs.length, '):');
        jobs.slice(0, 5).forEach(j => console.log('  -', j.title, j.company));
        console.log('  ... and', jobs.length -5, 'more');
        
        const apps = await Application.find().populate('job').populate('candidate');
        console.log('\n📝 Applications (', apps.length, '):');
        apps.forEach(a => console.log('  -', a.candidate?.name, '→', a.job?.title, '|', a.status));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
checkAll();