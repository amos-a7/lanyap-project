const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, applicationController.getAll);
router.post('/', verifyToken, applicationController.create);
router.put('/:id', verifyToken, applicationController.update);
router.delete('/:id', verifyToken, applicationController.delete);

module.exports = router;
