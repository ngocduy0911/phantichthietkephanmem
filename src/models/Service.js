const db = require('../config/database');

class Service {
    // Lấy tất cả dịch vụ
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM services ORDER BY service_name');
        return rows;
    }

    // Lấy dịch vụ đang hoạt động
    static async getActive() {
        const [rows] = await db.query('SELECT * FROM services WHERE is_active = TRUE ORDER BY service_name');
        return rows;
    }

    // Lấy dịch vụ theo ID
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM services WHERE service_id = ?', [id]);
        return rows[0];
    }

    // Tạo dịch vụ mới
    static async create(serviceData) {
        const { service_name, description, price, unit } = serviceData;
        const [result] = await db.query(
            'INSERT INTO services (service_name, description, price, unit) VALUES (?, ?, ?, ?)',
            [service_name, description, price, unit || 'lần']
        );
        return result.insertId;
    }

    // Cập nhật dịch vụ
    static async update(id, serviceData) {
        const { service_name, description, price, unit, is_active } = serviceData;
        const [result] = await db.query(
            'UPDATE services SET service_name = ?, description = ?, price = ?, unit = ?, is_active = ? WHERE service_id = ?',
            [service_name, description, price, unit, is_active, id]
        );
        return result.affectedRows > 0;
    }

    // Xóa dịch vụ
    static async delete(id) {
        const [result] = await db.query('DELETE FROM services WHERE service_id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Service;
