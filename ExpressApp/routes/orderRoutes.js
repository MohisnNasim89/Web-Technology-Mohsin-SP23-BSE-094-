const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// User Routes
router.get('/checkout', isAuthenticated, orderController.showCheckoutForm);
router.post('/checkout', isAuthenticated, orderController.createOrder);

// Admin Routes
router.get('/admin/orders', isAdmin, orderController.getAllOrders);
router.post('/admin/orders/:orderId/complete', isAdmin, orderController.completeOrder);

module.exports = router;
