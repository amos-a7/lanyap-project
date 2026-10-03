const db = require('../config/database');

const Company = {
    findAll: async () => {
        const [rows] = await db.query('SELECT * FROM companies ORDER BY name ASC');
        return rows;
    },
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM companies WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { name, logo, description, location, website, industry } = data;
        const [result] = await db.query(
            'INSERT INTO companies (name, logo, description, location, website, industry) VALUES (?, ?, ?, ?, ?, ?)',
            [name, logo, description, location, website, industry]
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const { name, logo, description, location, website, industry } = data;
        await db.query(
            'UPDATE companies SET name=?, logo=?, description=?, location=?, website=?, industry=? WHERE id=?',
            [name, logo, description, location, website, industry, id]
        );
    },
    delete: async (id) => {
        await db.query('DELETE FROM companies WHERE id = ?', [id]);
    }
};

module.exports = Company;
