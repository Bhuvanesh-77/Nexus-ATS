import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, role, companyName } = req.body;
        console.log("Registration attempt:", req.body);

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            companyName: role === 'recruiter' ? companyName : undefined
        });

        if (user) {
            const token = generateToken(user._id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                savedJobs: [],
                token // Keeping token in response for flexibility (optional if using cookies only)
            });
        } else {
            console.error("User creation failed. Data passed:", { name, email, role, companyName });
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Full Registration Error:", error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password').populate('savedJobs', 'title company location salary type');

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                savedJobs: user.savedJobs,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('savedJobs', 'title company location salary type');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Save a job
// @route   PUT /api/auth/save-job/:jobId
// @access  Private (Candidate)
export const saveJob = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const jobId = req.params.jobId;

        // Use some() with toString() for robust comparison
        const isAlreadySaved = (user.savedJobs || []).some(id => id.toString() === jobId);

        if (!isAlreadySaved) {
            if (!user.savedJobs) user.savedJobs = [];
            user.savedJobs.push(jobId);
            await user.save();
        }

        // Return fully populated saved jobs
        const updatedUser = await User.findById(req.user.id).populate('savedJobs', 'title company location salary type');
        res.json(updatedUser.savedJobs);
    } catch (error) {
        console.error("Save Job Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Unsave a job
// @route   PUT /api/auth/unsave-job/:jobId
// @access  Private (Candidate)
export const unsaveJob = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const jobId = req.params.jobId;

        user.savedJobs = (user.savedJobs || []).filter(id => id.toString() !== jobId);
        await user.save();

        // Return fully populated saved jobs
        const updatedUser = await User.findById(req.user.id).populate('savedJobs', 'title company location salary type');
        res.json(updatedUser.savedJobs);
    } catch (error) {
        console.error("Unsave Job Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user skills
// @route   PUT /api/auth/skills
// @access  Private
export const updateSkills = async (req, res) => {
    try {
        const { skills } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { skills }, { new: true });
        res.json(user.skills);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
