const Customer = require('../models/Customer');

class CustomerController {
    // Danh sách khách hàng
    static async index(req, res) {
        try {
            const { search } = req.query;
            let customers;

            if (search) {
                customers = await Customer.search(search);
            } else {
                customers = await Customer.getAll();
            }

            res.render('customers/index', { customers, search: search || '', user: req.session.user });
        } catch (error) {
            console.error('Lỗi lấy danh sách khách hàng:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Hiển thị form thêm khách hàng
    static showCreate(req, res) {
        res.render('customers/create', { user: req.session.user, error: null });
    }

    // Xử lý thêm khách hàng
    static async create(req, res) {
        try {
            const { full_name, id_card, phone, email, address, date_of_birth, nationality } = req.body;

            // Kiểm tra CMND/CCCD đã tồn tại
            const existingCustomer = await Customer.getByIdCard(id_card);
            if (existingCustomer) {
                return res.render('customers/create', {
                    user: req.session.user,
                    error: 'Số CMND/CCCD đã tồn tại'
                });
            }

            await Customer.create({ full_name, id_card, phone, email, address, date_of_birth, nationality });
            res.redirect('/customers?success=create');
        } catch (error) {
            console.error('Lỗi thêm khách hàng:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Hiển thị form sửa khách hàng
    static async showEdit(req, res) {
        try {
            const { id } = req.params;
            const customer = await Customer.getById(id);

            if (!customer) {
                return res.status(404).send('Không tìm thấy khách hàng');
            }

            res.render('customers/edit', { customer, user: req.session.user, error: null });
        } catch (error) {
            console.error('Lỗi hiển thị form sửa khách hàng:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Xử lý sửa khách hàng
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { full_name, id_card, phone, email, address, date_of_birth, nationality } = req.body;

            // Kiểm tra CMND/CCCD đã tồn tại (trừ khách hàng hiện tại)
            const existingCustomer = await Customer.getByIdCard(id_card);
            if (existingCustomer && existingCustomer.customer_id != id) {
                const customer = await Customer.getById(id);
                return res.render('customers/edit', {
                    customer,
                    user: req.session.user,
                    error: 'Số CMND/CCCD đã tồn tại'
                });
            }

            await Customer.update(id, { full_name, id_card, phone, email, address, date_of_birth, nationality });
            res.redirect('/customers?success=update');
        } catch (error) {
            console.error('Lỗi sửa khách hàng:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Xóa khách hàng
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await Customer.delete(id);
            res.redirect('/customers?success=delete');
        } catch (error) {
            console.error('Lỗi xóa khách hàng:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Xem chi tiết khách hàng
    static async show(req, res) {
        try {
            const { id } = req.params;
            const customer = await Customer.getById(id);

            if (!customer) {
                return res.status(404).send('Không tìm thấy khách hàng');
            }

            const bookingHistory = await Customer.getBookingHistory(id);

            res.render('customers/show', { customer, bookingHistory, user: req.session.user });
        } catch (error) {
            console.error('Lỗi xem chi tiết khách hàng:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }
}

module.exports = CustomerController;
