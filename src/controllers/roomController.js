const Room = require('../models/Room');
const RoomType = require('../models/RoomType');

class RoomController {
    // Danh sách phòng
    static async index(req, res) {
        try {
            const rooms = await Room.getAll();
            res.render('rooms/index', { rooms, user: req.session.user });
        } catch (error) {
            console.error('Lỗi lấy danh sách phòng:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Hiển thị form thêm phòng
    static async showCreate(req, res) {
        try {
            const roomTypes = await RoomType.getAll();
            res.render('rooms/create', { roomTypes, user: req.session.user, error: null });
        } catch (error) {
            console.error('Lỗi hiển thị form thêm phòng:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Xử lý thêm phòng
    static async create(req, res) {
        try {
            const { room_number, type_id, floor, description } = req.body;

            // Kiểm tra số phòng đã tồn tại
            const existingRoom = await Room.getByRoomNumber(room_number);
            if (existingRoom) {
                const roomTypes = await RoomType.getAll();
                return res.render('rooms/create', {
                    roomTypes,
                    user: req.session.user,
                    error: 'Số phòng đã tồn tại'
                });
            }

            await Room.create({ room_number, type_id, floor, description });
            res.redirect('/rooms?success=create');
        } catch (error) {
            console.error('Lỗi thêm phòng:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Hiển thị form sửa phòng
    static async showEdit(req, res) {
        try {
            const { id } = req.params;
            const room = await Room.getById(id);
            const roomTypes = await RoomType.getAll();

            if (!room) {
                return res.status(404).send('Không tìm thấy phòng');
            }

            res.render('rooms/edit', { room, roomTypes, user: req.session.user, error: null });
        } catch (error) {
            console.error('Lỗi hiển thị form sửa phòng:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Xử lý sửa phòng
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { room_number, type_id, floor, status, description } = req.body;

            // Kiểm tra số phòng đã tồn tại (trừ phòng hiện tại)
            const existingRoom = await Room.getByRoomNumber(room_number);
            if (existingRoom && existingRoom.room_id != id) {
                const room = await Room.getById(id);
                const roomTypes = await RoomType.getAll();
                return res.render('rooms/edit', {
                    room,
                    roomTypes,
                    user: req.session.user,
                    error: 'Số phòng đã tồn tại'
                });
            }

            await Room.update(id, { room_number, type_id, floor, status, description });
            res.redirect('/rooms?success=update');
        } catch (error) {
            console.error('Lỗi sửa phòng:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Xóa phòng
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await Room.delete(id);
            res.redirect('/rooms?success=delete');
        } catch (error) {
            console.error('Lỗi xóa phòng:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Xem chi tiết phòng
    static async show(req, res) {
        try {
            const { id } = req.params;
            const room = await Room.getById(id);

            if (!room) {
                return res.status(404).send('Không tìm thấy phòng');
            }

            res.render('rooms/show', { room, user: req.session.user });
        } catch (error) {
            console.error('Lỗi xem chi tiết phòng:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Tìm phòng trống
    static async searchAvailable(req, res) {
        try {
            const { check_in_date, check_out_date } = req.query;

            if (!check_in_date || !check_out_date) {
                const rooms = await Room.getByStatus('available');
                return res.render('rooms/available', {
                    rooms,
                    check_in_date: '',
                    check_out_date: '',
                    user: req.session.user
                });
            }

            const rooms = await Room.getAvailableRooms(check_in_date, check_out_date);
            res.render('rooms/available', {
                rooms,
                check_in_date,
                check_out_date,
                user: req.session.user
            });
        } catch (error) {
            console.error('Lỗi tìm phòng trống:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }
}

module.exports = RoomController;
