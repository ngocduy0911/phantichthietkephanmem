# HỆ THỐNG QUẢN LÝ KHÁCH SẠN
## Hotel Management System

Đồ án môn Phân Tích và Thiết Kế Hệ Thống

---

## 📋 Mô Tả Dự Án

Hệ thống quản lý khách sạn được xây dựng bằng NodeJS, Express, MySQL theo mô hình MVC. Hệ thống cung cấp các chức năng quản lý toàn diện cho khách sạn bao gồm:

- ✅ Quản lý phòng và loại phòng
- ✅ Quản lý khách hàng
- ✅ Quản lý đặt phòng (booking)
- ✅ Quản lý check-in/check-out
- ✅ Quản lý dịch vụ
- ✅ Quản lý hóa đơn và thanh toán
- ✅ Báo cáo thống kê doanh thu
- ✅ Xác thực và phân quyền người dùng

---

## 🛠 Công Nghệ Sử Dụng

### Backend:
- **NodeJS** v14+
- **Express** v4.18 - Web framework
- **MySQL2** v3.6 - Database connector
- **EJS** v3.1 - Template engine
- **bcryptjs** - Mã hóa mật khẩu
- **express-session** - Quản lý session
- **dotenv** - Quản lý biến môi trường
- **moment** - Xử lý thời gian

### Frontend:
- **HTML5**
- **CSS3** - Custom styling
- **JavaScript** (Vanilla)

### Database:
- **MySQL** v8.0+

---

## 📁 Cấu Trúc Thư Mục

```
DoAn_QuanLyKhachSan/
│
├── database/
│   └── schema.sql              # Schema database và dữ liệu mẫu
│
├── public/
│   ├── css/
│   │   └── style.css          # File CSS chính
│   ├── js/
│   └── images/
│
├── src/
│   ├── config/
│   │   └── database.js        # Cấu hình kết nối database
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── roomController.js
│   │   ├── customerController.js
│   │   ├── bookingController.js
│   │   └── invoiceController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── RoomType.js
│   │   ├── Customer.js
│   │   ├── Booking.js
│   │   ├── Service.js
│   │   └── Invoice.js
│   │
│   ├── middleware/
│   │   └── auth.js            # Middleware xác thực
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── rooms.js
│   │   ├── customers.js
│   │   ├── bookings.js
│   │   └── invoices.js
│   │
│   └── views/
│       ├── auth/
│       ├── dashboard/
│       ├── rooms/
│       ├── customers/
│       ├── bookings/
│       ├── invoices/
│       ├── partials/
│       └── layout.ejs
│
├── .env                       # Biến môi trường (cần tạo)
├── app.js                     # File khởi chạy ứng dụng
├── package.json
└── README.md

```

---

## 🚀 Hướng Dẫn Cài Đặt

### 1. Yêu Cầu Hệ Thống

- NodeJS v14 hoặc mới hơn
- MySQL v8.0 hoặc mới hơn
- NPM hoặc Yarn

### 2. Cài Đặt

#### Bước 1: Clone hoặc tải project

```bash
cd DoAn_QuanLyKhachSan
```

#### Bước 2: Cài đặt dependencies

```bash
npm install
```

#### Bước 3: Tạo database

1. Mở MySQL Workbench hoặc phpMyAdmin
2. Import file `database/schema.sql`
3. Database `hotel_management` sẽ được tạo với dữ liệu mẫu

Hoặc chạy lệnh:

```bash
mysql -u root -p < database/schema.sql
```

#### Bước 4: Cấu hình file .env

File `.env` đã được tạo sẵn với cấu hình mặc định. Nếu cần thay đổi:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=hotel_management
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# Session Secret
SESSION_SECRET=hotel_secret_key_2024
```

#### Bước 5: Chạy ứng dụng

```bash
npm start
```

Hoặc sử dụng nodemon để tự động reload:

```bash
npm run dev
```

#### Bước 6: Truy cập ứng dụng

Mở trình duyệt và truy cập: `http://localhost:3000`

---

## 👤 Tài Khoản Mặc Định

### Admin:
- **Username:** admin
- **Password:** admin123
- **Quyền:** Toàn quyền

### Lễ Tân:
- **Username:** receptionist1
- **Password:** admin123
- **Quyền:** Quản lý booking, khách hàng, hóa đơn

### Quản Lý:
- **Username:** manager1
- **Password:** admin123
- **Quyền:** Xem báo cáo, quản lý

> **Lưu ý:** Mật khẩu đã được mã hóa bằng bcryptjs

---

## 📊 Cấu Trúc Database

### Các bảng chính:

1. **users** - Quản lý tài khoản người dùng
2. **room_types** - Loại phòng (Standard, Deluxe, Suite, VIP)
3. **rooms** - Thông tin phòng
4. **customers** - Thông tin khách hàng
5. **bookings** - Đặt phòng
6. **services** - Dịch vụ khách sạn
7. **booking_services** - Dịch vụ đã sử dụng
8. **invoices** - Hóa đơn thanh toán

