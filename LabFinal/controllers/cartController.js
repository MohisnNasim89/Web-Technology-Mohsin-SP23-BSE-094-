const Product = require("../models/productmodel");

// Middleware to sync cart with session and calculate the total price
exports.setCartItems = async (req, res, next) => {
    const cart = req.session.cart || [];
    const productIds = cart.map(item => item.productId);

    try {
        const products = await Product.find({ _id: { $in: productIds } });

        const cartItems = products.map(product => {
            const cartItem = cart.find(item => item.productId === product._id.toString());
            return { ...product.toObject(), quantity: cartItem.quantity };
        });

        const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        res.locals.cartItems = cartItems;
        res.locals.totalPrice = totalPrice;

        next();
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.locals.cartItems = [];
        res.locals.totalPrice = 0;
        next();
    }
};
// Add item to cart
exports.addToCart = async (req, res) => {
    const productId = req.params.id;
    const quantity = parseInt(req.body.quantity, 10) || 1;  // default to 1 if quantity is not provided
    const cart = req.session.cart || [];

    try {
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;  // Increase quantity if item already in cart
        } else {
            cart.push({ productId, quantity });  // Add new product to cart
        }

        req.session.cart = cart;  // Save the cart back to the session
        req.session.save(() => res.status(200).redirect("/products/menu"));
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).send({ message: "Failed to add item to cart" });
    }
};

// Update cart item quantity
exports.updateCartItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = req.session.cart || [];
    try {
        const item = cart.find(item => item.productId === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);  // Ensure quantity is at least 1
        }

        req.session.cart = cart;  // Save the updated cart back to the session

        const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Respond with updated quantity and total price
        res.json({
            success: true,
            updatedQuantity: item.quantity,
            totalPrice: totalPrice,
        });
    } catch (error) {
        console.error("Error updating item quantity:", error);
        res.status(500).send({ message: "Failed to update item quantity" });
    }
};


// Remove item from cart
exports.removeFromCart = (req, res) => {
    const { productId } = req.body;
    try {
        req.session.cart = (req.session.cart || []).filter(item => item.productId !== productId);

        req.session.save(() => res.status(200).redirect("/menu/#"));
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).send({ message: "Failed to remove item from cart" });
    }
};
