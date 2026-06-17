-- Tạo database
CREATE DATABASE IF NOT EXISTS hotel_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hotel_management;

-- Bảng Users (Người dùng - Nhân viên, Quản lý)
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    role ENUM('admin', 'receptionist', 'manager') DEFAULT 'receptionist',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Room Types (Loại phòng)
CREATE TABLE IF NOT EXISTS room_types (
    type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    max_occupancy INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Rooms (Phòng)
CREATE TABLE IF NOT EXISTS rooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    type_id INT NOT NULL,
    floor INT,
    status ENUM('available', 'occupied', 'maintenance', 'reserved') DEFAULT 'available',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES room_types(type_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Customers (Khách hàng)
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    id_card VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    date_of_birth DATE,
    nationality VARCHAR(50) DEFAULT 'Vietnam',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Bookings (Đặt phòng)
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    room_id INT NOT NULL,
    user_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_adults INT DEFAULT 1,
    num_children INT DEFAULT 0,
    total_price DECIMAL(10, 2),
    deposit DECIMAL(10, 2) DEFAULT 0,
    status ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Services (Dịch vụ)
CREATE TABLE IF NOT EXISTS services (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) DEFAULT 'lần',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Booking Services (Dịch vụ đã sử dụng)
CREATE TABLE IF NOT EXISTS booking_services (
    booking_service_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    service_id INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    service_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Invoices (Hóa đơn)
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    room_charge DECIMAL(10, 2) NOT NULL,
    service_charge DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    payment_method ENUM('cash', 'card', 'transfer', 'other') DEFAULT 'cash',
    payment_status ENUM('unpaid', 'partial', 'paid') DEFAULT 'unpaid',
    notes TEXT,
    created_by INT,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert dữ liệu mẫu

-- Users
INSERT INTO users (username, password, full_name, email, phone, role) VALUES
('admin', '$2a$10$u4fa9hTMjRPhZ5YuYSqG1OCtm60SU7JqMIMPS0RR2EnVVwstgAgPO', 'Quản Trị Viên', 'admin@hotel.com', '0901234567', 'admin'),
('receptionist1', '$2a$10$u4fa9hTMjRPhZ5YuYSqG1OCtm60SU7JqMIMPS0RR2EnVVwstgAgPO', 'Lễ Tân 1', 'letan1@hotel.com', '0901234568', 'receptionist'),
('manager1', '$2a$10$u4fa9hTMjRPhZ5YuYSqG1OCtm60SU7JqMIMPS0RR2EnVVwstgAgPO', 'Quản Lý 1', 'quanly1@hotel.com', '0901234569', 'manager');

-- Room Types
INSERT INTO room_types (type_name, description, base_price, max_occupancy) VALUES
('Standard', 'Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản', 500000, 2),
('Deluxe', 'Phòng cao cấp với view đẹp và tiện nghi hiện đại', 800000, 2),
('Suite', 'Phòng suite sang trọng với phòng khách riêng', 1500000, 4),
('VIP', 'Phòng VIP cao cấp nhất với đầy đủ tiện nghi 5 sao', 2500000, 4);

-- Rooms
INSERT INTO rooms (room_number, type_id, floor, status) VALUES
('101', 1, 1, 'available'),
('102', 1, 1, 'available'),
('103', 1, 1, 'occupied'),
('201', 2, 2, 'available'),
('202', 2, 2, 'available'),
('203', 2, 2, 'reserved'),
('301', 3, 3, 'available'),
('302', 3, 3, 'available'),
('401', 4, 4, 'available'),
('402', 4, 4, 'maintenance');

-- Services
INSERT INTO services (service_name, description, price, unit) VALUES
('Giặt ủi', 'Dịch vụ giặt ủi quần áo', 50000, 'kg'),
('Ăn sáng', 'Buffet sáng tại nhà hàng', 150000, 'người'),
('Massage', 'Dịch vụ massage thư giãn', 300000, 'giờ'),
('Đưa đón sân bay', 'Dịch vụ đưa đón sân bay', 500000, 'lượt'),
('Thuê xe', 'Dịch vụ thuê xe tự lái hoặc có tài xế', 800000, 'ngày'),
('Minibar', 'Sử dụng đồ uống trong minibar', 100000, 'lần');

-- Customers (Dữ liệu mẫu)
INSERT INTO customers (full_name, id_card, phone, email, address, nationality) VALUES
('Nguyễn Văn A', '001234567890', '0912345678', 'nguyenvana@gmail.com', '123 Đường ABC, Quận 1, TP.HCM', 'Vietnam'),
('Trần Thị B', '001234567891', '0912345679', 'tranthib@gmail.com', '456 Đường DEF, Quận 2, TP.HCM', 'Vietnam'),
('Lê Văn C', '001234567892', '0912345680', 'levanc@gmail.com', '789 Đường GHI, Quận 3, TP.HCM', 'Vietnam');

-- Bookings (Dữ liệu mẫu)
INSERT INTO bookings (customer_id, room_id, user_id, check_in_date, check_out_date, num_adults, total_price, deposit, status) VALUES
(1, 3, 2, '2024-01-15', '2024-01-17', 2, 1000000, 500000, 'checked_in'),
(2, 6, 2, '2024-01-20', '2024-01-22', 2, 1600000, 800000, 'confirmed'),
(3, 1, 2, '2024-01-18', '2024-01-20', 1, 1000000, 0, 'pending');
