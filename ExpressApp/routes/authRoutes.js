const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register routes
router.get('/register', (req, res) => {
    res.render('auth/register', { layout: "authLayout" });
});
router.post('/register', authController.registerUser);

// Login routes
router.get('/login', (req, res) => {
    res.render('auth/login', { layout: "authLayout" });
});
router.post('/login', authController.loginUser);

// Logout
router.get('/logout', authController.logoutUser);

module.exports = router;
