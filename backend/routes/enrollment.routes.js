const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, enrollmentController.getAll);
router.post('/', verifyToken, enrollmentController.create);
router.put('/:id', verifyToken, enrollmentController.update);
router.delete('/:id', verifyToken, enrollmentController.delete);

module.exports = router;
