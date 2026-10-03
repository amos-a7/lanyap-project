const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/', jobController.getAll);
router.get('/:id', jobController.getById);
router.post('/', verifyToken, isAdmin, jobController.create);
router.put('/:id', verifyToken, isAdmin, jobController.update);
router.delete('/:id', verifyToken, isAdmin, jobController.delete);

module.exports = router;
