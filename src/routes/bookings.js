const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const BookingController = require('../controllers/bookingController');

// Tất cả routes đều yêu cầu đăng nhập
router.use(requireAuth);

// Danh sách bookings
router.get('/', BookingController.index);

// Tạo booking mới
router.get('/create', BookingController.showCreate);
router.post('/create', BookingController.create);

// Xem chi tiết booking
router.get('/:id', BookingController.show);

// Sửa booking
router.get('/:id/edit', BookingController.showEdit);
router.post('/:id/edit', BookingController.update);

// Check-in
router.post('/:id/checkin', BookingController.checkIn);

// Check-out
router.post('/:id/checkout', BookingController.checkOut);

// Xác nhận booking
router.post('/:id/confirm', BookingController.confirm);

// Hủy booking
router.post('/:id/cancel', BookingController.cancel);

module.exports = router;
