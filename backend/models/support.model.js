const db = require('../config/database');

const Support = {
    findAll: async () => {
        const [rows] = await db.query(`
            SELECT s.*, u.name as user_name, u.email as user_email
            FROM support_messages s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.created_at DESC
        `);
        return rows;
    },
    findByUserId: async (userId) => {
        const [rows] = await db.query('SELECT * FROM support_messages WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    },
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM support_messages WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { user_id, subject, message } = data;
        const [result] = await db.query(
            'INSERT INTO support_messages (user_id, subject, message) VALUES (?, ?, ?)',
            [user_id, subject, message]
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const { reply, status } = data;
        await db.query(
            'UPDATE support_messages SET reply = ?, status = ? WHERE id = ?',
            [reply, status, id]
        );
    },
    delete: async (id) => {
        await db.query('DELETE FROM support_messages WHERE id = ?', [id]);
    }
};

module.exports = Support;
