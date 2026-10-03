const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/jobs', require('./job.routes'));
router.use('/companies', require('./company.routes'));
router.use('/courses', require('./course.routes'));
router.use('/applications', require('./application.routes'));
router.use('/enrollments', require('./enrollment.routes'));
router.use('/categories', require('./category.routes'));
router.use('/support', require('./support.routes'));
router.use('/dashboard', require('./dashboard.routes'));

module.exports = router;
