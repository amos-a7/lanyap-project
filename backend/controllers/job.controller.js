const Job = require('../models/job.model');

const jobController = {
    getAll: async (req, res, next) => {
        try {
            const jobs = await Job.findAll(req.query);
            res.status(200).json({ success: true, message: 'Jobs fetched', data: jobs });
        } catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const job = await Job.findById(req.params.id);
            if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
            res.status(200).json({ success: true, message: 'Job fetched', data: job });
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const id = await Job.create(req.body);
            res.status(201).json({ success: true, message: 'Job created', data: { id } });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            await Job.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Job updated' });
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            await Job.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Job deleted' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = jobController;
