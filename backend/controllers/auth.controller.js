const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    register: async (req, res, next) => {
        try {
            const { name, email, password, phone } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi' });
            }

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email sudah terdaftar, silakan gunakan email lain' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const userId = await User.create({ name, email, password: hashedPassword, phone });
            
            const token = jwt.sign({ id: userId, name, role: 'user' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: { token, user: { id: userId, name, email, role: 'user' } }
            });
        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password required' });
            }

            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
            });
        } catch (error) {
            next(error);
        }
    },
    getProfile: async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });
            res.status(200).json({ success: true, message: 'Profile fetched', data: user });
        } catch (error) {
            next(error);
        }
    },
    updateProfile: async (req, res, next) => {
        try {
            await User.update(req.user.id, req.body);
            res.status(200).json({ success: true, message: 'Profile updated successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;
