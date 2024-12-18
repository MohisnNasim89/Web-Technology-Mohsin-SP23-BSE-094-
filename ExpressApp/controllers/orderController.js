const Order = require('../models/order');
const Product = require('../models/productmodel');

// Display Checkout Form
exports.showCheckoutForm = async (req, res) => {
    try {
        const cart = req.session.cart || []; // Assuming cart data is stored in session
        const products = await Product.find({ _id: { $in: cart.map(item => item.productId) } });

        res.render('checkout', { cart, products });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Create Order
exports.createOrder = async (req, res) => {
    try {
        const cart = req.session.cart || [];
        if (cart.length === 0) return res.status(400).send('Cart is empty');

        let totalPrice = 0;
        const products = await Promise.all(
            cart.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) throw new Error('Product not found');
                totalPrice += product.price * item.quantity;

                return {
                    product: product._id,
                    quantity: item.quantity
                };
            })
        );

        const order = new Order({
            user: req.user._id, // Assuming req.user is populated via session
            products,
            totalPrice,
            status: 'Pending',
        });

        await order.save();

        // Clear cart after successful order
        req.session.cart = [];
        res.send('Order created successfully! Please confirm your order.');
    } catch (err) {
        res.status(500).send('Failed to create order');
    }
};

// Admin: View All Orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email') // Replace with fields from your usermodel
            .populate('products.product', 'name price'); // Populate products array

        res.render('admin/orders', { orders });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Admin: Complete Order
exports.completeOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).send('Order not found');

        order.status = 'Completed';
        await order.save();
        res.send('Order marked as completed');
    } catch (err) {
        res.status(500).send('Failed to complete order');
    }
};
