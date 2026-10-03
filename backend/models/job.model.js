const db = require('../config/database');

const Job = {
    findAll: async (filters = {}) => {
        let query = `
            SELECT j.*, c.name as company_name, c.logo as company_logo, cat.name as category_name 
            FROM jobs j
            JOIN companies c ON j.company_id = c.id
            JOIN job_categories cat ON j.category_id = cat.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.search) {
            query += ' AND (j.title LIKE ? OR j.description LIKE ?)';
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }
        if (filters.category_id) {
            query += ' AND j.category_id = ?';
            params.push(filters.category_id);
        }
        if (filters.type) {
            query += ' AND j.type = ?';
            params.push(filters.type);
        }
        if (filters.status) {
            query += ' AND j.status = ?';
            params.push(filters.status);
        }

        query += ' ORDER BY j.created_at DESC';

        const [rows] = await db.query(query, params);
        return rows;
    },
    findById: async (id) => {
        const query = `
            SELECT j.*, c.name as company_name, c.logo as company_logo, c.description as company_description, cat.name as category_name 
            FROM jobs j
            JOIN companies c ON j.company_id = c.id
            JOIN job_categories cat ON j.category_id = cat.id
            WHERE j.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    },
    create: async (jobData) => {
        const { company_id, category_id, title, description, requirements, salary_min, salary_max, location, type, status } = jobData;
        const [result] = await db.query(
            'INSERT INTO jobs (company_id, category_id, title, description, requirements, salary_min, salary_max, location, type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [company_id, category_id, title, description, requirements, salary_min, salary_max, location, type, status || 'active']
        );
        return result.insertId;
    },
    update: async (id, jobData) => {
        const { company_id, category_id, title, description, requirements, salary_min, salary_max, location, type, status } = jobData;
        await db.query(
            'UPDATE jobs SET company_id=?, category_id=?, title=?, description=?, requirements=?, salary_min=?, salary_max=?, location=?, type=?, status=? WHERE id=?',
            [company_id, category_id, title, description, requirements, salary_min, salary_max, location, type, status, id]
        );
    },
    delete: async (id) => {
        await db.query('DELETE FROM jobs WHERE id = ?', [id]);
    },
    countAll: async () => {
        const [rows] = await db.query('SELECT COUNT(*) as count FROM jobs WHERE status = "active"');
        return rows[0].count;
    }
};

module.exports = Job;
