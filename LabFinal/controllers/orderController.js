const Order = require('../models/ordermodel');
const Product = require('../models/productmodel');
const User = require('../models/usermodel');

// Display Checkout Form
exports.showCheckoutForm = async (req, res) => {
    try {
        const cart = req.session.cart || []; // Assuming cart data is stored in session
        const productIds = cart.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        const totalPrice = cart.reduce((total, item) => {
            const product = products.find(p => p._id.toString() === item.productId.toString());
            if (product) {
                total += product.price * item.quantity;
            }
            return total;
        }, 0);

        res.render('user/checkout', { cart, products, totalPrice });
    } catch (err) {
        console.error('Error fetching checkout form:', err);
        res.status(500).send('Server error');
    }
};

// Create Order
exports.createOrder = async (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) return res.status(400).send('Cart is empty');

    try {
        let totalPrice = 0;

        // Fetch product details and calculate total price
        const products = await Promise.all(
            cart.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) throw new Error('Product not found');
                totalPrice += product.price * item.quantity;

                return {
                    product: product._id,
                    quantity: item.quantity,
                };
            })
        );

        // Ensure the user is in the session, or handle missing user
        const user = req.session.user;
        if (!user || !user.id) {
            return res.status(401).send('User not authenticated');
        }

        console.log(user); // Check user data in session

        const order = new Order({
            user: user.id,  // Use user.id instead of user._id
            products,
            totalPrice,
            status: 'Pending',
        });

        // Save order to the database
        await order.save();

        // Clear the cart after successful order
        req.session.cart = [];

        res.redirect('/products/menu');
    } catch (err) {
        console.error('Failed to create order:', err);
        res.status(500).send('Failed to create order');
    }
};



// Admin: View All Orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('products.product', 'name price'); // Populate the products array

        res.render('admin/orders', { orders });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).send('Server error');
    }
};


// Admin: Complete Order
exports.completeOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).send('Order not found');

        order.status = 'Completed';
        await order.save();
        // res.send('Order marked as completed');
        res.redirect('/orders/admin/orders');
    } catch (err) {
        console.error('Failed to complete order:', err);
        res.status(500).send('Failed to complete order');
    }
};

// User: View All Past Orders
exports.getUserOrders = async (req, res) => {
    try {
        // Ensure the user is logged in
        const user = req.session.user;
        if (!user || !user.id) {
            return res.status(401).send('You need to be logged in to view your orders.');
        }

        // Find all orders for the user
        const orders = await Order.find({ user: user.id })
            .populate('products.product', 'name price') // Populate product details
            .sort({ createdAt: -1 }); // Sort by latest orders first

        res.render('user/orders', { orders }); // Render the orders view for the user
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).send('Server error');
    }
};
