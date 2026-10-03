const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.get('/jobs', categoryController.getJobCategories);
router.get('/courses', categoryController.getCourseCategories);

module.exports = router;
