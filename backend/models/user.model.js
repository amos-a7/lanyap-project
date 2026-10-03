const db = require('../config/database');

const User = {
    findAll: async () => {
        const [rows] = await db.query('SELECT id, name, email, phone, address, avatar, bio, skills, cv_url, role, created_at, updated_at FROM users');
        return rows;
    },
    findById: async (id) => {
        const [rows] = await db.query('SELECT id, name, email, phone, address, avatar, bio, skills, cv_url, role, created_at, updated_at FROM users WHERE id = ?', [id]);
        return rows[0];
    },
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },
    create: async (userData) => {
        const { name, email, password, phone, role } = userData;
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, password, phone || null, role || 'user']
        );
        return result.insertId;
    },
    update: async (id, userData) => {
        // Use COALESCE to only update fields that are provided
        const { name, phone, address, avatar, bio, skills, cv_url } = userData;
        await db.query(
            `UPDATE users SET 
                name = COALESCE(?, name), 
                phone = COALESCE(?, phone), 
                address = COALESCE(?, address), 
                avatar = COALESCE(?, avatar), 
                bio = COALESCE(?, bio), 
                skills = COALESCE(?, skills), 
                cv_url = COALESCE(?, cv_url) 
            WHERE id = ?`,
            [name || null, phone || null, address || null, avatar || null, bio || null, skills || null, cv_url || null, id]
        );
    },
    delete: async (id) => {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
    }
};

module.exports = User;
