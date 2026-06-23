const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');

class DashboardController {
    // Hiển thị trang dashboard
    static async index(req, res) {
        try {
            // Lấy thống kê tổng quan
            const roomStats = await Room.getStatsByStatus();
            const todayBookings = await Booking.getToday();

            // Lấy thống kê tháng hiện tại
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1;

            const monthlyBookingStats = await Booking.getMonthlyStats(currentYear, currentMonth);
            const monthlyRevenueStats = await Invoice.getMonthlyRevenue(currentYear, currentMonth);

            // Lấy bookings sắp tới
            const upcomingBookings = await Booking.getByStatus('confirmed');

            // Lấy bookings đang ở
            const currentBookings = await Booking.getByStatus('checked_in');

            // Chuyển đổi room stats thành object
            const roomStatsObj = {
                available: 0,
                occupied: 0,
                reserved: 0,
                maintenance: 0
            };

            roomStats.forEach(stat => {
                roomStatsObj[stat.status] = stat.count;
            });

            res.render('dashboard/index', {
                user: req.session.user,
                roomStats: roomStatsObj,
                todayBookings,
                monthlyBookingStats,
                monthlyRevenueStats,
                upcomingBookings: upcomingBookings.slice(0, 5),
                currentBookings: currentBookings.slice(0, 5)
            });
        } catch (error) {
            console.error('Lỗi hiển thị dashboard:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }
}

module.exports = DashboardController;
