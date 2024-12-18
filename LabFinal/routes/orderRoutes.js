const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isLoggedIn, isUser, isAdmin } = require('../middlewares/authMiddleware');

// User Routes
router.get('/checkout', isLoggedIn, isUser, orderController.showCheckoutForm);
router.post('/checkout', isLoggedIn, isUser, orderController.createOrder);

// Admin Routes
router.get('/admin/orders', isAdmin, orderController.getAllOrders);
router.post('/admin/orders/:orderId/complete', isAdmin, orderController.completeOrder);

// User: View Orders Route
router.get('/user/orders', isUser, orderController.getUserOrders);


module.exports = router;
