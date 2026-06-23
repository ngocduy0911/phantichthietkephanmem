const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

class InvoiceController {
    // Danh sách hóa đơn
    static async index(req, res) {
        try {
            const invoices = await Invoice.getAll();
            res.render('invoices/index', { invoices, user: req.session.user });
        } catch (error) {
            console.error('Lỗi lấy danh sách hóa đơn:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Hiển thị form tạo hóa đơn
    static async showCreate(req, res) {
        try {
            const { booking_id } = req.query;

            if (!booking_id) {
                return res.redirect('/bookings');
            }

            const booking = await Booking.getById(booking_id);
            if (!booking) {
                return res.status(404).send('Không tìm thấy booking');
            }

            // Kiểm tra xem đã có hóa đơn chưa
            const existingInvoice = await Invoice.getByBookingId(booking_id);
            if (existingInvoice) {
                return res.redirect(`/invoices/${existingInvoice.invoice_id}`);
            }

            // Lấy danh sách dịch vụ đã sử dụng
            const bookingServices = await Invoice.getBookingServices(booking_id);

            // Tính tổng chi phí dịch vụ
            const serviceCharge = await Invoice.calculateServiceCharge(booking_id);

            // Tính tổng tiền
            const roomCharge = parseFloat(booking.total_price);
            const tax = (roomCharge + serviceCharge) * 0.1; // VAT 10%
            const totalAmount = roomCharge + serviceCharge + tax;

            res.render('invoices/create', {
                booking,
                bookingServices,
                roomCharge,
                serviceCharge,
                tax,
                totalAmount,
                user: req.session.user,
                error: null
            });
        } catch (error) {
            console.error('Lỗi hiển thị form tạo hóa đơn:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Xử lý tạo hóa đơn
    static async create(req, res) {
        try {
            const { booking_id, room_charge, service_charge, tax, discount,
                    total_amount, paid_amount, payment_method, notes } = req.body;

            // Xác định trạng thái thanh toán
            const paidAmountNum = parseFloat(paid_amount) || 0;
            const totalAmountNum = parseFloat(total_amount);
            let paymentStatus = 'unpaid';

            if (paidAmountNum >= totalAmountNum) {
                paymentStatus = 'paid';
            } else if (paidAmountNum > 0) {
                paymentStatus = 'partial';
            }

            const invoiceData = {
                booking_id,
                room_charge,
                service_charge: service_charge || 0,
                tax: tax || 0,
                discount: discount || 0,
                total_amount,
                paid_amount: paidAmountNum,
                payment_method: payment_method || 'cash',
                payment_status: paymentStatus,
                notes,
                created_by: req.session.user.user_id
            };

            const invoiceId = await Invoice.create(invoiceData);

            // Nếu đã thanh toán đủ, cập nhật trạng thái booking thành checked_out
            if (paymentStatus === 'paid') {
                await Booking.checkOut(booking_id);
            }

            res.redirect(`/invoices/${invoiceId}?success=create`);
        } catch (error) {
            console.error('Lỗi tạo hóa đơn:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Xem chi tiết hóa đơn
    static async show(req, res) {
        try {
            const { id } = req.params;
            const invoice = await Invoice.getById(id);

            if (!invoice) {
                return res.status(404).send('Không tìm thấy hóa đơn');
            }

            const bookingServices = await Invoice.getBookingServices(invoice.booking_id);

            res.render('invoices/show', {
                invoice,
                bookingServices,
                user: req.session.user
            });
        } catch (error) {
            console.error('Lỗi xem chi tiết hóa đơn:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Hiển thị form thanh toán
    static async showPayment(req, res) {
        try {
            const { id } = req.params;
            const invoice = await Invoice.getById(id);

            if (!invoice) {
                return res.status(404).send('Không tìm thấy hóa đơn');
            }

            const remainingAmount = parseFloat(invoice.total_amount) - parseFloat(invoice.paid_amount);

            res.render('invoices/payment', {
                invoice,
                remainingAmount,
                user: req.session.user,
                error: null
            });
        } catch (error) {
            console.error('Lỗi hiển thị form thanh toán:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Xử lý thanh toán
    static async processPayment(req, res) {
        try {
            const { id } = req.params;
            const { paid_amount, payment_method } = req.body;

            await Invoice.pay(id, paid_amount, payment_method);

            // Kiểm tra xem đã thanh toán đủ chưa
            const invoice = await Invoice.getById(id);
            if (invoice.payment_status === 'paid') {
                await Booking.checkOut(invoice.booking_id);
            }

            res.redirect(`/invoices/${id}?success=payment`);
        } catch (error) {
            console.error('Lỗi xử lý thanh toán:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Thêm dịch vụ vào booking
    static async addService(req, res) {
        try {
            const { booking_id, service_id, quantity } = req.body;

            const service = await Service.getById(service_id);
            await Invoice.addBookingService(booking_id, service_id, quantity, service.price);

            res.redirect(`/invoices/create?booking_id=${booking_id}&success=service`);
        } catch (error) {
            console.error('Lỗi thêm dịch vụ:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // Báo cáo doanh thu
    static async showReport(req, res) {
        try {
            const { start_date, end_date } = req.query;

            if (!start_date || !end_date) {
                return res.render('invoices/report', {
                    revenueData: null,
                    start_date: '',
                    end_date: '',
                    user: req.session.user
                });
            }

            const revenueData = await Invoice.getRevenueByDateRange(start_date, end_date);

            // Tính tổng
            let totalRevenue = 0;
            let totalPaid = 0;

            revenueData.forEach(item => {
                totalRevenue += parseFloat(item.total_revenue);
                totalPaid += parseFloat(item.paid_revenue);
            });

            res.render('invoices/report', {
                revenueData,
                totalRevenue,
                totalPaid,
                start_date,
                end_date,
                user: req.session.user
            });
        } catch (error) {
            console.error('Lỗi hiển thị báo cáo:', error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }
}

module.exports = InvoiceController;
