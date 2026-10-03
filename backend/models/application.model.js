const db = require('../config/database');

const Application = {
    findAll: async () => {
        const [rows] = await db.query(`
            SELECT a.*, u.name as user_name, u.email as user_email, j.title as job_title, c.name as company_name
            FROM job_applications a
            JOIN users u ON a.user_id = u.id
            JOIN jobs j ON a.job_id = j.id
            JOIN companies c ON j.company_id = c.id
            ORDER BY a.created_at DESC
        `);
        return rows;
    },
    findByUserId: async (userId) => {
        const [rows] = await db.query(`
            SELECT a.*, j.title as job_title, j.location as job_location, c.name as company_name, c.logo as company_logo
            FROM job_applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN companies c ON j.company_id = c.id
            WHERE a.user_id = ?
            ORDER BY a.created_at DESC
        `, [userId]);
        return rows;
    },
    findByJobId: async (jobId) => {
        const [rows] = await db.query(`
            SELECT a.*, u.name as user_name, u.email as user_email, u.cv_url as user_cv
            FROM job_applications a
            JOIN users u ON a.user_id = u.id
            WHERE a.job_id = ?
            ORDER BY a.created_at DESC
        `, [jobId]);
        return rows;
    },
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM job_applications WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { user_id, job_id, cover_letter, cv_url } = data;
        const [result] = await db.query(
            'INSERT INTO job_applications (user_id, job_id, cover_letter, cv_url) VALUES (?, ?, ?, ?)',
            [user_id, job_id, cover_letter, cv_url]
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const { status } = data;
        await db.query('UPDATE job_applications SET status = ? WHERE id = ?', [status, id]);
    },
    delete: async (id) => {
        await db.query('DELETE FROM job_applications WHERE id = ?', [id]);
    },
    checkExisting: async (userId, jobId) => {
        const [rows] = await db.query('SELECT id FROM job_applications WHERE user_id = ? AND job_id = ?', [userId, jobId]);
        return rows.length > 0;
    }
};

module.exports = Application;
