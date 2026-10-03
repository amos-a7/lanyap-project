const db = require('../config/database');

const Course = {
    findAll: async (filters = {}) => {
        let query = `
            SELECT c.*, cat.name as category_name 
            FROM courses c
            JOIN course_categories cat ON c.category_id = cat.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.search) {
            query += ' AND (c.title LIKE ? OR c.description LIKE ?)';
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }
        if (filters.category_id) {
            query += ' AND c.category_id = ?';
            params.push(filters.category_id);
        }
        if (filters.level) {
            query += ' AND c.level = ?';
            params.push(filters.level);
        }

        query += ' ORDER BY c.created_at DESC';

        const [rows] = await db.query(query, params);
        return rows;
    },
    findById: async (id) => {
        const query = `
            SELECT c.*, cat.name as category_name 
            FROM courses c
            JOIN course_categories cat ON c.category_id = cat.id
            WHERE c.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    },
    create: async (data) => {
        const { category_id, title, description, instructor, duration, level, price, image, status } = data;
        const [result] = await db.query(
            'INSERT INTO courses (category_id, title, description, instructor, duration, level, price, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [category_id, title, description, instructor, duration, level, price, image, status || 'active']
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const { category_id, title, description, instructor, duration, level, price, image, status } = data;
        await db.query(
            'UPDATE courses SET category_id=?, title=?, description=?, instructor=?, duration=?, level=?, price=?, image=?, status=? WHERE id=?',
            [category_id, title, description, instructor, duration, level, price, image, status, id]
        );
    },
    delete: async (id) => {
        await db.query('DELETE FROM courses WHERE id = ?', [id]);
    }
};

module.exports = Course;
