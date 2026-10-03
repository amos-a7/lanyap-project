const Category = require('../models/category.model');

const categoryController = {
    getJobCategories: async (req, res, next) => {
        try {
            const categories = await Category.findAllJobCategories();
            res.status(200).json({ success: true, message: 'Job categories fetched', data: categories });
        } catch (error) {
            next(error);
        }
    },
    getCourseCategories: async (req, res, next) => {
        try {
            const categories = await Category.findAllCourseCategories();
            res.status(200).json({ success: true, message: 'Course categories fetched', data: categories });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = categoryController;
