const db = require('../config/database');

class RoomType {
    // Lấy tất cả loại phòng
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM room_types ORDER BY base_price');
        return rows;
    }

    // Lấy loại phòng theo ID
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM room_types WHERE type_id = ?', [id]);
        return rows[0];
    }

    // Tạo loại phòng mới
    static async create(typeData) {
        const { type_name, description, base_price, max_occupancy } = typeData;
        const [result] = await db.query(
            'INSERT INTO room_types (type_name, description, base_price, max_occupancy) VALUES (?, ?, ?, ?)',
            [type_name, description, base_price, max_occupancy]
        );
        return result.insertId;
    }

    // Cập nhật loại phòng
    static async update(id, typeData) {
        const { type_name, description, base_price, max_occupancy } = typeData;
        const [result] = await db.query(
            'UPDATE room_types SET type_name = ?, description = ?, base_price = ?, max_occupancy = ? WHERE type_id = ?',
            [type_name, description, base_price, max_occupancy, id]
        );
        return result.affectedRows > 0;
    }

    // Xóa loại phòng
    static async delete(id) {
        const [result] = await db.query('DELETE FROM room_types WHERE type_id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = RoomType;
