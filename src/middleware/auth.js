// Middleware kiểm tra đăng nhập
function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

// Middleware kiểm tra quyền admin
function requireAdmin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (req.session.user.role !== 'admin') {
        return res.status(403).send('Bạn không có quyền truy cập chức năng này');
    }

    next();
}

// Middleware kiểm tra quyền manager hoặc admin
function requireManager(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (req.session.user.role !== 'admin' && req.session.user.role !== 'manager') {
        return res.status(403).send('Bạn không có quyền truy cập chức năng này');
    }

    next();
}

module.exports = {
    requireAuth,
    requireAdmin,
    requireManager
};
