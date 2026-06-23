const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const InvoiceController = require('../controllers/invoiceController');

// Tất cả routes đều yêu cầu đăng nhập
router.use(requireAuth);

// Danh sách hóa đơn
router.get('/', InvoiceController.index);

// Báo cáo doanh thu
router.get('/report', InvoiceController.showReport);

// Tạo hóa đơn mới
router.get('/create', InvoiceController.showCreate);
router.post('/create', InvoiceController.create);

// Thêm dịch vụ vào booking
router.post('/add-service', InvoiceController.addService);

// Xem chi tiết hóa đơn
router.get('/:id', InvoiceController.show);

// Thanh toán
router.get('/:id/payment', InvoiceController.showPayment);
router.post('/:id/payment', InvoiceController.processPayment);

module.exports = router;
