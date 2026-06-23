const db = require('../config/database');

class Booking {
    // Lấy tất cả bookings
    static async getAll() {
        const [rows] = await db.query(`
            SELECT b.*, c.full_name, c.phone, c.id_card,
                   r.room_number, rt.type_name, rt.base_price,
                   u.full_name as created_by_name
            FROM bookings b
            JOIN customers c ON b.customer_id = c.customer_id
            JOIN rooms r ON b.room_id = r.room_id
            JOIN room_types rt ON r.type_id = rt.type_id
            JOIN users u ON b.user_id = u.user_id
            ORDER BY b.booking_date DESC
        `);
        return rows;
    }

    // Lấy booking theo ID
    static async getById(id) {
        const [rows] = await db.query(`
            SELECT b.*, c.full_name, c.phone, c.id_card, c.email,
                   r.room_number, rt.type_name, rt.base_price,
                   u.full_name as created_by_name
            FROM bookings b
            JOIN customers c ON b.customer_id = c.customer_id
            JOIN rooms r ON b.room_id = r.room_id
            JOIN room_types rt ON r.type_id = rt.type_id
            JOIN users u ON b.user_id = u.user_id
            WHERE b.booking_id = ?
        `, [id]);
        return rows[0];
    }

    // Lấy bookings theo trạng thái
    static async getByStatus(status) {
        const [rows] = await db.query(`
            SELECT b.*, c.full_name, c.phone,
                   r.room_number, rt.type_name
            FROM bookings b
            JOIN customers c ON b.customer_id = c.customer_id
            JOIN rooms r ON b.room_id = r.room_id
            JOIN room_types rt ON r.type_id = rt.type_id
            WHERE b.status = ?
            ORDER BY b.check_in_date
        `, [status]);
        return rows;
    }

    // Lấy bookings hôm nay
    static async getToday() {
        const [rows] = await db.query(`
            SELECT b.*, c.full_name, c.phone,
                   r.room_number, rt.type_name
            FROM bookings b
            JOIN customers c ON b.customer_id = c.customer_id
            JOIN rooms r ON b.room_id = r.room_id
            JOIN room_types rt ON r.type_id = rt.type_id
            WHERE DATE(b.check_in_date) = CURDATE()
            ORDER BY b.booking_date DESC
        `);
        return rows;
    }

    // Tạo booking mới
    static async create(bookingData) {
        const { customer_id, room_id, user_id, check_in_date, check_out_date,
                num_adults, num_children, total_price, deposit, notes } = bookingData;

        const [result] = await db.query(
            `INSERT INTO bookings (customer_id, room_id, user_id, check_in_date, check_out_date,
             num_adults, num_children, total_price, deposit, notes, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [customer_id, room_id, user_id, check_in_date, check_out_date,
             num_adults || 1, num_children || 0, total_price, deposit || 0, notes]
        );

        // Cập nhật trạng thái phòng thành reserved
        await db.query('UPDATE rooms SET status = "reserved" WHERE room_id = ?', [room_id]);

        return result.insertId;
    }

    // Cập nhật booking
    static async update(id, bookingData) {
        const { check_in_date, check_out_date, num_adults, num_children,
                total_price, deposit, notes, status } = bookingData;

        const [result] = await db.query(
            `UPDATE bookings SET check_in_date = ?, check_out_date = ?,
             num_adults = ?, num_children = ?, total_price = ?, deposit = ?, notes = ?, status = ?
             WHERE booking_id = ?`,
            [check_in_date, check_out_date, num_adults, num_children,
             total_price, deposit, notes, status, id]
        );
        return result.affectedRows > 0;
    }

    // Check-in
    static async checkIn(id) {
        const [result] = await db.query('UPDATE bookings SET status = "checked_in" WHERE booking_id = ?', [id]);

        // Cập nhật trạng thái phòng thành occupied
        const booking = await this.getById(id);
        if (booking) {
            await db.query('UPDATE rooms SET status = "occupied" WHERE room_id = ?', [booking.room_id]);
        }

        return result.affectedRows > 0;
    }

    // Check-out
    static async checkOut(id) {
        const [result] = await db.query('UPDATE bookings SET status = "checked_out" WHERE booking_id = ?', [id]);

        // Cập nhật trạng thái phòng thành available
        const booking = await this.getById(id);
        if (booking) {
            await db.query('UPDATE rooms SET status = "available" WHERE room_id = ?', [booking.room_id]);
        }

        return result.affectedRows > 0;
    }

    // Hủy booking
    static async cancel(id) {
        const booking = await this.getById(id);

        const [result] = await db.query('UPDATE bookings SET status = "cancelled" WHERE booking_id = ?', [id]);

        // Cập nhật trạng thái phòng thành available
        if (booking) {
            await db.query('UPDATE rooms SET status = "available" WHERE room_id = ?', [booking.room_id]);
        }

        return result.affectedRows > 0;
    }

    // Xác nhận booking
    static async confirm(id) {
        const [result] = await db.query('UPDATE bookings SET status = "confirmed" WHERE booking_id = ?', [id]);
        return result.affectedRows > 0;
    }

    // Tính tổng tiền phòng
    static calculateRoomCharge(basePrice, checkInDate, checkOutDate) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return basePrice * nights;
    }

    // Thống kê bookings theo tháng
    static async getMonthlyStats(year, month) {
        const [rows] = await db.query(`
            SELECT
                COUNT(*) as total_bookings,
                SUM(CASE WHEN status = 'checked_out' THEN total_price ELSE 0 END) as total_revenue,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count
            FROM bookings
            WHERE YEAR(booking_date) = ? AND MONTH(booking_date) = ?
        `, [year, month]);
        return rows[0];
    }
}

module.exports = Booking;
