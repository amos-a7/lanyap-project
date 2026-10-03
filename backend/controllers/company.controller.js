const Company = require('../models/company.model');

const companyController = {
    getAll: async (req, res, next) => {
        try {
            const companies = await Company.findAll();
            res.status(200).json({ success: true, message: 'Companies fetched', data: companies });
        } catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const company = await Company.findById(req.params.id);
            if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
            res.status(200).json({ success: true, message: 'Company fetched', data: company });
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const id = await Company.create(req.body);
            res.status(201).json({ success: true, message: 'Company created', data: { id } });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            await Company.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Company updated' });
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            await Company.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Company deleted' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = companyController;
