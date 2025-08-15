import { User } from '../models/user.js';
import passport from 'passport';

export const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Creating user:', email);
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        
        // Create new user
        const user = new User({ email });
        user.setPassword(password);
        await user.save();
        
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

export const loginUser = async (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Authentication error' });
        }
        
        if (!user) {
            return res.status(401).json({ message: info.message || 'Invalid email or password' });
        }
        
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Login error' });
            }
            return res.status(200).json(user);
        });
    })(req, res);
};

export const logoutUser = async (req, res) => {
    req.logout();
    res.status(200).json({ message: 'Logged out successfully' });
};