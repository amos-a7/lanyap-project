const Application = require('../models/application.model');

const applicationController = {
    getAll: async (req, res, next) => {
        try {
            // Admin can see all, user sees their own
            if (req.user.role === 'admin') {
                const applications = await Application.findAll();
                return res.status(200).json({ success: true, message: 'Applications fetched', data: applications });
            } else {
                const applications = await Application.findByUserId(req.user.id);
                return res.status(200).json({ success: true, message: 'Applications fetched', data: applications });
            }
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const { job_id, cover_letter, cv_url } = req.body;
            const exists = await Application.checkExisting(req.user.id, job_id);
            if (exists) {
                return res.status(400).json({ success: false, message: 'You have already applied for this job' });
            }
            
            const id = await Application.create({ user_id: req.user.id, job_id, cover_letter, cv_url });
            res.status(201).json({ success: true, message: 'Application submitted', data: { id } });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }
            await Application.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Application updated' });
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const app = await Application.findById(req.params.id);
            if (!app) return res.status(404).json({ success: false, message: 'Not found' });
            if (app.user_id !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }
            await Application.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Application deleted' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = applicationController;
