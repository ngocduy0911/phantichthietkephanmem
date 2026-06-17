# ⚡ QUICK START GUIDE
## Chạy nhanh Hệ Thống Quản Lý Khách Sạn trong 5 phút!

---

## 🚀 5 BƯỚC NHANH

### Bước 1: Kiểm tra yêu cầu hệ thống
```bash
node --version   # Cần >= v14
mysql --version  # Cần >= v8.0
```

Nếu chưa có, tải về:
- Node.js: https://nodejs.org/
- MySQL: https://dev.mysql.com/downloads/

---

### Bước 2: Cài đặt dependencies
```bash
cd DoAn_QuanLyKhachSan
npm install
```

⏱️ **Thời gian:** ~1 phút

---

### Bước 3: Tạo database
```bash
mysql -u root -p < database/schema.sql
```

Nhập mật khẩu MySQL khi được hỏi.

**Hoặc** sử dụng MySQL Workbench:
1. Mở MySQL Workbench
2. File → Run SQL Script
3. Chọn file `database/schema.sql`
4. Click "Run"

⏱️ **Thời gian:** ~30 giây

---

### Bước 4: Cấu hình (nếu cần)

Mở file `.env` và thay đổi (nếu cần):

```env
DB_PASSWORD=your_mysql_password_here
```

Các thông số khác để mặc định.

⏱️ **Thời gian:** ~10 giây

---

### Bước 5: Chạy ứng dụng
```bash
npm start
```

Thấy thông báo này là thành công:

```
╔════════════════════════════════════════════════════════╗
║   HỆ THỐNG QUẢN LÝ KHÁCH SẠN                          ║
║   Server đang chạy tại: http://localhost:3000         ║
╚════════════════════════════════════════════════════════╝

Kết nối database thành công!
```

⏱️ **Thời gian:** ~5 giây

---

## 🎉 HOÀN THÀNH!

Truy cập: **http://localhost:3000**

Đăng nhập với:
- Username: `admin`
- Password: `admin123`

---

## 🐛 Gặp lỗi?

### Lỗi 1: "Cannot find module"
```bash
npm install
```

### Lỗi 2: "ER_ACCESS_DENIED_ERROR"
Kiểm tra lại `DB_PASSWORD` trong file `.env`

### Lỗi 3: "EADDRINUSE"
Port 3000 đã được sử dụng. Thay đổi `PORT` trong `.env`:
```env
PORT=3001
```

### Lỗi 4: Database không tồn tại
Chạy lại:
```bash
mysql -u root -p < database/schema.sql
```

---

## 📚 TÀI LIỆU CHI TIẾT

- **Cài đặt đầy đủ:** `INSTALLATION.md`
- **Hướng dẫn sử dụng:** `README.md`
- **Tổng kết dự án:** `SUMMARY.md`
- **Báo cáo đồ án:** `BAO_CAO_DO_AN.md`

---

## ⚡ Tắt server

Nhấn `Ctrl + C` trong terminal

---

**Chúc bạn thành công! 🎊**