### Mối quan hệ:
- Một phòng có một loại phòng (1-1)
- Một booking có một khách hàng (N-1)
- Một booking có một phòng (N-1)
- Một booking có nhiều dịch vụ (1-N)
- Một booking có một hóa đơn (1-1)

---

## 🎯 Chức Năng Chính

### 1. Quản Lý Phòng
- Xem danh sách phòng
- Thêm/sửa/xóa phòng
- Cập nhật trạng thái phòng (Trống, Đang thuê, Đã đặt, Bảo trì)
- Tìm phòng trống theo ngày

### 2. Quản Lý Khách Hàng
- Thêm/sửa/xóa thông tin khách hàng
- Tìm kiếm khách hàng
- Xem lịch sử đặt phòng

### 3. Quản Lý Đặt Phòng
- Tạo booking mới
- Xác nhận booking
- Check-in/Check-out
- Hủy booking
- Xem danh sách booking theo trạng thái

### 4. Quản Lý Hóa Đơn
- Tạo hóa đơn khi check-out
- Thêm dịch vụ vào hóa đơn
- Thanh toán (tiền mặt, thẻ, chuyển khoản)
- Xem lịch sử hóa đơn

### 5. Báo Cáo Thống Kê
- Thống kê doanh thu theo ngày/tháng
- Thống kê tình trạng phòng
- Báo cáo số lượng booking

### 6. Quản Lý Tài Khoản
- Đăng nhập/đăng xuất
- Đổi mật khẩu
- Phân quyền (Admin, Manager, Receptionist)

---

## 🔒 Bảo Mật

- Mật khẩu được mã hóa bằng bcryptjs
- Session management với express-session
- Middleware xác thực cho các route
- Phân quyền theo role
- SQL injection prevention với prepared statements

---

## 📝 API Routes

### Authentication:
- `GET /login` - Trang đăng nhập
- `POST /login` - Xử lý đăng nhập
- `GET /logout` - Đăng xuất
- `GET /change-password` - Đổi mật khẩu

### Dashboard:
- `GET /dashboard` - Trang chủ

### Rooms:
- `GET /rooms` - Danh sách phòng
- `GET /rooms/create` - Form thêm phòng
- `POST /rooms/create` - Xử lý thêm phòng
- `GET /rooms/:id` - Chi tiết phòng
- `GET /rooms/:id/edit` - Form sửa phòng
- `POST /rooms/:id/edit` - Xử lý sửa phòng
- `POST /rooms/:id/delete` - Xóa phòng

### Customers:
- `GET /customers` - Danh sách khách hàng
- `GET /customers/create` - Form thêm khách hàng
- `POST /customers/create` - Xử lý thêm khách hàng
- `GET /customers/:id` - Chi tiết khách hàng
- `GET /customers/:id/edit` - Form sửa khách hàng
- `POST /customers/:id/edit` - Xử lý sửa khách hàng
- `POST /customers/:id/delete` - Xóa khách hàng

### Bookings:
- `GET /bookings` - Danh sách bookings
- `GET /bookings/create` - Form tạo booking
- `POST /bookings/create` - Xử lý tạo booking
- `GET /bookings/:id` - Chi tiết booking
- `POST /bookings/:id/checkin` - Check-in
- `POST /bookings/:id/checkout` - Check-out
- `POST /bookings/:id/confirm` - Xác nhận
- `POST /bookings/:id/cancel` - Hủy

### Invoices:
- `GET /invoices` - Danh sách hóa đơn
- `GET /invoices/create` - Form tạo hóa đơn
- `POST /invoices/create` - Xử lý tạo hóa đơn
- `GET /invoices/:id` - Chi tiết hóa đơn
- `POST /invoices/:id/payment` - Thanh toán
- `GET /invoices/report` - Báo cáo doanh thu

---

## 🐛 Xử Lý Lỗi

Các lỗi thường gặp và cách khắc phục:

### 1. Lỗi kết nối database
```
Error: ER_ACCESS_DENIED_ERROR
```
**Giải pháp:** Kiểm tra lại thông tin DB_USER và DB_PASSWORD trong file .env

### 2. Lỗi port đã được sử dụng
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Giải pháp:** Thay đổi PORT trong file .env hoặc kill process đang chạy trên port 3000

### 3. Lỗi module not found
```
Error: Cannot find module 'express'
```
**Giải pháp:** Chạy lại `npm install`

---

## 📚 Tài Liệu Tham Khảo

- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [EJS Documentation](https://ejs.co/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

## 👨‍💻 Tác Giả

**[Ngô Ngọc Duy]**
- MSSV: [23010397]
**[Nguyễn Văn Thành]**
- MSSV: [23010764]

**Giảng viên hướng dẫn:** [Tên Giảng Viên]

---

## 📄 License

Dự án này được phát triển cho mục đích học tập.

---

## 🙏 Lời Cảm Ơn

Cảm ơn thầy giảng viên đã hướng dẫn và hỗ trợ trong quá trình thực hiện đồ án.

---


