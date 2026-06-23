const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const Room = require('../models/Room');

class BookingController {
    // Danh sách bookings
    static async index(req, res) {
        try {
            const { status } = req.query;
            let bookings;

            if (status) {
                bookings = await Booking.getByStatus(status);
            } else {
                bookings = await Booking.getAll();
            }

            res.render('bookings/index', { bookings, status: status || '', user: req.session.user });
        } catch (error) {
            console.error('Lỗi lấy danh sách bookings:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Hiển thị form tạo booking
    static async showCreate(req, res) {
        try {
            const { room_id } = req.query;
            const customers = await Customer.getAll();
            const rooms = await Room.getByStatus('available');

            res.render('bookings/create', {
                customers,
                rooms,
                selectedRoomId: room_id || '',
                user: req.session.user,
                error: null
            });
        } catch (error) {
            console.error('Lỗi hiển thị form tạo booking:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Xử lý tạo booking
    static async create(req, res) {
        try {
            const { customer_id, room_id, check_in_date, check_out_date,
                    num_adults, num_children, deposit, notes } = req.body;

            // Lấy thông tin phòng để tính tiền
            const room = await Room.getById(room_id);
            const totalPrice = Booking.calculateRoomCharge(room.base_price, check_in_date, check_out_date);

            const bookingData = {
                customer_id,
                room_id,
                user_id: req.session.user.user_id,
                check_in_date,
                check_out_date,
                num_adults,
                num_children,
                total_price: totalPrice,
                deposit: deposit || 0,
                notes
            };

            await Booking.create(bookingData);
            res.redirect('/bookings?success=create');
        } catch (error) {
            console.error('Lỗi tạo booking:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Hiển thị form sửa booking
    static async showEdit(req, res) {
        try {
            const { id } = req.params;
            const booking = await Booking.getById(id);
            const customers = await Customer.getAll();
            const rooms = await Room.getAll();

            if (!booking) {
                return res.status(404).send('Không tìm thấy booking');
            }

            res.render('bookings/edit', {
                booking,
                customers,
                rooms,
                user: req.session.user,
                error: null
            });
        } catch (error) {
            console.error('Lỗi hiển thị form sửa booking:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Xử lý sửa booking
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { check_in_date, check_out_date, num_adults, num_children,
                    total_price, deposit, notes, status } = req.body;

            await Booking.update(id, {
                check_in_date,
                check_out_date,
                num_adults,
                num_children,
                total_price,
                deposit,
                notes,
                status
            });

            res.redirect('/bookings?success=update');
        } catch (error) {
            console.error('Lỗi sửa booking:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Xem chi tiết booking
    static async show(req, res) {
        try {
            const { id } = req.params;
            const booking = await Booking.getById(id);

            if (!booking) {
                return res.status(404).send('Không tìm thấy booking');
            }

            res.render('bookings/show', { booking, user: req.session.user });
        } catch (error) {
            console.error('Lỗi xem chi tiết booking:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Check-in
    static async checkIn(req, res) {
        try {
            const { id } = req.params;
            await Booking.checkIn(id);
            res.redirect(`/bookings/${id}?success=checkin`);
        } catch (error) {
            console.error('Lỗi check-in:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Check-out
    static async checkOut(req, res) {
        try {
            const { id } = req.params;
            await Booking.checkOut(id);
            res.redirect(`/invoices/create?booking_id=${id}`);
        } catch (error) {
            console.error('Lỗi check-out:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Xác nhận booking
    static async confirm(req, res) {
        try {
            const { id } = req.params;
            await Booking.confirm(id);
            res.redirect(`/bookings/${id}?success=confirm`);
        } catch (error) {
            console.error('Lỗi xác nhận booking:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Hủy booking
    static async cancel(req, res) {
        try {
            const { id } = req.params;
            await Booking.cancel(id);
            res.redirect(`/bookings/${id}?success=cancel`);
        } catch (error) {
            console.error('Lỗi hủy booking:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }
}

module.exports = BookingController;
