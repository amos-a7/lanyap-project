const db = require('../config/database');

const Enrollment = {
    findByUserId: async (userId) => {
        const [rows] = await db.query(`
            SELECT e.*, c.title as course_title, c.image as course_image, c.instructor as course_instructor
            FROM course_enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = ?
            ORDER BY e.enrolled_at DESC
        `, [userId]);
        return rows;
    },
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM course_enrollments WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { user_id, course_id } = data;
        const [result] = await db.query(
            'INSERT INTO course_enrollments (user_id, course_id) VALUES (?, ?)',
            [user_id, course_id]
        );
        // increment total_students
        await db.query('UPDATE courses SET total_students = total_students + 1 WHERE id = ?', [course_id]);
        return result.insertId;
    },
    update: async (id, data) => {
        const { progress, status } = data;
        let query = 'UPDATE course_enrollments SET progress = ?, status = ?';
        const params = [progress, status];
        
        if (status === 'completed') {
            query += ', completed_at = CURRENT_TIMESTAMP';
        }
        query += ' WHERE id = ?';
        params.push(id);
        
        await db.query(query, params);
    },
    delete: async (id) => {
        const enrollment = await Enrollment.findById(id);
        if (enrollment) {
            await db.query('DELETE FROM course_enrollments WHERE id = ?', [id]);
            await db.query('UPDATE courses SET total_students = GREATEST(total_students - 1, 0) WHERE id = ?', [enrollment.course_id]);
        }
    },
    checkExisting: async (userId, courseId) => {
        const [rows] = await db.query('SELECT id FROM course_enrollments WHERE user_id = ? AND course_id = ?', [userId, courseId]);
        return rows.length > 0;
    }
};

module.exports = Enrollment;
