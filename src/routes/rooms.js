const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const RoomController = require('../controllers/roomController');

// Tất cả routes đều yêu cầu đăng nhập
router.use(requireAuth);

// Danh sách phòng
router.get('/', RoomController.index);

// Tìm phòng trống
router.get('/available', RoomController.searchAvailable);

// Tạo phòng mới
router.get('/create', RoomController.showCreate);
router.post('/create', RoomController.create);

// Xem chi tiết phòng
router.get('/:id', RoomController.show);

// Sửa phòng
router.get('/:id/edit', RoomController.showEdit);
router.post('/:id/edit', RoomController.update);

// Xóa phòng
router.post('/:id/delete', RoomController.delete);

module.exports = router;
