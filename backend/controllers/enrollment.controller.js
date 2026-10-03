const Enrollment = require('../models/enrollment.model');

const enrollmentController = {
    getAll: async (req, res, next) => {
        try {
            const enrollments = await Enrollment.findByUserId(req.user.id);
            res.status(200).json({ success: true, message: 'Enrollments fetched', data: enrollments });
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const { course_id } = req.body;
            const exists = await Enrollment.checkExisting(req.user.id, course_id);
            if (exists) {
                return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
            }
            
            const id = await Enrollment.create({ user_id: req.user.id, course_id });
            res.status(201).json({ success: true, message: 'Enrolled successfully', data: { id } });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const enrollment = await Enrollment.findById(req.params.id);
            if (!enrollment || enrollment.user_id !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }
            await Enrollment.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Enrollment updated' });
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const enrollment = await Enrollment.findById(req.params.id);
            if (!enrollment || enrollment.user_id !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }
            await Enrollment.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Enrollment deleted' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = enrollmentController;
