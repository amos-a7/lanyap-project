const Course = require('../models/course.model');

const courseController = {
    getAll: async (req, res, next) => {
        try {
            const courses = await Course.findAll(req.query);
            res.status(200).json({ success: true, message: 'Courses fetched', data: courses });
        } catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const course = await Course.findById(req.params.id);
            if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
            res.status(200).json({ success: true, message: 'Course fetched', data: course });
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const id = await Course.create(req.body);
            res.status(201).json({ success: true, message: 'Course created', data: { id } });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            await Course.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Course updated' });
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            await Course.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Course deleted' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = courseController;
