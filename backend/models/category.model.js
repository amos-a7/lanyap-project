const db = require('../config/database');

const Category = {
    findAllJobCategories: async () => {
        const [rows] = await db.query('SELECT * FROM job_categories ORDER BY name ASC');
        return rows;
    },
    findAllCourseCategories: async () => {
        const [rows] = await db.query('SELECT * FROM course_categories ORDER BY name ASC');
        return rows;
    }
};

module.exports = Category;
