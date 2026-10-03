const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/', companyController.getAll);
router.get('/:id', companyController.getById);
router.post('/', verifyToken, isAdmin, companyController.create);
router.put('/:id', verifyToken, isAdmin, companyController.update);
router.delete('/:id', verifyToken, isAdmin, companyController.delete);

module.exports = router;
