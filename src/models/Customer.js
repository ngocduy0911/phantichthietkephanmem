const db = require('../config/database');

class Customer {
    // Lấy tất cả khách hàng
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM customers ORDER BY created_at DESC');
        return rows;
    }

    // Lấy khách hàng theo ID
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM customers WHERE customer_id = ?', [id]);
        return rows[0];
    }

    // Lấy khách hàng theo CMND/CCCD
    static async getByIdCard(idCard) {
        const [rows] = await db.query('SELECT * FROM customers WHERE id_card = ?', [idCard]);
        return rows[0];
    }

    // Tìm kiếm khách hàng
    static async search(keyword) {
        const searchTerm = `%${keyword}%`;
        const [rows] = await db.query(`
            SELECT * FROM customers
            WHERE full_name LIKE ? OR id_card LIKE ? OR phone LIKE ? OR email LIKE ?
            ORDER BY created_at DESC
        `, [searchTerm, searchTerm, searchTerm, searchTerm]);
        return rows;
    }

    // Tạo khách hàng mới
    static async create(customerData) {
        const { full_name, id_card, phone, email, address, date_of_birth, nationality } = customerData;
        const [result] = await db.query(
            'INSERT INTO customers (full_name, id_card, phone, email, address, date_of_birth, nationality) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [full_name, id_card, phone, email, address, date_of_birth, nationality || 'Vietnam']
        );
        return result.insertId;
    }

    // Cập nhật khách hàng
    static async update(id, customerData) {
        const { full_name, id_card, phone, email, address, date_of_birth, nationality } = customerData;
        const [result] = await db.query(
            'UPDATE customers SET full_name = ?, id_card = ?, phone = ?, email = ?, address = ?, date_of_birth = ?, nationality = ? WHERE customer_id = ?',
            [full_name, id_card, phone, email, address, date_of_birth, nationality, id]
        );
        return result.affectedRows > 0;
    }

    // Xóa khách hàng
    static async delete(id) {
        const [result] = await db.query('DELETE FROM customers WHERE customer_id = ?', [id]);
        return result.affectedRows > 0;
    }

    // Lấy lịch sử đặt phòng của khách hàng
    static async getBookingHistory(customerId) {
        const [rows] = await db.query(`
            SELECT b.*, r.room_number, rt.type_name
            FROM bookings b
            JOIN rooms r ON b.room_id = r.room_id
            JOIN room_types rt ON r.type_id = rt.type_id
            WHERE b.customer_id = ?
            ORDER BY b.booking_date DESC
        `, [customerId]);
        return rows;
    }
}

module.exports = Customer;
