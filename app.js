const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const indexRoutes = require('./src/routes/index');
const roomRoutes = require('./src/routes/rooms');
const customerRoutes = require('./src/routes/customers');
const bookingRoutes = require('./src/routes/bookings');
const invoiceRoutes = require('./src/routes/invoices');

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'hotel_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Make user available in all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success = req.query.success || null;
    next();
});

// Helper function cho views
app.locals.moment = require('moment');
app.locals.formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

// Routes
app.use('/', indexRoutes);
app.use('/rooms', roomRoutes);
app.use('/customers', customerRoutes);
app.use('/bookings', bookingRoutes);
app.use('/invoices', invoiceRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).send('Trang không tồn tại');
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Có lỗi xảy ra trên server');
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║   HỆ THỐNG QUẢN LÝ KHÁCH SẠN                          ║
║   Hotel Management System                              ║
║                                                        ║
║   Server đang chạy tại: http://localhost:${PORT}       ║
║   Nhấn Ctrl+C để dừng server                          ║
╚════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
