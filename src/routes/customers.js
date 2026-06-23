const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const CustomerController = require('../controllers/customerController');

// Tất cả routes đều yêu cầu đăng nhập
router.use(requireAuth);

// Danh sách khách hàng
router.get('/', CustomerController.index);

// Tạo khách hàng mới
router.get('/create', CustomerController.showCreate);
router.post('/create', CustomerController.create);

// Xem chi tiết khách hàng
router.get('/:id', CustomerController.show);

// Sửa khách hàng
router.get('/:id/edit', CustomerController.showEdit);
router.post('/:id/edit', CustomerController.update);

// Xóa khách hàng
router.post('/:id/delete', CustomerController.delete);

module.exports = router;
