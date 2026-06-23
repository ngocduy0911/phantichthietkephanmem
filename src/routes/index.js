const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// Controllers
const AuthController = require('../controllers/authController');
const DashboardController = require('../controllers/dashboardController');

// Auth routes
router.get('/login', AuthController.showLogin);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.get('/change-password', requireAuth, AuthController.showChangePassword);
router.post('/change-password', requireAuth, AuthController.changePassword);

// Dashboard
router.get('/', requireAuth, (req, res) => res.redirect('/dashboard'));
router.get('/dashboard', requireAuth, DashboardController.index);

module.exports = router;
