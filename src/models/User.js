const db = require('../config/database');

class User {
    // Lấy tất cả users
    static async getAll() {
        const [rows] = await db.query('SELECT user_id, username, full_name, email, phone, role, is_active, created_at FROM users ORDER BY created_at DESC');
        return rows;
    }

    // Lấy user theo ID
    static async getById(id) {
        const [rows] = await db.query('SELECT user_id, username, full_name, email, phone, role, is_active, created_at FROM users WHERE user_id = ?', [id]);
        return rows[0];
    }

    // Lấy user theo username
    static async getByUsername(username) {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    // Tạo user mới
    static async create(userData) {
        const { username, password, full_name, email, phone, role } = userData;
        const [result] = await db.query(
            'INSERT INTO users (username, password, full_name, email, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
            [username, password, full_name, email, phone, role || 'receptionist']
        );
        return result.insertId;
    }

    // Cập nhật user
    static async update(id, userData) {
        const { full_name, email, phone, role, is_active } = userData;
        const [result] = await db.query(
            'UPDATE users SET full_name = ?, email = ?, phone = ?, role = ?, is_active = ? WHERE user_id = ?',
            [full_name, email, phone, role, is_active, id]
        );
        return result.affectedRows > 0;
    }

    // Xóa user (soft delete - đặt is_active = false)
    static async delete(id) {
        const [result] = await db.query('UPDATE users SET is_active = FALSE WHERE user_id = ?', [id]);
        return result.affectedRows > 0;
    }

    // Đổi mật khẩu
    static async changePassword(id, newPassword) {
        const [result] = await db.query('UPDATE users SET password = ? WHERE user_id = ?', [newPassword, id]);
        return result.affectedRows > 0;
    }
}

module.exports = User;
