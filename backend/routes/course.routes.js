const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/', courseController.getAll);
router.get('/:id', courseController.getById);
router.post('/', verifyToken, isAdmin, courseController.create);
router.put('/:id', verifyToken, isAdmin, courseController.update);
router.delete('/:id', verifyToken, isAdmin, courseController.delete);

module.exports = router;
