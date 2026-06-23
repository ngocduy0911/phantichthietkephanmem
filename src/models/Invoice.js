const db = require('../config/database');

class Invoice {
    // Lấy tất cả hóa đơn
    static async getAll() {
        const [rows] = await db.query(`
            SELECT i.*, b.booking_id, c.full_name as customer_name,
                   r.room_number, u.full_name as created_by_name
            FROM invoices i
            JOIN bookings b ON i.booking_id = b.booking_id
            JOIN customers c ON b.customer_id = c.customer_id
            JOIN rooms r ON b.room_id = r.room_id
            LEFT JOIN users u ON i.created_by = u.user_id
            ORDER BY i.invoice_date DESC
        `);
        return rows;
    }

    // Lấy hóa đơn theo ID
    static async getById(id) {
        const [rows] = await db.query(`
            SELECT i.*, b.*, c.full_name as customer_name, c.phone, c.id_card,
                   r.room_number, rt.type_name,
                   u.full_name as created_by_name
            FROM invoices i
            JOIN bookings b ON i.booking_id = b.booking_id
            JOIN customers c ON b.customer_id = c.customer_id
            JOIN rooms r ON b.room_id = r.room_id
            JOIN room_types rt ON r.type_id = rt.type_id
            LEFT JOIN users u ON i.created_by = u.user_id
            WHERE i.invoice_id = ?
        `, [id]);
        return rows[0];
    }

    // Lấy hóa đơn theo booking ID
    static async getByBookingId(bookingId) {
        const [rows] = await db.query(`
            SELECT i.*, u.full_name as created_by_name
            FROM invoices i
            LEFT JOIN users u ON i.created_by = u.user_id
            WHERE i.booking_id = ?
        `, [bookingId]);
        return rows[0];
    }

    // Tạo hóa đơn mới
    static async create(invoiceData) {
        const { booking_id, room_charge, service_charge, tax, discount,
                total_amount, paid_amount, payment_method, payment_status, notes, created_by } = invoiceData;

        const [result] = await db.query(
            `INSERT INTO invoices (booking_id, room_charge, service_charge, tax, discount,
             total_amount, paid_amount, payment_method, payment_status, notes, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [booking_id, room_charge, service_charge || 0, tax || 0, discount || 0,
             total_amount, paid_amount || 0, payment_method || 'cash', payment_status || 'unpaid', notes, created_by]
        );
        return result.insertId;
    }

    // Cập nhật hóa đơn
    static async update(id, invoiceData) {
        const { room_charge, service_charge, tax, discount, total_amount,
                paid_amount, payment_method, payment_status, notes } = invoiceData;

        const [result] = await db.query(
            `UPDATE invoices SET room_charge = ?, service_charge = ?, tax = ?, discount = ?,
             total_amount = ?, paid_amount = ?, payment_method = ?, payment_status = ?, notes = ?
             WHERE invoice_id = ?`,
            [room_charge, service_charge, tax, discount, total_amount,
             paid_amount, payment_method, payment_status, notes, id]
        );
        return result.affectedRows > 0;
    }

    // Thanh toán hóa đơn
    static async pay(id, paidAmount, paymentMethod) {
        const invoice = await this.getById(id);
        if (!invoice) return false;

        const newPaidAmount = parseFloat(invoice.paid_amount) + parseFloat(paidAmount);
        const paymentStatus = newPaidAmount >= invoice.total_amount ? 'paid' :
                            newPaidAmount > 0 ? 'partial' : 'unpaid';

        const [result] = await db.query(
            'UPDATE invoices SET paid_amount = ?, payment_method = ?, payment_status = ? WHERE invoice_id = ?',
            [newPaidAmount, paymentMethod, paymentStatus, id]
        );
        return result.affectedRows > 0;
    }

    // Lấy dịch vụ của booking
    static async getBookingServices(bookingId) {
        const [rows] = await db.query(`
            SELECT bs.*, s.service_name, s.unit
            FROM booking_services bs
            JOIN services s ON bs.service_id = s.service_id
            WHERE bs.booking_id = ?
            ORDER BY bs.service_date DESC
        `, [bookingId]);
        return rows;
    }

    // Thêm dịch vụ cho booking
    static async addBookingService(bookingId, serviceId, quantity, price) {
        const totalPrice = quantity * price;
        const [result] = await db.query(
            'INSERT INTO booking_services (booking_id, service_id, quantity, price, total_price) VALUES (?, ?, ?, ?, ?)',
            [bookingId, serviceId, quantity, price, totalPrice]
        );
        return result.insertId;
    }

    // Tính tổng chi phí dịch vụ
    static async calculateServiceCharge(bookingId) {
        const [rows] = await db.query(
            'SELECT COALESCE(SUM(total_price), 0) as service_charge FROM booking_services WHERE booking_id = ?',
            [bookingId]
        );
        return rows[0].service_charge;
    }

    // Thống kê doanh thu theo khoảng thời gian
    static async getRevenueByDateRange(startDate, endDate) {
        const [rows] = await db.query(`
            SELECT
                DATE(invoice_date) as date,
                COUNT(*) as invoice_count,
                SUM(total_amount) as total_revenue,
                SUM(paid_amount) as paid_revenue
            FROM invoices
            WHERE DATE(invoice_date) BETWEEN ? AND ?
            GROUP BY DATE(invoice_date)
            ORDER BY date
        `, [startDate, endDate]);
        return rows;
    }

    // Thống kê doanh thu theo tháng
    static async getMonthlyRevenue(year, month) {
        const [rows] = await db.query(`
            SELECT
                COUNT(*) as invoice_count,
                SUM(total_amount) as total_revenue,
                SUM(paid_amount) as paid_revenue,
                SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_count,
                SUM(CASE WHEN payment_status = 'unpaid' THEN 1 ELSE 0 END) as unpaid_count
            FROM invoices
            WHERE YEAR(invoice_date) = ? AND MONTH(invoice_date) = ?
        `, [year, month]);
        return rows[0];
    }
}

module.exports = Invoice;
