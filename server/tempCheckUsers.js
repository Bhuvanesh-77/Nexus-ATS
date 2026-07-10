import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');
        const users = await User.find();
        console.log('All Users Found:', users.length);
        for (let u of users) {
            console.log('-', u.email, u.role);
        }
        
        // Try to get recruiter with password
        const recruiter = await User.findOne({ email: 'recruiter@example.com' }).select('+password');
        if (recruiter) {
            console.log('\nRecruiter password hash:', recruiter.password);
            const match = await recruiter.matchPassword('password123');
            console.log('Password "password123" matches:', match);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
checkUsers();