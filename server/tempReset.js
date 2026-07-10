import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const userSchema = new mongoose.Schema({ password: { type: String } }, { strict: false });
const User = mongoose.model('User', userSchema);

async function runReset() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        for (let user of users) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash('password123', salt);
            await user.save();
        }
        console.log(`Successfully reset ${users.length} passwords to password123`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
runReset();
