const Support = require('../models/support.model');

const supportController = {
    getAll: async (req, res, next) => {
        try {
            if (req.user.role === 'admin') {
                const messages = await Support.findAll();
                return res.status(200).json({ success: true, message: 'Messages fetched', data: messages });
            } else {
                const messages = await Support.findByUserId(req.user.id);
                return res.status(200).json({ success: true, message: 'Messages fetched', data: messages });
            }
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const { subject, message } = req.body;
            const id = await Support.create({ user_id: req.user.id, subject, message });
            res.status(201).json({ success: true, message: 'Message sent', data: { id } });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }
            await Support.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Message updated' });
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const msg = await Support.findById(req.params.id);
            if (!msg) return res.status(404).json({ success: false, message: 'Not found' });
            if (msg.user_id !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }
            await Support.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Message deleted' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = supportController;
