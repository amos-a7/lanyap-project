const db = require('../config/database');

const dashboardController = {
    getStats: async (req, res, next) => {
        try {
            const [jobs] = await db.query('SELECT COUNT(*) as count FROM jobs WHERE status = "active"');
            const [courses] = await db.query('SELECT COUNT(*) as count FROM courses WHERE status = "active"');
            const [users] = await db.query('SELECT COUNT(*) as count FROM users');
            const [applications] = await db.query('SELECT COUNT(*) as count FROM job_applications');

            res.status(200).json({
                success: true,
                message: 'Dashboard stats fetched',
                data: {
                    totalJobs: jobs[0].count,
                    totalCourses: courses[0].count,
                    totalUsers: users[0].count,
                    totalApplications: applications[0].count
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = dashboardController;
