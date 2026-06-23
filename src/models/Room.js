const db = require('../config/database');

class Room {
    // Lấy tất cả phòng với thông tin loại phòng
    static async getAll() {
        const [rows] = await db.query(`
            SELECT r.*, rt.type_name, rt.base_price, rt.max_occupancy
            FROM rooms r
            JOIN room_types rt ON r.type_id = rt.type_id
            ORDER BY r.room_number
        `);
        return rows;
    }

    // Lấy phòng theo ID
    static async getById(id) {
        const [rows] = await db.query(`
            SELECT r.*, rt.type_name, rt.base_price, rt.max_occupancy, rt.description as type_description
            FROM rooms r
            JOIN room_types rt ON r.type_id = rt.type_id
            WHERE r.room_id = ?
        `, [id]);
        return rows[0];
    }

    // Lấy phòng theo số phòng
    static async getByRoomNumber(roomNumber) {
        const [rows] = await db.query(`
            SELECT r.*, rt.type_name, rt.base_price, rt.max_occupancy
            FROM rooms r
            JOIN room_types rt ON r.type_id = rt.type_id
            WHERE r.room_number = ?
        `, [roomNumber]);
        return rows[0];
    }

    // Lấy phòng theo trạng thái
    static async getByStatus(status) {
        const [rows] = await db.query(`
            SELECT r.*, rt.type_name, rt.base_price, rt.max_occupancy
            FROM rooms r
            JOIN room_types rt ON r.type_id = rt.type_id
            WHERE r.status = ?
            ORDER BY r.room_number
        `, [status]);
        return rows;
    }

    // Lấy phòng trống trong khoảng thời gian
    static async getAvailableRooms(checkInDate, checkOutDate) {
        const [rows] = await db.query(`
            SELECT r.*, rt.type_name, rt.base_price, rt.max_occupancy
            FROM rooms r
            JOIN room_types rt ON r.type_id = rt.type_id
            WHERE r.status = 'available'
            AND r.room_id NOT IN (
                SELECT room_id FROM bookings
                WHERE status IN ('confirmed', 'checked_in')
                AND (
                    (check_in_date <= ? AND check_out_date > ?) OR
                    (check_in_date < ? AND check_out_date >= ?) OR
                    (check_in_date >= ? AND check_out_date <= ?)
                )
            )
            ORDER BY r.room_number
        `, [checkInDate, checkInDate, checkOutDate, checkOutDate, checkInDate, checkOutDate]);
        return rows;
    }

    // Tạo phòng mới
    static async create(roomData) {
        const { room_number, type_id, floor, description } = roomData;
        const [result] = await db.query(
            'INSERT INTO rooms (room_number, type_id, floor, description) VALUES (?, ?, ?, ?)',
            [room_number, type_id, floor, description]
        );
        return result.insertId;
    }

    // Cập nhật phòng
    static async update(id, roomData) {
        const { room_number, type_id, floor, status, description } = roomData;
        const [result] = await db.query(
            'UPDATE rooms SET room_number = ?, type_id = ?, floor = ?, status = ?, description = ? WHERE room_id = ?',
            [room_number, type_id, floor, status, description, id]
        );
        return result.affectedRows > 0;
    }

    // Cập nhật trạng thái phòng
    static async updateStatus(id, status) {
        const [result] = await db.query('UPDATE rooms SET status = ? WHERE room_id = ?', [status, id]);
        return result.affectedRows > 0;
    }

    // Xóa phòng
    static async delete(id) {
        const [result] = await db.query('DELETE FROM rooms WHERE room_id = ?', [id]);
        return result.affectedRows > 0;
    }

    // Thống kê phòng theo trạng thái
    static async getStatsByStatus() {
        const [rows] = await db.query(`
            SELECT status, COUNT(*) as count
            FROM rooms
            GROUP BY status
        `);
        return rows;
    }
}

module.exports = Room;
