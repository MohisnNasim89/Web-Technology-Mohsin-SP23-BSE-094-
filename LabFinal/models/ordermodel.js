const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'usermodel', // Reference to your existing user model
        required: true 
    },
    products: [
        {
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'productmodel', // Reference to your existing product model
                required: true 
            },
            quantity: { type: Number, required: true },
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Completed'], 
        default: 'Pending' 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Order', orderSchema);
