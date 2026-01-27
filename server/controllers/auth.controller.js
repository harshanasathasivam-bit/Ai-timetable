const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (global.MOCK_MODE) {
        console.log('Mock Registration:', { name, email, role });
        const newUser = {
            _id: 'mock_user_id_' + Date.now(),
            name,
            email,
            password, // In a real app, hash this!
            role,
        };
        global.MOCK_USERS.push(newUser);

        return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token: 'mock_jwt_token_registered',
        });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, role });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (global.MOCK_MODE) {
        // Check hardcoded admin
        if (email === 'admin@example.com' && password === 'password123') {
            return res.json({
                _id: 'mock_admin_id',
                name: 'Mock Admin',
                email: 'admin@example.com',
                role: 'admin',
                token: 'mock_jwt_token',
            });
        }

        // Check registered mock users
        const mockUser = global.MOCK_USERS.find(u => u.email === email && u.password === password);
        if (mockUser) {
            return res.json({
                _id: mockUser._id,
                name: mockUser.name,
                email: mockUser.email,
                role: mockUser.role,
                token: 'mock_jwt_token_' + mockUser._id,
            });
        }

        return res.status(401).json({ message: 'Invalid email or password (Mock Mode)' });
    }

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
