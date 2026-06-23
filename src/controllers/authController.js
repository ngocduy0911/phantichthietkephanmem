const User = require('../models/User');
const bcrypt = require('bcryptjs');

class AuthController {
    // Hiển thị trang login
    static showLogin(req, res) {
        if (req.session.user) {
            return res.redirect('/dashboard');
        }
        res.render('auth/login', { error: null });
    }

    // Xử lý login
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            // Kiểm tra thông tin đăng nhập
            if (!username || !password) {
                return res.render('auth/login', { error: 'Vui lòng nhập đầy đủ thông tin' });
            }

            // Tìm user
            const user = await User.getByUsername(username);

            if (!user) {
                return res.render('auth/login', { error: 'Tên đăng nhập không tồn tại' });
            }

            if (!user.is_active) {
                return res.render('auth/login', { error: 'Tài khoản đã bị vô hiệu hóa' });
            }

            // Kiểm tra mật khẩu
            const pass = await bcrypt.hash(password, 10);
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.render('auth/login', { error: 'Mật khẩu không đúng' });
            }

            // Lưu thông tin user vào session
            req.session.user = {
                user_id: user.user_id,
                username: user.username,
                full_name: user.full_name,
                role: user.role
            };

            res.redirect('/dashboard');
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            res.render('auth/login', { error: 'Có lỗi xảy ra, vui lòng thử lại' });
        }
    }

    // Đăng xuất
    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Lỗi đăng xuất:', err);
            }
            res.redirect('/login');
        });
    }

    // Hiển thị trang đổi mật khẩu
    static showChangePassword(req, res) {
        res.render('auth/change-password', { error: null, success: null });
    }

    // Xử lý đổi mật khẩu
    static async changePassword(req, res) {
        try {
            const { current_password, new_password, confirm_password } = req.body;
            const userId = req.session.user.user_id;

            // Kiểm tra thông tin
            if (!current_password || !new_password || !confirm_password) {
                return res.render('auth/change-password', {
                    error: 'Vui lòng nhập đầy đủ thông tin',
                    success: null
                });
            }

            if (new_password !== confirm_password) {
                return res.render('auth/change-password', {
                    error: 'Mật khẩu mới không khớp',
                    success: null
                });
            }

            if (new_password.length < 6) {
                return res.render('auth/change-password', {
                    error: 'Mật khẩu mới phải có ít nhất 6 ký tự',
                    success: null
                });
            }

            // Lấy thông tin user
            const user = await User.getById(userId);

            // Kiểm tra mật khẩu hiện tại
            const isValidPassword = await bcrypt.compare(current_password, user.password);

            if (!isValidPassword) {
                return res.render('auth/change-password', {
                    error: 'Mật khẩu hiện tại không đúng',
                    success: null
                });
            }

            // Mã hóa mật khẩu mới
            const hashedPassword = await bcrypt.hash(new_password, 10);

            // Cập nhật mật khẩu
            await User.changePassword(userId, hashedPassword);

            res.render('auth/change-password', {
                error: null,
                success: 'Đổi mật khẩu thành công'
            });
        } catch (error) {
            console.error('Lỗi đổi mật khẩu:', error);
            res.render('auth/change-password', {
                error: 'Có lỗi xảy ra, vui lòng thử lại',
                success: null
            });
        }
    }
}

module.exports = AuthController;
