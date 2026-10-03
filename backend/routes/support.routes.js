const express = require('express');
const router = express.Router();
const supportController = require('../controllers/support.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, supportController.getAll);
router.post('/', verifyToken, supportController.create);
router.put('/:id', verifyToken, supportController.update);
router.delete('/:id', verifyToken, supportController.delete);

module.exports = router;
